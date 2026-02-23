# Blueprint Builder + Apply CLI Design

**Status:** Approved (user selected: dual command support + registry-only pages for v1)

## Goal
Enable a CEO-ready demo flow where users can:
1. Browse all layouts and components in a starter website.
2. Compose a JSON blueprint (pages + layouts + theme + components).
3. Run one command to apply blueprint into a project.
4. Optionally scaffold with `create-onelib --blueprint`.

## Decisions
- Command surface: both
  - `onelib-scripts blueprint:apply --file <path>` (core)
  - `create-onelib <name> --blueprint <path>` (wrapper)
- Page selection model: v1 registry IDs only.
- Layout model: generated layout wrappers from predefined layout presets.
- Theme model: CSS variable preset injected into `src/app/globals.css`.

## Scope
### In
- Blueprint JSON schema + validation.
- Apply engine in `@banavasi/scripts`.
- CLI command wiring.
- Generated route-group layouts and pages.
- Component scaffolding + config update integration.
- Starter website route to generate/copy blueprint JSON.

### Out (v2)
- Custom inline page code in blueprint.
- Arbitrary custom local component paths.
- Visual drag-and-drop editing.

## Success Criteria
- User can generate blueprint at `/starter` in website app.
- User can run `pnpm onelib:blueprint:apply` in generated project and get pages/layouts/theme applied.
- `create-onelib --blueprint` applies same blueprint after scaffold.
- `pnpm test` and `pnpm build` remain green.
