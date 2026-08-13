// Build an HTML mirror of the pptx (same inch coords -> px*96) for visual QA screenshots.
const fs = require('fs');
const A = 'file://' + __dirname + '/assets/';
const PX = 96;
const PT = 96 / 72;
const PINK2 = '#FF3EA5', PINK = '#FF149A', WHITE = '#fff', MUTE = '#A6A6AE';

let slides = [];
function box(o) {
  const st = [];
  st.push(`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`);
  if (o.h) st.push(`height:${o.h * PX}px`);
  if (o.fs) st.push(`font-size:${o.fs * PT}px`);
  st.push(`color:${o.color || WHITE}`);
  st.push(`font-weight:${o.bold ? 700 : 400}`);
  if (o.italic) st.push('font-style:italic');
  st.push(`text-align:${o.align || 'left'}`);
  if (o.cs) st.push(`letter-spacing:${o.cs}px`);
  if (o.lh) st.push(`line-height:${o.lh}`);
  if (o.valign === 'middle') st.push('display:flex', 'align-items:center', o.align === 'center' ? 'justify-content:center' : 'justify-content:flex-start');
  if (o.glow) st.push('text-shadow:0 0 12px rgba(255,0,144,.7)');
  return `<div class="t" style="${st.join(';')}">${o.text.replace(/\n/g, '<br>')}</div>`;
}
function rect(o) {
  const st = [`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`, `height:${o.h * PX}px`,
    `border-radius:${(o.r || 0) * PX}px`, `background:${o.fill || 'transparent'}`];
  if (o.border) st.push(`border:${o.border}`);
  if (o.shadow) st.push('box-shadow:0 0 16px rgba(255,0,144,.45)');
  return `<div class="s" style="${st.join(';')}"></div>`;
}
function ell(o) { return rect({ ...o, r: o.w / 2 }); }
function img(o) { return `<img class="im" style="left:${o.x * PX}px;top:${o.y * PX}px;width:${o.w * PX}px;height:${o.h * PX}px" src="${A}${o.src}">`; }

function slide(bg, parts) { slides.push(`<div class="slide" style="background-image:url('${A}${bg}')">${parts.join('')}</div>`); }

const kick = (t, x, y) => box({ text: t, x, y, w: 8, fs: 12, bold: true, color: PINK2, cs: 3 });

