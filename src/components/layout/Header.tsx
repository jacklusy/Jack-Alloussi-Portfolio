'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mainNav } from '@/config/navigation';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [isCondensed, setIsCondensed] = useState(false);
  const menuId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setIsCondensed(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        openRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md transition-[box-shadow,background-color] duration-[var(--duration-standard)]',
        'pt-[env(safe-area-inset-top)]',
        isCondensed && 'bg-[var(--color-bg)]/95 shadow-[var(--shadow-md)]',
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-3">
        <Link
          href="/"
          data-magnetic
          className="min-w-0 shrink font-[family-name:var(--font-syne)] text-sm font-semibold tracking-[0.08em] text-[var(--color-text)] uppercase sm:text-base"
        >
          <span className="sm:hidden">Jack A.</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-magnetic
                className={cn(
                  'relative min-h-11 px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-[var(--duration-micro)]',
                  isActive
                    ? 'text-[var(--color-brand)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive ? (
                  <span
                    className="absolute inset-x-3 bottom-1 h-px bg-[var(--color-brand)]"
                    aria-hidden
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] transition-transform duration-[var(--duration-micro)] hover:scale-105 hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]" />
          <ButtonLink
            href={profile.cv.href}
            variant="primary"
            size="sm"
            className="hidden !min-h-10 px-4 text-[11px] tracking-wide uppercase md:inline-flex"
            download={profile.cv.filename}
            data-magnetic
          >
            Download CV
          </ButtonLink>
          <button
            ref={openRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] lg:hidden"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div
          id={menuId}
          className="fixed inset-0 top-[calc(var(--header-height)+env(safe-area-inset-top))] z-[var(--z-overlay)] bg-[var(--color-bg)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex h-full flex-col overflow-y-auto px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
            <div className="mb-4 flex justify-end">
              <button
                ref={closeRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)]"
                aria-label="Close menu"
                onClick={() => {
                  setIsOpen(false);
                  openRef.current?.focus();
                }}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {mainNav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'min-h-12 rounded-[var(--radius-md)] px-4 py-3 font-mono text-sm tracking-[0.12em] uppercase',
                      isActive
                        ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href={profile.cv.href} variant="primary" download={profile.cv.filename}>
                Download CV
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Hire me
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
