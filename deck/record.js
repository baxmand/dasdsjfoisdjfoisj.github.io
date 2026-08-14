const { chromium } = require('playwright');
const fs = require('fs');
const CHR = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const b = await chromium.launch({ executablePath: CHR, args: [
    '--autoplay-policy=no-user-gesture-required','--disable-gpu','--use-gl=swiftshader',
    '--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'] });
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: __dirname + '/rec', size: { width: 1920, height: 1080 } } });
  const pg = await ctx.newPage();
  await pg.goto('file://' + __dirname + '/video.html', { waitUntil: 'load' });
  // keep renderer active by pinging every second
  const t0=Date.now();
  while(!(await pg.evaluate(()=>window.__done===true))){ await pg.waitForTimeout(1000); if(Date.now()-t0>150000) break; }
  await pg.waitForTimeout(400);
  await ctx.close();
  await b.close();
  const f = fs.readdirSync(__dirname + '/rec').find(x => x.endsWith('.webm'));
  console.log('elapsed', ((Date.now()-t0)/1000).toFixed(1)+'s', 'VIDEO:' + __dirname + '/rec/' + f);
})();
