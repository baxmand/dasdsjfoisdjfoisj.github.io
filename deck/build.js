const pptxgen = require('pptxgenjs');
const A = __dirname + '/assets/';

const p = new pptxgen();
p.defineLayout({ name: 'W', width: 13.333, height: 7.5 });
p.layout = 'W';
p.author = 'AS Talent Agency';
p.title = 'AS Talent Agency';

// ---- palette (dark + pink neon) ----
const PINK = 'FF149A';
const PINK2 = 'FF3EA5';
const PINK_DEEP = 'C8006A';
const WHITE = 'FFFFFF';
const TEXT = 'D7D7DC';
const MUTE = '9A9AA4';
const CARD = '141419';
const CARD2 = '1B1B21';
const HAIR = 'FFFFFF';   // hairline border colour (used with transparency)
const FONT = 'Arial';

// ---- helpers ----
function kicker(s, text, x, y) {
  s.addShape('ellipse', { x, y: y + 0.06, w: 0.12, h: 0.12, fill: { color: PINK } });
  s.addText(text, { x: x + 0.26, y, w: 9, h: 0.3, fontFace: FONT, fontSize: 12, bold: true,
    color: PINK2, charSpacing: 4, align: 'left' });
}
function heading(s, ru, y) {
  s.addText(ru, { x: 0.66, y, w: 11, h: 0.9, fontFace: FONT, fontSize: 40, bold: true, color: WHITE });
}
function panel(s, x, y, w, h, fill) {
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.13, fill: { color: fill || CARD },
    line: { color: HAIR, width: 0.75, transparency: 88 } });
}
function chip(s, x, y, d, label, fontSize) {
  s.addShape('ellipse', { x, y, w: d, h: d, fill: { color: PINK }, line: { color: PINK2, width: 1 } });
  s.addText(label, { x, y: y - 0.02, w: d, h: d, fontFace: FONT, fontSize: fontSize || 18, bold: true,
    color: WHITE, align: 'center', valign: 'middle' });
}

// ==================================================== SLIDE 1 — COVER
let s = p.addSlide();
s.background = { path: A + 'bg-cover.png' };
kicker(s, 'TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.3);
s.addText('AS Talent', { x: 0.85, y: 1.75, w: 11, h: 1.15, fontFace: FONT, fontSize: 68, bold: true, color: WHITE });
s.addText([
  { text: 'Agency', options: { color: WHITE } },
  { text: '   /   ', options: { color: MUTE } },
  { text: 'AS Superpowers', options: { color: PINK2 } },
], { x: 0.88, y: 2.95, w: 11.5, h: 0.8, fontFace: FONT, fontSize: 30, bold: true, align: 'left' });
s.addText('Управление талантами, соцсетями и OnlyFans — 24/7.\nHelping creators unlock their true potential.',
  { x: 0.9, y: 4.05, w: 8.6, h: 1.0, fontFace: FONT, fontSize: 17, color: TEXT, lineSpacingMultiple: 1.3 });
// bottom row
s.addText('astalentagency.com', { x: 0.9, y: 6.7, w: 5, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: WHITE });
s.addText('OnlyFans · Instagram · TikTok · X', { x: 7.4, y: 6.7, w: 5.0, h: 0.4, fontFace: FONT,
  fontSize: 12, bold: true, color: MUTE, align: 'right', charSpacing: 1 });
s.addNotes('Обложка. AS Talent Agency — агентство полного цикла: таланты, соцсети, OnlyFans, 24/7.');

// ==================================================== SLIDE 2 — WHO WE ARE
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHO WE ARE', 0.7, 0.55);
heading(s, 'Кто мы', 0.85);
s.addText(
  'AS Talent — ведущее агентство по маркетингу и менеджменту OnlyFans. Более 3 лет мы помогаем ' +
  'авторам раскрыть потенциал и кратно увеличить доход. Мы берём на себя весь бизнес — от стратегии ' +
  'и соцсетей до общения с фанатами — а автор фокусируется на контенте.',
  { x: 0.7, y: 1.95, w: 6.4, h: 1.7, fontFace: FONT, fontSize: 15.5, color: TEXT, lineSpacingMultiple: 1.3, valign: 'top' });

const rows = [
  ['Personalized strategy', 'Индивидуальная стратегия под каждого автора.'],
  ['Full-cycle management', 'Управление под ключ: контент, соцсети, чаттинг, аналитика.'],
  ['Global roster', 'Работаем с топ-моделями и блогерами по всему миру.'],
];
let ry = 3.9;
rows.forEach(([h, d]) => {
  s.addShape('ellipse', { x: 0.72, y: ry + 0.02, w: 0.16, h: 0.16, fill: { color: PINK } });
  s.addText(h, { x: 1.15, y: ry - 0.16, w: 5.95, h: 0.34, fontFace: FONT, fontSize: 15, bold: true, color: PINK2 });
  s.addText(d, { x: 1.15, y: ry + 0.2, w: 5.95, h: 0.5, fontFace: FONT, fontSize: 12.5, color: 'C2C2C8' });
  ry += 1.0;
});

panel(s, 7.7, 1.95, 4.95, 4.6, CARD);
s.addText('“No two creators\nare alike.”', { x: 8.05, y: 2.35, w: 4.3, h: 1.3, fontFace: FONT,
  fontSize: 27, bold: true, color: WHITE, lineSpacingMultiple: 1.05 });
s.addText('Мы не используем шаблонные решения — стратегия строится под бренд и цели каждого автора.',
  { x: 8.05, y: 3.8, w: 4.3, h: 1.0, fontFace: FONT, fontSize: 13.5, color: 'BEBEC4', lineSpacingMultiple: 1.25 });
s.addShape('line', { x: 8.05, y: 5.0, w: 4.25, h: 0, line: { color: HAIR, width: 0.75, transparency: 82 } });
s.addText('«За 3 месяца количество подписчиков удвоилось, а доход вырос втрое.»',
  { x: 8.05, y: 5.2, w: 4.3, h: 0.9, fontFace: FONT, fontSize: 13, italic: true, color: PINK2, lineSpacingMultiple: 1.2 });
s.addText('— отзыв автора / creator testimonial', { x: 8.05, y: 6.1, w: 4.3, h: 0.3, fontFace: FONT, fontSize: 10.5, color: MUTE });
s.addNotes('Кто мы: агентство полного цикла, 3+ года, индивидуальный подход, глобальный ростер.');

// ==================================================== SLIDE 3 — ROSTER
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'OUR TALENT  /  НАШИ ТАЛАНТЫ', 0.7, 0.5);
s.addText('AS Superpowers', { x: 0.66, y: 0.82, w: 8, h: 0.8, fontFace: FONT, fontSize: 38, bold: true, color: WHITE });
s.addText('FEATURED  ·  150+ CREATORS ON ROSTER\nИзбранные — часть ростера из 150+ креаторов', { x: 7.0, y: 1.02, w: 5.4, h: 0.6,
  fontFace: FONT, fontSize: 11.5, bold: true, color: MUTE, align: 'right', charSpacing: 0.5, lineSpacingMultiple: 1.15 });

