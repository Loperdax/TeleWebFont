const fontWeights = [
  { name: 'Vazirmatn-Thin', weight: 100, style: 'normal' },
  { name: 'Vazirmatn-ExtraLight', weight: 200, style: 'normal' },
  { name: 'Vazirmatn-Light', weight: 300, style: 'normal' },
  { name: 'Vazirmatn-Regular', weight: 400, style: 'normal' },
  { name: 'Vazirmatn-Medium', weight: 500, style: 'normal' },
  { name: 'Vazirmatn-SemiBold', weight: 600, style: 'normal' },
  { name: 'Vazirmatn-Bold', weight: 700, style: 'normal' },
  { name: 'Vazirmatn-ExtraBold', weight: 800, style: 'normal' },
  { name: 'Vazirmatn-Black', weight: 900, style: 'normal' },
];

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

const sidePanelCache = new Set();
let sidePanelCacheTime = 0;
const SIDE_CACHE_TTL_MS = 150;

function buildFontFamilyCSS() {
  let css = '';

  fontWeights.forEach((font) => {
    const fontUrl = chrome.runtime.getURL(`fonts/${font.name}.woff2`);
    css += `
@font-face {
  font-family: 'Vazirmatn';
  font-style: ${font.style};
  font-weight: ${font.weight};
  font-display: swap;
  src: url('${fontUrl}') format('woff2');
}`;
  });

  const variableUrl = chrome.runtime.getURL('fonts/Vazirmatn[wght].woff2');
  css += `
@font-face {
  font-family: 'Vazirmatn';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('${variableUrl}') format('woff2-variations');
}`;

  css += `
* {
  font-family: 'Vazirmatn', sans-serif !important;
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

function applyFontFamily(enabled) {
  if (enabled) {
    if (!document.getElementById('telewebfont-family')) {
      ensureStyleElement('telewebfont-family', buildFontFamilyCSS());
    }
  } else {
    removeStyleElement('telewebfont-family');
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
  applyFontFamily(currentFontEnabled);
  applyFontSize(currentFontSizePercent, currentIncludeSidePanel);
}

chrome.runtime.onMessage.addListener((request) => {
  let changed = false;
  if (request.action === 'toggleFont') {
    currentFontEnabled = !!request.enabled;
    if (typeof request.fontSizePercent === 'number') currentFontSizePercent = request.fontSizePercent;
    if (typeof request.includeSidePanel === 'boolean') currentIncludeSidePanel = request.includeSidePanel;
    changed = true;
  } else if (request.action === 'changeFontSize') {
    if (typeof request.fontSizePercent === 'number') currentFontSizePercent = request.fontSizePercent;
    if (typeof request.includeSidePanel === 'boolean') currentIncludeSidePanel = request.includeSidePanel;
    changed = true;
  } else if (request.action === 'toggleSidePanel') {
    if (typeof request.includeSidePanel === 'boolean') currentIncludeSidePanel = request.includeSidePanel;
    if (typeof request.fontSizePercent === 'number') currentFontSizePercent = request.fontSizePercent;
    changed = true;
  }
  if (changed) applyState();
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
  chrome.storage.sync.get(['fontEnabled', 'fontSizePercent', 'includeSidePanel'], (result) => {
    currentFontEnabled = result.fontEnabled !== false;
    currentFontSizePercent = result.fontSizePercent || 100;
    currentIncludeSidePanel = result.includeSidePanel !== false;
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
