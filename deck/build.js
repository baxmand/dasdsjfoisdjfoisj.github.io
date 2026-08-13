const pptxgen = require('pptxgenjs');
const A = __dirname + '/assets/';

const p = new pptxgen();
p.defineLayout({ name: 'W', width: 13.333, height: 7.5 });
p.layout = 'W';
p.author = 'AS Talent Agency';
p.title = 'AS Talent Agency';

// palette
const PINK = 'FF149A';
const PINK2 = 'FF3EA5';
const PINK_DEEP = 'C8006A';
const WHITE = 'FFFFFF';
const MUTE = 'A6A6AE';
const PANEL = '111114';
const PANEL2 = '17171B';
const FONT = 'Arial';

const glow = () => ({ type: 'outer', color: 'FF0090', blur: 14, offset: 0, angle: 0, opacity: 0.5 });

function kicker(s, text, x, y) {
  s.addText(text, { x, y, w: 8, h: 0.3, fontFace: FONT, fontSize: 12, bold: true,
    color: PINK2, charSpacing: 4, align: 'left' });
}
function pill(s, x, y, w, h, fill) {
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.12, fill: { color: fill || PANEL },
    line: { color: 'FFFFFF', width: 0.75, transparency: 82 } });
}

// ============================================================ SLIDE 1 — COVER
let s = p.addSlide();
s.background = { path: A + 'bg-cover.png' };
kicker(s, 'TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.35);
s.addText('AS Talent Agency', { x: 0.85, y: 1.75, w: 9.5, h: 1.4, fontFace: FONT,
  fontSize: 66, bold: true, color: WHITE, align: 'left' });
s.addText('AS Superpowers', { x: 0.9, y: 3.15, w: 8, h: 0.7, fontFace: FONT,
  fontSize: 30, bold: true, color: PINK2, align: 'left', glow: glow() });
s.addText('Управление талантами, соцсетями и OnlyFans — 24/7.\nHelping creators unlock their true potential.',
  { x: 0.9, y: 4.0, w: 8.4, h: 1.0, fontFace: FONT, fontSize: 17, color: 'D8D8DC',
    align: 'left', lineSpacingMultiple: 1.25 });
s.addText('astalentagency.com', { x: 0.9, y: 6.7, w: 6, h: 0.4, fontFace: FONT,
  fontSize: 14, bold: true, color: WHITE, align: 'left' });
s.addNotes('Обложка. AS Talent Agency — агентство полного цикла: таланты, соцсети, OnlyFans, поддержка 24/7.');

// ============================================================ SLIDE 2 — WHO WE ARE
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHO WE ARE', 0.7, 0.55);
s.addText('Кто мы', { x: 0.68, y: 0.85, w: 8, h: 0.8, fontFace: FONT, fontSize: 40,
  bold: true, color: WHITE });

s.addText(
  'AS Talent — ведущее агентство по маркетингу и менеджменту OnlyFans. Более 3 лет мы ' +
  'помогаем авторам раскрыть потенциал и кратно увеличить доход. Мы берём на себя весь бизнес — ' +
  'от стратегии и соцсетей до общения с фанатами — а автор фокусируется на контенте.',
  { x: 0.7, y: 1.95, w: 6.4, h: 1.7, fontFace: FONT, fontSize: 15.5, color: 'D2D2D6',
    align: 'left', lineSpacingMultiple: 1.3, valign: 'top' });

const rows = [
  ['Personalized strategy', 'Индивидуальная стратегия под каждого автора — «no two creators are alike».'],
  ['Full-cycle management', 'Управление под ключ: контент, соцсети, чаттинг, аналитика.'],
  ['Global roster', 'Работаем с топ-моделями и блогерами по всему миру.'],
];
let ry = 3.85;
rows.forEach(([h, d]) => {
  s.addShape('ellipse', { x: 0.7, y: ry + 0.02, w: 0.34, h: 0.34,
    fill: { color: PINK }, line: { color: PINK2, width: 1 }, shadow: glow() });
  s.addText(h, { x: 1.2, y: ry - 0.14, w: 5.9, h: 0.34, fontFace: FONT, fontSize: 15,
    bold: true, color: PINK2 });
  s.addText(d, { x: 1.2, y: ry + 0.2, w: 5.9, h: 0.5, fontFace: FONT, fontSize: 12.5,
    color: 'C2C2C8' });
  ry += 1.0;
});

// right panel — tagline + testimonial
pill(s, 7.7, 1.95, 4.95, 4.6, PANEL);
s.addText('“No two creators\nare alike.”', { x: 8.05, y: 2.35, w: 4.3, h: 1.3, fontFace: FONT,
  fontSize: 27, bold: true, color: WHITE, align: 'left', lineSpacingMultiple: 1.05 });
s.addText('Мы не используем шаблонные решения — стратегия строится под бренд и цели каждого автора.',
  { x: 8.05, y: 3.75, w: 4.3, h: 1.0, fontFace: FONT, fontSize: 13.5, color: 'BEBEC4',
    lineSpacingMultiple: 1.25 });
s.addShape('line', { x: 8.05, y: 4.95, w: 4.25, h: 0, line: { color: 'FFFFFF', width: 0.75, transparency: 80 } });
s.addText('«За 3 месяца количество подписчиков удвоилось, а доход вырос втрое.»',
  { x: 8.05, y: 5.15, w: 4.3, h: 0.9, fontFace: FONT, fontSize: 13, italic: true, color: PINK2,
    lineSpacingMultiple: 1.2 });
s.addText('— отзыв автора / creator testimonial', { x: 8.05, y: 6.05, w: 4.3, h: 0.3,
  fontFace: FONT, fontSize: 10.5, color: MUTE });
s.addNotes('Кто мы: агентство полного цикла, 3+ года, индивидуальный подход, таланты по всему миру.');

// ============================================================ SLIDE 3 — OUR TALENT (roster)
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'OUR TALENT  /  НАШИ ТАЛАНТЫ', 0.7, 0.45);
s.addText('AS Superpowers', { x: 0.68, y: 0.75, w: 10, h: 0.8, fontFace: FONT,
  fontSize: 38, bold: true, color: WHITE, glow: glow() });

