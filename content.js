// Weights a family doesn't ship are synthesized by the browser.
const FONTS = {
  vazirmatn: {
    family: 'Vazirmatn',
    variable: 'fonts/Vazirmatn[wght].woff2',
    files: [
      ['fonts/Vazirmatn-Thin.woff2', 100],
      ['fonts/Vazirmatn-ExtraLight.woff2', 200],
      ['fonts/Vazirmatn-Light.woff2', 300],
      ['fonts/Vazirmatn-Regular.woff2', 400],
      ['fonts/Vazirmatn-Medium.woff2', 500],
      ['fonts/Vazirmatn-SemiBold.woff2', 600],
      ['fonts/Vazirmatn-Bold.woff2', 700],
      ['fonts/Vazirmatn-ExtraBold.woff2', 800],
      ['fonts/Vazirmatn-Black.woff2', 900],
    ],
  },
  lateef: {
    family: 'Lateef',
    files: [
      ['fonts/Lateef-ExtraLight.ttf', 200],
      ['fonts/Lateef-Light.ttf', 300],
      ['fonts/Lateef-Regular.ttf', 400],
      ['fonts/Lateef-Medium.ttf', 500],
      ['fonts/Lateef-SemiBold.ttf', 600],
      ['fonts/Lateef-Bold.ttf', 700],
      ['fonts/Lateef-ExtraBold.ttf', 800],
    ],
  },
  iransans: {
    family: 'Iranian Sans',
    files: [
      ['fonts/irsans.ttf', 400],
      ['fonts/irsansb.ttf', 700],
    ],
  },
};

const DEFAULT_FONT = 'vazirmatn';

const sidePanelSelectors = [
  '#column-left',
  '.column-left',
  '.sidebar-left',
  '.Sidebar',
  '.left-side',
  '.left-slot',
  '.LeftPanel',
  'aside[data-telegram-sidebar="true"]',
  '.sidebar',
  '#LeftColumn',
];

let currentFontEnabled = true;
let currentFontSizePercent = 100;
let currentIncludeSidePanel = true;
let currentFontWeight = 0; // 0 = keep Telegram's own weights
let currentFontFamily = DEFAULT_FONT;

const sidePanelCache = new Set();
let sidePanelCacheTime = 0;
const SIDE_CACHE_TTL_MS = 150;

function buildFontFamilyCSS(fontKey) {
  const font = FONTS[fontKey] || FONTS[DEFAULT_FONT];
  let css = '';

  font.files.forEach(([path, weight]) => {
    const format = path.endsWith('.ttf') ? 'truetype' : 'woff2';
    css += `
@font-face {
  font-family: '${font.family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('${chrome.runtime.getURL(path)}') format('${format}');
}`;
  });

  if (font.variable) {
    css += `
@font-face {
  font-family: '${font.family}';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('${chrome.runtime.getURL(font.variable)}') format('woff2-variations');
}`;
  }

  css += `
* {
  font-family: '${font.family}', sans-serif !important;
}`;

  return css;
}

function buildSizeRuleCSS(percent, includeSidePanel) {
  const scale = (percent / 100).toFixed(4);
  let css = `body{zoom:${scale} !important;}`;
  if (!includeSidePanel) {
    const anti = (100 / percent).toFixed(4);
    css += sidePanelSelectors.map((s) => `${s}{zoom:${anti} !important;}`).join('');
  }
  return css;
}

function ensureStyleElement(id, content) {
  let styleEl = document.getElementById(id);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = id;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = content;
}

function removeStyleElement(id) {
  const styleEl = document.getElementById(id);
  if (styleEl) styleEl.remove();
}

function refreshSidePanelCache(force) {
  const now = Date.now();
  if (!force && sidePanelCache.size > 0 && (now - sidePanelCacheTime) < SIDE_CACHE_TTL_MS) return;
  sidePanelCacheTime = now;
  sidePanelCache.clear();
  sidePanelSelectors.forEach((sel) => {
    const nodes = document.querySelectorAll(sel);
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      if (el instanceof HTMLElement) sidePanelCache.add(el);
    }
  });
}

let lastFontKey = null;

function applyFontFamily(enabled, fontKey) {
  if (!enabled) {
    removeStyleElement('telewebfont-family');
    lastFontKey = null;
    return;
  }
  if (fontKey === lastFontKey && document.getElementById('telewebfont-family')) return;
  lastFontKey = fontKey;
  ensureStyleElement('telewebfont-family', buildFontFamilyCSS(fontKey));
}

function applyFontWeight(enabled, weight) {
  if (enabled && weight) {
    ensureStyleElement('telewebfont-weight', `*{font-weight:${weight} !important;}`);
  } else {
    removeStyleElement('telewebfont-weight');
  }
}

