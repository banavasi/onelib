# Phase 6: Port Real Components — Design

## 1. Scope & Component Selection

Phase 6 ports a representative slice of 8 real components from 2 source libraries across 4 categories. This validates the porting workflow before scaling to the full 80+ component list in a follow-up phase.

### Components to port

| Component | Category | Source | Complexity | Notes |
|-----------|----------|--------|------------|-------|
| basic-button | buttons | Sera UI | Simple | Replaces existing stub |
| shimmer-button | buttons | Sera UI | Medium | Animation + styling |
| aurora | backgrounds | ReactBits | Medium | Replaces existing stub |
| silk | backgrounds | ReactBits | Medium | WebGL or CSS effect |
| fuzzy-text | text-animations | Sera UI | Simple | Replaces existing stub |
| decrypting-text | text-animations | Sera UI | Medium | Character-by-character animation |
| marquee | sections | Sera UI | Medium | Infinite scroll, pause on hover |
| dome-gallery | gallery | ReactBits | Complex | 3D perspective, mouse tracking |

Source approach: fetch component code from each library's website, then adapt with minimal changes (Biome formatting + import path adjustments only).

## 2. File Structure & Dependencies

### Directory layout

Each component lives in `packages/components/src/<category>/<component-name>/`:

```
packages/components/src/
├── buttons/
│   ├── basic-button/
│   │   ├── basic-button.tsx
│   │   └── index.ts
│   └── shimmer-button/
│       ├── shimmer-button.tsx
│       └── index.ts
├── backgrounds/
│   ├── aurora/
│   │   ├── aurora.tsx
│   │   └── index.ts
│   └── silk/
│       ├── silk.tsx
│       └── index.ts
├── text-animations/
│   ├── fuzzy-text/
│   │   ├── fuzzy-text.tsx
│   │   └── index.ts
│   └── decrypting-text/
│       ├── decrypting-text.tsx
│       └── index.ts
├── sections/
│   └── marquee/
│       ├── marquee.tsx
│       └── index.ts
├── gallery/
│   └── dome-gallery/
│       ├── dome-gallery.tsx
│       └── index.ts
└── lib/
    └── utils.ts              # cn() utility
```

### Shared utility

`lib/utils.ts` exports `cn()` combining `clsx` + `tailwind-merge`. During scaffolding, this gets copied to the generated project's `src/lib/utils.ts`. Components import via `@/lib/utils` (the `@/` alias is set up by the base template's tsconfig).

### Component dependencies

The `registry.json` gains a `peerDependencies` field per component:

```json
{
  "name": "shimmer-button",
  "peerDependencies": { "motion": "^11.0.0" },
  ...
}
```

Common peer deps: `motion` (animated components), `clsx` + `tailwind-merge` (components using `cn()`).

### Registry schema change

`ComponentSchema` in `@onelib/registry` gets an optional `peerDependencies: Record<string, string>` field.

## 3. Porting Workflow & Adaptation Rules

### Per-component workflow

1. **Fetch** — Visit the component's page on the source library website and extract source code
2. **Adapt** — Apply minimal modifications (see rules below)
3. **Register** — Add entry to `registry.json` with `peerDependencies`, `sourceUrl`, `files`, `tags`
4. **Create barrel** — Write `index.ts` that re-exports the component
5. **Verify** — Run `biome check` to ensure formatting passes

### Adaptation rules

| Change | Don't change |
|--------|-------------|
| Indentation to tabs | Component logic/algorithms |
| Quotes to double | Props interface shape |
| Import paths to `@/lib/utils` | CSS class names |
| `framer-motion` to `motion` | Animation configs/keyframes |
| Add source comment | Internal variable names |
| Semicolons at line ends | JSX structure |

Sub-components stay in the same file. Cross-component imports go in the `dependencies` array in registry.json.

## 4. Scaffold Changes & Testing

### Scaffold enhancements

1. **`lib/utils.ts` scaffolding** — Copy `packages/components/src/lib/utils.ts` to the target project's `src/lib/utils.ts` alongside component files.

2. **Peer dependency auto-install** — After copying components, read `registry.json`, collect all `peerDependencies`, deduplicate, and run `pnpm add <deps>` in the generated project. If auto-install isn't possible, print a message listing required deps.

3. **Registry schema update** — Add `peerDependencies` as optional `Record<string, string>` to `ComponentSchema`.

### Testing strategy

- Existing 15 tests in `@onelib/components` must stay green
- New registry tests for `peerDependencies` field parsing
- All ported `.tsx` files must pass `biome check`
- No runtime tests for components (Storybook's job in a future phase)
- Scaffold integration test for `lib/utils.ts` copy and peer dep collection

## 5. Deliverables

### Included

- 8 real components ported from Sera UI and ReactBits
- Shared `lib/utils.ts` with `cn()` utility
- `peerDependencies` support in registry schema with auto-install during scaffolding
- Updated `registry.json` with all 8 components
- All existing tests green + new tests for schema and scaffold changes

### Not included

- Storybook stories (future phase)
- Remaining 70+ components (follow-up phase)
- Runtime component tests
- Components from Magic UI, Skiper UI, or Buouu UI

### Packages touched

- `@onelib/registry` — schema addition (peerDependencies)
- `@onelib/components` — 8 real components, lib/utils.ts, updated registry.json, updated scaffold
- `create-onelib` — scaffold copies utils.ts and handles peer deps

### Risk

If source component code isn't accessible via web fetch (JS-rendered pages), fall back to checking the library's GitHub repo directly.
