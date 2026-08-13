// HTML mirror of build.js (v2 redesign) for visual QA. Same inch coords -> px*96.
const fs = require('fs');
const A = 'file://' + __dirname + '/assets/';
const PX = 96, PT = 96 / 72;
const PINK = '#FF149A', PINK2 = '#FF3EA5', PINK_DEEP = '#C8006A', WHITE = '#fff',
  TEXT = '#D7D7DC', MUTE = '#9A9AA4', CARD = '#141419', CARD2 = '#1B1B21';

let slides = [];
function box(o) {
  const st = [`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`];
  if (o.h) st.push(`height:${o.h * PX}px`);
  if (o.fs) st.push(`font-size:${o.fs * PT}px`);
  st.push(`color:${o.color || WHITE}`, `font-weight:${o.bold ? 700 : 400}`, `text-align:${o.align || 'left'}`);
  if (o.italic) st.push('font-style:italic');
  if (o.cs) st.push(`letter-spacing:${o.cs}px`);
  if (o.lh) st.push(`line-height:${o.lh}`);
  if (o.valign === 'middle') st.push('display:flex', 'align-items:center', o.align === 'center' ? 'justify-content:center' : 'justify-content:flex-start');
  return `<div class="t" style="${st.join(';')}">${o.text.replace(/\n/g, '<br>')}</div>`;
}
function rect(o) {
  const st = [`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`, `height:${o.h * PX}px`,
    `border-radius:${(o.r || 0) * PX}px`, `background:${o.fill || 'transparent'}`];
  if (o.border) st.push(`border:${o.border}`);
  return `<div class="s" style="${st.join(';')}"></div>`;
}
const ell = (o) => rect({ ...o, r: o.w / 2 });
const img = (o) => `<img class="im" style="left:${o.x * PX}px;top:${o.y * PX}px;width:${o.w * PX}px;height:${o.h * PX}px" src="${A}${o.src}">`;
const panel = (x, y, w, h, fill) => rect({ x, y, w, h, r: 0.13, fill: fill || CARD, border: '1px solid rgba(255,255,255,.12)' });
function chip(x, y, d, label, fs) {
  return ell({ x, y, w: d, h: d, fill: PINK, border: '1px solid ' + PINK2 })
    + box({ text: label, x, y, w: d, h: d, fs: fs || 18, bold: true, color: WHITE, align: 'center', valign: 'middle' });
}
function kick(text, x, y) {
  return ell({ x, y: y + 0.06, w: 0.12, h: 0.12, fill: PINK })
    + box({ text, x: x + 0.26, y, w: 9, fs: 12, bold: true, color: PINK2, cs: 3 });
}
const heading = (ru, y) => box({ text: ru, x: 0.66, y, w: 11, fs: 40, bold: true });
const slide = (bg, parts) => slides.push(`<div class="slide" style="background-image:url('${A}${bg}')">${parts.join('')}</div>`);

