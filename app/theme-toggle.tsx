'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import {
  normalizeTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  updateDocumentTheme,
  type ThemePreference,
} from './theme';

const themes = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
] as const;

function getTheme() {
  return normalizeTheme(document.documentElement.dataset.themePreference);
}

function getServerTheme(): ThemePreference {
  return 'system';
}

function subscribe(onChange: () => void) {
  function syncStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      updateDocumentTheme(normalizeTheme(event.newValue));
      onChange();
    }
  }
  window.addEventListener('storage', syncStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', syncStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export default function ThemeToggle() {
  const preference = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const [openMode, setOpenMode] = useState<'closed' | 'hover' | 'pinned'>('closed');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsId = useId();
  const isOpen = openMode !== 'closed';
  const selected = themes.find(({ value }) => value === preference) ?? themes[0];

  useEffect(() => {
    updateDocumentTheme(getTheme());
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystem = () => {
      if (getTheme() === 'system') updateDocumentTheme('system');
    };
    system.addEventListener('change', syncSystem);
    return () => system.removeEventListener('change', syncSystem);
  }, [preference]);

  useEffect(() => {
    if (!isOpen) return;
    function closeOutside(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpenMode('closed');
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMode('closed');
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  function chooseTheme(nextTheme: ThemePreference) {
    updateDocumentTheme(nextTheme);
    try {
      if (nextTheme === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The current page still follows the selection when storage is blocked.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    setOpenMode('closed');
    triggerRef.current?.focus();
  }

  return (
    <div
      className={`theme-toggle${isOpen ? ' is-open' : ''}`}
      ref={wrapperRef}
      data-active-theme={preference}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          setOpenMode((mode) => (mode === 'pinned' ? mode : 'hover'));
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') {
          setOpenMode((mode) => (mode === 'hover' ? 'closed' : mode));
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpenMode('closed');
        }
      }}
    >
      <Button
        className="theme-trigger"
        variant="ghost"
        size="icon"
        ref={triggerRef}
        type="button"
        aria-controls={optionsId}
        aria-expanded={isOpen}
        aria-label={`${selected.label} theme. Choose color theme`}
        title={`${selected.label} theme`}
        onClick={() => setOpenMode((mode) => (mode === 'pinned' ? 'closed' : 'pinned'))}
      >
        <selected.Icon className="theme-symbol" aria-hidden="true" />
      </Button>
      <fieldset
        className="theme-menu-options"
        id={optionsId}
        aria-label="Choose color theme"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {themes.filter(({ value }) => value !== preference).map(({ value, label, Icon }) => (
          <Button
            className="theme-option"
            variant="ghost"
            size="icon"
            type="button"
            key={value}
            aria-label={`Use ${label.toLowerCase()} theme`}
            title={label}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => chooseTheme(value)}
          >
            <Icon className="theme-symbol" aria-hidden="true" />
          </Button>
        ))}
      </fieldset>
    </div>
  );
}
