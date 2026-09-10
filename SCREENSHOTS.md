# Website screenshot sources

The landing page uses real native app captures inside its existing device frames.
The WebP files are optimized exports at the source dimensions: no app content is
cropped, stretched, or painted over, and the screenshots retain their own status bars.

## Android home

- Website asset: `public/images/android-home-v6.webp`
- App version: Android 0.1.2, version code 6
- Captured: September 9, 2026, at 1080×2340
- Source in the private app repository: `play-store/assets/phone-s26-vc6-native/01-home.png`
- Source commit: `a7f302d`
- Capture details: `play-store/PHONE-ASSETS-S26-vc6.md` in the app repository

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
