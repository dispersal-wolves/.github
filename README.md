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

Without `--apply`, the command only regenerates `docs/banners/`. With it, each generated SVG is copied to `../<repository>/docs/banner.svg` for a normal versioned branding commit.

## Rebuild the walking-wolf trace

The selected source artwork is kept at `docs/brand/wolf-source.png`. Rebuild the vector and export package with:

```console
python tools/vectorize_wolf.py docs/brand/wolf-source.png docs/brand
```

The social preview PNG is drawn with Georgia and Arial. The script looks for them in the usual Windows, macOS and Linux font folders; pass `--serif-font` and `--sans-font` with `.ttf` paths if they live elsewhere.

Review the silhouette at its intended minimum size before replacing the canonical mark.
