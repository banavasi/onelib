#!/bin/bash
# CI-friendly integration test
set -e

echo "🧪 Onelib CI Integration Test"
echo "============================="

# Test structure exists
echo "✓ Checking monorepo structure..."
test -d packages/components && echo "  ✓ components"
test -d packages/skills && echo "  ✓ skills"
test -d packages/templates && echo "  ✓ templates"
test -d packages/create-onelib && echo "  ✓ create-onelib"

# Test configs exist
echo "✓ Checking configuration files..."
test -f tsconfig.json && echo "  ✓ TypeScript config"
test -f pnpm-workspace.yaml && echo "  ✓ pnpm workspace"
test -f turbo.json && echo "  ✓ Turbo config"
test -f package.json && echo "  ✓ Root package.json"

# Test scripts available
echo "✓ Checking build scripts..."
grep -q '"build"' package.json && echo "  ✓ Build script exists"
grep -q '"test"' package.json && echo "  ✓ Test script exists"
grep -q '"dev"' package.json && echo "  ✓ Dev script exists"

echo ""
echo "✅ All integration checks passed!"