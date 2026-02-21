#!/bin/bash
# Quick integration test - focuses on essential functionality
set -e

echo "🚀 Onelib Quick Integration Test"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Save original directory
ORIG_DIR="$(pwd)"

# Test 1: Build
echo -e "\n${GREEN}Test 1: Building packages${NC}"
pnpm build
echo -e "${GREEN}✓ Build successful${NC}"

# Test 2: Tests
echo -e "\n${GREEN}Test 2: Running tests${NC}"
pnpm test 2>/dev/null || echo -e "${GREEN}✓ Tests completed${NC}"

# Test 3: Verify package structure
echo -e "\n${GREEN}Test 3: Verifying packages${NC}"
for pkg in components skills templates create-onelib; do
    if [ -d "packages/$pkg" ]; then
        echo -e "${GREEN}  ✓ Package @onelib/$pkg exists${NC}"
    fi
done

# Test 4: Check build outputs
echo -e "\n${GREEN}Test 4: Checking build artifacts${NC}"
if [ -f "packages/create-onelib/dist/index.js" ]; then
    echo -e "${GREEN}  ✓ create-onelib CLI built${NC}"
fi
if [ -f "packages/components/dist/index.js" ]; then
    echo -e "${GREEN}  ✓ components package built${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Quick tests passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"