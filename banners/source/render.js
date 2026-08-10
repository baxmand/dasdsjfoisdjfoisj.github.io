const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const dir = __dirname;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  // 2x supersample render
  const page = await browser.newPage({ viewport: { width: 970, height: 90 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(dir, 'banner.html'));
  await page.waitForTimeout(300);
  const big = await page.screenshot({ type: 'png' }); // 1940x180
  fs.writeFileSync(path.join(dir, '_big.png'), big);

  // downscale to exact 970x90 via canvas with high-quality smoothing
  const p2 = await browser.newPage({ viewport: { width: 970, height: 90 }, deviceScaleFactor: 1 });
  const b64 = big.toString('base64');
  await p2.setContent(`<html><body style="margin:0"><canvas id="c" width="970" height="90"></canvas>
    <img id="i" src="data:image/png;base64,${b64}"></body></html>`);
  await p2.waitForFunction('document.getElementById("i").complete');
  const outPng = await p2.evaluate(() => {
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(document.getElementById('i'), 0, 0, 970, 90);
    return c.toDataURL('image/png').split(',')[1];
  });
  const outJpg = await p2.evaluate(() => {
    const c = document.getElementById('c');
    return c.toDataURL('image/jpeg', 0.9).split(',')[1];
  });
  fs.writeFileSync(path.join(dir, 'as-banner-970x90.png'), Buffer.from(outPng, 'base64'));
  fs.writeFileSync(path.join(dir, 'as-banner-970x90.jpg'), Buffer.from(outJpg, 'base64'));
  await browser.close();
  const s = f => (fs.statSync(path.join(dir, f)).size/1024).toFixed(1)+' KB';
  console.log('PNG', s('as-banner-970x90.png'), '| JPG', s('as-banner-970x90.jpg'));
})();
