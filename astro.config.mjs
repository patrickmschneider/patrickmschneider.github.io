// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.patrickmschneider.com',
  trailingSlash: 'ignore',

  // Keep old Google Sites URLs working.
  redirects: {
    '/home': '/',
    '/macro-conference-tracker': '/macro-conferences/',
  },
});
