'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VIDEO_DIRECTORY = '/videos/see-app-v6';

export default function AppDemo({ storeUrl }: { storeUrl: string }) {
  const lightVideo = useRef<HTMLVideoElement>(null);
  const darkVideo = useRef<HTMLVideoElement>(null);
  const activeVideo = useRef<HTMLVideoElement | null>(null);
  const preference = useRef<'auto' | 'play' | 'pause'>('auto');
  const syncPlayback = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const [readyThemes, setReadyThemes] = useState({ light: false, dark: false });

  useEffect(() => {
    const light = lightVideo.current;
    const dark = darkVideo.current;
    if (!light || !dark) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => {
      const theme = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
      const video = theme === 'dark' ? dark : light;
      const hiddenVideo = theme === 'dark' ? light : dark;
      activeVideo.current = video;
      hiddenVideo.autoplay = false;
      hiddenVideo.pause();

      const shouldPlay =
        !document.hidden &&
        (preference.current === 'play' ||
          (preference.current === 'auto' && !reducedMotion.matches));
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = shouldPlay;
      const source = `${VIDEO_DIRECTORY}/rosarium-galaxy-s26-${theme}-60fps.mp4`;
      // Only load the selected theme; reduced-motion visitors start with its poster.
      // Replace an outdated source too, so preview updates cannot keep the old canvas size.
      if (shouldPlay && video.getAttribute('src') !== source) {
        video.src = source;
        video.load();
      }
      if (shouldPlay) {
        if (video.paused) {
          void video.play().catch(() => {
            if (activeVideo.current === video && video.paused)
              setPlaying(false);
          });
        }
      } else {
        video.pause();
      }
      setPlaying(!video.paused);
    };

    const onMotionChange = () => {
      if (reducedMotion.matches && preference.current === 'play')
        preference.current = 'auto';
      sync();
    };
    // Observe the resolved theme, including System mode and changes in another tab.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', sync);
    syncPlayback.current = sync;
    sync();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', sync);
      syncPlayback.current = null;
      activeVideo.current = null;
      light.autoplay = false;
      dark.autoplay = false;
      light.pause();
      dark.pause();
    };
  }, []);

  function updatePlayback(event: SyntheticEvent<HTMLVideoElement>) {
    if (activeVideo.current === event.currentTarget)
      setPlaying(!event.currentTarget.paused);
  }

  function revealFrame(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    if (video.readyState >= 2 && !video.seeking) {
      const theme = video === lightVideo.current ? 'light' : 'dark';
      setReadyThemes((current) => ({ ...current, [theme]: true }));
    }
    updatePlayback(event);
  }

  function hideFrame(event: SyntheticEvent<HTMLVideoElement>) {
    const theme = event.currentTarget === lightVideo.current ? 'light' : 'dark';
    setReadyThemes((current) => ({ ...current, [theme]: false }));
    updatePlayback(event);
  }

  function togglePlayback() {
    const video = activeVideo.current;
    if (!video) return;
    preference.current = video.paused ? 'play' : 'pause';
    syncPlayback.current?.();
  }

  return (
    <div className="app-demo">
      <a
        className="app-demo-link"
        href={storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Rosarium on Google Play"
      >
        <span className="app-demo-frame">
          <img
            className="app-demo-poster app-demo-poster--light"
            src={`${VIDEO_DIRECTORY}/poster-light-mp4.png`}
            width="520"
            height="1074"
            alt=""
          />
          <img
            className="app-demo-poster app-demo-poster--dark"
            src={`${VIDEO_DIRECTORY}/poster-dark-mp4.png`}
            width="520"
            height="1074"
            alt=""
          />
          <video
            ref={lightVideo}
            className={`app-demo-video app-demo-video--light${readyThemes.light ? ' is-ready' : ''}`}
            width="600"
            height="1200"
            muted
            loop
            playsInline
            preload="none"
            aria-label="Rosarium app demonstration in light mode"
            onPlay={updatePlayback}
            onPlaying={revealFrame}
            onLoadedData={revealFrame}
            onLoadStart={hideFrame}
            onPause={updatePlayback}
            onError={hideFrame}
          />
          <video
            ref={darkVideo}
            className={`app-demo-video app-demo-video--dark${readyThemes.dark ? ' is-ready' : ''}`}
            width="600"
            height="1200"
            muted
            loop
            playsInline
            preload="none"
            aria-label="Rosarium app demonstration in dark mode"
            onPlay={updatePlayback}
            onPlaying={revealFrame}
            onLoadedData={revealFrame}
            onLoadStart={hideFrame}
            onPause={updatePlayback}
            onError={hideFrame}
          />
        </span>
      </a>
      <Button
        type="button"
        className="app-demo-control"
        variant="ghost"
        onClick={togglePlayback}
        aria-label={
          playing ? 'Pause app demonstration' : 'Play app demonstration'
        }
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        {playing ? 'Pause' : 'Play'}
      </Button>
    </div>
  );
}