const roster = [
  { name: 'Elizabeth Anokhina', foll: '45M', img: 'av-elizabeth.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Eli Vasilenko', foll: '10.5M', img: 'av-eli.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Little Caprice', foll: '11M', img: 'av-caprice.png', soc: ['tiktok', 'instagram'] },
  { name: 'Macca', foll: '1.5M', img: 'av-macca.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Kuri Emi', foll: '2.5M', img: 'av-kuri.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Qimmah Russo', foll: '5M', img: 'av-qimmah.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Chloe Amour', foll: '2.4M', img: 'av-chloe.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Zlata Sharvarok', foll: '1M', img: 'av-zlata.png', soc: ['x', 'tiktok', 'instagram'] },
];
const icMap = { x: 'ic-x.png', tiktok: 'ic-tiktok.png', instagram: 'ic-instagram.png' };
const DIA = 0.30, GAP = 0.14, ICON = 0.17, AV = 1.15;
const margin = 0.9, usable = 13.333 - 2 * margin;
const N = roster.length, topN = Math.ceil(N / 2);
const rowsArr = [roster.slice(0, topN), roster.slice(topN)];
const rowTopY = [1.55, 4.35];

rowsArr.forEach((items, ri) => {
  const k = items.length;
  const cellW = usable / k;
  const top = rowTopY[ri];
  items.forEach((t, ci) => {
    const cx = margin + (ci + 0.5) * cellW;
    s.addImage({ path: A + t.img, x: cx - AV / 2, y: top, w: AV, h: AV });
    s.addText(t.name.toUpperCase(), { x: cx - cellW / 2, y: top + AV + 0.05, w: cellW, h: 0.5,
      fontFace: FONT, fontSize: 13, bold: true, color: PINK2, align: 'center', valign: 'top', lineSpacingMultiple: 1.0 });
    s.addText(t.foll + ' FOLLOWERS', { x: cx - cellW / 2, y: top + AV + 0.6, w: cellW, h: 0.3,
      fontFace: FONT, fontSize: 10, color: MUTE, charSpacing: 1, align: 'center' });
    const n = t.soc.length;
    const totalW = n * DIA + (n - 1) * GAP;
    let ix = cx - totalW / 2;
    const iy = top + AV + 0.95;
    t.soc.forEach((sc) => {
      s.addShape('ellipse', { x: ix, y: iy, w: DIA, h: DIA, fill: { color: 'F2F2F2' } });
      s.addImage({ path: A + icMap[sc], x: ix + (DIA - ICON) / 2, y: iy + (DIA - ICON) / 2, w: ICON, h: ICON });
      ix += DIA + GAP;
    });
  });
});
s.addNotes('Избранные креаторы агентства (часть ростера из 150+ креаторов). X, TikTok, Instagram.');

