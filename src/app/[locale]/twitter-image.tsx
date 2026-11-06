import { renderSocialCard, ogSize } from '@/lib/og';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

export const alt = 'Jack Alloussi';
export const size = ogSize;
export const contentType = 'image/png';

export default async function TwitterImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return renderSocialCard(locale);
}
