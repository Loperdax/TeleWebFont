// Self-check for the CSS builders. Run: node test.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

// content.js runs in a content-script context; stub just enough to load it.
const sandbox = {
  document: {
    getElementById: () => null,
    createElement: () => ({ style: {} }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    head: { appendChild: () => {} },
    readyState: 'complete',
  },
  chrome: {
    runtime: { getURL: (p) => 'chrome-extension://x/' + p, onMessage: { addListener: () => {} } },
    storage: { sync: { get: () => {} }, onChanged: { addListener: () => {} } },
  },
  setInterval: () => 1,
  Date,
  Set,
  HTMLElement: class {},
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(__dirname + '/content.js', 'utf8'), sandbox);

// Font weight rule: 0 means "leave Telegram's weights alone", anything else forces it.
const weightCSS = (enabled, w) => {
  let written = null;
  sandbox.ensureStyleElement = (id, css) => { written = css; };
  sandbox.removeStyleElement = () => { written = null; };
  sandbox.applyFontWeight(enabled, w);
  return written;
};
assert.strictEqual(weightCSS(true, 0), null, 'weight 0 = no rule');
assert.strictEqual(weightCSS(false, 700), null, 'font disabled = no weight rule');
assert.strictEqual(weightCSS(true, 700), '*{font-weight:700 !important;}');

// Size rule: side panel excluded gets the inverse zoom so it stays at 100%.
assert.strictEqual(sandbox.buildSizeRuleCSS(100, true), 'body{zoom:1.0000 !important;}');
const at150 = sandbox.buildSizeRuleCSS(150, false);
assert.ok(at150.startsWith('body{zoom:1.5000 !important;}'), 'body scales up');
assert.ok(at150.includes('#column-left{zoom:0.6667 !important;}'), 'side panel cancels it out');

// Variable font covers the full range the weight slider can request.
const family = sandbox.buildFontFamilyCSS('vazirmatn');
assert.ok(family.includes('font-weight: 100 900;'), 'variable font spans slider range');
assert.ok(family.includes("font-family: 'Vazirmatn', sans-serif !important;"));

// Each family applies its own name, and .ttf must declare truetype (not woff2).
const lateef = sandbox.buildFontFamilyCSS('lateef');
assert.ok(lateef.includes("font-family: 'Lateef', sans-serif !important;"));
assert.ok(lateef.includes("format('truetype')"), 'ttf needs truetype format');
assert.ok(!lateef.includes("format('woff2')"), 'no woff2 claim on ttf files');
assert.ok(!lateef.includes('woff2-variations'), 'lateef has no variable font');

const iransans = sandbox.buildFontFamilyCSS('iransans');
assert.ok(iransans.includes("font-family: 'Iranian Sans', sans-serif !important;"));
assert.strictEqual((iransans.match(/@font-face/g) || []).length, 2, 'iransans ships 2 weights');

// Unknown key falls back instead of emitting a broken rule.
assert.strictEqual(sandbox.buildFontFamilyCSS('nope'), family, 'unknown font falls back');

// Every registered file is actually on disk and exposed by the manifest.
const manifest = JSON.parse(fs.readFileSync(__dirname + '/manifest.json', 'utf8'));
const exposed = manifest.web_accessible_resources[0].resources;
const FONTS = vm.runInContext('FONTS', sandbox);
for (const font of Object.values(FONTS)) {
    const paths = font.files.map(([p]) => p).concat(font.variable || []);
    for (const p of paths) {
        assert.ok(fs.existsSync(__dirname + '/' + p), 'missing file: ' + p);
        const ext = p.slice(p.lastIndexOf('.'));
        assert.ok(exposed.includes('fonts/*' + ext), 'not web-accessible: ' + p);
    }
}

// Popup picker offers exactly the registered fonts.
const html = fs.readFileSync(__dirname + '/popup.html', 'utf8');
const offered = [...html.matchAll(/data-font="([^"]+)"/g)].map((m) => m[1]);
assert.deepStrictEqual(offered.sort(), Object.keys(FONTS).sort(), 'picker matches registry');

// --- popup i18n ---
// Load popup.js far enough to read its I18N table (DOM calls are stubbed out).
const popupSandbox = {
  document: {
    getElementById: () => ({ style: {}, classList: { toggle() {} }, querySelectorAll: () => [], addEventListener() {} }),
    querySelectorAll: () => [],
    documentElement: {},
  },
  chrome: { storage: { sync: { get() {}, set() {} } }, runtime: {}, tabs: { query() {} } },
  getComputedStyle: () => ({ direction: 'rtl' }),
  Event: class {},
};
vm.createContext(popupSandbox);
vm.runInContext(fs.readFileSync(__dirname + '/popup.js', 'utf8'), popupSandbox);
const I18N = vm.runInContext('I18N', popupSandbox);

const markupKeys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]))];
const weightKeys = Array.from({ length: 10 }, (_, i) => 'w' + i * 100);
const langs = Object.keys(I18N);
assert.deepStrictEqual(langs.sort(), ['ar', 'en', 'fa'], 'three locales');

for (const code of langs) {
  const table = I18N[code];
  for (const key of [...markupKeys, ...weightKeys, 'dir', 'digits']) {
    assert.ok(table[key], `${code} is missing "${key}"`);
  }
  assert.strictEqual(table.digits.length, 10, `${code} needs 10 digit glyphs`);
  assert.ok(['rtl', 'ltr'].includes(table.dir), `${code} has a valid dir`);
}

// Every flag button maps to a real locale.
const flags = [...html.matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]);
assert.deepStrictEqual(flags.sort(), langs.sort(), 'flags match locales');

console.log('ok');