// S1 cover
slide('bg-cover.png', [
  kick('TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.3),
  box({ text: 'AS Talent', x: 0.85, y: 1.75, w: 11, fs: 68, bold: true }),
  box({ text: `Agency <span style="color:${MUTE}">   /   </span><span style="color:${PINK2}">AS Superpowers</span>`, x: 0.88, y: 2.95, w: 11.5, fs: 30, bold: true }),
  box({ text: 'Управление талантами, соцсетями и OnlyFans — 24/7.<br>Helping creators unlock their true potential.', x: 0.9, y: 4.05, w: 8.6, fs: 17, color: TEXT, lh: 1.3 }),
  box({ text: 'astalentagency.com', x: 0.9, y: 6.7, w: 5, fs: 14, bold: true }),
  box({ text: 'OnlyFans · Instagram · TikTok · X', x: 7.4, y: 6.7, w: 5.0, fs: 12, bold: true, color: MUTE, align: 'right', cs: 1 }),
]);

// S2 who
const rows = [['Personalized strategy', 'Индивидуальная стратегия под каждого автора.'],
['Full-cycle management', 'Управление под ключ: контент, соцсети, чаттинг, аналитика.'],
['Global roster', 'Работаем с топ-моделями и блогерами по всему миру.']];
let p2 = [kick('WHO WE ARE', 0.7, 0.55), heading('Кто мы', 0.85),
box({ text: 'AS Talent — ведущее агентство по маркетингу и менеджменту OnlyFans. Более 3 лет мы помогаем авторам раскрыть потенциал и кратно увеличить доход. Мы берём на себя весь бизнес — от стратегии и соцсетей до общения с фанатами — а автор фокусируется на контенте.', x: 0.7, y: 1.95, w: 6.4, fs: 15.5, color: TEXT, lh: 1.3 })];
let ry = 3.9;
rows.forEach(([h, d]) => {
  p2.push(ell({ x: 0.72, y: ry + 0.02, w: 0.16, h: 0.16, fill: PINK }));
  p2.push(box({ text: h, x: 1.15, y: ry - 0.16, w: 5.95, fs: 15, bold: true, color: PINK2 }));
  p2.push(box({ text: d, x: 1.15, y: ry + 0.2, w: 5.95, fs: 12.5, color: '#C2C2C8' }));
  ry += 1.0;
});
p2.push(panel(7.7, 1.95, 4.95, 4.6));
p2.push(box({ text: '“No two creators<br>are alike.”', x: 8.05, y: 2.35, w: 4.3, fs: 27, bold: true, lh: 1.05 }));
p2.push(box({ text: 'Мы не используем шаблонные решения — стратегия строится под бренд и цели каждого автора.', x: 8.05, y: 3.8, w: 4.3, fs: 13.5, color: '#BEBEC4', lh: 1.25 }));
p2.push(box({ text: '«За 3 месяца количество подписчиков удвоилось, а доход вырос втрое.»', x: 8.05, y: 5.2, w: 4.3, fs: 13, italic: true, color: PINK2, lh: 1.2 }));
p2.push(box({ text: '— отзыв автора / creator testimonial', x: 8.05, y: 6.1, w: 4.3, fs: 10.5, color: MUTE }));
slide('bg-content.png', p2);

// S3 roster
const roster = [
  { name: 'Elizabeth Anokhina', foll: '45M', img: 'av-elizabeth.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Eli Vasilenko', foll: '10.5M', img: 'av-eli.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Little Caprice', foll: '11M', img: 'av-caprice.png', soc: ['tiktok', 'instagram'] },
  { name: 'Macca', foll: '1.5M', img: 'av-macca.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Kuri Emi', foll: '2.5M', img: 'av-kuri.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Qimmah Russo', foll: '5M', img: 'av-qimmah.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Chloe Amour', foll: '2.4M', img: 'av-chloe.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Zlata Sharvarok', foll: '1M', img: 'av-zlata.png', soc: ['x', 'tiktok', 'instagram'] }];
const icMap = { x: 'ic-x.png', tiktok: 'ic-tiktok.png', instagram: 'ic-instagram.png' };
const DIA = 0.30, GAP = 0.14, ICON = 0.17, AV = 1.15, margin = 0.9, usable = 13.333 - 2 * margin;
const N = roster.length, topN = Math.ceil(N / 2), rowsArr = [roster.slice(0, topN), roster.slice(topN)], rowTopY = [1.55, 4.35];
let p3 = [kick('OUR TALENT  /  НАШИ ТАЛАНТЫ', 0.7, 0.5), box({ text: 'AS Superpowers', x: 0.66, y: 0.82, w: 8, fs: 38, bold: true }),
  box({ text: 'FEATURED  ·  150+ CREATORS ON ROSTER<br>Избранные — часть ростера из 150+ креаторов', x: 7.0, y: 1.02, w: 5.4, fs: 11.5, bold: true, color: MUTE, align: 'right', cs: 0.5, lh: 1.15 })];
rowsArr.forEach((items, ri) => {
  const k = items.length, cellW = usable / k, top = rowTopY[ri];
  items.forEach((t, ci) => {
    const cx = margin + (ci + 0.5) * cellW;
    p3.push(img({ src: t.img, x: cx - AV / 2, y: top, w: AV, h: AV }));
    p3.push(box({ text: t.name.toUpperCase(), x: cx - cellW / 2, y: top + AV + 0.05, w: cellW, fs: 13, bold: true, color: PINK2, align: 'center' }));
    p3.push(box({ text: t.foll + ' FOLLOWERS', x: cx - cellW / 2, y: top + AV + 0.6, w: cellW, fs: 10, color: MUTE, cs: 1, align: 'center' }));
    const n = t.soc.length, totalW = n * DIA + (n - 1) * GAP; let ix = cx - totalW / 2; const iy = top + AV + 0.95;
    t.soc.forEach(sc => {
      p3.push(ell({ x: ix, y: iy, w: DIA, h: DIA, fill: '#F2F2F2' }));
      p3.push(img({ src: icMap[sc], x: ix + (DIA - ICON) / 2, y: iy + (DIA - ICON) / 2, w: ICON, h: ICON }));
      ix += DIA + GAP;
    });
  });
});
slide('bg-content.png', p3);

// S4 services
const services = [['24/7 OnlyFans Coverage', 'Круглосуточное ведение OnlyFans: чаттинг, продажи, удержание и апселлы. Персональный менеджер у каждого автора.'],
['Social Media Management', 'Ведение и оптимизация Instagram, TikTok и X: контент-план, трафик и рост аудитории.'],
['Content Houses', 'Съёмки и продакшн в контент-хаусах: идеи, контроль качества и стабильный поток контента.']];
const cW = 3.85, cH = 3.15, cGap = 0.35, sX = (13.333 - (3 * cW + 2 * cGap)) / 2;
let p4 = [kick('WHAT WE DO', 0.7, 0.55), heading('Услуги', 0.85)];
services.forEach(([h, d], i) => {
  const x = sX + i * (cW + cGap), y = 2.0;
  p4.push(panel(x, y, cW, cH));
  p4.push(chip(x + 0.35, y + 0.35, 0.66, String(i + 1), 22));
  p4.push(box({ text: h, x: x + 0.35, y: y + 1.2, w: cW - 0.7, fs: 17.5, bold: true }));
  p4.push(box({ text: d, x: x + 0.35, y: y + 2.05, w: cW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.22 }));
});
const sub = ['Chatting & Sales / Чаттинг и продажи', 'Content Planning / Контент-план', 'Analytics & Growth / Аналитика и рост'];
sub.forEach((t, i) => {
  const x = sX + i * (cW + cGap), y = 5.5;
  p4.push(panel(x, y, cW, 0.75, CARD2));
  p4.push(ell({ x: x + 0.3, y: y + 0.25, w: 0.24, h: 0.24, fill: PINK }));
  p4.push(box({ text: t, x: x + 0.72, y, w: cW - 0.9, h: 0.75, fs: 12, bold: true, color: '#E4E4E8', valign: 'middle' }));
});
slide('bg-content.png', p4);

// S5 numbers
const stats = [['150+', 'Creators on roster', 'Креаторов в ростере'], ['3+', 'Years of experience', 'Года опыта'],
['24/7', 'Dedicated support', 'Поддержка без выходных'], ['Global', 'Worldwide talent', 'Таланты по всему миру']];
const nW = 2.86, nGap = 0.3, nX = (13.333 - (4 * nW + 3 * nGap)) / 2;
let p5 = [kick('BY THE NUMBERS', 0.7, 0.55), heading('Цифры', 0.85)];
stats.forEach(([big, en, ru], i) => {
  const x = nX + i * (nW + nGap), y = 2.1;
  p5.push(panel(x, y, nW, 2.35));
  p5.push(box({ text: big, x, y: y + 0.4, w: nW, fs: 46, bold: true, color: PINK2, align: 'center' }));
  p5.push(box({ text: en, x, y: y + 1.5, w: nW, fs: 13.5, bold: true, align: 'center' }));
  p5.push(box({ text: ru, x, y: y + 1.85, w: nW, fs: 11.5, color: MUTE, align: 'center' }));
});
const fW = 4 * nW + 3 * nGap;
p5.push(panel(nX, 5.0, fW, 1.35));
p5.push(box({ text: '“Within 3 months my subscriber count doubled, and my monthly income tripled.”', x: nX + 0.5, y: 5.2, w: fW - 1.0, fs: 16, bold: true, italic: true, align: 'center' }));
p5.push(box({ text: '«За 3 месяца подписчики удвоились, а доход вырос втрое.» — отзыв автора', x: nX + 0.5, y: 5.8, w: fW - 1.0, fs: 12.5, color: PINK2, align: 'center' }));
slide('bg-content.png', p5);

// S6 process
const steps = [['Onboarding', 'Знакомство', 'Изучаем автора, бренд и цели. Закрепляем персонального менеджера.'],
['Strategy', 'Стратегия', 'Строим индивидуальный план роста и монетизации.'],
['Content & Social', 'Контент и соцсети', 'Контент-план, съёмки, ведение Instagram, TikTok и X.'],
['Growth & Retention', 'Рост и удержание', 'Чаттинг, продажи, апселлы, аналитика и масштабирование.']];
const pW = 2.86, pGap = 0.3, pX = (13.333 - (4 * pW + 3 * pGap)) / 2;
let p6 = [kick('HOW WE WORK', 0.7, 0.55), heading('Как мы работаем', 0.85)];
steps.forEach(([en, ru, d], i) => {
  const x = pX + i * (pW + pGap), y = 2.2;
  p6.push(panel(x, y, pW, 3.6));
  p6.push(chip(x + 0.35, y + 0.35, 0.85, String(i + 1), 28));
  p6.push(box({ text: en, x: x + 0.35, y: y + 1.45, w: pW - 0.7, fs: 16, bold: true }));
  p6.push(box({ text: ru, x: x + 0.35, y: y + 1.85, w: pW - 0.7, fs: 12.5, bold: true, color: PINK2 }));
  p6.push(box({ text: d, x: x + 0.35, y: y + 2.3, w: pW - 0.7, fs: 12, color: '#C2C2C8', lh: 1.25 }));
  if (i < 3) p6.push(box({ text: '→', x: x + pW - 0.02, y: y + 1.35, w: pGap + 0.04, fs: 20, bold: true, color: PINK2, align: 'center' }));
});
slide('bg-content.png', p6);

// S7 why
const why = [['Dedicated manager', 'Персональный менеджер и обучение для каждого клиента.'],
['24/7 support', 'Команда поддержки на связи круглосуточно.'],
['Data-driven', 'Решения на основе аналитики и метрик эффективности.'],
['Creative freedom', 'Вы создаёте контент — мы берём на себя бизнес.'],
['All levels welcome', 'Работаем с авторами любого уровня — от старта до топа.'],
['Global reach', 'Модели и блогеры по всему миру, мужчины и женщины.']];
const wW = 3.85, wGx = 0.35, wH = 1.55, wGy = 0.3, wX = (13.333 - (3 * wW + 2 * wGx)) / 2;
let p7 = [kick('WHY AS TALENT', 0.7, 0.55), heading('Почему мы', 0.85)];
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3), x = wX + col * (wW + wGx), y = 2.1 + row * (wH + wGy);
  p7.push(panel(x, y, wW, wH));
  p7.push(ell({ x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: PINK }));
  p7.push(box({ text: '✓', x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fs: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' }));
  p7.push(box({ text: h, x: x + 0.9, y: y + 0.28, w: wW - 1.15, fs: 15, bold: true, color: PINK2 }));
  p7.push(box({ text: d, x: x + 0.9, y: y + 0.7, w: wW - 1.15, fs: 12, color: '#C6C6CC', lh: 1.2 }));
});
slide('bg-content.png', p7);

// S8 contact
slide('bg-contact.png', [
  kick("LET'S TALK  /  ДАВАЙТЕ РАБОТАТЬ", 0.9, 1.85),
  box({ text: 'Unlock your true<br>potential.', x: 0.85, y: 2.25, w: 9, fs: 52, bold: true, lh: 1.0 }),
  box({ text: 'Присоединяйся к AS Talent Agency — и раскрой свой потенциал вместе с нами.', x: 0.9, y: 4.2, w: 8.4, fs: 17, color: TEXT }),
  panel(0.9, 5.15, 3.4, 0.9),
  box({ text: 'astalentagency.com', x: 0.9, y: 5.15, w: 3.4, h: 0.9, fs: 15, bold: true, align: 'center', valign: 'middle' }),
  panel(4.45, 5.15, 3.4, 0.9),
  box({ text: '@astalentagency', x: 4.45, y: 5.15, w: 3.4, h: 0.9, fs: 15, bold: true, color: PINK2, align: 'center', valign: 'middle' }),
]);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#222;font-family:Arial,Helvetica,sans-serif}
.slide{position:relative;width:1280px;height:720px;background-size:cover;overflow:hidden;margin:0 auto 20px}
.t{position:absolute}.s{position:absolute}.im{position:absolute}
</style></head><body>${slides.join('')}</body></html>`;
fs.writeFileSync(__dirname + '/preview.html', html);
console.log('preview.html written');
