const pptxgen = require('pptxgenjs');
const A = __dirname + '/assets/';

const p = new pptxgen();
p.defineLayout({ name: 'W', width: 13.333, height: 7.5 });
p.layout = 'W';
p.author = 'AS Talent Agency';
p.title = 'AS Talent Agency';

// ---- palette ----
const PINK = 'FF2E8D';
const PINK2 = 'FF6FB0';
const WHITE = 'FFFFFF';
const TEXT = 'ECECEF';
const MUTE = '8C8C95';
const CARD = '141418';
const CARD2 = '1B1B21';
const HAIR = 'FFFFFF';
const DISP = 'Cambria';   // serif display
const SANS = 'Arial';     // body / kickers

// ---- helpers ----
function kicker(s, text, x, y) {
  s.addShape('ellipse', { x, y: y + 0.06, w: 0.11, h: 0.11, fill: { color: PINK } });
  s.addText(text, { x: x + 0.25, y, w: 10, h: 0.3, fontFace: SANS, fontSize: 12, bold: true,
    color: PINK2, charSpacing: 4 });
}
function title(s, text, y, size) {
  s.addText(text, { x: 0.64, y, w: 11.5, h: 1.0, fontFace: DISP, fontSize: size || 44, bold: true, color: WHITE });
}
function panel(s, x, y, w, h, fill) {
  s.addShape('roundRect', { x, y, w, h, rectRadius: 0.12, fill: { color: fill || CARD },
    line: { color: HAIR, width: 0.75, transparency: 88 } });
}
function serifNum(s, x, y, n) {
  s.addText(n, { x, y, w: 1.6, h: 0.9, fontFace: DISP, fontSize: 44, bold: true, italic: true, color: PINK2 });
}
function footer(s, n) {
  s.addShape('ellipse', { x: 0.7, y: 7.12, w: 0.08, h: 0.08, fill: { color: PINK } });
  s.addText('AS TALENT AGENCY', { x: 0.9, y: 7.02, w: 5, h: 0.3, fontFace: SANS, fontSize: 9.5, bold: true, color: MUTE, charSpacing: 2 });
  s.addText(String(n).padStart(2, '0') + '  /  13', { x: 10.5, y: 7.02, w: 2.13, h: 0.3, fontFace: DISP, fontSize: 11, bold: true, color: PINK2, align: 'right' });
}

