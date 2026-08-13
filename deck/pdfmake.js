const { chromium } = require('playwright');
const CHR = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
(async () => {
  const b = await chromium.launch({ executablePath: CHR });
  const pg = await b.newPage();
  await pg.goto('file://' + __dirname + '/preview.html', { waitUntil: 'networkidle' });
  await pg.addStyleTag({ content: '@page{size:1280px 720px;margin:0} body{background:#000;margin:0} .slide{margin:0 !important;page-break-after:always}' });
  await pg.pdf({ path: __dirname + '/AS-Talent-Agency.pdf', width: '1280px', height: '720px', printBackground: true });
  await b.close();
  console.log('vector pdf done');
})();
