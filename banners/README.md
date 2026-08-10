# Recruitment banner — OnlyFans / Fansly

Leaderboard banner for datingforum.com.ua (model recruitment, 18+).

## Deliverables (970×90)
- `banner-onlyfans-fansly-970x90.jpg` — ~34 KB (lightest, recommended for upload)
- `banner-onlyfans-fansly-970x90.png` — ~88 KB
- `banner-onlyfans-fansly-1940x180.png` — ~308 KB (**@2× retina**, crispest, still < 600 KB)
- `banner-onlyfans-fansly-1940x180.jpg` — ~92 KB (@2×)

Display slot is 970×90 — upload the @2× file for the sharpest result on all screens.
The whole image is meant to be a single clickable link to the recruitment thread.

## Design
White-blue, in the platforms' native colors. Official **OnlyFans** and **fansly**
logos on the left, headline + pink CTA in the center, model on the right,
benefits strip, and the top slogan "A partner of talented agencies".

## Assets (`source/assets/`)
- `of_zip1/onlyfans-seeklogo.png`, `fansly_full.png` — platform logos (provided)
- `girl.png` — model image (provided, transparent PNG)
- `fonts/` — Montserrat + Oswald (embedded at build time)

## Rebuild
```
cd source
node build.js   # renders 970×90 and @2× 1940×180 PNG + JPG
```
Requires Playwright + Chromium. Edit copy/colors/layout in `source/build.js`.
