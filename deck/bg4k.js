// Regenerate ONLY the backgrounds at 4K (3840x2160). Does not touch avatars/icons.
const sharp = require('sharp');
const dir = __dirname + '/assets';
const W = 3840, H = 2160;
const png = (svg, f) => sharp(Buffer.from(svg)).png().toFile(dir + '/' + f);

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
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="65"/></filter>`;

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#topglow)"/>
  <g filter="url(#soft)" transform="rotate(-14 3380 2035)"><ellipse cx="3380" cy="2055" rx="1075" ry="825" fill="url(#blob)"/></g>
  <ellipse cx="3300" cy="1980" rx="440" ry="290" fill="#ffffff" opacity="0.10" filter="url(#soft)"/></svg>`;

const content = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#cornerglow)"/></svg>`;

const contact = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs>
  <rect width="${W}" height="${H}" fill="#060608"/>
  <rect width="${W}" height="${H}" fill="url(#topglow)"/>
  <g filter="url(#soft)" transform="rotate(18 440 2015)"><ellipse cx="440" cy="2055" rx="1000" ry="770" fill="url(#blob)"/></g></svg>`;

(async () => {
  await png(cover, 'bg-cover.png');
  await png(content, 'bg-content.png');
  await png(contact, 'bg-contact.png');
  console.log('4K backgrounds regenerated');
})();
