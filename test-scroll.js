const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
  try {
    for (const variant of ['k', 'a']) {
      const page = await browser.newPage();
      const column = variant === 'k' ? 'column-center' : 'MiddleColumn';
      const variable = variant === 'k' ? 'messages-text-size' : 'message-text-size';
      await page.setContent(`
        <style>
          :root { --messages-text-size: 16px; --message-text-size: 16px; }
          .scrollable { height: 400px; width: 450px; overflow: auto; overflow-anchor: none; }
          .message { font-size: var(--${variable}); line-height: 1.3125; padding: 12px; }
          #column-left { height: 100px; }
        </style>
        <div id="column-left"></div>
        <div id="${column}"><div class="scrollable">${Array.from({ length: 70 }, (_, i) =>
          `<div class="bubble"><div class="message" id="m${i}">پیام فارسی برای آزمایش اسکرول و رفتن به پیام قبلی<br>Another line of text ${i}</div></div>`).join('')}</div></div>
      `);
      await page.evaluate(() => {
        window.chrome = {
          runtime: { getURL: (p) => p, onMessage: { addListener() {} } },
          storage: {
            sync: { get: (_, callback) => callback({ fontEnabled: false }) },
            onChanged: { addListener() {} },
          },
        };
      });
      await page.addScriptTag({ path: path.join(__dirname, 'content.js') });
      for (const percent of [50, 75, 100, 125, 150, 200]) {
        const result = await page.evaluate(({ percent, column, variable }) => {
          applyFontSize(percent, true);
          const panel = document.getElementById(column);
          const container = panel.querySelector('.scrollable');
          const element = document.getElementById('m30');
          const follow = () => {
            container.scrollTop = 0;
            const positions = [];
            for (let i = 0; i < 20; i++) {
              const contentTop = container.getBoundingClientRect().top - container.scrollTop;
              const target = element.getBoundingClientRect().top - contentTop
                + (element.scrollHeight - container.getBoundingClientRect().height) / 2;
              container.scrollTop = Math.round(target);
              positions.push(container.scrollTop);
            }
            return Math.max(...positions) - Math.min(...positions);
          };
          const stableRange = follow();
          const fontSize = parseFloat(getComputedStyle(element).fontSize);
          const geometryScale = container.getBoundingClientRect().height / container.clientHeight;
          const sideZoom = parseFloat(getComputedStyle(document.getElementById('column-left')).zoom);
          panel.style.zoom = String(percent / 100);
          const oldRange = follow();
          panel.style.zoom = '';
          document.documentElement.style.setProperty(`--${variable}`, '18px');
          const changedSize = parseFloat(getComputedStyle(element).fontSize);
          document.documentElement.style.removeProperty(`--${variable}`);
          applyFontSize(percent, false);
          return {
            stableRange, oldRange, fontSize, geometryScale, sideZoom, changedSize,
            excludedSideZoom: parseFloat(getComputedStyle(document.getElementById('column-left')).zoom),
          };
        }, { percent, column, variable });
        const label = `${variant} at ${percent}%`;
        assert.ok(result.stableRange <= 1, `${label}: scroll oscillated ${result.stableRange}px`);
        assert.equal(result.geometryScale, 1, `${label}: scroll coordinates were scaled`);
        assert.equal(result.fontSize, 16 * percent / 100, `${label}: text size`);
        assert.equal(result.changedSize, 18 * percent / 100, `${label}: native size update`);
        assert.equal(result.sideZoom, percent / 100, `${label}: sidebar size`);
        assert.equal(result.excludedSideZoom, 1, `${label}: sidebar exclusion`);
        if (percent !== 100) assert.ok(result.oldRange > 10, `${label}: old zoom failed to reproduce drift`);
      }
      await page.close();
    }
    console.log('ok: Web K/A scroll geometry, font sizes, native settings, sidebar at 50–200%');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
