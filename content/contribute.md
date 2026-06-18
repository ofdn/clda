+++
title = "Contributing to the Data Literacy Training Course"
description = "A guide to setting up and contributing to the project from scratch."
weight = 20
+++

This guide walks through setting up the project from scratch on a new machine.

## Editing content via "Edit this page"

Every page on this site shows an **Edit this page** link at the bottom. This is the quickest way to fix a typo, update outdated content, or add a paragraph — no local setup required.

### How it works

1. Open the page you want to edit and click **Edit this page** at the bottom.
2. GitHub opens the file in its web editor. If you don't have write access to the repository, GitHub automatically forks the repo into your account.
3. Make your changes in the editor.
4. Scroll to **Commit changes**, write a short description of what you changed, and select **Create a new branch and open a pull request**.
5. Click **Propose changes**. GitHub shows a diff and opens the pull request form.
6. Add a title and description, then click **Create pull request**.

A maintainer reviews the pull request, asks questions if needed, and merges it. The site rebuilds automatically on merge via GitHub Actions.

### What the link points to

The link is constructed from the `editURL` in `config.toml`:

```toml
editURL = "https://github.com/ofdn/clda/edit/main/content/"
```

For a page at `content/Module_1/intro.md` the link becomes:

```
https://github.com/ofdn/clda/edit/main/content/Module_1/intro.md
```

### Tips

- Keep edits focused — one topic per pull request makes review faster.
- The page content is plain Markdown. Headings use `##`, bold uses `**text**`, and links use `[label](url)`.
- Front matter at the top of each file (between `+++` markers) controls the page title and sidebar order — leave it unchanged unless you intend to rename the page.
- If you want to preview your changes locally before opening a pull request, follow the [local setup](#prerequisites) steps below.

## Localisation

Hugo handles multilingual sites through two mechanisms: **content translation** (parallel Markdown files) and **UI string translation** (i18n files).

### Translate content files

For each page you want to translate, create a copy of the Markdown file with the language code inserted before `.md`:

```
content/Module_1/_index.md        ← English (default)
content/Module_1/_index.fr.md     ← French
content/Module_1/_index.hi.md     ← Hindi
```

The front matter title and body text should be fully translated. Hugo automatically links the language variants together and shows a language switcher in the nav.

### Translate UI strings

Create `i18n/fr.toml` and `i18n/hi.toml` alongside the existing `i18n/en.toml` and translate each string:

```toml
# i18n/hi.toml
[Edit-this-page]
other = "इस पृष्ठ को संपादित करें"

[Search-placeholder]
other = "खोजें..."
```

### Test the localised build

```bash
hugo server
# French version: http://localhost:1313/fr/
# Hindi version:  http://localhost:1313/hi/
```

Pages not yet translated fall back to the English version automatically.

