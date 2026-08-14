// HTML mirror of build.js (v3 editorial redesign, English) for QA and PDF.
const fs = require('fs');
const A = 'file://' + __dirname + '/assets/';
const PX = 96, PT = 96 / 72;
const PINK = '#FF2E8D', PINK2 = '#FF6FB0', WHITE = '#fff', TEXT = '#ECECEF', MUTE = '#8C8C95',
  CARD = '#141418', CARD2 = '#1B1B21';
const DISP = "Georgia, 'Times New Roman', serif";  // serif stand-in for Cambria in QA
const SANS = 'Arial, Helvetica, sans-serif';

let slides = [];
function box(o) {
  const st = [`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`, `font-family:${o.ff || SANS}`];
  if (o.h) st.push(`height:${o.h * PX}px`);
  if (o.fs) st.push(`font-size:${o.fs * PT}px`);
  st.push(`color:${o.color || WHITE}`, `font-weight:${o.bold ? 700 : 400}`, `text-align:${o.align || 'left'}`);
  if (o.italic) st.push('font-style:italic');
  if (o.cs) st.push(`letter-spacing:${o.cs}px`);
  if (o.lh) st.push(`line-height:${o.lh}`);
  if (o.valign === 'middle') st.push('display:flex', 'align-items:center', o.align === 'center' ? 'justify-content:center' : 'justify-content:flex-start');
  if (o.valign === 'bottom') st.push('display:flex', 'align-items:flex-end');
  return `<div class="t" style="${st.join(';')}">${o.text.replace(/\n/g, '<br>')}</div>`;
}
function rect(o) {
  const st = [`left:${o.x * PX}px`, `top:${o.y * PX}px`, `width:${o.w * PX}px`, `height:${o.h * PX}px`,
    `border-radius:${(o.r || 0) * PX}px`, `background:${o.fill || 'transparent'}`];
  if (o.border) st.push(`border:${o.border}`);
  return `<div class="s" style="${st.join(';')}"></div>`;
}
const ell = (o) => rect({ ...o, r: o.w / 2 });
const img = (o) => `<img class="im" style="left:${o.x * PX}px;top:${o.y * PX}px;width:${o.w * PX}px;height:${o.h * PX}px;border-radius:${(o.r || 0) * PX}px" src="${A}${o.src}">`;
const panel = (x, y, w, h, fill) => rect({ x, y, w, h, r: 0.12, fill: fill || CARD, border: '1px solid rgba(255,255,255,.12)' });
function kick(text, x, y) {
  return ell({ x, y: y + 0.06, w: 0.11, h: 0.11, fill: PINK })
    + box({ text, x: x + 0.25, y, w: 10, fs: 12, bold: true, color: PINK2, cs: 3 });
}
const title = (text, y, size) => box({ text, x: 0.64, y, w: 11.5, fs: size || 44, bold: true, ff: DISP });
const serifNum = (x, y, n) => box({ text: n, x, y, w: 1.6, fs: 44, bold: true, italic: true, color: PINK2, ff: DISP });
const line = (x, y, w) => rect({ x, y, w, h: 0.02, fill: PINK });
const footer = (n) => ell({ x: 0.7, y: 7.12, w: 0.08, h: 0.08, fill: PINK })
  + box({ text: 'AS TALENT AGENCY', x: 0.9, y: 7.02, w: 5, fs: 9.5, bold: true, color: MUTE, cs: 2 })
  + box({ text: String(n).padStart(2, '0') + '  /  13', x: 10.5, y: 7.02, w: 2.13, fs: 11, bold: true, color: PINK2, align: 'right', ff: DISP });
const slide = (bg, parts) => slides.push(`<div class="slide" style="background-image:url('${A}${bg}')">${parts.join('')}</div>`);

