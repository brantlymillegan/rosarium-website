# Website screenshot sources

The landing page uses real native app captures inside its existing device frames.
The WebP files are optimized exports at the source dimensions: no app content is
cropped, stretched, or painted over, and the screenshots retain their own status bars.

## Android home

- Light website asset: `public/images/android-home-2026-09-11.webp`
- Dark website asset: `public/images/android-home-dark-2026-09-11.webp`
- Original native captures: `assets/source/android-home-2026-09-11.png` and
  `assets/source/android-home-dark-2026-09-11.png`
- App version: Android 0.1.2, version code 6, local development build
- Captured: September 11, 2026, at 1080×2340
- Source baseline in the private app repository: `81cd8e6`, with local updates
- Light PNG SHA-256: `467b37411e0a0a25e273980531d1249e7ea387c1f59b1e1bebce6c1f4c37f556`
- Dark PNG SHA-256: `fce5a42d86bfeb3a04cbd2fcfbf835d29c31113933f4b682350f33f58f554c43`

This fresh development capture shows the corrected cross, the tab rail aligned
with the catalog cards, and tighter card spacing. It replaces the September 9
release screenshot; the version number alone does not identify these newer UI
changes. Both captures use the same APK and home state, with the native app
following Android's light or dark system appearance. The dark counterpart was
recovered and verified on September 12; the existing light image is unchanged.
The untouched PNGs are retained outside the public assets for future exports.

APK SHA-256: `0f4e065dff436937622a42799b2583bfee438c8ee85a6e788460071190a3250f`.

The stock Android emulator used Galaxy S26 screen dimensions. This is not a
physical Samsung/One UI capture. The website adds the Galaxy S26 frame separately.
Use the native source, not the Play Store copy that adds side margins.

## iPhone Scripture meditation

- Light website asset: `public/images/iphone-scripture-light-2026-09-12.webp`
- Dark website asset: `public/images/iphone-scripture-dark-2026-09-12.webp`
- Original native captures: `assets/source/iphone-scripture-light-2026-09-12.png`
  and `assets/source/iphone-scripture-dark-2026-09-12.png`
- App version: iPhone 1.0 (1), local September 12 development build
- Captured: September 12, 2026, on an iPhone 17 Pro Max simulator, iOS 26.5,
  at 1320×2868
- Light PNG SHA-256: `cc28405c2b3f9aadc6aaeee399a9703ad8eea554c5db512820a2f7fc77299c9f`
- Dark PNG SHA-256: `4c5459a69ec737a2803c006fc9b6f688a39a0e710e61a6b0bf8164e0fe512c06`
- App executable SHA-256: `403cbca5001181f8513c923dfbee4f9e15bc35abdcc2d435ec1ad8f1958aca47`

Both captures use the same expanded Annunciation Scripture state and scroll
position, with the updated native logo. The app's built-in debug QA launch routing
selected each native appearance on a disposable simulator; no app source was
changed. Earlier website captures remain preserved.

## Website appearance

The website defaults to System and also offers explicit Light and Dark choices.
Its resolved appearance controls which native image is displayed inside both
existing device frames. Neither dark screenshot is an inverted or recolored
light image. Both images are loaded so toggling does not wait for a new request.
The frames, overlapping order, tilt, hover motion, and links are unchanged.

## Refreshing

Use the latest native capture for each platform, preserve its full screen aspect
ratio, and update the image path in `app/page.tsx`. Use a new filename when replacing
an image so existing visitors receive the new asset instead of a cached copy.