// S1
slide('bg-cover.png', [
  kick('TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.35),
  box({ text: 'AS Talent Agency', x: 0.85, y: 1.75, w: 9.5, fs: 66, bold: true }),
  box({ text: 'AS Superpowers', x: 0.9, y: 3.15, w: 8, fs: 30, bold: true, color: PINK2, glow: 1 }),
  box({ text: 'Управление талантами, соцсетями и OnlyFans — 24/7.<br>Helping creators unlock their true potential.', x: 0.9, y: 4.0, w: 8.4, fs: 17, color: '#D8D8DC', lh: 1.25 }),
  box({ text: 'astalentagency.com', x: 0.9, y: 6.7, w: 6, fs: 14, bold: true }),
]);

// S2
const rows = [['Personalized strategy', 'Индивидуальная стратегия под каждого автора — «no two creators are alike».'],
['Full-cycle management', 'Управление под ключ: контент, соцсети, чаттинг, аналитика.'],
['Global roster', 'Работаем с топ-моделями и блогерами по всему миру.']];
let p2 = [kick('WHO WE ARE', 0.7, 0.55), box({ text: 'Кто мы', x: 0.68, y: 0.85, w: 8, fs: 40, bold: true }),
box({ text: 'AS Talent — ведущее агентство по маркетингу и менеджменту OnlyFans. Более 3 лет мы помогаем авторам раскрыть потенциал и кратно увеличить доход. Мы берём на себя весь бизнес — от стратегии и соцсетей до общения с фанатами — а автор фокусируется на контенте.', x: 0.7, y: 1.95, w: 6.4, fs: 15.5, color: '#D2D2D6', lh: 1.3 })];
let ry = 3.85;
rows.forEach(([h, d]) => {
  p2.push(ell({ x: 0.7, y: ry + 0.02, w: 0.34, h: 0.34, fill: PINK, border: '1px solid ' + PINK2, shadow: 1 }));
  p2.push(box({ text: h, x: 1.2, y: ry - 0.14, w: 5.9, fs: 15, bold: true, color: PINK2 }));
  p2.push(box({ text: d, x: 1.2, y: ry + 0.2, w: 5.9, fs: 12.5, color: '#C2C2C8' }));
  ry += 1.0;
});
p2.push(rect({ x: 7.7, y: 1.95, w: 4.95, h: 4.6, r: 0.14, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }));
p2.push(box({ text: '“No two creators<br>are alike.”', x: 8.05, y: 2.35, w: 4.3, fs: 27, bold: true, lh: 1.05 }));
p2.push(box({ text: 'Мы не используем шаблонные решения — стратегия строится под бренд и цели каждого автора.', x: 8.05, y: 3.75, w: 4.3, fs: 13.5, color: '#BEBEC4', lh: 1.25 }));
p2.push(box({ text: '«За 3 месяца количество подписчиков удвоилось, а доход вырос втрое.»', x: 8.05, y: 5.15, w: 4.3, fs: 13, italic: true, color: PINK2, lh: 1.2 }));
p2.push(box({ text: '— отзыв автора / creator testimonial', x: 8.05, y: 6.05, w: 4.3, fs: 10.5, color: MUTE }));
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
let p3 = [kick('OUR TALENT  /  НАШИ ТАЛАНТЫ', 0.7, 0.45), box({ text: 'AS Superpowers', x: 0.68, y: 0.75, w: 10, fs: 38, bold: true, glow: 1 })];
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
const cardW = 3.85, cardH = 3.1, gap = 0.35, startX = (13.333 - (3 * cardW + 2 * gap)) / 2;
let p4 = [kick('WHAT WE DO', 0.7, 0.55), box({ text: 'Услуги', x: 0.68, y: 0.85, w: 8, fs: 40, bold: true })];
services.forEach(([h, d], i) => {
  const x = startX + i * (cardW + gap), y = 2.0;
  p4.push(rect({ x, y, w: cardW, h: cardH, r: 0.14, fill: '#111114', border: '1px solid rgba(255,20,154,.45)', shadow: 1 }));
  p4.push(box({ text: String(i + 1).padStart(2, '0'), x: x + 0.35, y: y + 0.3, w: 1.5, fs: 30, bold: true, color: PINK2 }));
  p4.push(box({ text: h, x: x + 0.35, y: y + 1.05, w: cardW - 0.7, fs: 17, bold: true }));
  p4.push(box({ text: d, x: x + 0.35, y: y + 1.9, w: cardW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.22 }));
});
const sub = ['Chatting & Sales / Чаттинг и продажи', 'Content Planning / Контент-план', 'Analytics & Growth / Аналитика и рост'];
sub.forEach((t, i) => {
  const x = startX + i * (cardW + gap), y = 5.45;
  p4.push(rect({ x, y, w: cardW, h: 0.75, r: 0.12, fill: '#17171B', border: '1px solid rgba(255,255,255,.18)' }));
  p4.push(ell({ x: x + 0.28, y: y + 0.24, w: 0.26, h: 0.26, fill: PINK }));
  p4.push(box({ text: t, x: x + 0.72, y, w: cardW - 0.9, h: 0.75, fs: 12, bold: true, color: '#E4E4E8', valign: 'middle' }));
});
slide('bg-content.png', p4);

// S5 numbers
const stats = [['79M+', 'Combined audience', 'Суммарная аудитория'], ['8', 'Top creators featured', 'Топ-авторов в подборке'],
['3+', 'Years of experience', 'Года опыта'], ['24/7', 'Dedicated support', 'Поддержка без выходных']];
const sw = 2.86, sgap = 0.3, sx0 = (13.333 - (4 * sw + 3 * sgap)) / 2;
let p5 = [kick('BY THE NUMBERS', 0.7, 0.55), box({ text: 'Цифры', x: 0.68, y: 0.85, w: 8, fs: 40, bold: true })];
stats.forEach(([big, en, ru], i) => {
  const x = sx0 + i * (sw + sgap), y = 2.1;
  p5.push(rect({ x, y, w: sw, h: 2.35, r: 0.14, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }));
  p5.push(box({ text: big, x, y: y + 0.35, w: sw, fs: 48, bold: true, color: PINK2, align: 'center', glow: 1 }));
  p5.push(box({ text: en, x, y: y + 1.45, w: sw, fs: 13.5, bold: true, align: 'center' }));
  p5.push(box({ text: ru, x, y: y + 1.8, w: sw, fs: 11.5, color: MUTE, align: 'center' }));
});
const fw = 4 * sw + 3 * sgap;
p5.push(rect({ x: sx0, y: 5.0, w: fw, h: 1.35, r: 0.14, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }));
p5.push(box({ text: '“Within 3 months my subscriber count doubled, and my monthly income tripled.”', x: sx0 + 0.5, y: 5.2, w: fw - 1.0, fs: 16, bold: true, italic: true, align: 'center' }));
p5.push(box({ text: '«За 3 месяца подписчики удвоились, а доход вырос втрое.» — отзыв автора', x: sx0 + 0.5, y: 5.8, w: fw - 1.0, fs: 12.5, color: PINK2, align: 'center' }));
slide('bg-content.png', p5);

// S6 process
const steps = [['Onboarding', 'Знакомство', 'Изучаем автора, бренд и цели. Закрепляем персонального менеджера.'],
['Strategy', 'Стратегия', 'Строим индивидуальный план роста и монетизации.'],
['Content & Social', 'Контент и соцсети', 'Контент-план, съёмки, ведение Instagram, TikTok и X.'],
['Growth & Retention', 'Рост и удержание', 'Чаттинг, продажи, апселлы, аналитика и масштабирование.']];
const stw = 2.86, stgap = 0.3, stx0 = (13.333 - (4 * stw + 3 * stgap)) / 2;
let p6 = [kick('HOW WE WORK', 0.7, 0.55), box({ text: 'Как мы работаем', x: 0.68, y: 0.85, w: 10, fs: 40, bold: true })];
steps.forEach(([en, ru, d], i) => {
  const x = stx0 + i * (stw + stgap), y = 2.2;
  p6.push(rect({ x, y, w: stw, h: 3.6, r: 0.14, fill: '#111114', border: '1px solid rgba(255,20,154,.4)' }));
  p6.push(ell({ x: x + 0.35, y: y + 0.35, w: 0.9, h: 0.9, fill: '#C8006A', border: '1px solid ' + PINK2, shadow: 1 }));
  p6.push(box({ text: String(i + 1), x: x + 0.35, y: y + 0.42, w: 0.9, fs: 30, bold: true, align: 'center' }));
  p6.push(box({ text: en, x: x + 0.35, y: y + 1.45, w: stw - 0.7, fs: 16, bold: true }));
  p6.push(box({ text: ru, x: x + 0.35, y: y + 1.85, w: stw - 0.7, fs: 12.5, bold: true, color: PINK2 }));
  p6.push(box({ text: d, x: x + 0.35, y: y + 2.3, w: stw - 0.7, fs: 12, color: '#C2C2C8', lh: 1.25 }));
  if (i < 3) p6.push(box({ text: '→', x: x + stw - 0.02, y: y + 1.35, w: stgap + 0.04, fs: 20, bold: true, color: PINK2, align: 'center' }));
});
slide('bg-content.png', p6);

// S7 why
const why = [['Dedicated manager', 'Персональный менеджер и обучение для каждого клиента.'],
['24/7 support', 'Команда поддержки на связи круглосуточно.'],
['Data-driven', 'Решения на основе аналитики и метрик эффективности.'],
['Creative freedom', 'Вы создаёте контент — мы берём на себя бизнес.'],
['All levels welcome', 'Работаем с авторами любого уровня — от старта до топа.'],
['Global reach', 'Модели и блогеры по всему миру, мужчины и женщины.']];
const ww = 3.85, wgapx = 0.35, wh = 1.55, wgapy = 0.3, wx0 = (13.333 - (3 * ww + 2 * wgapx)) / 2;
let p7 = [kick('WHY AS TALENT', 0.7, 0.55), box({ text: 'Почему мы', x: 0.68, y: 0.85, w: 10, fs: 40, bold: true })];
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3), x = wx0 + col * (ww + wgapx), y = 2.1 + row * (wh + wgapy);
  p7.push(rect({ x, y, w: ww, h: wh, r: 0.12, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }));
  p7.push(ell({ x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: PINK, border: '1px solid ' + PINK2, shadow: 1 }));
  p7.push(box({ text: '✓', x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fs: 14, bold: true, align: 'center', valign: 'middle' }));
  p7.push(box({ text: h, x: x + 0.9, y: y + 0.28, w: ww - 1.15, fs: 15, bold: true, color: PINK2 }));
  p7.push(box({ text: d, x: x + 0.9, y: y + 0.7, w: ww - 1.15, fs: 12, color: '#C6C6CC', lh: 1.2 }));
});
slide('bg-content.png', p7);

// S8 contact
slide('bg-contact.png', [
  kick("LET'S TALK  /  ДАВАЙТЕ РАБОТАТЬ", 0.9, 1.9),
  box({ text: 'Unlock your true<br>potential.', x: 0.85, y: 2.3, w: 9, fs: 52, bold: true, lh: 1.0 }),
  box({ text: 'Присоединяйся к AS Talent Agency — и раскрой свой потенциал вместе с нами.', x: 0.9, y: 4.2, w: 8.4, fs: 17, color: '#D8D8DC' }),
  rect({ x: 0.9, y: 5.15, w: 3.4, h: 0.9, r: 0.14, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }),
  box({ text: 'astalentagency.com', x: 0.9, y: 5.15, w: 3.4, h: 0.9, fs: 15, bold: true, align: 'center', valign: 'middle' }),
  rect({ x: 4.45, y: 5.15, w: 3.4, h: 0.9, r: 0.14, fill: '#111114', border: '1px solid rgba(255,255,255,.18)' }),
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
