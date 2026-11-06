import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from '@/i18n/navigation';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    external?: boolean | undefined;
    download?: boolean | string | undefined;
  };

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, href, external, download, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    // Downloads and files under /pdf are static assets, not pages: they must
    // not get a language prefix, so they render as a plain anchor.
    const isExternal =
      external === true ||
      Boolean(download) ||
      href.startsWith('/pdf/') ||
      href.startsWith('mailto:') ||
      href.startsWith('http') ||
      href.startsWith('tel:');

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={classes}
          rel={external === true || href.startsWith('http') ? 'noopener noreferrer' : undefined}
          target={external === true || href.startsWith('http') ? '_blank' : undefined}
          download={download}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={classes}>
        {children}
      </Link>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
