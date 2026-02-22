# Layouts, Themes & Showcase Design

**Date:** 2026-02-21
**Status:** Approved
**Scope:** Theme system, layout presets, /showcase route, CLI updates

## Context

The onelib monorepo has 51 components, a working CLI (`pnpm create @banavasi/onelib`), and 6 curated skills. But layouts, themes, and template variants are stubs — schemas exist but no implementations.

**Target audience:** Internal OneOrigin team standardizing new client projects.
**Project types:** SaaS dashboards, marketing sites, e-commerce, blogs, auth-heavy apps, docs, portfolios — all of them.
**Key requirement:** Each client gets custom branding, so themes must be easy to swap.

## Architecture

Three independent systems that compose, plus a built-in dev showcase:

```
Base Template (always)
  + Theme overlay (CSS variables + Tailwind tokens)
  + Layout overlay (structural components + route groups + starter pages)
  + Showcase route (dev-only /showcase with gallery, theme preview, etc.)
```

Any layout works with any theme — they're orthogonal.

## 1. Theme System

**Package:** `packages/themes/` (new, `@banavasi/themes`)

### Structure

```
packages/themes/
├── src/
│   ├── presets/
│   │   ├── neutral/
│   │   │   ├── theme.css       ← CSS variables (light + dark)
│   │   │   └── meta.json       ← name, description, preview colors
│   │   ├── vibrant/
│   │   │   ├── theme.css
│   │   │   └── meta.json
│   │   └── corporate/
│   │       ├── theme.css
│   │       └── meta.json
│   ├── index.ts                ← exports preset list + utilities
│   └── tailwind.ts             ← Tailwind theme extension helper
└── package.json
```

### CSS Variables (shadcn-compatible)