// 1 cover
slide('bg-cover.png', [
  kick('TALENT  ·  SOCIAL MEDIA  ·  ONLYFANS', 0.9, 1.35),
  box({ text: 'AS Talent Agency', x: 0.85, y: 1.85, w: 11.5, fs: 70, bold: true, ff: DISP }),
  box({ text: `<span style="color:${PINK2}">AS Superpowers</span><span style="color:${MUTE}">  —  a premium creator management house</span>`, x: 0.9, y: 3.25, w: 11.5, fs: 20, bold: true }),
  box({ text: 'We manage talent, social media and OnlyFans, around the clock —<br>so creators can focus on what they do best.', x: 0.9, y: 4.15, w: 8.6, fs: 17, color: TEXT, lh: 1.3 }),
  box({ text: 'astalentagency.com', x: 0.9, y: 6.7, w: 5, fs: 14, bold: true }),
  box({ text: 'OnlyFans · Instagram · TikTok · X', x: 7.4, y: 6.7, w: 5.0, fs: 12, bold: true, color: MUTE, align: 'right', cs: 1 }),
]);

// 2 who
const rows = [['Personalized strategy', 'A tailored game plan for every creator — no two are alike.'],
['Full-cycle management', 'Turnkey: content, social, chatting and analytics.'],
['Global roster', 'We work with top models and influencers worldwide.']];
let p2 = [kick('WHO WE ARE', 0.7, 0.55), title('Who we are', 0.9),
box({ text: 'AS Talent is a leading OnlyFans marketing and management agency. For 3+ years we have helped creators unlock their potential and multiply their income. We run the entire business — from strategy and social media to fan communication — while the creator focuses on content.', x: 0.7, y: 2.0, w: 6.4, fs: 15.5, color: TEXT, lh: 1.32 })];
let ry = 3.95;
rows.forEach(([h, d]) => {
  p2.push(ell({ x: 0.72, y: ry + 0.02, w: 0.15, h: 0.15, fill: PINK }));
  p2.push(box({ text: h, x: 1.12, y: ry - 0.17, w: 5.95, fs: 15, bold: true, color: PINK2 }));
  p2.push(box({ text: d, x: 1.12, y: ry + 0.19, w: 5.95, fs: 12.5, color: '#C2C2C8' }));
  ry += 0.98;
});
p2.push(panel(7.7, 2.0, 4.95, 4.55));
p2.push(box({ text: '“No two creators<br>are alike.”', x: 8.05, y: 2.4, w: 4.3, fs: 29, bold: true, ff: DISP, lh: 1.05 }));
p2.push(box({ text: 'We never ship template solutions — the strategy is built around each creator’s brand and goals.', x: 8.05, y: 3.9, w: 4.3, fs: 13.5, color: '#BEBEC4', lh: 1.25 }));
p2.push(line(8.05, 5.06, 4.25));
p2.push(box({ text: '“Within 3 months my subscriber count doubled, and my monthly income tripled.”', x: 8.05, y: 5.25, w: 4.3, fs: 13, italic: true, color: PINK2, lh: 1.2 }));
p2.push(box({ text: '— creator testimonial', x: 8.05, y: 6.15, w: 4.3, fs: 10.5, color: MUTE }));
p2.push(footer(2));
slide('bg-content.png', p2);

// 3 roster
const roster = [
  ['Elizabeth Anokhina', '45M followers', 'p-elizabeth.png'],
  ['Elizabeth Vasilenko', '10.5M followers', 'p-eli.png'],
  ['Little Caprice', '11M followers', 'p-caprice.png'],
  ['Macca', '1.5M followers', 'p-macca.png'],
  ['Kuri Emi', '2.5M followers', 'p-kuri.png'],
  ['Qimmah Russo', '5M followers', 'p-qimmah.png'],
  ['Chloe Amour', '2.4M followers', 'p-chloe.png'],
  ['Zlata Sharvarok', '1M followers', 'p-zlata.png']];
