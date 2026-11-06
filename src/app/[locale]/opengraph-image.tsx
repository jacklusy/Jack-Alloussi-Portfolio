import { renderSocialCard, ogSize } from '@/lib/og';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

// The card shows the owner's name and a localised headline; the name is the
// same in every language.
export const alt = 'Jack Alloussi';
export const size = ogSize;
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return renderSocialCard(locale);
}
