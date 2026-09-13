import { Check } from 'lucide-react';
import ThemeToggle from './theme-toggle';
import FooterMaker from './footer-maker';
import AppDemo from './app-demo';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.brantly.rosarium';

const PRIVACY_URL = 'https://brantlymillegan.github.io/rosarium-privacy/';

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

          <AppDemo storeUrl={PLAY_STORE_URL} />
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <FooterMaker />
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