// ==================================================== SLIDE 4 — SERVICES
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHAT WE DO', 0.7, 0.55);
heading(s, 'Услуги', 0.85);

const services = [
  ['24/7 OnlyFans Coverage', 'Круглосуточное ведение OnlyFans: чаттинг, продажи, удержание и апселлы. Персональный менеджер у каждого автора.'],
  ['Social Media Management', 'Ведение и оптимизация Instagram, TikTok и X: контент-план, трафик и рост аудитории.'],
  ['Content Houses', 'Съёмки и продакшн в контент-хаусах: идеи, контроль качества и стабильный поток контента.'],
];
const cW = 3.85, cH = 3.15, cGap = 0.35;
const sX = (13.333 - (3 * cW + 2 * cGap)) / 2;
services.forEach(([h, d], i) => {
  const x = sX + i * (cW + cGap), y = 2.0;
  panel(s, x, y, cW, cH, CARD);
  chip(s, x + 0.35, y + 0.35, 0.66, String(i + 1), 22);
  s.addText(h, { x: x + 0.35, y: y + 1.2, w: cW - 0.7, h: 0.85, fontFace: FONT, fontSize: 17.5, bold: true, color: WHITE, valign: 'top', lineSpacingMultiple: 1.0 });
  s.addText(d, { x: x + 0.35, y: y + 2.05, w: cW - 0.7, h: 1.0, fontFace: FONT, fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.22 });
});
const sub = ['Chatting & Sales / Чаттинг и продажи', 'Content Planning / Контент-план', 'Analytics & Growth / Аналитика и рост'];
sub.forEach((t, i) => {
  const x = sX + i * (cW + cGap), y = 5.5;
  panel(s, x, y, cW, 0.75, CARD2);
  s.addShape('ellipse', { x: x + 0.3, y: y + 0.25, w: 0.24, h: 0.24, fill: { color: PINK } });
  s.addText(t, { x: x + 0.72, y, w: cW - 0.9, h: 0.75, fontFace: FONT, fontSize: 12, bold: true, color: 'E4E4E8', valign: 'middle' });
});
s.addNotes('Три ключевые услуги + поддерживающие сервисы.');

// ==================================================== SLIDE 5 — NUMBERS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'BY THE NUMBERS', 0.7, 0.55);
heading(s, 'Цифры', 0.85);

const stats = [
  ['150+', 'Creators on roster', 'Креаторов в ростере'],
  ['3+', 'Years of experience', 'Года опыта'],
  ['24/7', 'Dedicated support', 'Поддержка без выходных'],
  ['Global', 'Worldwide talent', 'Таланты по всему миру'],
];
const nW = 2.86, nGap = 0.3;
const nX = (13.333 - (4 * nW + 3 * nGap)) / 2;
stats.forEach(([big, en, ru], i) => {
  const x = nX + i * (nW + nGap), y = 2.1;
  panel(s, x, y, nW, 2.35, CARD);
  s.addText(big, { x, y: y + 0.4, w: nW, h: 1.0, fontFace: FONT, fontSize: 46, bold: true, color: PINK2, align: 'center' });
  s.addText(en, { x, y: y + 1.5, w: nW, h: 0.35, fontFace: FONT, fontSize: 13.5, bold: true, color: WHITE, align: 'center' });
  s.addText(ru, { x, y: y + 1.85, w: nW, h: 0.35, fontFace: FONT, fontSize: 11.5, color: MUTE, align: 'center' });
});
const fW = 4 * nW + 3 * nGap;
panel(s, nX, 5.0, fW, 1.35, CARD);
s.addText('“Within 3 months my subscriber count doubled, and my monthly income tripled.”',
  { x: nX + 0.5, y: 5.2, w: fW - 1.0, h: 0.55, fontFace: FONT, fontSize: 16, bold: true, italic: true, color: WHITE, align: 'center' });
s.addText('«За 3 месяца подписчики удвоились, а доход вырос втрое.» — отзыв автора',
  { x: nX + 0.5, y: 5.8, w: fW - 1.0, h: 0.4, fontFace: FONT, fontSize: 12.5, color: PINK2, align: 'center' });
s.addNotes('Ключевые цифры и социальное доказательство.');

