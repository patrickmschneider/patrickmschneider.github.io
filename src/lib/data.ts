// Loads and validates the YAML files in src/data at build time.
// A typo in a YAML file (e.g. a misspelled field) fails the build with a clear message,
// so a broken page never gets deployed.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), url: z.string(), primary: z.boolean().default(false) }).strict();

const profileSchema = z
  .object({
    name: z.string(),
    position: z.string(),
    position_start: z.number(),
    affiliation: z.string(),
    affiliation_url: z.string().optional(),
    department: z.string(),
    address: z.string().optional(),
    photo: z.string(),
    description: z.string(),
    statement: z.string().optional(),
    bio: z.array(z.string()),
    email: z.string(),
    cv: z.string().optional(),
    links: z.array(link),
  })
  .strict();

const coauthor = z.union([
  z.string(),
  z.object({ name: z.string(), url: z.string().optional() }).strict(),
]);

const paperSchema = z
  .object({
    section: z.enum(['working', 'published', 'prephd']),
    title: z.string(),
    url: z.string().optional(),
    year: z.number().optional(),
    status: z.enum(['working', 'forthcoming', 'published']).optional(),
    journal: z.string().optional(),
    image: z.string().optional(),
    teaser: z.string().optional(),
    coauthors: z.array(coauthor).default([]),
    venue: z.string().optional(),
    note: z.string().optional(),
    links: z.array(link).default([]),
    coverage: z.array(link).default([]),
    abstract: z.string().optional(),
    featured: z.boolean().default(false),
  })
  .strict();

const teachingSchema = z.array(
  z
    .object({
      institution: z.string(),
      courses: z.array(
        z
          .object({
            code: z.string().optional(),
            title: z.string(),
            level: z.string().optional(),
            years: z.string().optional(),
          })
          .strict(),
      ),
    })
    .strict(),
);

const toolsSchema = z
  .object({
    intro: z.string().optional(),
    hero_before: z.string().default('I also build small public tools like'),
    hero_after: z.string().default('.'),
    tools: z.array(
      z
        .object({
          title: z.string(),
          description: z.string(),
          url: z.string().optional(),
          image: z.string().optional(),
          source: z.string().optional(),
          /** list this tool in the home-page "I also build…" line */
          hero: z.boolean().default(true),
        })
        .strict(),
    ),
  })
  .strict();

const newsSchema = z
  .object({
    news: z.array(z.object({ date: z.string(), text: z.string() }).strict()).default([]),
  })
  .strict();

function load<T extends z.ZodType>(file: string, schema: T): z.infer<T> {
  const raw = parse(readFileSync(join(process.cwd(), 'src/data', file), 'utf-8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Problem in src/data/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const profile = load('profile.yaml', profileSchema);
// Newest first within each section (stable, so equal years keep their file order).
export const papers = load('papers.yaml', z.array(paperSchema)).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
export const teaching = load('teaching.yaml', teachingSchema);
export const tools = load('tools.yaml', toolsSchema);
export const news = load('news.yaml', newsSchema).news;
export const liveTools = tools.tools.filter((t) => t.url);

/** Publication status: explicit `status`, otherwise working papers are 'working' and the rest 'published'. */
export function paperStatus(p: Paper): { kind: 'working' | 'forthcoming' | 'published'; label: string } {
  const kind = p.status ?? (p.section === 'working' ? 'working' : 'published');
  const label = { working: 'Working paper', forthcoming: 'Forthcoming', published: 'Published' }[kind];
  return { kind, label };
}

/** URL-safe id for a paper, used for #anchors. */
export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export type Paper = z.infer<typeof paperSchema>;

export const coauthorName = (c: z.infer<typeof coauthor>) => (typeof c === 'string' ? c : c.name);

/** Join names as "A", "A and B", "A, B, and C". */
export function joinNames(names: string[]): string {
  if (names.length <= 2) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

/** Minimal inline markdown: escapes HTML, then turns [text](url) into links and *text* into emphasis. */
export function inlineMd(text: string): string {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
