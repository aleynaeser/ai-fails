import { Metadata } from 'next';
import * as motion from 'motion/react-client';
import Header from '@components/shared/Header';
import { Anonymous_Pro } from 'next/font/google';
import { QueryProvider } from '@/common/providers/QueryProvider';
import { createClient } from '@lib/supabase/server';
import { getFails } from '@lib/supabase/queries/fails';
import { getFailCategories } from '@lib/supabase/queries/categories';

import '@styles/globals.css';

export const anonymousPro = Anonymous_Pro({
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'AI Fails',
    description: 'AI Fails is a collection of AI fails and violations submit fails to the collection.',
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const categories = await getFailCategories(supabase);

  return (
    <html lang='en'>
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
        className={`${anonymousPro.className} bg-background relative h-full antialiased`}
      >
        <QueryProvider>
          <Header categories={categories} />
          {children}
        </QueryProvider>
      </motion.body>
    </html>
  );
}