// ==================================================== 1 — COVER
let s = p.addSlide();
s.background = { path: A + 'bg-cover.png' };
kicker(s, 'TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.35);
s.addText('AS Talent Agency', { x: 0.85, y: 1.85, w: 11.5, h: 1.5, fontFace: DISP, fontSize: 70, bold: true, color: WHITE });
s.addText([
  { text: 'AS Superpowers', options: { color: PINK2 } },
  { text: '  —  a premium creator management house', options: { color: MUTE } },
], { x: 0.9, y: 3.25, w: 11.5, h: 0.6, fontFace: SANS, fontSize: 20, bold: true });
s.addText('We manage talent, social media and OnlyFans, around the clock —\nso creators can focus on what they do best.',
  { x: 0.9, y: 4.15, w: 8.6, h: 1.0, fontFace: SANS, fontSize: 17, color: TEXT, lineSpacingMultiple: 1.3 });
s.addText('astalentagency.com', { x: 0.9, y: 6.7, w: 5, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE });
s.addText('OnlyFans · Instagram · TikTok · X', { x: 7.4, y: 6.7, w: 5.0, h: 0.4, fontFace: SANS,
  fontSize: 12, bold: true, color: MUTE, align: 'right', charSpacing: 1 });
s.addNotes('Cover. AS Talent Agency — full-service creator management: talent, social, OnlyFans, 24/7.');

// ==================================================== 2 — WHO WE ARE
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHO WE ARE', 0.7, 0.55);
title(s, 'Who we are', 0.9);
s.addText(
  'AS Talent is a leading OnlyFans marketing and management agency. For 3+ years we have helped ' +
  'creators unlock their potential and multiply their income. We run the entire business — from ' +
  'strategy and social media to fan communication — while the creator focuses on content.',
  { x: 0.7, y: 2.0, w: 6.4, h: 1.7, fontFace: SANS, fontSize: 15.5, color: TEXT, lineSpacingMultiple: 1.32, valign: 'top' });

const rows = [
  ['Personalized strategy', 'A tailored game plan for every creator — no two are alike.'],
  ['Full-cycle management', 'Turnkey: content, social, chatting and analytics.'],
  ['Global roster', 'We work with top models and influencers worldwide.'],
];
let ry = 3.95;
rows.forEach(([h, d]) => {
  s.addShape('ellipse', { x: 0.72, y: ry + 0.02, w: 0.15, h: 0.15, fill: { color: PINK } });
  s.addText(h, { x: 1.12, y: ry - 0.17, w: 5.95, h: 0.34, fontFace: SANS, fontSize: 15, bold: true, color: PINK2 });
  s.addText(d, { x: 1.12, y: ry + 0.19, w: 5.95, h: 0.5, fontFace: SANS, fontSize: 12.5, color: 'C2C2C8' });
  ry += 0.98;
});

panel(s, 7.7, 2.0, 4.95, 4.55, CARD);
s.addText('“No two creators\nare alike.”', { x: 8.05, y: 2.4, w: 4.3, h: 1.3, fontFace: DISP,
  fontSize: 29, bold: true, color: WHITE, lineSpacingMultiple: 1.05 });
s.addText('We never ship template solutions — the strategy is built around each creator’s brand and goals.',
  { x: 8.05, y: 3.9, w: 4.3, h: 1.0, fontFace: SANS, fontSize: 13.5, color: 'BEBEC4', lineSpacingMultiple: 1.25 });
s.addShape('line', { x: 8.05, y: 5.05, w: 4.25, h: 0, line: { color: HAIR, width: 0.75, transparency: 82 } });
s.addText('“Within 3 months my subscriber count doubled, and my monthly income tripled.”',
  { x: 8.05, y: 5.25, w: 4.3, h: 0.9, fontFace: SANS, fontSize: 13, italic: true, color: PINK2, lineSpacingMultiple: 1.2 });
s.addText('— creator testimonial', { x: 8.05, y: 6.15, w: 4.3, h: 0.3, fontFace: SANS, fontSize: 10.5, color: MUTE });
footer(s, 2);
s.addNotes('Who we are: full-cycle agency, 3+ years, personalized approach, global roster.');

// ==================================================== 3 — ROSTER (editorial portrait cards)
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'OUR TALENT', 0.7, 0.5);
title(s, 'The Roster', 0.8, 40);
s.addText('FEATURED SELECTION\nPart of a 150+ creator roster', { x: 7.6, y: 0.92, w: 4.8, h: 0.7,
  fontFace: SANS, fontSize: 11.5, bold: true, color: MUTE, align: 'right', charSpacing: 0.5, lineSpacingMultiple: 1.2 });

const roster = [
  ['Elizabeth Anokhina', '45M followers', 'p-elizabeth.png'],
  ['Elizabeth Vasilenko', '10.5M followers', 'p-eli.png'],
  ['Little Caprice', '11M followers', 'p-caprice.png'],
  ['Macca', '1.5M followers', 'p-macca.png'],
  ['Kuri Emi', '2.5M followers', 'p-kuri.png'],
  ['Qimmah Russo', '5M followers', 'p-qimmah.png'],
  ['Chloe Amour', '2.4M followers', 'p-chloe.png'],
  ['Zlata Sharvarok', '1M followers', 'p-zlata.png'],
];
const mgn = 0.55, gap = 0.28;
const cardW = (13.333 - 2 * mgn - 3 * gap) / 4;   // ~2.848
const rowY = [1.62, 4.58];
roster.forEach((t, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = mgn + col * (cardW + gap), y = rowY[row];
  s.addImage({ path: A + t[2], x, y, w: cardW, h: cardW });
  s.addShape('roundRect', { x, y, w: cardW, h: cardW, rectRadius: 0.16, fill: { color: 'FFFFFF', transparency: 100 },
    line: { color: PINK, width: 1, transparency: 45 } });
  s.addText(t[0], { x: x + 0.16, y: y + cardW - 0.68, w: cardW - 0.32, h: 0.36, fontFace: DISP,
    fontSize: 15, bold: true, color: WHITE, valign: 'bottom' });
  s.addText(t[1].toUpperCase(), { x: x + 0.16, y: y + cardW - 0.3, w: cardW - 0.32, h: 0.24,
    fontFace: SANS, fontSize: 9.5, bold: true, color: PINK2, charSpacing: 1 });
});
s.addNotes('Featured selection from a 150+ creator roster. All active on OnlyFans, Instagram, TikTok and X.');

