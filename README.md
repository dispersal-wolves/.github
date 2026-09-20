# Dispersal Wolves organization profile

This repository owns the public organization profile and the canonical Dispersal Wolves identity.

- `profile/README.md` is rendered on the GitHub organization Overview page.
- `docs/brand/` contains the master icon, wordmark, palette, avatar, favicon, and social preview.
- `docs/banners/` contains generated repository banners.
- `tools/sync-banners.mjs` regenerates and copies banners into sibling repository clones.

## Refresh repository banners

Clone the ten tool repositories as siblings of this `.github` repository, then run:

```console
node tools/sync-banners.mjs --apply
```

Without `--apply`, the command only regenerates `docs/banners/`. With it, each generated SVG is copied to `../<repository>/docs/banner.svg` for a normal versioned branding commit.