const roster = [
  { name: 'Eli Vasilenko', foll: '10.5M', img: 'av-eli.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Little Caprice', foll: '11M', img: 'av-caprice.png', soc: ['tiktok', 'instagram'] },
  { name: 'Macca', foll: '1.5M', img: 'av-macca.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Kuri Emi', foll: '2.5M', img: 'av-kuri.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Qimmah Russo', foll: '5M', img: 'av-qimmah.png', soc: ['x', 'tiktok', 'instagram'] },
  { name: 'Chloe Amour', foll: '2.4M', img: 'av-chloe.png', soc: ['x', 'tiktok', 'instagram'] },
];
const icMap = { x: 'ic-x.png', tiktok: 'ic-tiktok.png', instagram: 'ic-instagram.png' };
const cols = [2.89, 6.667, 10.44];
const rowTop = [1.65, 4.5];
const AV = 1.35, DIA = 0.34, GAP = 0.16, ICON = 0.19;

roster.forEach((t, i) => {
  const cx = cols[i % 3];
  const top = rowTop[Math.floor(i / 3)];
  s.addImage({ path: A + t.img, x: cx - AV / 2, y: top, w: AV, h: AV });
  s.addText(t.name.toUpperCase(), { x: cx - 1.85, y: top + AV + 0.08, w: 3.7, h: 0.4,
    fontFace: FONT, fontSize: 15, bold: true, color: PINK2, align: 'center' });
  s.addText(t.foll + ' FOLLOWERS', { x: cx - 1.85, y: top + AV + 0.5, w: 3.7, h: 0.3,
    fontFace: FONT, fontSize: 10.5, color: MUTE, charSpacing: 1, align: 'center' });
  const n = t.soc.length;
  const totalW = n * DIA + (n - 1) * GAP;
  let ix = cx - totalW / 2;
  const iy = top + AV + 0.86;
  t.soc.forEach((sc) => {
    s.addShape('ellipse', { x: ix, y: iy, w: DIA, h: DIA, fill: { color: 'F2F2F2' } });
    s.addImage({ path: A + icMap[sc], x: ix + (DIA - ICON) / 2, y: iy + (DIA - ICON) / 2, w: ICON, h: ICON });
    ix += DIA + GAP;
  });
});
s.addNotes('Наши топ-авторы и их суммарный охват. Присутствие на X, TikTok и Instagram.');