// ==================================================== 4 — SERVICES
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHAT WE DO', 0.7, 0.55);
title(s, 'What we do', 0.9);

const services = [
  ['24/7 OnlyFans Coverage', 'Round-the-clock OnlyFans operations: chatting, sales, retention and upsells. A dedicated manager for every creator.'],
  ['Social Media Management', 'Growing and optimizing Instagram, TikTok and X: content plan, traffic and audience growth.'],
  ['Content Houses', 'Shoots and production in our content houses: ideas, quality control and a steady content flow.'],
];
const cW = 3.85, cH = 3.15, cGap = 0.35;
const sX = (13.333 - (3 * cW + 2 * cGap)) / 2;
services.forEach(([h, d], i) => {
  const x = sX + i * (cW + cGap), y = 2.05;
  panel(s, x, y, cW, cH, CARD);
  serifNum(s, x + 0.33, y + 0.28, '0' + (i + 1));
  s.addShape('line', { x: x + 0.35, y: y + 1.28, w: 0.6, h: 0, line: { color: PINK, width: 1.5 } });
  s.addText(h, { x: x + 0.35, y: y + 1.42, w: cW - 0.7, h: 0.8, fontFace: DISP, fontSize: 19, bold: true, color: WHITE, valign: 'top', lineSpacingMultiple: 1.0 });
  s.addText(d, { x: x + 0.35, y: y + 2.2, w: cW - 0.7, h: 0.9, fontFace: SANS, fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.22 });
});
const sub = ['Chatting & Sales', 'Content Planning', 'Analytics & Growth'];
sub.forEach((t, i) => {
  const x = sX + i * (cW + cGap), y = 5.55;
  panel(s, x, y, cW, 0.72, CARD2);
  s.addShape('ellipse', { x: x + 0.3, y: y + 0.24, w: 0.22, h: 0.22, fill: { color: PINK } });
  s.addText(t, { x: x + 0.7, y, w: cW - 0.9, h: 0.72, fontFace: SANS, fontSize: 13, bold: true, color: 'E4E4E8', valign: 'middle' });
});
footer(s, 4);
s.addNotes('Three core services plus supporting capabilities.');

// ==================================================== PLATFORMS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'PLATFORMS', 0.7, 0.55);
title(s, 'Where we grow you', 0.9);
const platforms = [
  ['OnlyFans', 'Core monetization: subscriptions, PPV and tips.'],
  ['Instagram', 'Brand funnel: Reels, stories and audience growth.'],
  ['TikTok', 'Top-of-funnel reach and viral discovery.'],
  ['X (Twitter)', 'NSFW-friendly promo and warm inbound traffic.'],
  ['Reddit', 'Targeted community traffic straight to your page.'],
  ['Fansly & more', 'Secondary platforms and backup accounts.'],
];
const plW = 3.85, plGx = 0.35, plH = 1.95, plGy = 0.3;
const plX = (13.333 - (3 * plW + 2 * plGx)) / 2;
platforms.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = plX + col * (plW + plGx), y = 2.1 + row * (plH + plGy);
  panel(s, x, y, plW, plH, CARD);
  s.addText(h, { x: x + 0.35, y: y + 0.3, w: plW - 0.7, h: 0.5, fontFace: DISP, fontSize: 20, bold: true, color: WHITE });
  s.addShape('line', { x: x + 0.37, y: y + 0.92, w: 0.6, h: 0, line: { color: PINK, width: 1.5 } });
  s.addText(d, { x: x + 0.35, y: y + 1.05, w: plW - 0.7, h: 0.8, fontFace: SANS, fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.25 });
});
footer(s, 5);
s.addNotes('Platforms we manage and the role each plays in the funnel.');

