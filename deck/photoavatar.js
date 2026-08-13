// Turn a real photo into a circular neon-framed avatar matching the deck style.
// usage: node photoavatar.js <srcPhoto> <outName> [focusY 0..1, default 0.4]
const sharp = require('sharp');
const path = require('path');
const dir = __dirname + '/assets';

const SIZE = 500;      // canvas
const RING = 222;      // pink ring outer radius
const INNER = 190;     // photo circle radius
const PHOTO = INNER * 2; // 380

async function make(src, outName, focusX = 0.5, focusY = 0.4, zoom = 1) {
  // ring + glow base (no dark inner, no initials)
  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
    <defs>
      <radialGradient id="ring" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="#ff64bb"/>
        <stop offset="55%" stop-color="#ff0e93"/>
        <stop offset="100%" stop-color="#c8006a"/>
      </radialGradient>
      <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="26"/>
      </filter>
    </defs>
    <circle cx="250" cy="250" r="235" fill="#ff0090" opacity="0.6" filter="url(#g)"/>
    <circle cx="250" cy="250" r="${RING}" fill="url(#ring)"/>
    <circle cx="250" cy="250" r="${INNER + 4}" fill="#0c0c0e"/>
  </svg>`;
  const baseBuf = await sharp(Buffer.from(base)).png().toBuffer();

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO}" height="${PHOTO}">
       <circle cx="${INNER}" cy="${INNER}" r="${INNER}" fill="#fff"/></svg>`);

  const meta = await sharp(src).rotate().metadata();
  const W = meta.width, H = meta.height;
  const side = Math.round(Math.min(W, H) * zoom);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const left = clamp(Math.round(focusX * W - side / 2), 0, W - side);
  const top = clamp(Math.round(focusY * H - side / 2), 0, H - side);

  const photo = await sharp(src)
    .rotate()
    .extract({ left, top, width: side, height: side })
    .resize(PHOTO, PHOTO, { fit: 'cover' })
    .toColourspace('srgb')
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const off = Math.round((SIZE - PHOTO) / 2);
  await sharp(baseBuf)
    .composite([{ input: photo, left: off, top: off }])
    .png()
    .toFile(path.join(dir, outName));
  console.log('wrote', outName);
}

const [, , src, out, fx, fy, z] = process.argv;
make(src, out, fx ? parseFloat(fx) : 0.5, fy ? parseFloat(fy) : 0.4, z ? parseFloat(z) : 1);