// ============================================================ SLIDE 4 — SERVICES
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHAT WE DO', 0.7, 0.55);
s.addText('Услуги', { x: 0.68, y: 0.85, w: 8, h: 0.8, fontFace: FONT, fontSize: 40,
  bold: true, color: WHITE });

const services = [
  ['24/7 OnlyFans Coverage', 'Круглосуточное ведение OnlyFans: чаттинг, продажи, удержание и апселлы. Персональный менеджер у каждого автора.'],
  ['Social Media Management', 'Ведение и оптимизация Instagram, TikTok и X: контент-план, трафик и рост аудитории.'],
  ['Content Houses', 'Съёмки и продакшн в контент-хаусах: идеи, контроль качества и стабильный поток контента.'],
];
const cardW = 3.85, cardH = 3.1, gap = 0.35;
const startX = (13.333 - (3 * cardW + 2 * gap)) / 2;
services.forEach(([h, d], i) => {
  const x = startX + i * (cardW + gap);
  const y = 2.0;
  s.addShape('roundRect', { x, y, w: cardW, h: cardH, rectRadius: 0.14,
    fill: { color: PANEL }, line: { color: PINK, width: 1, transparency: 55 }, shadow: glow() });
  s.addText(String(i + 1).padStart(2, '0'), { x: x + 0.35, y: y + 0.3, w: 1.5, h: 0.6,
    fontFace: FONT, fontSize: 30, bold: true, color: PINK2 });
  s.addText(h, { x: x + 0.35, y: y + 1.05, w: cardW - 0.7, h: 0.85, fontFace: FONT,
    fontSize: 17, bold: true, color: WHITE, valign: 'top', lineSpacingMultiple: 1.0 });
  s.addText(d, { x: x + 0.35, y: y + 1.9, w: cardW - 0.7, h: 1.0, fontFace: FONT,
    fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.22 });
});

// supporting services strip
const sub = ['Chatting & Sales / Чаттинг и продажи', 'Content Planning / Контент-план', 'Analytics & Growth / Аналитика и рост'];
sub.forEach((t, i) => {
  const x = startX + i * (cardW + gap);
  const y = 5.45;
  pill(s, x, y, cardW, 0.75, PANEL2);
  s.addShape('ellipse', { x: x + 0.28, y: y + 0.24, w: 0.26, h: 0.26, fill: { color: PINK } });
  s.addText(t, { x: x + 0.72, y: y, w: cardW - 0.9, h: 0.75, fontFace: FONT, fontSize: 12,
    bold: true, color: 'E4E4E8', valign: 'middle' });
});
s.addNotes('Три ключевые услуги + поддерживающие: чаттинг, контент-план, аналитика.');

// ============================================================ SLIDE 5 — NUMBERS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'BY THE NUMBERS', 0.7, 0.55);
s.addText('Цифры', { x: 0.68, y: 0.85, w: 8, h: 0.8, fontFace: FONT, fontSize: 40,
  bold: true, color: WHITE });

