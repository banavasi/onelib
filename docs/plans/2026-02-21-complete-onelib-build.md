# Complete Onelib Build Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the remaining 8% of Onelib to achieve a fully functional monorepo system for scaffolding AI-ready Next.js projects.

**Architecture:** Build missing dist artifacts, verify E2E flows work, enhance Storybook stories, and create the documentation/showcase apps using the existing infrastructure.

**Tech Stack:** TypeScript, Turbo, pnpm, Next.js 15, Storybook 10, Tailwind CSS 4

## Phase 1: Critical Path - Build & Test Core Functionality

### Task 1: Build @onelib/scripts Package

**Files:**
- Build: `tooling/scripts/`
- Verify: `tooling/scripts/dist/cli.js`

**Step 1: Clean and build the scripts package**

```bash
cd /Users/shashankshandilya/Documents/oneorigin/onelibrary
pnpm --filter @onelib/scripts clean
```

**Step 2: Build the package**

```bash
pnpm --filter @onelib/scripts build
```

Expected: Creates `tooling/scripts/dist/cli.js` and other build artifacts

**Step 3: Verify the CLI exists and is executable**

```bash
ls -la tooling/scripts/dist/
cat tooling/scripts/dist/cli.js | head -20
```

Expected: See the compiled CLI with shebang `#!/usr/bin/env node`

**Step 4: Test the CLI help command**

```bash
node tooling/scripts/dist/cli.js --help
```

Expected: Shows available commands (update, skills:update, etc.)

**Step 5: Commit**

```bash
git add tooling/scripts/dist/
git commit -m "build: compile @onelib/scripts package"
```

### Task 2: Test create-onelib E2E Flow

**Files:**
- Test: `packages/create-onelib/`
- Create: `/tmp/test-onelib-app/`

**Step 1: Build create-onelib if needed**

```bash
pnpm --filter create-onelib build
```

Expected: Build completes successfully

**Step 2: Create a test directory**

```bash
mkdir -p /tmp/onelib-test
cd /tmp/onelib-test
```

**Step 3: Run create-onelib locally**

```bash
node /Users/shashankshandilya/Documents/oneorigin/onelibrary/packages/create-onelib/dist/cli.js test-app
```

Expected: Interactive prompts appear

**Step 4: Complete the wizard**

Answer prompts:
- Project name: test-app
- Description: Test Onelib App
- Author: Test Author
- Install skills: Yes (curated)

Expected: Project scaffolds successfully

**Step 5: Verify project structure**

```bash
cd test-app
ls -la
cat onelib.config.ts
ls skills/
```

Expected: See full project structure with skills populated

**Step 6: Install dependencies**

```bash
pnpm install
```

Expected: Dependencies install successfully

**Step 7: Test the dev server**

```bash
pnpm dev &
sleep 5
curl http://localhost:3000 | head -20
kill %1
```

Expected: Next.js dev server starts and returns HTML

**Step 8: Document findings**

Create: `/Users/shashankshandilya/Documents/oneorigin/onelibrary/docs/test-results/e2e-create-onelib.md`

```markdown
# E2E Test Results: create-onelib

**Date:** 2026-02-21
**Status:** [PASS/FAIL]

## Test Steps
1. Built create-onelib package
2. Ran CLI in /tmp/onelib-test
3. Created test-app project
4. Installed dependencies
5. Started dev server

## Results
- [ ] CLI runs without errors
- [ ] Project scaffolds correctly
- [ ] Skills are populated
- [ ] Dependencies install
- [ ] Dev server starts

## Issues Found
[List any issues]
```

**Step 9: Commit**

```bash
cd /Users/shashankshandilya/Documents/oneorigin/onelibrary
git add docs/test-results/
git commit -m "test: document create-onelib E2E results"
```

### Task 3: Test Update Pipeline

**Files:**
- Test: `/tmp/onelib-test/test-app/`
- Verify: `tooling/scripts/dist/cli.js`

**Step 1: Copy onelib-scripts to test project**

```bash
cd /tmp/onelib-test/test-app
cp /Users/shashankshandilya/Documents/oneorigin/onelibrary/tooling/scripts/dist/cli.js node_modules/.bin/onelib-scripts
chmod +x node_modules/.bin/onelib-scripts
```

**Step 2: Test skills update command**

```bash
pnpm onelib:skills:update
```

Expected: Skills update process runs

**Step 3: Test full update command**

```bash
pnpm onelib:update
```

Expected: Full update pipeline runs (components, skills, etc.)

**Step 4: Verify changes**

```bash
git status
ls -la .onelib/
cat .onelib/lockfile.json | head -20
```

Expected: See lockfile and any component updates

**Step 5: Document results**

Update: `/Users/shashankshandilya/Documents/oneorigin/onelibrary/docs/test-results/e2e-update-pipeline.md`

