import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sidho-Kanho Agriculture and Forest Produce State Co-operative Federation Ltd. (SIDHKOFED)',
    short_name: 'SIDHKOFED',
    description:
      'Official website of SIDHKOFED, the State-level apex cooperative federation for agriculture and minor forest produce in Jharkhand.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#083D5E',
    icons: [{ src: '/favicon.png', sizes: '200x200', type: 'image/png' }],
  };
}
