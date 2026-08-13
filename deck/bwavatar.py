#!/usr/bin/env python3
# High-res (1000px) face-crop + B&W circular avatar in the neon ring. No bg removal.
# usage: bwavatar.py <src> <out.png> <focusX> <focusY> <zoom>
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps

SIZE = 1000
RING = round(SIZE * 0.444)   # pink ring outer radius
DARK = round(SIZE * 0.388)   # thin dark rim radius
INNER = round(SIZE * 0.380)  # photo circle radius
PHOTO = INNER * 2
C = SIZE / 2


def face_crop(src, fx, fy, zoom):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    side = int(round(min(W, H) * zoom))
    left = max(0, min(int(round(fx * W - side / 2)), W - side))
    top = max(0, min(int(round(fy * H - side / 2)), H - side))
    return im.crop((left, top, left + side, top + side))


def make(src, out, fx, fy, zoom):
    crop = face_crop(src, fx, fy, zoom)
    gray = ImageOps.grayscale(crop).convert('RGBA').resize((PHOTO, PHOTO), Image.LANCZOS)
    mask = Image.new('L', (PHOTO, PHOTO), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, PHOTO - 1, PHOTO - 1], fill=255)
    gray.putalpha(mask)

    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    gr = round(SIZE * 0.47)
    ImageDraw.Draw(glow).ellipse([C - gr, C - gr, C + gr, C + gr], fill=(255, 0, 144, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(round(SIZE * 0.052)))
    canvas.alpha_composite(glow)

    def disc(rad, color):
        im = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
        ImageDraw.Draw(im).ellipse([C - rad, C - rad, C + rad, C + rad], fill=color)
        return im

    # pink ring + thin dark rim
    canvas.alpha_composite(disc(RING, (255, 20, 154, 255)))
    canvas.alpha_composite(disc(DARK, (12, 12, 14, 255)))
    canvas.alpha_composite(gray, (round(C - INNER), round(C - INNER)))
    canvas.save(out)
    print('wrote', out)


if __name__ == '__main__':
    src, out, fx, fy, zoom = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
    make(src, out, fx, fy, zoom)