// ==================================================== SLIDE 6 — HOW WE WORK
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'HOW WE WORK', 0.7, 0.55);
heading(s, 'Как мы работаем', 0.85);

const steps = [
  ['Onboarding', 'Знакомство', 'Изучаем автора, бренд и цели. Закрепляем персонального менеджера.'],
  ['Strategy', 'Стратегия', 'Строим индивидуальный план роста и монетизации.'],
  ['Content & Social', 'Контент и соцсети', 'Контент-план, съёмки, ведение Instagram, TikTok и X.'],
  ['Growth & Retention', 'Рост и удержание', 'Чаттинг, продажи, апселлы, аналитика и масштабирование.'],
];
const pW = 2.86, pGap = 0.3;
const pX = (13.333 - (4 * pW + 3 * pGap)) / 2;
steps.forEach(([en, ru, d], i) => {
  const x = pX + i * (pW + pGap), y = 2.2;
  panel(s, x, y, pW, 3.6, CARD);
  chip(s, x + 0.35, y + 0.35, 0.85, String(i + 1), 28);
  s.addText(en, { x: x + 0.35, y: y + 1.45, w: pW - 0.7, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: WHITE });
  s.addText(ru, { x: x + 0.35, y: y + 1.85, w: pW - 0.7, h: 0.35, fontFace: FONT, fontSize: 12.5, bold: true, color: PINK2 });
  s.addText(d, { x: x + 0.35, y: y + 2.3, w: pW - 0.7, h: 1.15, fontFace: FONT, fontSize: 12, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.25 });
  if (i < 3) s.addText('→', { x: x + pW - 0.02, y: y + 1.35, w: pGap + 0.04, h: 0.5, fontFace: FONT, fontSize: 20, bold: true, color: PINK2, align: 'center' });
});
s.addNotes('Процесс из 4 шагов: онбординг, стратегия, контент и соцсети, рост и удержание.');

// ==================================================== SLIDE 7 — WHY AS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHY AS TALENT', 0.7, 0.55);
heading(s, 'Почему мы', 0.85);

const why = [
  ['Dedicated manager', 'Персональный менеджер и обучение для каждого клиента.'],
  ['24/7 support', 'Команда поддержки на связи круглосуточно.'],
  ['Data-driven', 'Решения на основе аналитики и метрик эффективности.'],
  ['Creative freedom', 'Вы создаёте контент — мы берём на себя бизнес.'],
  ['All levels welcome', 'Работаем с авторами любого уровня — от старта до топа.'],
  ['Global reach', 'Модели и блогеры по всему миру, мужчины и женщины.'],
];
const wW = 3.85, wGx = 0.35, wH = 1.55, wGy = 0.3;
const wX = (13.333 - (3 * wW + 2 * wGx)) / 2;
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = wX + col * (wW + wGx), y = 2.1 + row * (wH + wGy);
  panel(s, x, y, wW, wH, CARD);
  s.addShape('ellipse', { x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: { color: PINK } });
  s.addText('✓', { x: x + 0.3, y: y + 0.3, w: 0.4, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addText(h, { x: x + 0.9, y: y + 0.28, w: wW - 1.15, h: 0.4, fontFace: FONT, fontSize: 15, bold: true, color: PINK2 });
  s.addText(d, { x: x + 0.9, y: y + 0.7, w: wW - 1.15, h: 0.75, fontFace: FONT, fontSize: 12, color: 'C6C6CC', valign: 'top', lineSpacingMultiple: 1.2 });
});
s.addNotes('Преимущества AS Talent.');

// ==================================================== SLIDE 8 — CONTACT
s = p.addSlide();
s.background = { path: A + 'bg-contact.png' };
kicker(s, "LET'S TALK  /  ДАВАЙТЕ РАБОТАТЬ", 0.9, 1.85);
s.addText('Unlock your true\npotential.', { x: 0.85, y: 2.25, w: 9, h: 1.9, fontFace: FONT, fontSize: 52, bold: true, color: WHITE, lineSpacingMultiple: 1.0 });
s.addText('Присоединяйся к AS Talent Agency — и раскрой свой потенциал вместе с нами.',
  { x: 0.9, y: 4.2, w: 8.4, h: 0.6, fontFace: FONT, fontSize: 17, color: TEXT });
panel(s, 0.9, 5.15, 3.9, 0.9, CARD);
s.addText('astalentagency.com', { x: 0.9, y: 5.15, w: 3.9, h: 0.9, fontFace: FONT, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle' });
s.addNotes('Контакты и призыв к действию. astalentagency.com');

p.writeFile({ fileName: __dirname + '/AS-Talent-Agency.pptx' }).then(f => console.log('saved', f));
