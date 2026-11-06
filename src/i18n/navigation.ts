import { createNavigation } from 'next-intl/navigation';
import { routing } from '@/i18n/routing';

/**
 * Locale-aware replacements for `next/link` and `next/navigation`. Use these
 * instead of the originals: they add the `/de` `/en` `/fr` `/ar` prefix on the
 * way out and strip it from `usePathname()` on the way in, so `pathname === '/'`
 * still means "home" in every language.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
