# CLDA — Community Language Documentation and Archiving Training

Training materials for recording and archiving Adivasi, Tribal, and mother tongue languages. Built with [Hugo](https://gohugo.io) and the [DocDock theme](https://docdock.netlify.app). Organised by [OpenSpeaks](https://openspeaks.wikiversity.org).

## Modules

| # | Title |
|---|-------|
| 1 | Planning before documenting |
| 2 | Consent, ethics and payment |
| 3 | How to record clear audio and video |
| 4 | How to manage files safely and processing audio and video |
| 5 | How to edit audio and video for sharing |
| 6 | How to prepare media and metadata for Wikimedia Commons |
| 7 | How to share materials with archives, libraries, and communities |
| 8 | Glossary |
| 9 | Annexure 1: Text Style Guide |
| 10 | Annexure: Oral Knowledge |

## Local setup

Requires [Hugo](https://gohugo.io/getting-started/installing/) v0.124+ and [Node.js](https://nodejs.org/) 18+.

```bash
git clone https://github.com/ofdn/clda.git
cd clda
git submodule update --init --recursive
npm install
hugo server
# open http://localhost:1313
```

## Build

```bash
hugo --minify
# output → public/
```

## Suggest a change

Every page has an **Edit this page** button that opens the file in GitHub's web editor. To submit a suggestion without a GitHub account, use the form at `/suggest/` — it creates a pull request via a Netlify Function backed by a GitHub token.

## Contributing

See [content/contribute.md](content/contribute.md) for a full guide covering:

- Local setup and theme submodule
- Hugo v0.124+ compatibility fixes
- Adding content and slide decks (RevealJS)
- Interactive quizzes (quizdown)
- Localisation (French and Hindi)
- Visual CMS options (Decap CMS, TinaCMS)

## Deployment

Pushes to `main` trigger a GitHub Actions workflow (`.github/workflows/gh-pages.yml`) that builds with `hugo --minify` and publishes to the `gh-pages` branch. The site is served at `https://ofdn.github.io/clda/`.

Alternatively, connect the repo to [Netlify](https://netlify.com) — `netlify.toml` is already configured.

## Tech stack

| Component | Details |
|---|---|
| Static site generator | Hugo v0.133.0 |
| Theme | DocDock (git submodule at `themes/docdock/`) |
| Slide decks | RevealJS via DocDock shortcode |
| Quizzes | quizdown via `layouts/shortcodes/quizdown.html` |
| Languages | English · Français · हिन्दी |
| PR submissions | Netlify Function + Octokit (`netlify/functions/submit-pr.js`) |
| CI/CD | GitHub Actions → `gh-pages` branch |
