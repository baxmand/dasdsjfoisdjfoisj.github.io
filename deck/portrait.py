#!/usr/bin/env python3
# Editorial portrait card: face-focused square crop, B&W, baked bottom gradient,
# rounded corners (alpha). No pink ring. For overlay-name magazine layout.
# usage: portrait.py <src> <out.png> <focusX> <focusY> <zoom>
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageOps

SIZE = 1100
RAD = round(SIZE * 0.055)


def face_crop(src, fx, fy, zoom):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    side = int(round(min(W, H) * zoom))
    left = max(0, min(int(round(fx * W - side / 2)), W - side))
    top = max(0, min(int(round(fy * H - side / 2)), H - side))
    return im.crop((left, top, left + side, top + side))


def make(src, out, fx, fy, zoom):
    im = face_crop(src, fx, fy, zoom).resize((SIZE, SIZE), Image.LANCZOS)
    im = ImageOps.grayscale(im).convert('RGBA')

    # bottom gradient (transparent -> dark) baked in for text legibility
    grad = np.zeros((SIZE, SIZE, 4), np.uint8)
    ys = np.linspace(0, 1, SIZE).reshape(-1, 1)
    start = 0.46
    a = np.clip((ys - start) / (1 - start), 0, 1) ** 1.35 * 216
    grad[..., 3] = np.repeat(a.astype(np.uint8), SIZE, axis=1)
    im.alpha_composite(Image.fromarray(grad, 'RGBA'))

    # rounded corners
    mask = Image.new('L', (SIZE, SIZE), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=RAD, fill=255)
    im.putalpha(mask)
    im.save(out)
    print('wrote', out)


if __name__ == '__main__':
    src, out, fx, fy, zoom = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5])
    make(src, out, fx, fy, zoom)
