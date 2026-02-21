# Component Registry & Scaffold — Design

## Overview

Phase 5 adds the curated component library to the Onelib monorepo. Onelib is a component **aggregator** — it wraps components from 5 source UI libraries into a single, pre-installed collection that ships with every generated project.

### Source Libraries

- **Sera UI** (seraui.com) — shadcn-compatible buttons, accordions, cards, text animations
- **ReactBits** (reactbits.dev) — backgrounds, galleries, navigation
- **Magic UI** (magicui.design) — 150+ animated shadcn companion components
- **Skiper UI** (skiper-ui.com) — uncommon shadcn components
- **Buouu UI** (buouui.com) — TailwindCSS sections and templates

All source libraries use the shadcn-compatible copy-paste pattern (React + Tailwind + Motion/framer-motion).

---

## Section 1 — Architecture Overview

The component system has three layers:

1. **Monorepo (`packages/components/`)** — holds the actual `.tsx` source files, registry metadata, and Storybook stories. This is the single source of truth.
2. **Scaffold (`create-onelib`)** — during project generation, component `.tsx` files are copied into the generated project's `src/components/` directory. All ~80 components are pre-installed.
3. **Update (`onelib:update`)** — pulls new or updated components into existing generated projects, preserving user modifications.

Storybook (`apps/storybook/`) documents every component with live examples for browsing and copy-paste.

Only dependencies required: React, Tailwind CSS, and Motion — all already in the base template.

---

## Section 2 — Component File Structure

Components are organized by category inside `packages/components/src/`:

```
packages/components/
├── src/
│   ├── buttons/
│   │   ├── basic-button/
│   │   │   ├── basic-button.tsx
│   │   │   ├── basic-button.stories.tsx
│   │   │   └── index.ts
│   │   ├── glow-button/
│   │   │   └── ...
│   │   └── index.ts              # Category barrel
│   ├── backgrounds/
│   │   ├── aurora/
│   │   │   └── ...
│   │   └── index.ts
│   ├── text-animations/
│   │   └── ...
│   └── index.ts                  # Root barrel
├── registry.json
├── package.json
└── tsconfig.json
```

### Key decisions

- **Grouped by category** — matches the curated list organization (buttons, backgrounds, text-animations, etc.). Avoids a single directory with 80+ folders.
- **Each component folder has exactly 3 files** — the `.tsx` source, a `.stories.tsx`, and an `index.ts` barrel. Minimal and predictable.
- **`registry.json` at the package root** — single source of truth for all component metadata.
- **During scaffold, only `.tsx` files are copied** — stories and registry metadata stay in the monorepo.

### Component Categories

- **Buttons** — basic, modern, glow, liquid-glass, shimmer
- **Effects** — glow line
- **Accordions** — basic, fancy, gradient
- **Cards** — noise, glitch vault
- **Website Sections** — hero, navbar, testimonial, bento grids, tabs, file tree, marquee, video-text, infinite-grid, orbiting, orbit-carousel, progress, company logo, drawer, orbits, FAQ, fancy-tabs, modal, card-nav
- **Pages** — 404, login, signup
- **Backgrounds** — falling-glitch, background-studio, liquid-ether, prism, dark-veil, light-pillar, silk, floating-lines, light-rays, pixel-blast, color-bends, aurora, plasma, particles, gradient-blinds, grid-scan, pixel-snow, faulty-terminal
- **Text Animations** — text, fuzzy, flipwords, textreveal, decrypting, aurora, ticker, text-highlighter, curved-text
- **Gallery** — dome-gallery, chroma-grid

---

## Section 3 — Registry Entry Schema

The `registry.json` at `packages/components/registry.json` is the manifest the scaffold command reads:

```jsonc
{
  "version": "0.1.0",
  "components": [
    {
      "name": "basic-button",
      "displayName": "Basic Button",
      "category": "buttons",
      "source": "seraui",
      "sourceUrl": "https://seraui.com/docs/buttons/basic",
      "version": "0.1.0",
      "description": "Clean, accessible button with variants",
      "files": ["buttons/basic-button/basic-button.tsx"],
      "dependencies": [],
      "tags": ["button", "interactive", "form"]
    }
  ]
}
```