const stats = [
  ['33M+', 'Combined audience', 'Суммарная аудитория'],
  ['6', 'Top creators featured', 'Топ-авторов в подборке'],
  ['3+', 'Years of experience', 'Года опыта'],
  ['24/7', 'Dedicated support', 'Поддержка без выходных'],
];
const sw = 2.86, sgap = 0.3;
const sx0 = (13.333 - (4 * sw + 3 * sgap)) / 2;
stats.forEach(([big, en, ru], i) => {
  const x = sx0 + i * (sw + sgap);
  const y = 2.1;
  s.addShape('roundRect', { x, y, w: sw, h: 2.35, rectRadius: 0.14, fill: { color: PANEL },
    line: { color: 'FFFFFF', width: 0.75, transparency: 82 } });
  s.addText(big, { x: x, y: y + 0.35, w: sw, h: 1.0, fontFace: FONT, fontSize: 48,
    bold: true, color: PINK2, align: 'center', glow: glow() });
  s.addText(en, { x: x, y: y + 1.45, w: sw, h: 0.35, fontFace: FONT, fontSize: 13.5,
    bold: true, color: WHITE, align: 'center' });
  s.addText(ru, { x: x, y: y + 1.8, w: sw, h: 0.35, fontFace: FONT, fontSize: 11.5,
    color: MUTE, align: 'center' });
});

pill(s, sx0, 5.0, 4 * sw + 3 * sgap, 1.35, PANEL);
s.addText('“Within 3 months my subscriber count doubled, and my monthly income tripled.”',
  { x: sx0 + 0.5, y: 5.2, w: 4 * sw + 3 * sgap - 1.0, h: 0.55, fontFace: FONT, fontSize: 16,
    bold: true, italic: true, color: WHITE, align: 'center' });
s.addText('«За 3 месяца подписчики удвоились, а доход вырос втрое.» — отзыв автора',
  { x: sx0 + 0.5, y: 5.8, w: 4 * sw + 3 * sgap - 1.0, h: 0.4, fontFace: FONT, fontSize: 12.5,
    color: PINK2, align: 'center' });
s.addNotes('Ключевые цифры и социальное доказательство.');

// ============================================================ SLIDE 6 — HOW WE WORK
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'HOW WE WORK', 0.7, 0.55);
s.addText('Как мы работаем', { x: 0.68, y: 0.85, w: 10, h: 0.8, fontFace: FONT,
  fontSize: 40, bold: true, color: WHITE });

const steps = [
  ['Onboarding', 'Знакомство', 'Изучаем автора, бренд и цели. Закрепляем персонального менеджера.'],
  ['Strategy', 'Стратегия', 'Строим индивидуальный план роста и монетизации.'],
  ['Content & Social', 'Контент и соцсети', 'Контент-план, съёмки, ведение Instagram, TikTok и X.'],
  ['Growth & Retention', 'Рост и удержание', 'Чаттинг, продажи, апселлы, аналитика и масштабирование.'],
];
const stw = 2.86, stgap = 0.3;
const stx0 = (13.333 - (4 * stw + 3 * stgap)) / 2;
steps.forEach(([en, ru, d], i) => {
  const x = stx0 + i * (stw + stgap);
  const y = 2.2;
  s.addShape('roundRect', { x, y, w: stw, h: 3.6, rectRadius: 0.14, fill: { color: PANEL },
    line: { color: PINK, width: 1, transparency: 60 } });
  s.addShape('ellipse', { x: x + 0.35, y: y + 0.35, w: 0.9, h: 0.9, fill: { color: PINK_DEEP },
    line: { color: PINK2, width: 1.25 }, shadow: glow() });
  s.addText(String(i + 1), { x: x + 0.35, y: y + 0.42, w: 0.9, h: 0.75, fontFace: FONT,
    fontSize: 30, bold: true, color: WHITE, align: 'center' });
  s.addText(en, { x: x + 0.35, y: y + 1.45, w: stw - 0.7, h: 0.4, fontFace: FONT,
    fontSize: 16, bold: true, color: WHITE });
  s.addText(ru, { x: x + 0.35, y: y + 1.85, w: stw - 0.7, h: 0.35, fontFace: FONT,
    fontSize: 12.5, bold: true, color: PINK2 });
  s.addText(d, { x: x + 0.35, y: y + 2.3, w: stw - 0.7, h: 1.15, fontFace: FONT,
    fontSize: 12, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.25 });
  if (i < 3) s.addText('→', { x: x + stw - 0.02, y: y + 1.35, w: stgap + 0.04, h: 0.5,
    fontFace: FONT, fontSize: 20, bold: true, color: PINK2, align: 'center' });
});
s.addNotes('Процесс из 4 шагов: онбординг, стратегия, контент и соцсети, рост и удержание.');

