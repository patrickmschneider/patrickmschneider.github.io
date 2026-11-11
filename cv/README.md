# CV source

This directory holds the LaTeX source for the CV published at
`/files/cv.pdf` on the website.

## Expected layout

```text
cv/
├── cv.tex              # main document
├── references.bib      # optional bibliography
├── assets/             # images, logos, and other included files
├── *.cls / *.sty       # any custom class or package files
└── build/              # generated locally; ignored by Git
```

The main document is `cv.tex`. Keep any files it includes alongside it or in
`assets/`, and commit those sources with the website. Do not edit files under
`generated/`; the build recreates them from the website data.

The website data is the source of truth for shared content:

- `src/data/profile.yaml` supplies the CV header and current position;
- `src/data/papers.yaml` supplies publications, working papers, and earlier work.

Edit those YAML files to update both the website and CV. CV-only material such
as education, teaching, awards, and other experience remains in `cv/cv.tex`.

The deployment workflow now:

1. generate LaTeX fragments from the shared YAML data;
2. compile `cv/cv.tex` with pdfLaTeX via `latexmk`;
3. write the generated document to `public/files/cv.pdf`; and
4. build and deploy the website as usual.

To compile locally, run:

```sh
npm run build:cv
```

`npm run build:all` also compiles the CV before building the site and its
design previews. Generated LaTeX files stay under the ignored `cv/build/`
directory.

This repository is public. Remove private comments, unused personal details,
credentials, and other information from the source before committing it.
