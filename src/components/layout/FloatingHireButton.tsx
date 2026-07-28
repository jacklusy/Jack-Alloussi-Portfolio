'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Always-visible hire CTA — satisfies persistent contact access.
 */
export function FloatingHireButton() {
  const pathname = usePathname();
  const isContact = pathname === '/contact';

  if (isContact) return null;

  return (
    <Link
      href="/contact"
      data-magnetic
      className={cn(
        'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[45]',
        'btn-cta inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3',
        'font-medium shadow-[var(--shadow-md)]',
        'transition-[transform,box-shadow] duration-[var(--duration-micro)] ease-[var(--ease-out)]',
        'hover:scale-[1.03] hover:shadow-[var(--shadow-lg)] active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
      )}
      aria-label="Hire me — go to contact"
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Hire me</span>
      <span className="sm:hidden">Contact</span>
    </Link>
  );
}
