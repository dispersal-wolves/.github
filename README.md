# Dispersal Wolves organization profile

This repository owns the public organization profile and the canonical Dispersal Wolves identity.

- `profile/README.md` is rendered on the GitHub organization Overview page.
- `docs/brand/` contains the generated raster source, cleaned vector trace, wordmark, palette, avatar, favicon, and social preview.
- `docs/banners/` contains generated repository banners.
- `tools/sync-banners.mjs` regenerates and copies banners into sibling repository clones.

## Refresh repository banners

Clone the ten tool repositories as siblings of this `.github` repository, then run:

```console
node tools/sync-banners.mjs --apply
```

Without `--apply`, the command regenerates `docs/field-banner.svg` and `docs/banners/`. With it, each repository banner is also copied to `../<repository>/docs/banner.svg` for a normal versioned branding commit. The command checks that every sibling clone has a `docs/` folder first and writes nothing if one is missing.

## Rebuild the walking-wolf trace

The selected source artwork is kept at `docs/brand/wolf-source.png`. Rebuild the vector and export package with:

```console
python tools/vectorize_wolf.py docs/brand/wolf-source.png docs/brand
```

Review the silhouette at its intended minimum size before replacing the canonical mark.
