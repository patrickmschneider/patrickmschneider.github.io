# patrickmschneider.com

Personal academic website. Built with [Astro](https://astro.build), hosted free on GitHub Pages.
Every push to `main` rebuilds and publishes the site automatically (about a minute).

## Editing content

All content lives in four YAML files in `src/data/`. You rarely need to touch anything else.

| File | What it controls |
|---|---|
| `profile.yaml` | Name, bio, photo, links row on the home page |
| `papers.yaml` | Research page (and the "Featured" paper on the home page) |
| `teaching.yaml` | Teaching page |
| `tools.yaml` | Tools page |

PDFs (CV, papers, appendices, slides) go in `public/files/`. A file at `public/files/cv.pdf` is served at
`patrickmschneider.com/files/cv.pdf`. **To update your CV, overwrite `public/files/cv.pdf` and push.**

### Adding a paper

Copy an existing entry in `src/data/papers.yaml` and edit it:

```yaml
- section: working            # working | published | prephd
  title: My New Paper
  url: /files/my-new-paper.pdf
  coauthors:
    - Jane Doe
  links:
    - { label: Slides, url: /files/my-new-paper-slides.pdf }
  abstract: >-
    One paragraph…
```

If you mistype a field name, the build fails with a message such as `Unrecognized key: "venu"`, and the
live site stays unchanged. You can see the error on the repo's **Actions** tab.

### Editing without a computer

On github.com, open any file in `src/data/`, click the pencil icon, edit, then commit. The site redeploys
by itself.

## Working locally

```sh
npm install      # first time only
npm run dev      # live preview at http://localhost:4321
npm run build    # production build into dist/
```

## Tools

Each tool is its own repo with GitHub Pages turned on (`monetary-space`, `fiscal-space`,
`macro-conferences`). GitHub serves those at `patrickmschneider.com/<repo-name>/` automatically, so this
repo only links to them. Don't create pages here whose names match a tool repo.

## Old URLs

Redirects for the old Google Sites addresses are in `astro.config.mjs` (`/home` and
`/macro-conference-tracker`).

## Design

The look lives in `src/themes/`: `common.css` holds the shared structure and `site/` holds the design
(colours, fonts, home-page layout). Imperial Blue is used only in the top bar.

To try an alternative design without touching the live one, copy `site/` to e.g. `src/themes/x/`, edit it,
and add `x` to `previews.txt`: it is then published at `/preview-x/` (hidden from search engines).
Preview locally with `THEME=x npx astro dev`.

## Images

- `public/images/headshot.jpg` (1600px) and `headshot-860.jpg` are square crops of the studio original.
  The originals live in `images/` (not committed).
- `public/images/thumbs/` holds the figure cards: tool screenshots and recoloured paper figures.
- Tool "Updated" dates are looked up from each tool repo's latest commit when the site builds.
