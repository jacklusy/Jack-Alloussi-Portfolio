import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { localeMeta, type Locale } from '@/i18n/config';

export const ogSize = { width: 1200, height: 630 } as const;

async function arabicFonts() {
  const dir = path.join(process.cwd(), 'node_modules/@fontsource/ibm-plex-sans-arabic/files');
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, 'ibm-plex-sans-arabic-arabic-400-normal.woff')),
    readFile(path.join(dir, 'ibm-plex-sans-arabic-arabic-700-normal.woff')),
  ]);
  return [
    { name: 'Plex Arabic', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Plex Arabic', data: bold, weight: 700 as const, style: 'normal' as const },
  ];
}

/** Shared by the Open Graph and Twitter cards so both read the same in every language. */
export async function renderSocialCard(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const isRtl = localeMeta[locale].dir === 'rtl';
  const fonts = isRtl ? await arabicFonts() : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0D10',
          color: '#F4F6F8',
          padding: 64,
          direction: isRtl ? 'rtl' : 'ltr',
          fontFamily: isRtl ? 'Plex Arabic' : 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#3D82E6',
            fontSize: 22,
            letterSpacing: isRtl ? 0 : '0.14em',
            textTransform: isRtl ? 'none' : 'uppercase',
          }}
        >
          {t('og.badge')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 32, color: '#9AA3AF', maxWidth: 900 }}>{t('og.headline')}</div>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', color: '#7B8494', fontSize: 22 }}
        >
          <span>{t('og.location')}</span>
          <span>{t('og.graduation')}</span>
        </div>
      </div>
    ),
    { ...ogSize, ...(fonts ? { fonts } : {}) },
  );
}
