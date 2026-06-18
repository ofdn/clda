# Contributing to the Data Literacy Training Course

This guide walks through setting up the project from scratch on a new machine.

## Prerequisites

Install [Hugo](https://gohugo.io/getting-started/installing/) (extended edition recommended). The project has been tested with Hugo v0.133.0.

On Ubuntu/Debian:
```bash
sudo snap install hugo
```

On macOS:
```bash
brew install hugo
```

Verify the installation:
```bash
hugo version
```

## 1. Clone the repository

```bash
git clone https://github.com/ofdn/clda.git
cd clda
```

## 2. Initialize the theme submodule

The site uses the [DocDock theme](https://docdock.netlify.app/getting-start/installation/) as a git submodule. After cloning, the `themes/docdock/` directory will be empty until you run:

```bash
git submodule update --init --recursive
```

This clones the theme into `themes/docdock/`. Without this step Hugo will fail with:

```
template for shortcode "revealjs" not found
```

### Setting up DocDock on a brand new Hugo site

If you are starting a new site from scratch rather than cloning this repository, follow these steps from the [DocDock installation guide](https://docdock.netlify.app/getting-start/installation/):

```bash
hugo new site mysite
cd mysite
git init

# Add DocDock as a submodule (recommended for CI/CD platforms like Netlify)
git submodule add https://github.com/vjeantet/hugo-theme-docdock.git themes/docdock
git submodule init
git submodule update
```

Then set the theme in `config.toml`:

```toml
theme = "docdock"
```

> **Note:** Never edit files inside `themes/docdock/` directly. Override templates by placing files with the same relative path under the project's `layouts/` directory (see section 3 below for an example of this pattern).

## 3. Fix Hugo compatibility issues

Hugo v0.124+ includes virtual pages (home, 404, taxonomy terms) in `.Site.Pages`. The DocDock theme queries `.Site.Pages` by `File.BaseFileName`, but virtual pages have no `File` object, causing a nil pointer dereference at build time.

The fix is already committed in this repository as two partial overrides under `layouts/partials/` that replace `.Site.Pages` with `.Site.RegularPages` (which only contains content pages that always have a `File` object):

- `layouts/partials/header.html` — fixes the header lookup
- `layouts/partials/flex/body-aftercontent.html` — fixes the footer lookup

These files override the equivalent theme templates without modifying the submodule, so upstream theme updates remain clean to pull in.

If you ever need to recreate these overrides manually:

**`layouts/partials/header.html`** — change line 2 from:
```
{{ range where .Site.Pages "File.BaseFileName" $header }}
```
to:
```
{{ range where .Site.RegularPages "File.BaseFileName" $header }}
```

**`layouts/partials/flex/body-aftercontent.html`** — change line 42 from:
```
{{ range where .Site.Pages "File.BaseFileName" $footer }}
```
to:
```
{{ range where .Site.RegularPages "File.BaseFileName" $footer }}
```

## 4. Start the development server

```bash
hugo server
```

Then open [http://localhost:1313](http://localhost:1313) in your browser. Hugo watches for file changes and reloads automatically.

## 5. Adding content

Content lives in the `content/` directory, organised by module:

```
content/
  Module_1/
  Module_2/
  Module_3/
  Module_4/
```

Each page is a Markdown file with TOML front matter:

```toml
+++
title = "Page Title"
description = ""
weight = "10"
alwayopen = false
+++
```

`weight` controls the order pages appear in the sidebar (lower numbers appear first).

### Adding a slide deck

Slide decks use the [RevealJS shortcode](https://docdock.netlify.app/shortcodes/revealjs/) provided by the DocDock theme:

```markdown
{{<revealjs theme="moon" progress="true" controls="true">}}

## Slide One

---

## Slide Two

* Bullet point

{{</revealjs>}}
```

Separate slides with `---` (horizontal) or `___` (vertical).

## 6. Plugins

### hugo-quiz (quizdown)

[hugo-quiz](https://github.com/bonartm/hugo-quiz) adds interactive quizzes to pages using the [quizdown](https://github.com/bonartm/quizdown-js) library. It supports multiple-choice, single-choice, and sequence questions with optional hints and answer shuffling.

#### Installation

**Step 1** — Copy the shortcode into the project's local shortcodes directory:

```bash
# create the directory if it doesn't exist
mkdir -p layouts/shortcodes

# copy quizdown.html from the hugo-quiz demo into your project
# (download from https://github.com/bonartm/hugo-quiz/blob/main/demo/layouts/shortcodes/quizdown.html)
cp quizdown.html layouts/shortcodes/quizdown.html
```

**Step 2** — Add the quizdown JS library to the site `<head>`. Create or edit `layouts/partials/custom-head.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/quizdown@latest/public/build/quizdown.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quizdown@latest/public/build/extensions/quizdownKatex.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quizdown@latest/public/build/extensions/quizdownHighlight.js"></script>
<script>quizdown.register(quizdownHighlight).register(quizdownKatex).init()</script>
```

**Step 3** — Disable HTML minification in `config.toml` to prevent build issues:

```toml
[minify]
  disableHTML = true
```

#### Usage

Add a quiz to any content page using the `quizdown` shortcode:

```markdown
{{< quizdown >}}
---
primary_color: orange
secondary_color: lightgray
text_color: black
shuffle_questions: false
---

## What file format stores tabular data as plain text?

- [ ] PDF
- [x] CSV
- [ ] DOCX
- [ ] PNG

## Which of these are open data formats? (select all that apply)

- [x] CSV
- [x] JSON
- [ ] XLS
- [x] XML

{{< /quizdown >}}
```

Mark the correct answer(s) with `[x]` and wrong answers with `[ ]`. Add an optional hint below any question with `> hint text`.

## 7. Editing content via pull requests

Non-technical contributors can edit content without touching the command line using a git-backed CMS. Changes are submitted as pull requests to the repository.

### Option A: GitHub edit link (simplest)

The DocDock theme has built-in support for a per-page edit link. Set `editURL` in `config.toml` to the GitHub path for your content directory:

```toml
editURL = "https://github.com/arky/dataliteracycourse/edit/main/content/"
```

Each page will show an "Edit this page" link. Clicking it opens the file in GitHub's web editor — GitHub automatically forks the repo and offers to open a pull request for anyone without direct write access.

### Option B: Decap CMS (visual editor)

[Decap CMS](https://decapcms.org/docs/hugo/) (formerly Netlify CMS) adds a `/admin` visual editor to the site. Editors log in with GitHub, write in a rich Markdown editor, and submit changes as pull requests without ever seeing raw files.

**Setup requires two files in `static/admin/`:**

`static/admin/index.html`:
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Content Manager</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

`static/admin/config.yml`:
```yaml
backend:
  name: git-gateway
  branch: main

media_folder: static/images
public_folder: /images

collections:
  - name: module_1
    label: Module 1
    folder: content/Module_1
    create: true
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Weight, name: weight, widget: string }
      - { label: Body, name: body, widget: markdown }
```

Then enable **Netlify Identity** and **Git Gateway** in your Netlify site dashboard (Configuration → Identity → Enable, then Services → Git Gateway → Enable).

### Similar alternatives

| Tool | Free | Self-hostable | Notes |
|---|---|---|---|
| [Sveltia CMS](https://github.com/sveltia/sveltia-cms) | Yes | Yes | Modern rewrite of Decap CMS; reuses existing Decap config |
| [Static CMS](https://www.staticcms.org/) | Yes | Yes | Community fork of Decap CMS with ongoing development |
| [TinaCMS](https://tina.io/) | Free tier | Yes | Visual editing with live preview; requires a Tina Cloud account |
| [CloudCannon](https://cloudcannon.com/) | No ($55/mo) | No | Most polished UI; Hugo support is first-class |

**Recommendation for this project:** Start with the GitHub edit link (Option A) — zero setup and works immediately. Add Sveltia CMS or Decap CMS if contributors need a visual editor.

## 8. Build for production

```bash
hugo
```

Output is written to `public/`. The `public/` directory is not committed to the repository.

## References

- [Hugo Documentation](https://gohugo.io/getting-started/)
- [DocDock Theme](https://docdock.netlify.app)
- [DocDock Installation Guide](https://docdock.netlify.app/getting-start/installation/)
- [RevealJS Shortcode](https://docdock.netlify.app/shortcodes/revealjs/)
- [hugo-quiz (quizdown)](https://github.com/bonartm/hugo-quiz)
- [Decap CMS + Hugo](https://decapcms.org/docs/hugo/)
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
- [Static CMS](https://www.staticcms.org/)
- [TinaCMS](https://tina.io/)
