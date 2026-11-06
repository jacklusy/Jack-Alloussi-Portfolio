/**
 * Navigation structure. Labels are translated: look them up with
 * `t(`nav.${item.key}`)` from the `nav` messages.
 */
export type NavKey = 'home' | 'about' | 'projects' | 'experience' | 'contact';

export type NavItem = {
  key: NavKey;
  /** Locale-neutral path; the i18n `Link` adds the language prefix. */
  href: string;
};

export const mainNav: NavItem[] = [
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'experience', href: '/experience' },
  { key: 'contact', href: '/contact' },
];

export const footerNav: NavItem[] = [...mainNav, { key: 'home', href: '/' }];