// ==================================================== WHAT'S INCLUDED
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'FULL SERVICE', 0.7, 0.55);
title(s, "What's included", 0.9);
const incl = [
  'Account setup & optimization',
  'Content strategy & scheduling',
  '24/7 chatting & sales',
  'PPV & upsell campaigns',
  'Fan retention & win-back',
  'Social media growth',
  'Paid promo & shoutouts',
  'Analytics & weekly reporting',
  'Persona & brand development',
  'Compliance & account safety',
];
const inColX = [0.9, 6.95], inStartY = 2.15, inStep = 0.86;
incl.forEach((t, i) => {
  const col = Math.floor(i / 5), row = i % 5;
  const x = inColX[col], y = inStartY + row * inStep;
  s.addShape('ellipse', { x, y, w: 0.4, h: 0.4, fill: { color: PINK } });
  s.addText('✓', { x, y, w: 0.4, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addText(t, { x: x + 0.6, y: y - 0.05, w: 5.0, h: 0.5, fontFace: SANS, fontSize: 15.5, bold: true, color: TEXT, valign: 'middle' });
});
footer(s, 6);
s.addNotes('Everything included in full-service management.');

// ==================================================== 5 — NUMBERS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'BY THE NUMBERS', 0.7, 0.55);
title(s, 'By the numbers', 0.9);

const stats = [
  ['150+', 'Creators on roster'],
  ['3+', 'Years of experience'],
  ['24/7', 'Dedicated support'],
  ['Global', 'Talent worldwide'],
];
const nW = 2.86, nGap = 0.3;
const nX = (13.333 - (4 * nW + 3 * nGap)) / 2;
stats.forEach(([big, en], i) => {
  const x = nX + i * (nW + nGap), y = 2.15;
  panel(s, x, y, nW, 2.3, CARD);
  s.addText(big, { x, y: y + 0.45, w: nW, h: 1.05, fontFace: DISP, fontSize: 50, bold: true, color: PINK2, align: 'center' });
  s.addText(en, { x, y: y + 1.6, w: nW, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, align: 'center' });
});
const fW = 4 * nW + 3 * nGap;
panel(s, nX, 5.05, fW, 1.3, CARD);
s.addText('“Within 3 months my subscriber count doubled, and my monthly income tripled.”',
  { x: nX + 0.5, y: 5.2, w: fW - 1.0, h: 0.6, fontFace: DISP, fontSize: 18, bold: true, italic: true, color: WHITE, align: 'center' });
s.addText('— creator testimonial', { x: nX + 0.5, y: 5.85, w: fW - 1.0, h: 0.35, fontFace: SANS, fontSize: 12, color: PINK2, align: 'center' });
footer(s, 7);
s.addNotes('Key numbers and social proof.');

// ==================================================== RESULTS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'RESULTS', 0.7, 0.55);
title(s, 'What growth looks like', 0.9);
s.addText('Representative first-quarter trajectory', { x: 0.72, y: 1.75, w: 8, h: 0.35, fontFace: SANS, fontSize: 13, italic: true, color: MUTE });
const res = [
  ['Active paying fans', '1,200', 'from 350'],
  ['Monthly revenue', '$18k', 'from $4k'],
  ['Avg revenue / fan', '$15', 'subs + PPV + tips'],
  ['Chat response', '<2 min', '24/7 coverage'],
];
const reW = 2.86, reG = 0.3;
const reX = (13.333 - (4 * reW + 3 * reG)) / 2;
res.forEach(([lab, big, sub], i) => {
  const x = reX + i * (reW + reG), y = 2.35;
  panel(s, x, y, reW, 2.45, CARD);
  s.addText(lab.toUpperCase(), { x, y: y + 0.35, w: reW, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, color: MUTE, align: 'center', charSpacing: 1 });
  s.addText(big, { x, y: y + 0.78, w: reW, h: 0.9, fontFace: DISP, fontSize: 44, bold: true, color: PINK2, align: 'center' });
  s.addText(sub, { x, y: y + 1.82, w: reW, h: 0.35, fontFace: SANS, fontSize: 12, color: 'C2C2C8', align: 'center' });
});
s.addText('Representative example based on typical outcomes — actual results vary by creator and niche.',
  { x: reX, y: 5.1, w: 4 * reW + 3 * reG, h: 0.4, fontFace: SANS, fontSize: 11.5, italic: true, color: MUTE, align: 'center' });
footer(s, 8);
s.addNotes('Representative growth example. Replace with real client numbers where available.');

// ==================================================== 6 — HOW WE WORK
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'HOW WE WORK', 0.7, 0.55);
title(s, 'How we work', 0.9);

const steps = [
  ['Onboarding', 'We learn the creator, brand and goals, and assign a dedicated manager.'],
  ['Strategy', 'We build a personalized growth and monetization plan.'],
  ['Content & Social', 'Content plan, shoots, and running Instagram, TikTok and X.'],
  ['Growth & Retention', 'Chatting, sales, upsells, analytics and scaling.'],
];
const pW = 2.86, pGap = 0.3;
const pX = (13.333 - (4 * pW + 3 * pGap)) / 2;
steps.forEach(([en, d], i) => {
  const x = pX + i * (pW + pGap), y = 2.2;
  panel(s, x, y, pW, 3.5, CARD);
  serifNum(s, x + 0.33, y + 0.3, String(i + 1));
  s.addShape('line', { x: x + 0.35, y: y + 1.3, w: 0.6, h: 0, line: { color: PINK, width: 1.5 } });
  s.addText(en, { x: x + 0.35, y: y + 1.45, w: pW - 0.7, h: 0.5, fontFace: DISP, fontSize: 18, bold: true, color: WHITE });
  s.addText(d, { x: x + 0.35, y: y + 2.05, w: pW - 0.7, h: 1.2, fontFace: SANS, fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.28 });
  if (i < 3) s.addText('→', { x: x + pW - 0.02, y: y + 1.35, w: pGap + 0.04, h: 0.5, fontFace: SANS, fontSize: 20, bold: true, color: PINK2, align: 'center' });
});
footer(s, 9);
s.addNotes('Four-step process: onboarding, strategy, content & social, growth & retention.');

// ==================================================== THE TEAM
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'THE TEAM', 0.7, 0.55);
title(s, 'Behind the scenes', 0.9);
const team = [
  ['Account Managers', 'Own the strategy and day-to-day for each creator.'],
  ['OnlyFans Chatters', 'Convert and retain fans with 24/7 sales.'],
  ['Social Media Managers', 'Grow Instagram, TikTok and X audiences.'],
  ['Content Producers', 'Plan, shoot and edit premium content.'],
  ['Marketing & Traffic', 'Paid promo, shoutouts and funnels.'],
  ['Data Analysts', 'Track performance and optimize revenue.'],
];
const tmW = 3.85, tmGx = 0.35, tmH = 1.6, tmGy = 0.3;
const tmX = (13.333 - (3 * tmW + 2 * tmGx)) / 2;
team.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = tmX + col * (tmW + tmGx), y = 2.15 + row * (tmH + tmGy);
  panel(s, x, y, tmW, tmH, CARD);
  s.addText(h, { x: x + 0.32, y: y + 0.26, w: tmW - 0.6, h: 0.4, fontFace: DISP, fontSize: 16, bold: true, color: WHITE });
  s.addShape('line', { x: x + 0.34, y: y + 0.76, w: 0.5, h: 0, line: { color: PINK, width: 1.5 } });
  s.addText(d, { x: x + 0.32, y: y + 0.88, w: tmW - 0.6, h: 0.6, fontFace: SANS, fontSize: 12, color: 'C6C6CC', valign: 'top', lineSpacingMultiple: 1.2 });
});
footer(s, 10);
s.addNotes('Roles that make full-service management work.');

