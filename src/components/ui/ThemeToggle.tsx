'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const THEME_EVENT = 'theme-change';

function subscribeTheme(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

function getTheme(): Theme {
  const stored = window.localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

function getServerTheme(): Theme {
  return 'dark';
}

export type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations('theme');
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  function handleToggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem('theme', next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={className}
      aria-label={mounted ? (theme === 'dark' ? t('switchToLight') : t('switchToDark')) : t('toggle')}
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