```markdown
# E2E Test Results: Update Pipeline

**Date:** 2026-02-21
**Status:** [PASS/FAIL]

## Test Steps
1. Used test-app from create-onelib
2. Ran onelib:skills:update
3. Ran onelib:update
4. Verified lockfile creation

## Results
- [ ] Skills update works
- [ ] Component update works
- [ ] Lockfile created
- [ ] No errors thrown

## Issues Found
[List any issues]
```

**Step 6: Commit**

```bash
cd /Users/shashankshandilya/Documents/oneorigin/onelibrary
git add docs/test-results/
git commit -m "test: document update pipeline E2E results"
```

## Phase 2: Fix Critical Issues

### Task 4: Fix Any Build/Runtime Issues

**Note:** This task is conditional based on Task 1-3 results

**Files:**
- Fix: [Files identified in testing]

**Step 1: Review test results**

```bash
cat docs/test-results/*.md
```

**Step 2: Fix identified issues**

[Specific fixes based on test results]

**Step 3: Re-test affected flows**

[Re-run relevant tests]

**Step 4: Commit fixes**

```bash
git add [fixed files]
git commit -m "fix: [description of fixes]"
```

## Phase 3: Enhance Storybook Stories

### Task 5: Verify Story Quality

**Files:**
- Check: `packages/components/src/**/*.stories.tsx`
- Run: `apps/storybook/`

**Step 1: Start Storybook dev server**

```bash
cd /Users/shashankshandilya/Documents/oneorigin/onelibrary
pnpm --filter @onelib/storybook dev
```

Expected: Storybook starts on port 6006

**Step 2: Review stories in browser**

Open: http://localhost:6006

Check:
- Do stories render?
- Are they interactive?
- Do they showcase features?

**Step 3: Document story status**

Create: `/Users/shashankshandilya/Documents/oneorigin/onelibrary/docs/test-results/storybook-audit.md`

```markdown
# Storybook Audit

**Date:** 2026-02-21

## Categories Reviewed

### Accordions (3 components)
- [ ] Stories render
- [ ] Interactive demos work
- [ ] Props documented

### Backgrounds (18 components)
- [ ] Stories render
- [ ] Visual effects work
- [ ] Customization shown

[Continue for all categories]

## Components Needing Work
[List components with issues]
```

**Step 4: Commit audit**

```bash
git add docs/test-results/
git commit -m "docs: audit Storybook story quality"
```

### Task 6: Fix Priority Stories

**Note:** Based on Task 5 audit results

**Files:**
- Fix: `packages/components/src/[category]/[component].stories.tsx`

[Specific story fixes based on audit]

## Phase 4: Create Documentation Site

### Task 7: Initialize Website App

**Files:**
- Create: `apps/website/`
- Template: Use Next.js 15 with Tailwind

**Step 1: Create website package.json**

Create: `apps/website/package.json`

```json
{
  "name": "@onelib/website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome check --write .",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.2.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "onelib": "workspace:*",
    "@onelib/registry": "workspace:*",
    "@onelib/components": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^25.3.0",
    "@types/react": "^19.0.5",
    "@types/react-dom": "^19.0.3",
    "typescript": "^5.8.0",
    "tailwindcss": "^4.0.12",
    "postcss": "^8.5.3",
    "autoprefixer": "^10.5.3"
  }
}
```

**Step 2: Create Next.js config**

Create: `apps/website/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@onelib/components', '@onelib/registry', 'onelib']
}

export default nextConfig
```

**Step 3: Create TypeScript config**

Create: `apps/website/tsconfig.json`

```json
{
  "extends": "@onelib/config/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create app directory structure**

```bash
mkdir -p apps/website/src/app
mkdir -p apps/website/src/components
mkdir -p apps/website/public
```

**Step 5: Create layout and page**

Create: `apps/website/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Onelib - AI-Ready Next.js Projects',
  description: 'Build, scaffold, and maintain AI-ready Next.js projects with curated skills and component registries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

Create: `apps/website/src/app/page.tsx`

```typescript
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Onelib</h1>
      <p className="text-lg text-gray-600 mb-8">
        AI-Ready Next.js Projects with Curated Skills
      </p>
      
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
          <pre className="bg-gray-100 p-4 rounded">
            <code>npx create-onelib my-app</code>
          </pre>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">53+ Components</h2>
          <p>Ready-to-use components from top UI libraries</p>
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Auto Updates</h2>
          <p>Keep skills and components in sync</p>
        </div>
      </section>
    </main>
  )
}
```

**Step 6: Create globals.css**

Create: `apps/website/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 7: Install and test**

```bash
cd apps/website
pnpm install
pnpm dev
```

Expected: Website starts on port 3001

**Step 8: Commit**

```bash
git add apps/website/
git commit -m "feat: create documentation website app"
```

## Phase 5: Integration Testing

### Task 8: Create Integration Test Suite

**Files:**
- Create: `tests/integration/`
- Test: Full monorepo workflows

**Step 1: Create test structure**

```bash
mkdir -p tests/integration
cd tests/integration
```

**Step 2: Create integration test script**

Create: `tests/integration/test-full-workflow.sh`

```bash
#!/bin/bash
set -e

