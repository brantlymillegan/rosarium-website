'use client';

/* oxlint-disable next/no-img-element -- Keep the original SVGs as no-JavaScript fallbacks. */

import { useEffect, useRef, type MouseEvent } from 'react';
import { mountAnimatedLogo, type MountedLogoMotion } from '@/lib/artes-nobiles-logo-motion';

const MAKER_URL = 'https://artesnobiles.com';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
type Theme = 'light' | 'dark';

export default function FooterMaker() {
  const link = useRef<HTMLAnchorElement>(null);
  const lightSlot = useRef<HTMLSpanElement>(null);
  const darkSlot = useRef<HTMLSpanElement>(null);
  const controllers = useRef<Partial<Record<Theme, MountedLogoMotion>>>({});
  const ready = useRef<Partial<Record<Theme, Promise<MountedLogoMotion | null>>>>({});
  const lastPointer = useRef('');
  const pending = useRef(false);
  const pendingController = useRef<MountedLogoMotion | null>(null);
  const generation = useRef(0);

  function navigate() {
    pending.current = false;
    pendingController.current = null;
    window.location.assign(MAKER_URL);
  }

  useEffect(() => {
    let active = true;
    const abort = new AbortController();
    // A slow or unavailable animation must not strand the link.
    const loadTimeout = window.setTimeout(() => abort.abort(), 5000);
    const listeners: Array<() => void> = [];

    async function mount(theme: Theme, slot: HTMLSpanElement | null, color: string) {
      if (!slot) return null;
      try {
        const controller = await mountAnimatedLogo(
          slot,
          `/images/artes-nobiles-full-growth-${color}.svg`,
          { onLoad: false, onHover: false, signal: abort.signal },
        );
        if (!active) {
          controller.destroy();
          return null;
        }
        controller.svg.setAttribute('aria-hidden', 'true');
        slot.parentElement?.setAttribute('data-ready', 'true');
        controllers.current[theme] = controller;
        const onEnd = (event: Event) => {
          const completed = (event as CustomEvent<{ completed: boolean }>).detail?.completed;
          if (
            active && !document.hidden && pending.current &&
            pendingController.current === controller &&
            (completed || window.matchMedia(REDUCED_MOTION).matches)
          ) navigate();
        };
        controller.svg.addEventListener('logo-motion-end', onEnd);
        listeners.push(() => controller.svg.removeEventListener('logo-motion-end', onEnd));
        return controller;
      } catch {
        // Keep the supplied static logo and normal navigation as the fallback.
        return null;
      }
    }

    ready.current = {
      light: mount('light', lightSlot.current, 'black'),
      dark: mount('dark', darkSlot.current, 'white'),
    };
    void Promise.all(Object.values(ready.current)).finally(() => clearTimeout(loadTimeout));

    const cancelNavigation = () => {
      if (document.hidden) {
        generation.current += 1;
        pending.current = false;
        pendingController.current = null;
      }
    };
    document.addEventListener('visibilitychange', cancelNavigation);
    return () => {
      active = false;
      generation.current += 1;
      pending.current = false;
      pendingController.current = null;
      abort.abort();
      clearTimeout(loadTimeout);
      document.removeEventListener('visibilitychange', cancelNavigation);
      listeners.forEach(remove => remove());
      Object.values(controllers.current).forEach(controller => controller.destroy());
      controllers.current = {};
    };
  }, []);

  function currentTheme(): Theme {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  async function play() {
    const theme = currentTheme();
    const controller = controllers.current[theme] ?? await ready.current[theme];
    if (
      !pending.current && theme === currentTheme() &&
      link.current?.matches(':hover, :focus-visible')
    ) controller?.play();
  }

  async function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const pointer = (event.nativeEvent as PointerEvent).pointerType || lastPointer.current;
    lastPointer.current = '';
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const touchActivation = event.detail !== 0 && (
      pointer === 'touch' || pointer === 'pen' || window.matchMedia('(hover: none)').matches
    );
    if (!touchActivation) return;

    event.preventDefault();
    if (pending.current) return;
    if (window.matchMedia(REDUCED_MOTION).matches) {
      navigate();
      return;
    }
    pending.current = true;
    const request = ++generation.current;
    let theme = currentTheme();
    let controller = await ready.current[theme];
    while (request === generation.current && theme !== currentTheme()) {
      theme = currentTheme();
      controller = await ready.current[theme];
    }
    if (request !== generation.current || document.hidden) return;
    pendingController.current = controller ?? null;
    if (!controller || (!controller.isPlaying && !controller.play())) navigate();
  }

  return (
    <a
      ref={link}
      className="footer-maker"
      href={MAKER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Artes Nobiles"
      onPointerDown={event => { lastPointer.current = event.pointerType; }}
      onPointerEnter={event => { if (event.pointerType === 'mouse') void play(); }}
      onFocus={event => { if (event.currentTarget.matches(':focus-visible')) void play(); }}
      onClick={onClick}
    >
      <span className="footer-maker-logo footer-maker-logo--light" aria-hidden="true">
        <img src="/images/artes-nobiles-static-black.svg" alt="" width="1434" height="1434" />
        <span className="footer-maker-animation" ref={lightSlot} />
      </span>
      <span className="footer-maker-logo footer-maker-logo--dark" aria-hidden="true">
        <img src="/images/artes-nobiles-static-white.svg" alt="" width="1434" height="1434" />
        <span className="footer-maker-animation" ref={darkSlot} />
      </span>
    </a>
  );
}
