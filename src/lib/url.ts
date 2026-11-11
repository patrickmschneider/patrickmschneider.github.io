// Internal page links go through `page()` so the same code works at the site root
// and inside a design preview built under /preview-a/ etc. (see astro.config.mjs).
// Files (/files/…, /images/…) and tool apps (/fiscal-space/ …) always live at the
// site root, so they are NOT passed through this.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const page = (path: string) => base + path;

/** Which design is being built, including the live theme. */
export const theme: string = import.meta.env.THEME ?? '';
export const isPreview = base !== '';
