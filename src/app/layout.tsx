import { Metadata } from 'next';
import { routing } from '@i18n/routing';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl';
import { getFormatter, getNow, getTimeZone, getTranslations, setRequestLocale } from 'next-intl/server';
import * as motion from 'motion/react-client';

import { QueryProvider } from '@/common/providers/QueryProvider';
import '@styles/globals.css';

const inter = Inter({
  display: 'swap',
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Manifest' });
  const formatter = await getFormatter({ locale });
  const now = await getNow({ locale });
  const timeZone = await getTimeZone({ locale });

  return {
    title: t('name'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone,
    },
  };
}

export default async function LocaleLayout({ children, params }: ILocaleLayout) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicons/favicon-16x16.png' />
        <link rel='mask-icon' href='/favicons/safari-pinned-tab.svg' color='#f9f9f9' />
        <link rel='shortcut icon' href='/favicons/favicon.ico' />
        <meta name='msapplication-TileColor' content='#f9f9f9' />
        <meta name='msapplication-config' content='/favicons/browserconfig.xml' />
        <meta name='theme-color' content='#f9f9f9' />
      </head>

      <motion.body
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          scale: { type: 'spring', visualDuration: 0.5, bounce: 0.5 },
        }}
        cz-shortcut-listen='true'
        className={`${inter.variable} bg-background relative flex h-full min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </motion.body>
    </html>
  );
}
