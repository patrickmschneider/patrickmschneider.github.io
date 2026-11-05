// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Design previews: `THEME=a npm run build` builds the site under /preview-a/ into dist/preview-a.
// The deploy workflow builds the live site and each preview, then merges them.
const theme = process.env.THEME ?? '';
const preview = theme !== '';

export default defineConfig({
  // Canonical address used for link previews and search engines.
  site: 'https://www.patrickmschneider.com',
  base: preview ? `/preview-${theme}` : '/',
  outDir: preview ? `dist/preview-${theme}` : 'dist',
  trailingSlash: 'ignore',
  vite: {
    define: { 'import.meta.env.THEME': JSON.stringify(theme) },
    // `@theme/…` points at the folder for the design being built (src/themes/site for the live site).
    resolve: { alias: { '@theme': fileURLToPath(new URL(`./src/themes/${theme || 'site'}`, import.meta.url)) } },
  },

  // Keep old Google Sites URLs working (live site only).
  redirects: preview
    ? {}
    : {
        '/home': '/',
        '/macro-conference-tracker': '/macro-conferences/',
      },
});