const mgn = 0.55, gap = 0.28, cardW = (13.333 - 2 * mgn - 3 * gap) / 4, rowY = [1.62, 4.58];
let p3 = [kick('OUR TALENT', 0.7, 0.5), title('The Roster', 0.8, 40),
  box({ text: 'FEATURED SELECTION<br>Part of a 150+ creator roster', x: 7.6, y: 0.92, w: 4.8, fs: 11.5, bold: true, color: MUTE, align: 'right', cs: 0.5, lh: 1.2 })];
roster.forEach((t, i) => {
  const col = i % 4, row = Math.floor(i / 4), x = mgn + col * (cardW + gap), y = rowY[row];
  p3.push(img({ src: t[2], x, y, w: cardW, h: cardW, r: 0.16 }));
  p3.push(rect({ x, y, w: cardW, h: cardW, r: 0.16, border: '1px solid rgba(255,46,141,.55)' }));
  p3.push(box({ text: t[0], x: x + 0.16, y: y + cardW - 0.68, w: cardW - 0.32, h: 0.36, fs: 15, bold: true, ff: DISP, valign: 'bottom' }));
  p3.push(box({ text: t[1].toUpperCase(), x: x + 0.16, y: y + cardW - 0.3, w: cardW - 0.32, fs: 9.5, bold: true, color: PINK2, cs: 1 }));
});
slide('bg-content.png', p3);

// 4 services
const services = [['24/7 OnlyFans Coverage', 'Round-the-clock OnlyFans operations: chatting, sales, retention and upsells. A dedicated manager for every creator.'],
['Social Media Management', 'Growing and optimizing Instagram, TikTok and X: content plan, traffic and audience growth.'],
['Content Houses', 'Shoots and production in our content houses: ideas, quality control and a steady content flow.']];
const cW = 3.85, cH = 3.15, cGap = 0.35, sX = (13.333 - (3 * cW + 2 * cGap)) / 2;
let p4 = [kick('WHAT WE DO', 0.7, 0.55), title('What we do', 0.9)];
services.forEach(([h, d], i) => {
  const x = sX + i * (cW + cGap), y = 2.05;
  p4.push(panel(x, y, cW, cH));
  p4.push(serifNum(x + 0.33, y + 0.28, '0' + (i + 1)));
  p4.push(line(x + 0.35, y + 1.28, 0.6));
  p4.push(box({ text: h, x: x + 0.35, y: y + 1.42, w: cW - 0.7, fs: 19, bold: true, ff: DISP }));
  p4.push(box({ text: d, x: x + 0.35, y: y + 2.2, w: cW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.22 }));
});
const sub = ['Chatting & Sales', 'Content Planning', 'Analytics & Growth'];
sub.forEach((t, i) => {
  const x = sX + i * (cW + cGap), y = 5.55;
  p4.push(panel(x, y, cW, 0.72, CARD2));
  p4.push(ell({ x: x + 0.3, y: y + 0.24, w: 0.22, h: 0.22, fill: PINK }));
  p4.push(box({ text: t, x: x + 0.7, y, w: cW - 0.9, h: 0.72, fs: 13, bold: true, color: '#E4E4E8', valign: 'middle' }));
});
p4.push(footer(4));
slide('bg-content.png', p4);

// PLATFORMS
const platforms = [['OnlyFans', 'Core monetization: subscriptions, PPV and tips.'],
['Instagram', 'Brand funnel: Reels, stories and audience growth.'],
['TikTok', 'Top-of-funnel reach and viral discovery.'],
['X (Twitter)', 'NSFW-friendly promo and warm inbound traffic.'],
['Reddit', 'Targeted community traffic straight to your page.'],
['Fansly & more', 'Secondary platforms and backup accounts.']];
const plW = 3.85, plGx = 0.35, plH = 1.95, plGy = 0.3, plX = (13.333 - (3 * plW + 2 * plGx)) / 2;
let pPl = [kick('PLATFORMS', 0.7, 0.55), title('Where we grow you', 0.9)];
platforms.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3), x = plX + col * (plW + plGx), y = 2.1 + row * (plH + plGy);
  pPl.push(panel(x, y, plW, plH));
  pPl.push(box({ text: h, x: x + 0.35, y: y + 0.3, w: plW - 0.7, fs: 20, bold: true, ff: DISP }));
  pPl.push(line(x + 0.37, y + 0.93, 0.6));
  pPl.push(box({ text: d, x: x + 0.35, y: y + 1.05, w: plW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.25 }));
});
pPl.push(footer(5));
slide('bg-content.png', pPl);

