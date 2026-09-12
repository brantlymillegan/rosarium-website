import { Check } from 'lucide-react';
import ThemeToggle from './theme-toggle';
import ComingSoonTooltip from './coming-soon-tooltip';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.brantly.rosarium';

const PRIVACY_URL = 'https://brantlymillegan.github.io/rosarium-privacy/';

type DevicePreviewProps = {
  device: 'iphone' | 'galaxy';
  image: string;
  darkImage: string;
  alt: string;
  className?: string;
};

function DevicePreview({ device, image, darkImage, alt, className = '' }: DevicePreviewProps) {
  return (
    <div className={`device device--${device} ${className}`.trim()}>
      {device === 'galaxy' ? (
        <img
          className="device-hardware"
          src="/images/galaxy-s26-frame.png"
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <div className="device-screen">
        <img className="device-screen-light" src={image} alt={alt} />
        <img className="device-screen-dark" src={darkImage} alt={alt} />
      </div>
      {device === 'galaxy' ? <span className="device-camera" aria-hidden="true" /> : null}
    </div>
  );
}

function StoreLinks() {
  return (
    <div className="store-links">
      <div className="store-block">
        <a
          className="store-badge store-badge--play"
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Get Rosarium on Google Play"
        >
          <img
            src="/images/google-play-badge-tight.png"
            alt="Get it on Google Play"
            width="564"
            height="166"
          />
        </a>
        <span>Free on Android</span>
      </div>
      <div className="store-block store-block--disabled">
        <span className="store-badge store-badge--apple" aria-disabled="true">
          <img
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            width="120"
            height="40"
          />
        </span>
        <span>Coming Soon</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div id="home" className="site-frame">
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#home" aria-label="Rosarium home">
            <img
              className="brand-mark"
              src="/images/rosarium-icon.png"
              alt=""
              width="48"
              height="48"
            />
            <span>Rosarium</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Traditional Catholic Prayers</p>
            <h1 id="hero-title">Pray Every Day</h1>
            <p className="hero-lede">
              <em>Rosarium</em> keeps your place through the Rosary, chaplets,
              novenas, and traditional prayers—with Scripture and Sacred Art
              along the way.
            </p>
            <StoreLinks />
            <div className="quiet-proof" aria-label="Key product qualities">
              <span>
                <Check className="quiet-proof-check" strokeWidth={3} aria-hidden="true" />
                Works offline
              </span>
              <span>
                <Check className="quiet-proof-check" strokeWidth={3} aria-hidden="true" />
                No account
              </span>
              <span>
                <Check className="quiet-proof-check" strokeWidth={3} aria-hidden="true" />
                No ads
              </span>
            </div>
          </div>

          <div className="phone-stage" aria-label="Rosarium for Android and iPhone">
            <div className="stage-halo" aria-hidden="true" />
            <a
              className="hero-device hero-device--galaxy"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Rosarium on Google Play"
            >
              <DevicePreview
                device="galaxy"
                image="/images/android-home-2026-09-11.webp"
                darkImage="/images/android-home-dark-2026-09-11.webp"
                alt="Rosarium for Android showing its updated devotion library, search, and reminders in a Samsung Galaxy S26 frame"
              />
            </a>
            <ComingSoonTooltip>
              <figure className="hero-device hero-device--iphone">
                <DevicePreview
                  device="iphone"
                  image="/images/iphone-scripture-light-2026-09-12.webp"
                  darkImage="/images/iphone-scripture-dark-2026-09-12.webp"
                  alt="Rosarium on iPhone showing the Annunciation artwork, Scripture, and prayer beads"
                />
              </figure>
            </ComingSoonTooltip>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>Made by Athleta Christi</p>
          <div className="footer-links">
            <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
              Privacy
            </a>
            <a href="mailto:me@brantly.com">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