// ==================================================== HOW WE PARTNER
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'PARTNERSHIP', 0.7, 0.55);
title(s, 'How we partner', 0.9);
const part = [
  ['Performance-based', 'We earn when you earn — our commission is tied directly to your results.'],
  ['No upfront cost', 'No setup or subscription fees. We invest in your growth from day one.'],
  ['Flexible & confidential', 'Custom terms, exclusivity options and full discretion, always.'],
];
const paW = 3.85, paGap = 0.35;
const paX = (13.333 - (3 * paW + 2 * paGap)) / 2;
part.forEach(([h, d], i) => {
  const x = paX + i * (paW + paGap), y = 2.15;
  panel(s, x, y, paW, 3.05, CARD);
  serifNum(s, x + 0.33, y + 0.28, '0' + (i + 1));
  s.addShape('line', { x: x + 0.35, y: y + 1.28, w: 0.6, h: 0, line: { color: PINK, width: 1.5 } });
  s.addText(h, { x: x + 0.35, y: y + 1.42, w: paW - 0.7, h: 0.6, fontFace: DISP, fontSize: 19, bold: true, color: WHITE });
  s.addText(d, { x: x + 0.35, y: y + 2.08, w: paW - 0.7, h: 0.9, fontFace: SANS, fontSize: 12.5, color: 'C2C2C8', valign: 'top', lineSpacingMultiple: 1.22 });
});
s.addText('Commission is tailored to your tier and platform mix. Ask us for a custom proposal.',
  { x: paX, y: 5.5, w: 3 * paW + 2 * paGap, h: 0.4, fontFace: SANS, fontSize: 12.5, italic: true, color: MUTE, align: 'center' });
