const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname;
const F = f => fs.readFileSync(path.join(dir, 'assets/fonts', f)).toString('base64');
const mont800 = F('mont800.ttf'), mont900 = F('mont900.ttf'), os500 = F('oswald500.ttf'), os700 = F('oswald700.ttf');
const ofPng = fs.readFileSync(path.join(dir, 'assets/of_zip1/onlyfans-seeklogo.png')).toString('base64');
const fansly = fs.readFileSync(path.join(dir, 'assets/fansly_full.png')).toString('base64');
const girlRaw = fs.readFileSync(path.join(dir, 'assets/girl.png')).toString('base64');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  // trim transparent margins of girl
  const p0 = await browser.newPage();
  await p0.setContent(`<html><body style="margin:0"><img id="i" src="data:image/png;base64,${girlRaw}"></body></html>`);
  await p0.waitForFunction('document.getElementById("i").complete && document.getElementById("i").naturalWidth>0');
  const girl = await p0.evaluate(() => {
    const img = document.getElementById('i'); const W=img.naturalWidth,H=img.naturalHeight;
    const c=document.createElement('canvas'); c.width=W;c.height=H; const x=c.getContext('2d'); x.drawImage(img,0,0);
    const a=x.getImageData(0,0,W,H).data; let minX=W,minY=H,maxX=0,maxY=0;
    for(let i=3;i<a.length;i+=4){ if(a[i]>18){ const p=(i-3)/4,px=p%W,py=(p/W)|0; if(px<minX)minX=px;if(px>maxX)maxX=px;if(py<minY)minY=py;if(py>maxY)maxY=py; } }
    const cw=maxX-minX+1, ch=maxY-minY+1;
    const c2=document.createElement('canvas'); c2.width=cw;c2.height=ch; c2.getContext('2d').drawImage(c,minX,minY,cw,ch,0,0,cw,ch);
    return { url:c2.toDataURL('image/png'), w:cw, h:ch };
  });
  await p0.close();
  const gH = 190, gW = Math.round(gH * girl.w / girl.h);

  const ofH = 22, ofW = Math.round(ofH * 803.63 / 140.42);
  const faH = 22, faW = Math.round(faH * 820 / 230);

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Mont';font-weight:800;src:url(data:font/ttf;base64,${mont800}) format('truetype');}
@font-face{font-family:'Mont';font-weight:900;src:url(data:font/ttf;base64,${mont900}) format('truetype');}
@font-face{font-family:'Os';font-weight:500;src:url(data:font/ttf;base64,${os500}) format('truetype');}
@font-face{font-family:'Os';font-weight:700;src:url(data:font/ttf;base64,${os700}) format('truetype');}
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;}
html,body{width:970px;height:90px;overflow:hidden;}
.banner{position:relative;width:970px;height:90px;overflow:hidden;font-family:'Mont';
  background:
   radial-gradient(60% 150% at 4% 8%, rgba(0,175,240,.18),rgba(0,175,240,0) 55%),
   radial-gradient(70% 160% at 82% 60%, rgba(253,74,158,.16),rgba(253,74,158,0) 55%),
   linear-gradient(180deg,#ffffff 0%,#e9f5ff 100%);}
.edge{position:absolute;top:0;bottom:0;width:5px;z-index:5}
.edge.l{left:0;background:linear-gradient(180deg,#00b6f2,#0098e0)}
.edge.r{right:0;background:linear-gradient(180deg,#fd4a9e,#b31cf0)}
.girlglow{position:absolute;right:20px;bottom:-30px;width:230px;height:150px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(255,255,255,.9),rgba(180,225,255,.35) 55%,rgba(255,255,255,0) 75%);z-index:1}
.girl{position:absolute;right:8px;top:-8px;height:${gH}px;width:${gW}px;z-index:2;
  filter:drop-shadow(0 0 2px rgba(255,255,255,.85)) drop-shadow(0 8px 16px rgba(30,80,140,.18))}
.row{position:relative;height:90px;display:flex;align-items:center;gap:16px;padding:0 168px 0 16px;z-index:3}
.leftlogos{flex:0 0 auto;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.fa{display:flex;align-items:center;gap:7px}
.faw{font-family:'Mont';font-weight:800;font-size:${Math.round(faH*0.62)}px;color:#2b9ef0;letter-spacing:-.5px}
.divx{width:1px;height:56px;background:linear-gradient(180deg,transparent,rgba(10,111,176,.22),transparent);flex:0 0 auto}
.mid{flex:1 1 auto;min-width:0;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center}
.tagtop{display:flex;align-items:center;justify-content:center;gap:9px;font-family:'Os';font-weight:700;font-size:9.5px;letter-spacing:3.4px;color:#3f6da0;text-transform:uppercase;white-space:nowrap}
.tagtop .ln{width:30px;height:1px;background:linear-gradient(90deg,transparent,rgba(253,74,158,.7))}
.tagtop .ln.r{background:linear-gradient(90deg,rgba(253,74,158,.7),transparent)}
.tagtop .df{color:#fd4a9e;font-size:8px}
.brandline{display:flex;align-items:center;gap:9px;font-family:'Os';font-weight:700;font-size:10px;letter-spacing:4px;color:#0a6fb0;text-transform:uppercase;white-space:nowrap}
.brandline .as{background:linear-gradient(135deg,#fd4a9e 0%,#e0269e 45%,#b31cf0 100%);color:#fff;border-radius:5px;padding:2px 7px;font-family:'Mont';font-weight:900;letter-spacing:0;box-shadow:0 3px 11px rgba(253,74,158,.5),0 0 0 1px rgba(255,255,255,.35) inset}
.brandline .tt{color:#c22b8e}
.brandline .st{color:#fd4a9e;letter-spacing:1px}
.l2{display:flex;align-items:center;justify-content:center;gap:12px;white-space:nowrap}
.head{font-family:'Mont';font-weight:900;font-size:26px;line-height:1;letter-spacing:.2px;color:#0a2f66;white-space:nowrap}
.head b{color:#00AFF0}
.btn{font-family:'Mont';font-weight:900;font-size:11px;letter-spacing:.4px;color:#fff;text-transform:uppercase;
  background:linear-gradient(90deg,#fd4a9e,#b31cf0);padding:7px 15px;border-radius:22px;white-space:nowrap;box-shadow:0 6px 16px rgba(253,74,158,.42)}
.btn .a{margin-left:5px}
.benes{display:flex;align-items:center;justify-content:center;gap:5px;font-family:'Os';font-weight:500;font-size:8.4px;letter-spacing:.2px;color:#2f6390;text-transform:uppercase;white-space:nowrap}
.benes i{color:#fd4a9e;font-style:normal;font-size:7px}
</style></head><body>
<div class="banner">
  <div class="edge l"></div><div class="edge r"></div>
  <div class="girlglow"></div>
  <img class="girl" src="${girl.url}" alt="model">
  <div class="row">
    <div class="leftlogos">
      <img src="data:image/png;base64,${ofPng}" width="${ofW}" height="${ofH}" alt="OnlyFans">
      <img src="data:image/png;base64,${fansly}" width="${faW}" height="${faH}" alt="Fansly">
    </div>
    <div class="divx"></div>
    <div class="mid">
      <div class="tagtop"><span class="ln"></span><span class="df">✦</span>A partner of talented agencies<span class="df">✦</span><span class="ln r"></span></div>
      <div class="l2"><div class="head">ИЩЕМ <b>НОВЫЕ ЛИЦА</b></div><div class="btn">Откликнуться<span class="a">→</span></div></div>
      <div class="benes"><span>Обучение с нуля</span><i>◆</i><span>Продюсирование</span><i>◆</i><span>Отдел продаж 24/7</span><i>◆</i><span>Индивидуальные&nbsp;условия</span><i>◆</i><span>Выплаты 2×/мес</span><i>◆</i><span>Анонимность</span></div>
    </div>
  </div>
</div>
</body></html>`;

  const name = 'concept-girl';
  fs.writeFileSync(path.join(dir, name + '.html'), html);
  const page = await browser.newPage({ viewport: { width: 970, height: 90 }, deviceScaleFactor: 4 });
  await page.setContent(html);
  await page.waitForTimeout(350);
  const big = await page.screenshot({ type: 'png' });
  const p2 = await browser.newPage({ viewport: { width: 1940, height: 180 } });
  await p2.setContent(`<html><body style="margin:0"><canvas id="c"></canvas><img id="i" src="data:image/png;base64,${big.toString('base64')}"></body></html>`);
  await p2.waitForFunction('document.getElementById("i").complete');
  const make=(w,h,type,q)=>p2.evaluate(([w,h,type,q])=>{const c=document.getElementById('c');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.clearRect(0,0,w,h);x.drawImage(document.getElementById('i'),0,0,w,h);return c.toDataURL(type,q).split(',')[1];},[w,h,type,q]);
  const out={ 'concept-girl.png':await make(970,90,'image/png'),'concept-girl.jpg':await make(970,90,'image/jpeg',0.95),'concept-girl@2x.png':await make(1940,180,'image/png'),'concept-girl@2x.jpg':await make(1940,180,'image/jpeg',0.95) };
  for(const [f,b] of Object.entries(out)) fs.writeFileSync(path.join(dir,f),Buffer.from(b,'base64'));
  const kb=f=>(fs.statSync(path.join(dir,f)).size/1024).toFixed(1);
  console.log('girl trimmed',girl.w+'x'+girl.h,'-> shown',gW+'x'+gH);
  for(const f of Object.keys(out)) console.log(f,kb(f)+' KB');
  await browser.close();
})();
