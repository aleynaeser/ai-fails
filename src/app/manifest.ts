import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: 'Manifest',
  });

  return {
    name: t('name'),
    short_name: t('shortName'),
    description: t('description'),
    start_url: '/',
    display: 'standalone',
    background_color: '#1F1F1F',
    theme_color: '#0A402E',
    icons: [
      {
        src: '/favicons/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
