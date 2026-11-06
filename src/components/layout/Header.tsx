'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { mainNav } from '@/config/navigation';
import { Container } from '@/components/layout/Container';
import { DirIcon } from '@/components/ui/DirIcon';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScrollLock } from '@/hooks/useScrollLock';
import { isUsableHref } from '@/lib/content-text';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type HeaderProps = {
  name: string;
  cv: { href: string; filename: string };
  socials: Array<{ id: string; label: string; href: string; external: boolean }>;
};

export function Header({ name, cv, socials: allSocials }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [isCondensed, setIsCondensed] = useState(false);
  // Mirrors ThemeToggle's mount-detection pattern: the portal target only
  // exists client-side, and this avoids a setState call inside an effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setIsOpen(false);
  }

  useScrollLock(isOpen);

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        // Only re-render on the actual threshold crossing, not every event.
        setIsCondensed((prev) => {
          const next = window.scrollY > 24;
          return prev === next ? prev : next;
        });
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function close() {
    setIsOpen(false);
    openRef.current?.focus();
  }

  // Escape to close, and keep Tab inside the sheet while it is open.
  useEffect(() => {
    if (!isOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        openRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    closeRef.current?.focus();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const socials = allSocials.filter((social) => isUsableHref(social.href));

  const drawer = (
    <div
      id={menuId}
      ref={panelRef}
      className="fixed inset-0 z-[var(--z-drawer)] flex h-[100dvh] flex-col bg-[var(--color-bg)] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.siteNavigation')}
    >
      <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 pt-[env(safe-area-inset-top)] sm:px-6">
        <span className="font-[family-name:var(--font-syne)] text-sm font-semibold tracking-[0.08em] text-[var(--color-text)] uppercase">
          {name}
        </span>
        <button
          ref={closeRef}
          type="button"
          className="-me-2 inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-sunken)]"
          aria-label={t('nav.closeMenu')}
          onClick={close}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
        <nav className="flex flex-col gap-1" aria-label={t('nav.mobilePrimary')}>
          {mainNav.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-14 touch-manipulation items-center justify-between gap-4 rounded-[var(--radius-md)] px-4 py-3 transition-colors',
                  isActive
                    ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
                  {t(`nav.${item.key}`)}
                </span>
                <span
                  className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-text-subtle)]"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="/contact" variant="primary">
            {t('actions.hireMe')}
          </ButtonLink>
          <ButtonLink href={cv.href} variant="secondary" download={cv.filename}>
            {t('actions.downloadCv')}
          </ButtonLink>
        </div>

        <div className="mt-8">
          <LanguageSwitcher variant="segmented" />
        </div>

        <div className="mt-auto pt-10">
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    className="inline-flex min-h-11 touch-manipulation items-center gap-1 font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-muted)] uppercase transition-colors hover:text-[var(--color-brand)]"
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    target={social.external ? '_blank' : undefined}
                  >
                    {social.label}
                    {social.external ? <DirIcon icon={ArrowUpRight} className="h-3 w-3" /> : null}
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle className="inline-flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        // No backdrop-filter here: a non-none backdrop-filter makes this
        // element a containing block for fixed-position descendants, which
        // trapped the mobile sheet inside the header's box.
        'sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)] bg-[var(--color-bg)] transition-shadow duration-[var(--duration-standard)]',
        'pt-[env(safe-area-inset-top)]',
        isCondensed && 'shadow-[var(--shadow-md)]',
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-3">
        <Link
          href="/"
          className="min-w-0 shrink font-[family-name:var(--font-syne)] text-sm font-semibold tracking-[0.08em] text-[var(--color-text)] uppercase transition-colors hover:text-[var(--color-brand)] sm:text-base"
        >
          <span className="sm:hidden">{t('nav.shortName')}</span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label={t('nav.primary')}>
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-link relative min-h-11 px-2.5 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-[var(--duration-micro)] lg:px-3',
                  isActive
                    ? 'is-active text-[var(--color-brand)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <LanguageSwitcher className="hidden md:block" />
          <ThemeToggle className="hidden min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] transition-colors duration-[var(--duration-micro)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)] md:inline-flex" />
          <ButtonLink
            href={cv.href}
            variant="primary"
            size="sm"
            className="hidden !min-h-10 px-4 text-[11px] tracking-wide uppercase xl:inline-flex"
            download={cv.filename}
          >
            {t('actions.downloadCv')}
          </ButtonLink>
          <button
            ref={openRef}
            type="button"
            className="-me-2 inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-sunken)] md:hidden"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </Container>

      {/* Portalled to <body>: `position: fixed` must resolve against the
          viewport, and the sheet must escape the header's stacking context. */}
      {mounted && isOpen ? createPortal(drawer, document.body) : null}
    </header>
  );
}