// WHAT'S INCLUDED
const incl = ['Account setup & optimization', 'Content strategy & scheduling', '24/7 chatting & sales',
  'PPV & upsell campaigns', 'Fan retention & win-back', 'Social media growth', 'Paid promo & shoutouts',
  'Analytics & weekly reporting', 'Persona & brand development', 'Compliance & account safety'];
const inColX = [0.9, 6.95], inStartY = 2.15, inStep = 0.86;
let pIn = [kick('FULL SERVICE', 0.7, 0.55), title("What's included", 0.9)];
incl.forEach((t, i) => {
  const col = Math.floor(i / 5), row = i % 5, x = inColX[col], y = inStartY + row * inStep;
  pIn.push(ell({ x, y, w: 0.4, h: 0.4, fill: PINK }));
  pIn.push(box({ text: '✓', x, y, w: 0.4, h: 0.4, fs: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' }));
  pIn.push(box({ text: t, x: x + 0.6, y: y - 0.05, w: 5.0, h: 0.5, fs: 15.5, bold: true, color: TEXT, valign: 'middle' }));
});
pIn.push(footer(6));
slide('bg-content.png', pIn);

// 5 numbers
const stats = [['150+', 'Creators on roster'], ['3+', 'Years of experience'], ['24/7', 'Dedicated support'], ['Global', 'Talent worldwide']];
const nW = 2.86, nGap = 0.3, nX = (13.333 - (4 * nW + 3 * nGap)) / 2;
let p5 = [kick('BY THE NUMBERS', 0.7, 0.55), title('By the numbers', 0.9)];
stats.forEach(([big, en], i) => {
  const x = nX + i * (nW + nGap), y = 2.15;
  p5.push(panel(x, y, nW, 2.3));
  p5.push(box({ text: big, x, y: y + 0.45, w: nW, fs: 50, bold: true, color: PINK2, align: 'center', ff: DISP }));
  p5.push(box({ text: en, x, y: y + 1.6, w: nW, fs: 14, bold: true, align: 'center' }));
});
const fW = 4 * nW + 3 * nGap;
p5.push(panel(nX, 5.05, fW, 1.3));
p5.push(box({ text: '“Within 3 months my subscriber count doubled, and my monthly income tripled.”', x: nX + 0.5, y: 5.2, w: fW - 1.0, fs: 18, bold: true, italic: true, align: 'center', ff: DISP }));
p5.push(box({ text: '— creator testimonial', x: nX + 0.5, y: 5.85, w: fW - 1.0, fs: 12, color: PINK2, align: 'center' }));
p5.push(footer(7));
slide('bg-content.png', p5);

// RESULTS
const res = [['Subscribers', '9,000', 'from 2,000'], ['Monthly revenue', '$18k', 'from $4k'],
['Fan retention', '+60%', 'vs. baseline'], ['Chat response', '<2 min', '24/7 coverage']];
const reW = 2.86, reG = 0.3, reX = (13.333 - (4 * reW + 3 * reG)) / 2;
let pRe = [kick('RESULTS', 0.7, 0.55), title('What growth looks like', 0.9),
  box({ text: 'Representative first-quarter trajectory', x: 0.72, y: 1.75, w: 8, fs: 13, italic: true, color: MUTE })];
res.forEach(([lab, big, sub], i) => {
  const x = reX + i * (reW + reG), y = 2.35;
  pRe.push(panel(x, y, reW, 2.45));
  pRe.push(box({ text: lab.toUpperCase(), x, y: y + 0.35, w: reW, fs: 11, bold: true, color: MUTE, align: 'center', cs: 1 }));
  pRe.push(box({ text: big, x, y: y + 0.78, w: reW, fs: 44, bold: true, color: PINK2, align: 'center', ff: DISP }));
  pRe.push(box({ text: sub, x, y: y + 1.82, w: reW, fs: 12, color: '#C2C2C8', align: 'center' }));
});
pRe.push(box({ text: 'Representative example based on typical outcomes — actual results vary by creator and niche.', x: reX, y: 5.1, w: 4 * reW + 3 * reG, fs: 11.5, italic: true, color: MUTE, align: 'center' }));
pRe.push(footer(8));
slide('bg-content.png', pRe);

// 6 process
const steps = [['Onboarding', 'We learn the creator, brand and goals, and assign a dedicated manager.'],
['Strategy', 'We build a personalized growth and monetization plan.'],
['Content & Social', 'Content plan, shoots, and running Instagram, TikTok and X.'],
['Growth & Retention', 'Chatting, sales, upsells, analytics and scaling.']];
const pW = 2.86, pGap = 0.3, pX = (13.333 - (4 * pW + 3 * pGap)) / 2;
let p6 = [kick('HOW WE WORK', 0.7, 0.55), title('How we work', 0.9)];
steps.forEach(([en, d], i) => {
  const x = pX + i * (pW + pGap), y = 2.2;
  p6.push(panel(x, y, pW, 3.5));
  p6.push(serifNum(x + 0.33, y + 0.3, String(i + 1)));
  p6.push(line(x + 0.35, y + 1.3, 0.6));
  p6.push(box({ text: en, x: x + 0.35, y: y + 1.45, w: pW - 0.7, fs: 18, bold: true, ff: DISP }));
  p6.push(box({ text: d, x: x + 0.35, y: y + 2.05, w: pW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.28 }));
  if (i < 3) p6.push(box({ text: '→', x: x + pW - 0.02, y: y + 1.35, w: pGap + 0.04, fs: 20, bold: true, color: PINK2, align: 'center' }));
});
p6.push(footer(9));
slide('bg-content.png', p6);

// THE TEAM
const team = [['Account Managers', 'Own the strategy and day-to-day for each creator.'],
['OnlyFans Chatters', 'Convert and retain fans with 24/7 sales.'],
['Social Media Managers', 'Grow Instagram, TikTok and X audiences.'],
['Content Producers', 'Plan, shoot and edit premium content.'],
['Marketing & Traffic', 'Paid promo, shoutouts and funnels.'],
['Data Analysts', 'Track performance and optimize revenue.']];
const tmW = 3.85, tmGx = 0.35, tmH = 1.6, tmGy = 0.3, tmX = (13.333 - (3 * tmW + 2 * tmGx)) / 2;
let pTm = [kick('THE TEAM', 0.7, 0.55), title('Behind the scenes', 0.9)];
team.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3), x = tmX + col * (tmW + tmGx), y = 2.15 + row * (tmH + tmGy);
  pTm.push(panel(x, y, tmW, tmH));
  pTm.push(box({ text: h, x: x + 0.32, y: y + 0.26, w: tmW - 0.6, fs: 16, bold: true, ff: DISP }));
  pTm.push(line(x + 0.34, y + 0.78, 0.5));
  pTm.push(box({ text: d, x: x + 0.32, y: y + 0.88, w: tmW - 0.6, fs: 12, color: '#C6C6CC', lh: 1.2 }));
});
pTm.push(footer(10));
slide('bg-content.png', pTm);

