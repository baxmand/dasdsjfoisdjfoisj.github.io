// Generate all image assets (backgrounds, avatars, social icons) via SVG -> PNG (sharp)
const fs = require('fs');
const sharp = require('sharp');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { FaXTwitter, FaTiktok, FaInstagram } = require('react-icons/fa6');

const W = 2000, H = 1125;
const dir = __dirname + '/assets';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const png = (svg, file, w) =>
  sharp(Buffer.from(svg), w ? { density: 300 } : {}).png().toFile(dir + '/' + file);

// ---------- Backgrounds ----------
const defs = `
  <radialGradient id="topglow" cx="50%" cy="-5%" r="75%">
    <stop offset="0%" stop-color="#ff1e9c" stop-opacity="0.55"/>
    <stop offset="42%" stop-color="#ff1e9c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="cornerglow" cx="100%" cy="0%" r="60%">
    <stop offset="0%" stop-color="#ff1e9c" stop-opacity="0.32"/>
    <stop offset="55%" stop-color="#ff1e9c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="blob" cx="45%" cy="45%" r="55%">
    <stop offset="0%" stop-color="#ffa6dd"/>
    <stop offset="38%" stop-color="#ff149a"/>
    <stop offset="72%" stop-color="#b3005f"/>
    <stop offset="100%" stop-color="#b3005f" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="34"/>
  </filter>`;

const bgCover = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#topglow)"/>
  <g filter="url(#soft)" transform="rotate(-14 1720 1060)">
    <ellipse cx="1760" cy="1070" rx="560" ry="430" fill="url(#blob)"/>
  </g>
  <ellipse cx="1720" cy="1030" rx="230" ry="150" fill="#ffffff" opacity="0.10" filter="url(#soft)"/>
</svg>`;

const bgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#cornerglow)"/>
</svg>`;

const bgContact = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#topglow)"/>
  <g filter="url(#soft)" transform="rotate(18 260 1050)">
    <ellipse cx="230" cy="1070" rx="520" ry="400" fill="url(#blob)"/>
  </g>
</svg>`;

// ---------- Avatars ----------
function avatar(initials, file) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <defs>
      <radialGradient id="ring" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#ff64bb"/>
        <stop offset="55%" stop-color="#ff0e93"/>
        <stop offset="100%" stop-color="#c8006a"/>
      </radialGradient>
      <radialGradient id="inner" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stop-color="#54545c"/>
        <stop offset="58%" stop-color="#2a2a30"/>
        <stop offset="100%" stop-color="#111114"/>
      </radialGradient>
      <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="26"/>
      </filter>
    </defs>
    <circle cx="250" cy="250" r="235" fill="#ff0090" opacity="0.6" filter="url(#g)"/>
    <circle cx="250" cy="250" r="222" fill="url(#ring)"/>
    <circle cx="250" cy="250" r="190" fill="url(#inner)"/>
    <text x="250" y="258" font-family="Arial, sans-serif" font-size="150" font-weight="700"
      fill="#ffffff" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle"
      letter-spacing="4">${initials}</text>
  </svg>`;
  return png(svg, file);
}

// ---------- Social icons (black glyph, transparent bg) ----------
function icon(Comp, file) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: '#0b0b0b', size: 220 }));
  return png(svg, file);
}

const talents = [
  ['Eli Vasilenko', 'av-eli.png', 'EV'],
  ['Little Caprice', 'av-caprice.png', 'LC'],
  ['Macca', 'av-macca.png', 'M'],
  ['Kuri Emi', 'av-kuri.png', 'KE'],
  ['Qimmah Russo', 'av-qimmah.png', 'QR'],
  ['Chloe Amour', 'av-chloe.png', 'CA'],
];

(async () => {
  await png(bgCover, 'bg-cover.png');
  await png(bgContent, 'bg-content.png');
  await png(bgContact, 'bg-contact.png');
  for (const [, file, init] of talents) await avatar(init, file);
  await icon(FaXTwitter, 'ic-x.png');
  await icon(FaTiktok, 'ic-tiktok.png');
  await icon(FaInstagram, 'ic-instagram.png');
  console.log('assets generated');
})();