function applySideZoomInline(includeSidePanel, percent) {
  refreshSidePanelCache(false);
  const zoomValue = includeSidePanel ? '1' : (100 / percent).toFixed(4);
  sidePanelCache.forEach((el) => {
    if (el instanceof HTMLElement) el.style.zoom = zoomValue;
  });
}

let sizeStyleEl = null;
let lastSizeCSS = '';
let lastPercentForCSS = -1;
let lastSideForCSS = null;

function applySizeRuleStyle(percent, includeSidePanel) {
  if (percent === lastPercentForCSS && includeSidePanel === lastSideForCSS && sizeStyleEl) return;
  lastPercentForCSS = percent;
  lastSideForCSS = includeSidePanel;
  const css = buildSizeRuleCSS(percent, includeSidePanel);
  if (css === lastSizeCSS && sizeStyleEl) return;
  lastSizeCSS = css;
  if (!sizeStyleEl) {
    sizeStyleEl = document.createElement('style');
    sizeStyleEl.id = 'telewebfont-size';
    document.head.appendChild(sizeStyleEl);
  }
  sizeStyleEl.textContent = css;
}

function applyFontSize(percent, includeSidePanel) {
  currentFontSizePercent = percent;
  currentIncludeSidePanel = includeSidePanel;
  const scaleStr = (percent / 100).toFixed(4);
  applySizeRuleStyle(percent, includeSidePanel);
  try {
    if (document.body) document.body.style.zoom = scaleStr;
  } catch (e) {}
  applySideZoomInline(includeSidePanel, percent);
}

function applyState() {
  applyFontFamily(currentFontEnabled, currentFontFamily);
  applyFontWeight(currentFontEnabled, currentFontWeight);
  applyFontSize(currentFontSizePercent, currentIncludeSidePanel);
}

const ACTIONS = ['toggleFont', 'changeFontSize', 'toggleSidePanel', 'changeFontWeight', 'changeFontFamily'];

chrome.runtime.onMessage.addListener((request) => {
  if (!ACTIONS.includes(request.action)) return;
  // Every popup message carries the full state, so just take whatever is present.
  if (typeof request.enabled === 'boolean') currentFontEnabled = request.enabled;
  if (typeof request.fontSizePercent === 'number') currentFontSizePercent = request.fontSizePercent;
  if (typeof request.includeSidePanel === 'boolean') currentIncludeSidePanel = request.includeSidePanel;
  if (typeof request.fontWeight === 'number') currentFontWeight = request.fontWeight;
  if (typeof request.fontFamily === 'string') currentFontFamily = request.fontFamily;
  applyState();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  let needUpdate = false;
  if (changes.fontEnabled) {
    currentFontEnabled = changes.fontEnabled.newValue !== false;
    needUpdate = true;
  }
  if (changes.fontSizePercent) {
    currentFontSizePercent = changes.fontSizePercent.newValue || 100;
    needUpdate = true;
  }
  if (changes.includeSidePanel) {
    currentIncludeSidePanel = changes.includeSidePanel.newValue !== false;
    needUpdate = true;
  }
  if (changes.fontWeight) {
    currentFontWeight = changes.fontWeight.newValue || 0;
    needUpdate = true;
  }
  if (changes.fontFamily) {
    currentFontFamily = changes.fontFamily.newValue || DEFAULT_FONT;
    needUpdate = true;
  }
  if (needUpdate) applyState();
});

let sidePanelRefreshTimer = null;
function startSidePanelRefreshInterval() {
  if (sidePanelRefreshTimer) return;
  sidePanelRefreshTimer = setInterval(() => {
    refreshSidePanelCache(true);
    applySideZoomInline(currentIncludeSidePanel, currentFontSizePercent);
  }, 1000);
}

function loadStateAndApply() {
  chrome.storage.sync.get(['fontEnabled', 'fontSizePercent', 'includeSidePanel', 'fontWeight', 'fontFamily'], (result) => {
    currentFontEnabled = result.fontEnabled !== false;
    currentFontSizePercent = result.fontSizePercent || 100;
    currentIncludeSidePanel = result.includeSidePanel !== false;
    currentFontWeight = result.fontWeight || 0;
    currentFontFamily = result.fontFamily || DEFAULT_FONT;
    lastFontKey = null;
    lastPercentForCSS = -1;
    lastSideForCSS = null;
    lastSizeCSS = '';
    applyState();
  });
}

loadStateAndApply();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadStateAndApply();
    startSidePanelRefreshInterval();
  });
} else {
  startSidePanelRefreshInterval();
}
