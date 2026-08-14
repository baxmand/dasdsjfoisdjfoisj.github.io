#!/usr/bin/env python3
# Video still -> B&W rounded card with baked bottom gradient (for overlay captions).
# usage: still.py <src> <out.png> <aspect w/h> <focusY 0..1>
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageOps


def make(src, out, aspect, focusY):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    if W / H < aspect:
        cw = W; ch = int(round(W / aspect))
    else:
        ch = H; cw = int(round(H * aspect))
    left = (W - cw) // 2
    top = max(0, min(int(round(focusY * H - ch / 2)), H - ch))
    im = im.crop((left, top, left + cw, top + ch))

    OW = 1200; OH = int(round(OW / aspect))
    im = im.resize((OW, OH), Image.LANCZOS)
    g = ImageOps.grayscale(im).convert('RGBA')

    grad = np.zeros((OH, OW, 4), np.uint8)
    ys = np.linspace(0, 1, OH).reshape(-1, 1)
    a = np.clip((ys - 0.5) / 0.5, 0, 1) ** 1.3 * 210
    grad[..., 3] = np.repeat(a.astype(np.uint8), OW, axis=1)
    g.alpha_composite(Image.fromarray(grad, 'RGBA'))

    mask = Image.new('L', (OW, OH), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, OW - 1, OH - 1], radius=int(OW * 0.05), fill=255)
    g.putalpha(mask)
    g.save(out)
    print('wrote', out)


if __name__ == '__main__':
    src, out, aspect, fy = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
    make(src, out, aspect, fy)