echo "🧪 Onelib Integration Tests"
echo "=========================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test directory
TEST_DIR="/tmp/onelib-integration-$(date +%s)"
mkdir -p "$TEST_DIR"

echo "📁 Test directory: $TEST_DIR"

# Test 1: Build all packages
echo -e "\n${GREEN}Test 1: Building all packages${NC}"
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All packages built successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Test 2: Run all tests
echo -e "\n${GREEN}Test 2: Running all tests${NC}"
pnpm test
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${RED}✗ Tests failed${NC}"
    exit 1
fi

# Test 3: Create new project
echo -e "\n${GREEN}Test 3: Creating new project${NC}"
cd "$TEST_DIR"
node "$OLDPWD/packages/create-onelib/dist/cli.js" test-app --yes
if [ -d "test-app" ]; then
    echo -e "${GREEN}✓ Project created successfully${NC}"
else
    echo -e "${RED}✗ Project creation failed${NC}"
    exit 1
fi

# Test 4: Install dependencies
echo -e "\n${GREEN}Test 4: Installing dependencies${NC}"
cd test-app
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Dependency installation failed${NC}"
    exit 1
fi

# Test 5: Build generated project
echo -e "\n${GREEN}Test 5: Building generated project${NC}"
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Generated project builds${NC}"
else
    echo -e "${RED}✗ Generated project build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 All integration tests passed!${NC}"
echo "Test artifacts available at: $TEST_DIR"
```

**Step 3: Make script executable**

```bash
chmod +x tests/integration/test-full-workflow.sh
```

**Step 4: Run integration tests**

```bash
cd /Users/shashankshandilya/Documents/oneorigin/onelibrary
./tests/integration/test-full-workflow.sh
```

Expected: All tests pass

**Step 5: Create test documentation**

Create: `tests/integration/README.md`

```markdown
# Integration Tests

Run the full integration test suite:

```bash
./tests/integration/test-full-workflow.sh
```

## Test Coverage

1. **Build Pipeline**: All packages build successfully
2. **Unit Tests**: All package tests pass
3. **E2E Create**: create-onelib scaffolds a working project
4. **E2E Install**: Generated project installs dependencies
5. **E2E Build**: Generated project builds successfully

## Running Individual Tests

```bash
# Just build
pnpm build

# Just test
pnpm test

# Manual E2E
cd /tmp && npx create-onelib test-app
```
```

**Step 6: Commit**

```bash
git add tests/integration/
git commit -m "test: add integration test suite"
```

## Phase 6: Final Verification

### Task 9: Run Full System Check

**Step 1: Clean everything**

```bash
pnpm clean
rm -rf node_modules
pnpm install
```

**Step 2: Build everything**

```bash
pnpm build
```

**Step 3: Run all tests**

```bash
pnpm test
```

**Step 4: Run integration tests**

```bash
./tests/integration/test-full-workflow.sh
```

**Step 5: Create release notes**

Create: `docs/RELEASE_NOTES.md`

```markdown
# Onelib v1.0.0 Release Notes

## ✅ Complete Features

- **create-onelib CLI**: Full interactive scaffolding
- **53 Components**: From 9 categories
- **Registry System**: Component and skill management
- **Update Pipeline**: Auto-update skills and components
- **Monorepo Structure**: 12 packages with Turbo + pnpm
- **Testing**: 124+ tests across all packages
- **Documentation Site**: Basic docs website
- **Storybook**: Component showcase

## 📦 Packages

- `create-onelib`: Project scaffolding CLI
- `onelib`: Config and types
- `@onelib/registry`: Component/skill schemas
- `@onelib/skills`: Curated skills list
- `@onelib/scripts`: Update pipeline CLI
- `@onelib/templates`: Base project template
- `@onelib/components`: 53 registry components
- `@onelib/layouts`: Layout templates
- `@onelib/config`: Shared configs
- `@onelib/website`: Documentation site
- `@onelib/storybook`: Component showcase

## 🚀 Getting Started

```bash
npx create-onelib my-app
cd my-app
pnpm dev
```

## 📈 Stats

- 53 components (6.6x original plan)
- 124+ tests passing
- 12 packages in monorepo
- 9 component categories
```

**Step 6: Final commit**

```bash
git add docs/RELEASE_NOTES.md
git commit -m "docs: add v1.0.0 release notes"
```

## Summary

This plan completes the remaining 8% of Onelib:

1. **Phase 1**: Build and test core functionality (Tasks 1-3)
2. **Phase 2**: Fix any critical issues found (Task 4)
3. **Phase 3**: Verify and enhance Storybook (Tasks 5-6)
4. **Phase 4**: Create documentation site (Task 7)
5. **Phase 5**: Integration testing suite (Task 8)
6. **Phase 6**: Final verification (Task 9)

**Estimated Time**: 2-3 hours for full implementation

**Critical Path**: Tasks 1-3 are essential for the system to work. Other tasks enhance but aren't blockers.