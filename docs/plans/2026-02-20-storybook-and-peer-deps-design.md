# Phase 7: Storybook Stories & Peer Dependency Auto-Install

## 1. Overview

Two features in one phase:

**7a — Storybook 10 stories** for all 8 ported components. Full showcase with interactive controls, variant stories, dark mode toggle, and container decorators. Stories are colocated next to component source files and excluded from scaffold copying (already handled).

**7b — Peer dependency auto-install** during scaffold and update. When components are copied into a generated project, their peer dependencies (ogl, three, etc.) are automatically installed.

## 2. Storybook Setup

### Package: `apps/storybook/`

Currently a stub with `echo 'TODO'` scripts. Becomes a real Storybook 10 app.

### Framework & Dependencies

- **Storybook 10.x** with `@storybook/react-vite` framework
- **CSF Next** format: `defineMain`, `definePreview`, `preview.meta()`, `meta.story()`
- **TailwindCSS v4** via `@tailwindcss/vite` plugin
- **Dark mode** via `@storybook/addon-themes` with `withThemeByClassName`

Dependencies added to `apps/storybook/package.json`:

```
storybook, @storybook/react-vite, @storybook/addon-themes
react, react-dom, @types/react, @types/react-dom
tailwindcss, @tailwindcss/vite
clsx, tailwind-merge, motion
ogl, three, @react-three/fiber, @use-gesture/react
```

### Configuration Files

**`.storybook/main.ts`** — Storybook 10 main config:
- Framework: `@storybook/react-vite`
- Stories glob: `../../../packages/components/src/**/*.stories.tsx`
- `viteFinal` hook to alias `@/` to component source lib dir
- Addon: `@storybook/addon-themes`

**`.storybook/preview.ts`** — Global decorators:
- Import Tailwind CSS
- `addon-themes.withThemeByClassName` for dark/light toggle on `<html>`
- Default dark theme (components designed for dark backgrounds)

**`.storybook/tailwind.css`** — Tailwind entry:
- `@import "tailwindcss"` (v4 syntax)
- `@source "../../../packages/components/src/**/*.tsx"` for class scanning

### Scripts

```json
{
  "dev": "storybook dev -p 6006",
  "build": "storybook build"
}
```

### Turbo Integration

Add `dev` task for storybook in turbo.json (persistent, no cache).

## 3. Story Files

### Location

Colocated: `packages/components/src/{category}/{name}/{name}.stories.tsx`

The scaffold function already filters out `.stories.tsx` files (line 44 of scaffold.ts), so stories never end up in generated projects.

### CSF Next Format

Each story file follows this pattern:

```tsx
import preview from "../../../../apps/storybook/.storybook/preview";
import { ComponentName } from "./component-name";

const meta = preview.meta({
  component: ComponentName,
  title: "Category/ComponentName",
  argTypes: { /* controls */ },
  decorators: [ /* container wrappers */ ],
});

export default meta;

export const Default = meta.story({
  args: { /* default props */ },
});

export const Variant = meta.story({
  args: { /* variant props */ },
});
```

### Per-Component Story Plan

| Component | Category | Stories | Key Controls |
|-----------|----------|---------|-------------|
| basic-button | Buttons | Default, AllVariants, Sizes, Loading, WithIcons, IconOnly | variant (select), size (select), loading (boolean), children (text) |
| shimmer-button | Buttons | Default, CustomText | children (text) |
| fuzzy-text | Text Animations | Default, CustomColor, HighIntensity | text, color, fontSize, baseIntensity, hoverIntensity |
| decrypting-text | Text Animations | Default, SlowDecode, CustomText | targetText, speed, className |
| marquee | Sections | Default, Reversed, Vertical, PauseOnHover, FastSpeed | reverse, pauseOnHover, vertical, speed, repeat |
| aurora | Backgrounds | Default, CustomColors, HighAmplitude | colorStops, amplitude, blend, speed |
| silk | Backgrounds | Default, CustomColor, FastSpeed | speed, scale, color, noiseIntensity, rotation |
| dome-gallery | Gallery | Default | images (placeholder URLs) |

### Decorators

- **Buttons**: Centered flex container with padding
- **Backgrounds**: Fixed-size container (100% width, 500px height, relative positioned)
- **Text Animations**: Dark background container, centered
- **Sections**: Full-width container
- **Gallery**: Fixed-size container (100% width, 600px height)

## 4. Peer Dependency Auto-Install

### Problem

Components like aurora, silk, dome-gallery need packages (ogl, three, @react-three/fiber, @use-gesture/react) that aren't in the base template. Currently, registry.json tracks peerDependencies per component but nothing installs them.

### Solution

**Change `scaffoldComponents()` return type** from `void` to `ScaffoldResult`:

```ts
interface ScaffoldResult {
  componentsInstalled: number;
  peerDependencies: Record<string, string>;
}
```

After copying files, the function reads registry.json, collects all peerDependencies for scaffolded components, deduplicates, and returns them.

**CLI (`create-onelib`) handles the install:**

After receiving `ScaffoldResult`, runs `pnpm add <deps>` in the target project directory. Logs which peer deps are being installed.

**Updater (`updateComponents`) same pattern:**

When new components are added during update, collect their new peer deps and return them in the `UpdateReport`. The CLI (`@onelib/scripts`) handles the install.

### Registry Data (existing)

```json
{
  "name": "aurora",
  "peerDependencies": { "ogl": "^1.0.0" }
}
```

All 4 components with peer deps already have this data in registry.json.

## 5. Out of Scope

- MDX documentation pages (stories-only for now)
- Storybook deployment/hosting
- Visual regression testing
- Additional components beyond the 8 already ported
- Component-level unit tests in Storybook (use Vitest instead)
