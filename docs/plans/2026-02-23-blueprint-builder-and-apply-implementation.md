# Blueprint Builder + Apply Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a CEO-demo-ready blueprint workflow: website builder -> JSON blueprint -> one-command application to scaffold layouts/pages/components/theme.

**Architecture:** `@banavasi/scripts` owns blueprint parsing/validation/application and exposes `blueprint:apply`. `create-onelib` adds a wrapper flag to call the same engine. `apps/website` adds a starter builder UI that lists all components from registry and emits copy-ready JSON.

**Tech Stack:** TypeScript, Node ESM, Next.js 15 App Router, Vitest

---

### Task 1: Add blueprint domain + apply engine in `@banavasi/scripts`
- Create blueprint types and validation.
- Create apply engine to scaffold components, generate route-group layouts/pages, inject theme CSS, update `onelib.config.ts`.
- Add tests (validation + apply smoke behavior).

### Task 2: Add `blueprint:apply` CLI command
- Update `tooling/scripts/src/cli.ts` parser/help/switch.
- Add template script hooks in scaffolded app package template.
- Export blueprint apply function from scripts package.

### Task 3: Add `create-onelib --blueprint` wrapper
- Parse CLI args for `--blueprint` and optional project name.
- After scaffold/deps install, invoke shared apply function from `@banavasi/scripts`.
- Add tests for arg parsing and integration path.

### Task 4: Add starter builder website route
- Add `/starter` route + client builder component.
- Read components from `@banavasi/components/registry.json`.
- Include layout/theme pickers and page composer.
- Render copyable JSON output.

### Task 5: Verification
- `pnpm --filter @banavasi/scripts test`
- `pnpm --filter @banavasi/create-onelib test`
- `pnpm --filter @banavasi/website check-types`
- `pnpm --filter @banavasi/website build`
- `pnpm test`
- `pnpm build`