// HOW WE PARTNER
const part = [['Performance-based', 'We earn when you earn — our commission is tied directly to your results.'],
['No upfront cost', 'No setup or subscription fees. We invest in your growth from day one.'],
['Flexible & confidential', 'Custom terms, exclusivity options and full discretion, always.']];
const paW = 3.85, paGap = 0.35, paX = (13.333 - (3 * paW + 2 * paGap)) / 2;
let pPa = [kick('PARTNERSHIP', 0.7, 0.55), title('How we partner', 0.9)];
part.forEach(([h, d], i) => {
  const x = paX + i * (paW + paGap), y = 2.15;
  pPa.push(panel(x, y, paW, 3.05));
  pPa.push(serifNum(x + 0.33, y + 0.28, '0' + (i + 1)));
  pPa.push(line(x + 0.35, y + 1.28, 0.6));
  pPa.push(box({ text: h, x: x + 0.35, y: y + 1.42, w: paW - 0.7, fs: 19, bold: true, ff: DISP }));
  pPa.push(box({ text: d, x: x + 0.35, y: y + 2.08, w: paW - 0.7, fs: 12.5, color: '#C2C2C8', lh: 1.22 }));
});
pPa.push(box({ text: 'Commission is tailored to your tier and platform mix. Ask us for a custom proposal.', x: paX, y: 5.5, w: 3 * paW + 2 * paGap, fs: 12.5, italic: true, color: MUTE, align: 'center' }));
pPa.push(footer(11));
slide('bg-content.png', pPa);

