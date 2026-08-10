# AS Talent Agency — banners

Leaderboard banner for datingforum.com.ua (model recruitment, 18+).

## Deliverables
- `as-talent-970x90.png` — 970×90, ~124 KB
- `as-talent-970x90.jpg` — 970×90, ~30 KB (lighter, use if the forum caps file size)

Both are well under the 512 KB target.

## Design
Dark-luxe + metallic gold palette in the style of astalentagency.com.
Trust cues are carried by the design, not the copy: ★★★★★ mark, gold frame with
corner ticks, `AS` monogram watermark, strict Montserrat/Oswald typography.
Platform focus: **OnlyFans** and **Fansly** (branded blue badges).

## Rebuild
```
cd source
node build.js     # embeds fonts -> banner.html
node render.js    # renders 2x then downscales -> ../as-talent-970x90.{png,jpg}
```
Requires Playwright + Chromium. Edit copy/colors in `source/build.js`.
