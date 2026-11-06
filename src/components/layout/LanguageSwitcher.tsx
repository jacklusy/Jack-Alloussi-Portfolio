'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { localeMeta, locales, type Locale } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export type LanguageSwitcherProps = {
  /** `menu`: compact popover for the header. `segmented`: all four options inline (mobile drawer, footer). */
  variant?: 'menu' | 'segmented';
  className?: string;
};

/**
 * Switches the page to another language while keeping the visitor exactly where
 * they are: same route, same query string, same #hash, same scroll position.
 * The choice is remembered in the NEXT_LOCALE cookie (next-intl sets it), so
 * `/` takes a returning visitor straight to their language (see `proxy.ts`).
 */
export function LanguageSwitcher({ variant = 'menu', className }: LanguageSwitcherProps) {
  const t = useTranslations('language');
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function select(next: Locale) {
    if (next === current) return;
    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: next, scroll: false });
    });
  }

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label={t('choose')}
        aria-busy={isPending}
        className={cn('grid grid-cols-4 gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] p-1', className)}
      >
        {locales.map((locale) => {
          const active = locale === current;
          return (
            <button
              key={locale}
              type="button"
              lang={locale}
              aria-pressed={active}
              onClick={() => select(locale)}
              className={cn(
                'inline-flex min-h-11 touch-manipulation items-center justify-center rounded-[calc(var(--radius-md)-2px)] px-2 text-[var(--text-sm)] font-medium transition-colors',
                active
                  ? 'bg-[var(--color-bg)] text-[var(--color-brand)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              )}
            >
              {localeMeta[locale].nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  return <LanguageMenu current={current} onSelect={select} busy={isPending} className={className} />;
}

function LanguageMenu({
  current,
  onSelect,
  busy,
  className,
}: {
  current: Locale;
  onSelect: (locale: Locale) => void;
  busy: boolean;
  className?: string | undefined;
}) {
  const t = useTranslations('language');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  // Close on outside pointer / focus leaving the widget.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Move focus to the active item when the menu opens.
  useEffect(() => {
    if (!open) return;
    const index = Math.max(0, locales.indexOf(current));
    itemRefs.current[index]?.focus();
  }, [open, current]);

  function close(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function onMenuKeyDown(event: React.KeyboardEvent) {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (i: number) => items[(i + items.length) % items.length]?.focus();

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close(true);
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusAt(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusAt(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${t('label')}: ${localeMeta[current].nativeName}`}
        aria-busy={busy}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 text-[var(--color-text-muted)] transition-colors duration-[var(--duration-micro)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="font-mono text-[11px] tracking-[0.14em]" lang={current}>
          {localeMeta[current].short}
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-[var(--duration-micro)]', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t('choose')}
          onKeyDown={onMenuKeyDown}
          className="absolute end-0 top-[calc(100%+0.5rem)] z-[var(--z-drawer)] min-w-44 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-1.5 shadow-[var(--shadow-lg)]"
        >
          {locales.map((locale, index) => {
            const active = locale === current;
            return (
              <button
                key={locale}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                lang={locale}
                dir={localeMeta[locale].dir}
                onClick={() => {
                  close(true);
                  onSelect(locale);
                }}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between gap-6 rounded-[var(--radius-md)] px-3 text-start transition-colors',
                  active
                    ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]',
                )}
              >
                <span className="font-medium">{localeMeta[locale].nativeName}</span>
                {active ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-text-subtle)]">
                    {localeMeta[locale].short}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
