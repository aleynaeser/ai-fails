import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: 'AI Fails',
    short_name: 'AI Fails',
    description: 'AI Fails',
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