footer(s, 11);
s.addNotes('Partnership model: performance-based, no upfront, flexible and confidential.');

// ==================================================== 7 — WHY AS
s = p.addSlide();
s.background = { path: A + 'bg-content.png' };
kicker(s, 'WHY AS TALENT', 0.7, 0.55);
title(s, 'Why AS Talent', 0.9);

const why = [
  ['Dedicated manager', 'A personal manager and onboarding for every client.'],
  ['24/7 support', 'A support team available around the clock.'],
  ['Data-driven', 'Decisions based on analytics and performance metrics.'],
  ['Creative freedom', 'You create the content — we run the business.'],
  ['All levels welcome', 'We work with creators at any level, from start to top.'],
  ['Global reach', 'Models and influencers worldwide, men and women.'],
];
const wW = 3.85, wGx = 0.35, wH = 1.5, wGy = 0.3;
const wX = (13.333 - (3 * wW + 2 * wGx)) / 2;
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = wX + col * (wW + wGx), y = 2.15 + row * (wH + wGy);
  panel(s, x, y, wW, wH, CARD);
  s.addShape('ellipse', { x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: { color: PINK } });
  s.addText('✓', { x: x + 0.3, y: y + 0.3, w: 0.4, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' });
  s.addText(h, { x: x + 0.9, y: y + 0.26, w: wW - 1.15, h: 0.4, fontFace: DISP, fontSize: 16, bold: true, color: WHITE });
  s.addText(d, { x: x + 0.9, y: y + 0.66, w: wW - 1.15, h: 0.72, fontFace: SANS, fontSize: 12, color: 'C6C6CC', valign: 'top', lineSpacingMultiple: 1.2 });
});
footer(s, 12);
s.addNotes('Why AS Talent — key advantages.');

// ==================================================== 8 — CONTACT
s = p.addSlide();
s.background = { path: A + 'bg-contact.png' };
kicker(s, "LET'S TALK", 0.9, 1.9);
s.addText('Unlock your true\npotential.', { x: 0.85, y: 2.3, w: 9, h: 1.9, fontFace: DISP, fontSize: 56, bold: true, color: WHITE, lineSpacingMultiple: 1.0 });
s.addText('Join AS Talent Agency and unlock your true potential with us.',
  { x: 0.9, y: 4.35, w: 8.4, h: 0.6, fontFace: SANS, fontSize: 17, color: TEXT });
panel(s, 0.9, 5.25, 3.9, 0.9, CARD);
s.addText('astalentagency.com', { x: 0.9, y: 5.25, w: 3.9, h: 0.9, fontFace: SANS, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle' });
s.addNotes('Contact and call to action. astalentagency.com');

p.writeFile({ fileName: __dirname + '/AS-Talent-Agency.pptx' }).then(f => console.log('saved', f));
