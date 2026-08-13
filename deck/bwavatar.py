#!/usr/bin/env python3
# Face-crop + black & white circular avatar in the neon ring (no bg removal, no artifacts).
# usage: bwavatar.py <src> <out.png> <focusX> <focusY> <zoom>
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

SIZE = 500
RING = 222          # pink ring outer radius
DARK = 194          # thin dark rim radius
INNER = 190         # photo circle radius
PHOTO = INNER * 2

def disc(d, c_in, c_out):
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
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    side = int(round(min(W, H) * zoom))
    left = max(0, min(int(round(fx * W - side / 2)), W - side))
    top = max(0, min(int(round(fy * H - side / 2)), H - side))
    return im.crop((left, top, left + side, top + side))

def make(src, out, fx, fy, zoom):
    crop = face_crop(src, fx, fy, zoom)
    gray = ImageOps.grayscale(crop).convert('RGBA')
    gray = gray.resize((PHOTO, PHOTO), Image.LANCZOS)
    mask = Image.new('L', (PHOTO, PHOTO), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, PHOTO - 1, PHOTO - 1], fill=255)
    gray.putalpha(mask)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([15, 15, 485, 485], fill=(255, 0, 144, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(24))
    canvas.alpha_composite(glow)
    canvas.alpha_composite(disc(RING * 2, (255, 100, 187), (200, 0, 106)),
                           (round((SIZE - RING * 2) / 2),) * 2)
    canvas.alpha_composite(solid_circle(DARK * 2, (12, 12, 14, 255)),
                           (round((SIZE - DARK * 2) / 2),) * 2)
    canvas.alpha_composite(gray, (round((SIZE - PHOTO) / 2),) * 2)
    canvas.save(out)
    print('wrote', out)

if __name__ == '__main__':
    src, out, fx, fy, zoom = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
    make(src, out, fx, fy, zoom)
