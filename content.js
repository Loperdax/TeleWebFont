// Inject Vazirmatn font @font-face rules into the page
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

function injectFontFaces() {
  const styleEl = document.createElement('style');
  styleEl.id = 'telewebfont-styles';

  let css = '';

  // Add @font-face for each static weight
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

  // Add @font-face for the variable font
  const variableUrl = chrome.runtime.getURL('fonts/Vazirmatn[wght].woff2');
  css += `
@font-face {
  font-family: 'Vazirmatn';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('${variableUrl}') format('woff2-variations');
}`;

  // Apply Vazirmatn globally with high specificity
  css += `
* {
  font-family: 'Vazirmatn', sans-serif !important;
}`;

  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

// Run on DOMContentLoaded to ensure head exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFontFaces);
} else {
  injectFontFaces();
}