Each `theme.css` defines variables in HSL format for both light and dark modes:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --destructive: 0 84.2% 60.2%;
    --accent: 240 4.8% 95.9%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-border: 220 13% 91%;
    --sidebar-accent: 240 4.8% 95.9%;
  }
  .dark { /* dark mode overrides */ }
}
```

### Presets

| Preset | Vibe | Use case |
|--------|------|----------|
| `neutral` | Clean grays, minimal | Default starting point |
| `vibrant` | Bold primary, saturated accents | Consumer apps, startups |
| `corporate` | Navy/slate, conservative | Enterprise, finance |

### Scaffolding integration

1. Selected theme's `theme.css` → `src/styles/theme.css`
2. `globals.css` imports: `@import "./theme.css"; @import "tailwindcss";`
3. Developer owns the file after scaffolding — edit directly to rebrand

### Add-later command

```bash
npx @banavasi/onelib add theme vibrant
```

Replaces `src/styles/theme.css` with the new preset.

## 2. Layout System

**Package:** `packages/layouts/` (existing, currently empty)

### Structure per layout

```
packages/layouts/src/presets/<name>/
├── meta.json                   ← name, slots, requiredComponents, pages
├── components/                 ← structural components (sidebar, header, etc.)
├── routes/                     ← Next.js route groups + starter pages
└── root-layout.tsx             ← modified root layout.tsx
```

### 8 Layouts

| Layout | Components | Starter Pages | Required UI Components |
|--------|-----------|---------------|----------------------|
| `dashboard` | Sidebar, Header, Breadcrumbs, MobileNav | Home (stats), Settings, Analytics, Login, Signup | button, card, avatar, dropdown-menu, sheet, breadcrumb, skeleton |
| `marketing` | Navbar, Footer, MobileMenu, Hero | Landing, About, Pricing, Contact | button, card, badge, separator |
| `ecommerce` | TopNav, CartSheet, CategorySidebar, ProductGrid | Store Home, Product Detail, Cart, Checkout | button, card, badge, sheet, input, separator, skeleton |
| `blog` | BlogHeader, BlogSidebar, ArticleLayout | Blog Index, Article Page, Category Page | card, badge, separator, avatar |
| `auth` | AuthCard, SocialButtons, AuthHeader | Login, Signup, Forgot Password, Reset Password | button, card, input, label, separator |
| `docs` | DocsSidebar, DocsHeader, TableOfContents, PageOutline | Docs Home, Getting Started, API Reference | button, separator, badge, breadcrumb |
| `portfolio` | PortfolioNav, ProjectCard, TeamGrid, ContactSection | Home, Projects, Team, Contact | button, card, badge, avatar |
| `blank` | _(none)_ | Single empty page | button |

### meta.json example (dashboard)

```json
{
  "name": "dashboard",
  "displayName": "SaaS Dashboard",
  "description": "Sidebar navigation with collapsible menu, top header, and starter pages",
  "category": "dashboard",
  "slots": ["sidebar", "header", "main", "footer"],
  "requiredComponents": [
    "button", "card", "avatar", "dropdown-menu",
    "sheet", "breadcrumb", "separator", "skeleton"
  ],
  "pages": [
    { "path": "(dashboard)/page.tsx", "name": "Dashboard Home" },
    { "path": "(dashboard)/settings/page.tsx", "name": "Settings" },
    { "path": "(dashboard)/analytics/page.tsx", "name": "Analytics" },
    { "path": "(auth)/login/page.tsx", "name": "Login" },
    { "path": "(auth)/signup/page.tsx", "name": "Sign Up" }
  ]
}
```

### Scaffolding flow

1. Base template copied (as today)
2. Layout components → `src/components/layout/`
3. Layout routes → `src/app/` (route groups overlay on base)
4. Root `layout.tsx` replaced with layout's version
5. Only `requiredComponents` + base components installed (not all 51)
6. Showcase route added

### Add-later command

```bash
npx @banavasi/onelib add layout marketing
```

## 3. Showcase Route (`/showcase`)

A dev-only route built into every scaffolded project. Lightweight Storybook alternative.

### Routes

```
src/app/showcase/
├── layout.tsx              ← clean minimal layout
├── page.tsx                ← overview dashboard
├── components/page.tsx     ← component gallery (grouped by category, live previews)
├── pages/page.tsx          ← page directory (all routes with links)
├── theme/page.tsx          ← theme token preview (color swatches, typography, spacing)
├── layout-info/page.tsx    ← layout structure diagram
└── skills/page.tsx         ← installed skills list
```

### Pages

**Overview (`/showcase`)** — Project name, layout, theme, stats (X components, Y pages, Z skills), links to sub-pages.

**Component Gallery (`/showcase/components`)** — Reads `.onelib/components.lock`. Groups by category. Live rendered examples. Light/dark toggle. Shows name, source, import path.

**Page Directory (`/showcase/pages`)** — Scans `src/app/` for `page.tsx` files. Lists route paths with navigation links. Groups by route group. Indicates layout-provided vs custom pages.

**Theme Preview (`/showcase/theme`)** — All CSS variables rendered as color swatches. Typography scale. Spacing scale. Border radius. Side-by-side light/dark.

**Layout Overview (`/showcase/layout-info`)** — Visual slot diagram. Layout component file paths. Required vs optional slots.

**Skills (`/showcase/skills`)** — Reads `.agents/` and `.agent/`. Parses `SKILL.md` for name/description. Shows source repo.

### Production protection

```ts
// next.config.ts
async redirects() {
  if (process.env.NODE_ENV === 'production') {
    return [{
      source: '/showcase/:path*',
      destination: '/',
      permanent: false,
    }]
  }
  return []
}
```

## 4. CLI Updates

### Interactive scaffolding (default)

```
$ pnpm create @banavasi/onelib

  ? Project name: my-saas-app
  ? Choose a layout: Dashboard — Sidebar + header, for SaaS/admin
  ? Choose a theme: Neutral — Clean grays, minimal
  ? Install curated AI skills? Yes

  ✔ Layout: dashboard (5 pages, 7 components)
  ✔ Theme: neutral (light + dark mode)
  ✔ Components: 12 installed
  ✔ Skills: 6 repos installed
  ✔ Git initialized

  → cd my-saas-app && pnpm dev
  → Visit /showcase for component gallery
```

### CLI flags

```bash
pnpm create @banavasi/onelib my-app --layout dashboard --theme neutral --no-skills
```

### Add-later commands

```bash
npx @banavasi/onelib add layout marketing
npx @banavasi/onelib add theme vibrant
npx @banavasi/onelib add component card button avatar
```

## 5. Component Installation Change

Currently: all 51 components installed unconditionally.

New behavior:
- **Base components** (button, card, input, label) — always installed
- **Layout required components** — installed per layout's `requiredComponents`
- **Remaining components** — available via `onelib add component <name>`

## Package Changes Summary

| Package | Change |
|---------|--------|
| `@banavasi/themes` | **New package** — theme presets, CSS variables, Tailwind helper |
| `@banavasi/layouts` | **Populated** — 8 layout presets with components + routes + starter pages |
| `@banavasi/create-onelib` | **Updated** — layout/theme prompts, flags, selective component install |
| `@banavasi/components` | **Updated** — selective install based on layout requirements |
| `@banavasi/templates` | **Updated** — showcase route added to base template |
| `@banavasi/onelib` | **Updated** — `OnelibConfig` type extended with layout field |
| `@banavasi/scripts` | **Updated** — `add layout`, `add theme` commands |
| `@banavasi/registry` | **Updated** — `ThemeSchema`, populated layout/skill data |

## Implementation Order

1. **Theme system** — foundation everything else builds on
2. **Layout system** — structural components + routes + meta.json
3. **CLI updates** — prompts, flags, selective component install
4. **Showcase route** — built into scaffolded projects
5. **Add-later commands** — `onelib add layout/theme`
6. **Testing + verification** — end-to-end scaffold test
7. **Publish v0.2.0**
