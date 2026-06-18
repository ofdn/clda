#### clda
Website to house Community language documentation and archiving (CLDA) training materials written using [Hugo Static Site Generator](https://gohugo.io) and [Hugo DocDock Theme](https://docdock.netlify.app).

### How to contribute ?

[Install Hugo](https://gohugo.io/getting-started/installing/) on your computer. And then checkout the source code and theme submodule.

```
$ git clone https://github.com/ofdn/clda.git
$ cd clda
$ git submodule init
$ git submodule update
$ hugo server
$ firefox http://localhost:1313

```

### Documentation

Please check out [Hugo Documentation](https://gohugo.io/getting-started/) and [Hugo DocDock Theme](https://docdock.netlify.app) for detailed instructions.

In this respository we extensively use the [Hugo Reveal.Js Shortcodes](https://docdock.netlify.app/shortcodes/revealjs/) for displaying the slide decks.

### Deployment

TODO #1 Github action for deploying to gh-pages branch.
