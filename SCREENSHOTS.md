# Website screenshot sources

The landing page uses real native app captures inside its existing device frames.
The WebP files are optimized exports at the source dimensions: no app content is
cropped, stretched, or painted over, and the screenshots retain their own status bars.

## Android home

- Website asset: `public/images/android-home-2026-09-11.webp`
- Original native capture: `assets/source/android-home-2026-09-11.png`
- App version: Android 0.1.2, version code 6, local development build
- Captured: September 11, 2026, at 1080×2340
- Source baseline in the private app repository: `81cd8e6`, with local updates
- PNG SHA-256: `467b37411e0a0a25e273980531d1249e7ea387c1f59b1e1bebce6c1f4c37f556`

This fresh development capture shows the corrected cross, the tab rail aligned
with the catalog cards, and tighter card spacing. It replaces the September 9
release screenshot; the version number alone does not identify these newer UI
changes. The untouched PNG is retained outside the public assets for future exports.

The stock Android emulator used Galaxy S26 screen dimensions. This is not a
physical Samsung/One UI capture. The website adds the Galaxy S26 frame separately.
Use the native source, not the Play Store copy that adds side margins.

## iPhone Scripture meditation

- Website asset: `public/images/iphone-scripture-v1.webp`
- App version: iPhone 1.0 release candidate
- Captured: September 2, 2026, on an iPhone 17 Pro Max simulator at 1320×2868
- Source in the private app repository: `app-store/assets/iphone-6.9/03-scripture-meditation.png`
- Source commit: `bcce4f3`
- Capture details: `app-store/asset-manifest.md` in the app repository

As of September 9, the iPhone source is unchanged since these release captures;
the newer Android redesign is not yet part of the native iPhone app.

## Refreshing

Use the latest native capture for each platform, preserve its full screen aspect
ratio, and update the image path in `app/page.tsx`. Use a new filename when replacing
an image so existing visitors receive the new asset instead of a cached copy.
