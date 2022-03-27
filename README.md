# ZD-Publisher

This project is in the initial stages, working towards a simple command-line mechanism that will publish an Obsidian
Vault to a reasonable content website.

## Current State

Uses EJS as a template engine for markdown pages converted to HTML. Currently the default template is not configurable,
but that's our eventual intent.

Recognizes `type: presentation` in markdown metadata as a content hint that the markdown is to be published as a
presentation. Currently uses `pandoc` to convert that content to PowerPoint (PPTX) format. The template used is not
configurable, but that's our eventual intent.

## Installing ZK-Publisher

`npm install -g zk-publisher`

## Running ZK-Publisher

Get a sense of the available options:

`zk-publisher --help`

The simplest usage is:

```bash
zk-publisher -s [Path To My Vault]
```

On MacOS, by default a vault you create called `Main` will likely be found someplace
like `$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Main`.

## Runtime Requirements

You must have the following tools on your path:

- `obsidian-export`
- `pandoc`