// 7 why
const why = [['Dedicated manager', 'A personal manager and onboarding for every client.'],
['24/7 support', 'A support team available around the clock.'],
['Data-driven', 'Decisions based on analytics and performance metrics.'],
['Creative freedom', 'You create the content — we run the business.'],
['All levels welcome', 'We work with creators at any level, from start to top.'],
['Global reach', 'Models and influencers worldwide, men and women.']];
const wW = 3.85, wGx = 0.35, wH = 1.5, wGy = 0.3, wX = (13.333 - (3 * wW + 2 * wGx)) / 2;
let p7 = [kick('WHY AS TALENT', 0.7, 0.55), title('Why AS Talent', 0.9)];
why.forEach(([h, d], i) => {
  const col = i % 3, row = Math.floor(i / 3), x = wX + col * (wW + wGx), y = 2.15 + row * (wH + wGy);
  p7.push(panel(x, y, wW, wH));
  p7.push(ell({ x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fill: PINK }));
  p7.push(box({ text: '✓', x: x + 0.3, y: y + 0.32, w: 0.4, h: 0.4, fs: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' }));
  p7.push(box({ text: h, x: x + 0.9, y: y + 0.26, w: wW - 1.15, fs: 16, bold: true, ff: DISP }));
  p7.push(box({ text: d, x: x + 0.9, y: y + 0.66, w: wW - 1.15, fs: 12, color: '#C6C6CC', lh: 1.2 }));
});
p7.push(footer(12));
slide('bg-content.png', p7);

// 8 contact
slide('bg-contact.png', [
  kick("LET'S TALK", 0.9, 1.9),
  box({ text: 'Unlock your true<br>potential.', x: 0.85, y: 2.3, w: 9, fs: 56, bold: true, ff: DISP, lh: 1.0 }),
  box({ text: 'Join AS Talent Agency and unlock your true potential with us.', x: 0.9, y: 4.35, w: 8.4, fs: 17, color: TEXT }),
  panel(0.9, 5.25, 3.9, 0.9),
  box({ text: 'astalentagency.com', x: 0.9, y: 5.25, w: 3.9, h: 0.9, fs: 15, bold: true, align: 'center', valign: 'middle' }),
]);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#222;font-family:Arial,Helvetica,sans-serif}
.slide{position:relative;width:1280px;height:720px;background-size:cover;overflow:hidden;margin:0 auto 20px}
.t{position:absolute}.s{position:absolute}.im{position:absolute;object-fit:cover}
</style></head><body>${slides.join('')}</body></html>`;
fs.writeFileSync(__dirname + '/preview.html', html);
console.log('preview.html written');
