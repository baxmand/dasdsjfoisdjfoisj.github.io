const fs = require('fs');
const path = require('path');
const dir = __dirname;
const F = f => fs.readFileSync(path.join(dir, 'fonts', f)).toString('base64');
const mont600 = F('mont600.ttf'), mont800 = F('mont800.ttf'), mont900 = F('mont900.ttf');
const os500 = F('oswald500.ttf'), os700 = F('oswald700.ttf');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Mont';font-weight:600;src:url(data:font/ttf;base64,${mont600}) format('truetype');}
@font-face{font-family:'Mont';font-weight:800;src:url(data:font/ttf;base64,${mont800}) format('truetype');}
@font-face{font-family:'Mont';font-weight:900;src:url(data:font/ttf;base64,${mont900}) format('truetype');}
@font-face{font-family:'Os';font-weight:500;src:url(data:font/ttf;base64,${os500}) format('truetype');}
@font-face{font-family:'Os';font-weight:700;src:url(data:font/ttf;base64,${os700}) format('truetype');}
*{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased;}
html,body{width:970px;height:90px;overflow:hidden;}
.banner{position:relative;width:970px;height:90px;overflow:hidden;
  background:
    radial-gradient(120% 200% at 6% 30%, rgba(124,45,178,.30) 0%, rgba(124,45,178,0) 42%),
    radial-gradient(120% 240% at 46% 130%, rgba(0,174,239,.30) 0%, rgba(0,174,239,0) 44%),
    radial-gradient(150% 260% at 93% 45%, rgba(235,200,115,.22) 0%, rgba(235,200,115,0) 46%),
    linear-gradient(100deg,#0a0910 0%,#111524 48%,#0a0910 100%);
  font-family:'Mont',sans-serif;}
/* subtle diagonal sheen texture */
.tex{position:absolute;inset:0;opacity:.06;background:repeating-linear-gradient(115deg,#fff 0 1px,transparent 1px 46px);pointer-events:none;}
/* giant faint monogram watermark */
.wm{position:absolute;right:150px;top:-34px;font-family:'Mont';font-weight:900;font-size:180px;line-height:1;
  color:transparent;-webkit-text-stroke:1.5px rgba(235,200,115,.09);letter-spacing:-6px;user-select:none;}
/* hairline gold frame + corner ticks */
.frame{position:absolute;inset:0;border-top:1px solid rgba(235,200,115,.35);border-bottom:1px solid rgba(235,200,115,.35);}
.frame:before,.frame:after{content:"";position:absolute;width:14px;height:14px;}
.frame:before{left:8px;top:8px;border-left:1.5px solid rgba(235,200,115,.6);border-top:1.5px solid rgba(235,200,115,.6);}
.frame:after{right:8px;bottom:8px;border-right:1.5px solid rgba(235,200,115,.6);border-bottom:1.5px solid rgba(235,200,115,.6);}

.row{position:relative;height:90px;display:flex;align-items:center;padding:0 20px 0 22px;gap:20px;}
.gold{background:linear-gradient(180deg,#fdeeb6 0%,#ecc86b 42%,#c79a3c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}

/* LOGO lockup */
.logo{display:flex;align-items:center;gap:11px;flex:0 0 auto;}
.mono{font-family:'Mont';font-weight:900;font-size:44px;letter-spacing:-2px;line-height:.9;
  filter:drop-shadow(0 1px 0 rgba(255,255,255,.15));}
.lname{display:flex;flex-direction:column;gap:3px;}
.lname .t1{font-family:'Os';font-weight:700;font-size:15px;letter-spacing:5.5px;color:#f4efe4;line-height:1;}
.lname .t2{font-family:'Os';font-weight:500;font-size:9px;letter-spacing:6.2px;color:rgba(235,200,115,.85);line-height:1;}
.stars{font-size:9px;letter-spacing:2px;color:#ecc86b;line-height:1;margin-top:1px;}

.vr{width:1px;height:52px;background:linear-gradient(180deg,transparent,rgba(235,200,115,.55),transparent);flex:0 0 auto;}

/* CENTER message */
.mid{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;gap:6px;min-width:0;overflow:hidden;}
.kick{font-family:'Os';font-weight:500;font-size:10px;letter-spacing:4.3px;color:rgba(215,208,225,.7);text-transform:uppercase;white-space:nowrap;}
.kick b{color:rgba(235,200,115,.95);font-weight:700;}
.head{font-family:'Mont';font-weight:900;font-size:29px;line-height:1;letter-spacing:.2px;color:#fbf7ef;white-space:nowrap;text-shadow:0 2px 14px rgba(0,0,0,.5);}
.plat{display:flex;align-items:center;gap:8px;font-family:'Os';font-weight:500;font-size:10.5px;letter-spacing:.9px;color:rgba(222,217,232,.78);white-space:nowrap;text-transform:uppercase;}
.plat .d{color:rgba(235,200,115,.7);font-size:8px;}
.plat .sep{color:rgba(235,200,115,.75);font-size:12px;font-weight:700;margin:0 1px;}
.pf{display:inline-flex;align-items:center;font-family:'Mont';font-weight:800;font-size:14px;letter-spacing:.2px;text-transform:none;}
.pf .w{background:linear-gradient(180deg,#9be6ff 0%,#26c2ff 45%,#0093dd 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ofb{display:inline-block;background:linear-gradient(180deg,#2ac6ff,#0091d8);color:#fff;font-family:'Mont';font-weight:800;
  font-size:11px;border-radius:5px;padding:2px 4px 3px;margin-right:5px;line-height:1;
  box-shadow:0 0 12px rgba(0,174,239,.6),0 0 0 1px rgba(255,255,255,.25) inset;}

/* CTA */
.cta{flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:7px;padding-left:8px;}
.btn{font-family:'Os';font-weight:700;font-size:15px;letter-spacing:1.4px;color:#1a1206;text-transform:uppercase;
  background:linear-gradient(180deg,#fdeeb6 0%,#eecb6d 50%,#d3a544 100%);
  padding:11px 20px;border-radius:30px;white-space:nowrap;
  box-shadow:0 0 0 1px rgba(255,240,200,.55) inset,0 6px 20px rgba(236,200,107,.35),0 0 26px rgba(255,120,170,.18);}
.btn .ar{font-weight:700;}
.subcta{font-family:'Os';font-weight:500;font-size:9px;letter-spacing:2.8px;color:rgba(215,208,225,.68);text-transform:uppercase;}
</style></head><body>
<div class="banner">
  <div class="tex"></div>
  <div class="wm">AS</div>
  <div class="frame"></div>
  <div class="row">
    <div class="logo">
      <div class="mono gold">AS</div>
      <div class="lname">
        <div class="t1">TALENT</div>
        <div class="t2">AGENCY</div>
        <div class="stars">★★★★★</div>
      </div>
    </div>
    <div class="vr"></div>
    <div class="mid">
      <div class="kick">Модельный менеджмент&nbsp;&nbsp;·&nbsp;&nbsp;<b>18+</b>&nbsp;&nbsp;·&nbsp;&nbsp;Работаем по всему миру</div>
      <div class="head">ИЩЕМ&nbsp;НОВЫЕ&nbsp;ЛИЦА</div>
      <div class="plat"><span class="pf"><span class="ofb">of</span><span class="w">OnlyFans</span></span><span class="sep">·</span><span class="pf"><span class="ofb">f</span><span class="w">Fansly</span></span><span class="d">◆</span><span>Без&nbsp;опыта</span><span class="d">◆</span><span>Обучение</span><span class="d">◆</span><span>Выплаты&nbsp;2×/мес</span></div>
    </div>
    <div class="cta">
      <div class="btn">Откликнуться <span class="ar gold" style="-webkit-text-fill-color:#1a1206">›</span></div>
      <div class="subcta">Обучение · Продвижение · 24/7</div>
    </div>
  </div>
</div>
</body></html>`;
fs.writeFileSync(path.join(dir, 'banner.html'), html);
console.log('banner.html written', html.length, 'bytes');
