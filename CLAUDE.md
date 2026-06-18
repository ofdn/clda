# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup after cloning
git submodule update --init --recursive

# Start dev server (auto-reloads on file changes)
hugo server

# Production build (output goes to public/)
hugo

# Production build with minification
hugo --minify
```

`public/` is not committed — it is generated at build time (and deployed via the `gh-pages` GitHub Actions workflow on every push to `main`).

## Architecture

This is a [Hugo](https://gohugo.io) static site using the [DocDock theme](https://docdock.netlify.app) (a git submodule at `themes/docdock/`). The site is the CLDA (Community Language Documentation and Archiving) training course by OpenSpeaks.

### Content structure

```
content/
  _index.md                  # site home — Data Literacy Training Course overview
  _footer.md                 # footer rendered on every page
  credits.md                 # credits page (linked from sidebar shortcut)
  contribute.md              # contributor guide (linked from sidebar shortcut)
  workshop-series-1/         # OpenSpeaks Workshop Series 1 landing page
  Module_1/                  # Planning before documenting
  Module_2/                  # Consent, ethics and payment
  Module_3/                  # How to record clear audio and video
  Module_4/                  # How to manage files safely and processing audio and video
  Module_5/                  # How to edit audio and video for sharing
  Module_6/                  # How to prepare media and metadata for Wikimedia Commons
  Module_7/                  # How to share materials with archives, libraries, and communities
  Module_8/                  # Glossary
  Module_9/                  # Annexure 1: Text Style Guide
  Module_10/                 # Annexure: Oral Knowledge
```

Each content file uses TOML front matter. `weight` controls sidebar order (lower = first). `alwaysopen = true` on a section `_index.md` expands it by default in the nav.

Slide decks use the `revealjs` shortcode from DocDock. Slides are separated by `---` (horizontal) or `___` (vertical). Static images referenced in slides live in `static/` and are served at the root path (e.g. `![alt](/image.png)`).

### Configuration

`config.toml` is the Hugo config file (not `hugo.toml`). Key settings:

- `editURL` — set to `https://github.com/ofdn/clda/edit/main/content/` to render an "Edit this page" link on every content page via DocDock's built-in support.
- `[minify] disableHTML = true` — required to prevent build failures with the quizdown shortcode.

### Theme customization

**Never edit files inside `themes/docdock/`** — it is a submodule. To override a theme template, copy the file to the same relative path under the project's `layouts/` directory.

Current overrides:

- `layouts/partials/header.html` — replaces `.Site.Pages` with `.Site.RegularPages` to fix a nil-pointer crash on virtual pages (Hugo v0.124+).
- `layouts/partials/flex/body-aftercontent.html` — same `.Site.RegularPages` fix, plus wraps the `editURL` link in `{{ with .File }}` so it is skipped on virtual pages (404, taxonomy) that have no `File` object.
- `layouts/partials/custom-head.html` — loads quizdown JS from CDN.

### Plugins

The `quizdown` shortcode (`layouts/shortcodes/quizdown.html`) enables interactive quizzes. Usage:

```markdown
{{< quizdown >}}
## Question text

- [ ] Wrong answer
- [x] Correct answer
{{< /quizdown >}}
```

When showing shortcode syntax in a code block (e.g. in documentation), escape it with `{{</* ... */>}}` to prevent Hugo from executing it.

### Deployment

GitHub Actions (`.github/workflows/gh-pages.yml`) builds the site with `hugo --minify` on every push to `main` and publishes `public/` to the `gh-pages` branch using the `Deploy` repository secret.
