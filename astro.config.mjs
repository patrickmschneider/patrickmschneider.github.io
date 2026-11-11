// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Design previews: `THEME=a npm run build` builds the site under /preview-a/ into dist/preview-a.
// The deploy workflow builds the live site and each preview, then merges them.
const requestedTheme = process.env.THEME ?? '';
const preview = requestedTheme !== '';
const theme = requestedTheme || 'editorial';

export default defineConfig({
  // Canonical address used for link previews and search engines.
  site: 'https://www.patrickmschneider.com',
  base: preview ? `/preview-${requestedTheme}` : '/',
  outDir: preview ? `dist/preview-${requestedTheme}` : 'dist',
  trailingSlash: 'ignore',
  vite: {
    define: { 'import.meta.env.THEME': JSON.stringify(theme) },
    // `@theme/…` points at the live design, or at a requested preview theme.
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
