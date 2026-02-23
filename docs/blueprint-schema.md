# Onelib Blueprint Schema (v1)

Use this file format for `onelib-scripts blueprint:apply`.

## Command

```bash
pnpm onelib:blueprint:apply -- --file onelib.blueprint.json
```

## Top-level shape

```json
{
  "$schema": "https://banavasi.dev/onelib/blueprint-v1",
  "name": "CEO Demo Site",
  "rootLayout": "marketing",
  "theme": "neutral",
  "pages": []
}
```

## Fields

- `$schema` (optional): string
- `name` (required): non-empty string
- `rootLayout` (required): one of
  - `blank`
  - `marketing`
  - `dashboard`
  - `ecommerce`
  - `blog`
  - `auth`
  - `docs`
  - `portfolio`
- `theme` (required): one of
  - `default`
  - `neutral`
  - `vibrant`
  - `corporate`
- `pages` (required): non-empty array

## Page object

Each `pages[]` item must be:

```json
{
  "name": "Home",
  "route": "/",
  "layout": "marketing",
  "components": ["hero", "navbar"],
  "title": "Home"
}
```

- `name` (required): non-empty string
- `route` (required): string starting with `/` and unique across pages
- `layout` (required): same allowed values as `rootLayout`
- `components` (required): array of registry component IDs
- `title` (optional): string

## Example blueprint

```json
{
  "$schema": "https://banavasi.dev/onelib/blueprint-v1",
  "name": "CEO Demo Site",
  "rootLayout": "dashboard",
  "theme": "corporate",
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "layout": "marketing",
      "components": ["hero", "navbar", "features-grid"],
      "title": "Welcome"
    },
    {
      "name": "Pricing",
      "route": "/pricing",
      "layout": "marketing",
      "components": ["pricing-card", "faq-accordion"],
      "title": "Plans"
    },
    {
      "name": "Analytics",
      "route": "/analytics",
      "layout": "dashboard",
      "components": ["stats-card", "chart-area"],
      "title": "Executive Overview"
    }
  ]
}
```

## What `blueprint:apply` changes

- Generates route-group layouts and page files under `src/app`
- Scaffolds component files into `src/components`
- Injects theme/layout helper blocks into `src/app/globals.css`
- Updates `onelib.config.ts` (`registry`, `theme`, `layout`)
- Writes audit metadata to `.onelib/blueprint.applied.json`