### Schema fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Kebab-case unique identifier |
| `displayName` | string | Human-readable name |
| `category` | string | Category folder name |
| `source` | enum | Source library (seraui, reactbits, magicui, skiperui, buouui) |
| `sourceUrl` | string | Link to original component documentation |
| `version` | semver | Component version for update tracking |
| `description` | string | Short description of the component |
| `files` | string[] | Paths relative to `src/` — most have one file, complex components may have multiple |
| `dependencies` | string[] | Other Onelib component names this component requires |
| `tags` | string[] | Searchable tags for discoverability |

### Key decisions

- **`source` enum expanded** to include all 5 libraries (existing `@onelib/registry` schemas need updating)
- **`sourceUrl`** enables developers to reference original docs/examples
- **`dependencies`** enables transitive resolution (e.g., a login page depends on basic-button)

---

## Section 4 — Scaffold Command Interface

During `create-onelib` scaffold, all components are copied into the generated project:

```
my-new-project/
├── src/
│   ├── components/
│   │   ├── buttons/
│   │   │   ├── basic-button.tsx
│   │   │   ├── glow-button.tsx
│   │   │   └── ...
│   │   ├── backgrounds/
│   │   │   ├── aurora.tsx
│   │   │   └── ...
│   │   ├── text-animations/
│   │   │   └── ...
│   │   └── index.ts          # Generated barrel export
│   └── ...
```

### Key decisions

- **All ~80 components copied by default** — no cherry-picking. "VibeCoder's Paradise" means everything pre-installed.
- **Flat file per component** in the generated project — no nested `basic-button/` folders. Just `buttons/basic-button.tsx`. Simpler for end users.
- **Generated `index.ts` barrel** — users can `import { BasicButton } from "@/components/buttons"`.
- **No `registry.json` in generated project** — the registry is a monorepo concern.
- **Scaffold function** lives in `tooling/scripts/` or is called directly by `create-onelib` reading from `packages/components/`.

---

## Section 5 — Update Flow for Components

When a user runs `pnpm onelib:update`, the update pipeline handles component updates:

### Mechanism

1. **Fetch latest `registry.json`** from the published `@onelib/components` package (or GitHub raw URL during early development)
2. **Compare versions** against the local `.onelib/components.lock` file
3. **For each outdated component**, check if user has modified the local file via checksum
4. **If unmodified** — overwrite with the new version silently
5. **If modified** — skip and warn: "Skipping basic-button.tsx (locally modified). Run with --force to overwrite."

### Lockfile format (`.onelib/components.lock`)

```jsonc
{
  "version": "0.1.0",
  "components": {
    "basic-button": {
      "version": "0.1.0",
      "checksum": "sha256:abc123...",
      "installedAt": "2026-02-20T12:00:00Z"
    }
  }
}
```

### Key decisions

- **Checksum-based modification detection** — SHA-256 of file contents at install time. Simple and reliable.
- **No git dependency** — works whether or not the project uses git.
- **`--force` flag** to overwrite modified files when the user explicitly wants the latest.
- **New components** added to the registry are automatically installed during update.

---

## Section 6 — Storybook Integration

Storybook lives at `apps/storybook/` and is a monorepo-only concern — generated projects don't ship with Storybook.

### Setup

- Storybook 8.x with React + Vite builder
- Discovers stories from `packages/components/src/**/*.stories.tsx`
- Tailwind CSS + Motion configured in preview
- Category-based sidebar matches folder structure automatically

### Story format

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { BasicButton } from "./basic-button";

const meta: Meta<typeof BasicButton> = {
  title: "Buttons/Basic Button",
  component: BasicButton,
  parameters: {
    docs: {
      description: {
        component: "Clean, accessible button. Source: Sera UI",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BasicButton>;

export const Default: Story = { args: { children: "Click me" } };
export const Variants: Story = { /* showcase all variants */ };
```

### Key decisions

- **`title` matches category/name** — sidebar mirrors folder structure
- **Source attribution in description** — every story notes the upstream library
- **Default + Variants stories** — Default shows simplest usage, Variants showcases all props
- **Storybook setup is a later implementation task** — Phase 5 focuses on the component package and scaffold. Storybook wiring can be a follow-up or a final task within Phase 5.
