export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'rosarium-theme';
export const THEME_CHANGE_EVENT = 'rosarium-theme-change';

export function normalizeTheme(value: string | null | undefined): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean) {
  return preference === 'dark' || (preference === 'system' && systemDark)
    ? 'dark'
    : 'light';
}

export function updateDocumentTheme(preference: ThemePreference) {
  const resolved = resolveTheme(
    preference,
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  document.querySelector('#theme-color')?.setAttribute(
    'content',
    resolved === 'dark' ? '#252a32' : '#f6f4ef',
  );
}

// Apply the saved or system theme before paint; this does not depend on hydration.
export const themeInitializationScript = `(() => {
  let preference = 'system';
  try {
    const stored = localStorage.getItem('rosarium-theme');
    if (stored === 'light' || stored === 'dark') preference = stored;
  } catch {}
  const dark = preference === 'dark' ||
    (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = dark ? 'dark' : 'light';
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
})();`;
