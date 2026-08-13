#!/usr/bin/env python3
# Uniform B&W-on-pink circular avatar (reference style).
# usage: styleavatar.py <src> <out.png> <focusX> <focusY> <zoom>
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps
from rembg import remove, new_session

SIZE = 500
RING = 222          # pink ring outer radius
DARK = 194          # thin dark rim radius
INNER = 190         # photo/pink circle radius
PHOTO = INNER * 2   # 380

SESS = new_session('u2net')

def disc(d, c_in, c_out):
    """RGBA radial-gradient filled circle of diameter d."""
    yy, xx = np.ogrid[:d, :d]
    c = (d - 1) / 2.0
    r = np.sqrt((xx - c) ** 2 + (yy - c) ** 2) / (d / 2.0)
    rc = np.clip(r, 0, 1)
    img = np.zeros((d, d, 4), np.uint8)
    for i in range(3):
        img[..., i] = (c_in[i] * (1 - rc) + c_out[i] * rc).astype(np.uint8)
    img[..., 3] = np.where(r <= 1.0, 255, 0).astype(np.uint8)
    return Image.fromarray(img, 'RGBA')

def solid_circle(d, color):
    im = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    ImageDraw.Draw(im).ellipse([0, 0, d - 1, d - 1], fill=color)
    return im

def face_crop(src, fx, fy, zoom):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert('RGB')
    W, H = im.size
    side = int(round(min(W, H) * zoom))
    left = max(0, min(int(round(fx * W - side / 2)), W - side))
    top = max(0, min(int(round(fy * H - side / 2)), H - side))
    return im.crop((left, top, left + side, top + side))

def make(src, out, fx, fy, zoom):
    crop = face_crop(src, fx, fy, zoom)
    cut = remove(crop, session=SESS)          # RGBA person on transparent
    alpha = cut.split()[3]
    gray = ImageOps.grayscale(cut.convert('RGB')).convert('RGB')
    gray.putalpha(alpha)
    gray = gray.resize((PHOTO, PHOTO), Image.LANCZOS)

    # pink inner background + person, clipped to circle
    inner = disc(PHOTO, (255, 122, 196), (224, 13, 134))
    inner.alpha_composite(gray)
    mask = Image.new('L', (PHOTO, PHOTO), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, PHOTO - 1, PHOTO - 1], fill=255)
    inner.putalpha(mask)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    # glow
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([15, 15, 485, 485], fill=(255, 0, 144, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(24))
    canvas.alpha_composite(glow)
    # pink ring
    ring = disc(RING * 2, (255, 100, 187), (200, 0, 106))
    canvas.alpha_composite(ring, (round((SIZE - RING * 2) / 2),) * 2)
    # thin dark rim
    canvas.alpha_composite(solid_circle(DARK * 2, (12, 12, 14, 255)),
                           (round((SIZE - DARK * 2) / 2),) * 2)
    # photo
    canvas.alpha_composite(inner, (round((SIZE - PHOTO) / 2),) * 2)

    canvas.save(out)
    print('wrote', out)

if __name__ == '__main__':
    src, out, fx, fy, zoom = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
    make(src, out, fx, fy, zoom)