// ============================================================ SLIDE 7 — WHY AS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHY AS TALENT', 0.7, 0.55);
s.addText('Почему мы', { x: 0.68, y: 0.85, w: 10, h: 0.8, fontFace: FONT,
  fontSize: 40, bold: true, color: WHITE });

const why = [
  ['Dedicated manager', 'Персональный менеджер и обучение для каждого клиента.'],
  ['24/7 support', 'Команда поддержки на связи круглосуточно.'],
  ['Data-driven', 'Решения на основе аналитики и метрик эффективности.'],
  ['Creative freedom', 'Вы создаёте контент — мы берём на себя бизнес.'],
  ['All levels welcome', 'Работаем с авторами любого уровня — от старта до топа.'],
  ['Global reach', 'Модели и блогеры по всему миру, мужчины и женщины.'],
];
const ww = 3.85, wgapx = 0.35, wh = 1.55, wgapy = 0.3;
const wx0 = (13.333 - (3 * ww + 2 * wgapx)) / 2;
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = wx0 + col * (ww + wgapx);
  const y = 2.1 + row * (wh + wgapy);
  s.addShape('roundRect', { x, y, w: ww, h: wh, rectRadius: 0.12, fill: { color: PANEL },
    line: { color: 'FFFFFF', width: 0.75, transparency: 82 } });
  s.addShape('ellipse', { x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: { color: PINK },
    line: { color: PINK2, width: 1 }, shadow: glow() });
  s.addText('✓', { x: x + 0.3, y: y + 0.3, w: 0.4, h: 0.4, fontFace: FONT, fontSize: 14,
    bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addText(h, { x: x + 0.9, y: y + 0.28, w: ww - 1.15, h: 0.4, fontFace: FONT, fontSize: 15,
    bold: true, color: PINK2 });
  s.addText(d, { x: x + 0.9, y: y + 0.7, w: ww - 1.15, h: 0.75, fontFace: FONT, fontSize: 12,
    color: 'C6C6CC', valign: 'top', lineSpacingMultiple: 1.2 });
});
s.addNotes('Преимущества AS Talent: персональный менеджер, 24/7, аналитика, свобода творчества, любой уровень, глобальный охват.');

// ============================================================ SLIDE 8 — CONTACT
s = p.addSlide();
s.background = { path: A + 'bg-contact.png' };
kicker(s, "LET'S TALK  /  ДАВАЙТЕ РАБОТАТЬ", 0.9, 1.9);
s.addText('Unlock your true\npotential.', { x: 0.85, y: 2.3, w: 9, h: 1.9, fontFace: FONT,
  fontSize: 52, bold: true, color: WHITE, lineSpacingMultiple: 1.0 });
s.addText('Присоединяйся к AS Talent Agency — и раскрой свой потенциал вместе с нами.',
  { x: 0.9, y: 4.2, w: 8.4, h: 0.6, fontFace: FONT, fontSize: 17, color: 'D8D8DC' });

pill(s, 0.9, 5.15, 3.4, 0.9, PANEL);
s.addText('astalentagency.com', { x: 0.9, y: 5.15, w: 3.4, h: 0.9, fontFace: FONT,
  fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle' });
pill(s, 4.45, 5.15, 3.4, 0.9, PANEL);
s.addText('@astalentagency', { x: 4.45, y: 5.15, w: 3.4, h: 0.9, fontFace: FONT,
  fontSize: 15, bold: true, color: PINK2, align: 'center', valign: 'middle' });
s.addNotes('Контакты и призыв к действию. Сайт: astalentagency.com');

p.writeFile({ fileName: __dirname + '/AS-Talent-Agency.pptx' }).then(f => console.log('saved', f));
