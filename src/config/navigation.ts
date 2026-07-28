export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { label: 'Home', href: '/' },
];
