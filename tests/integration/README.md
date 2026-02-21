# Integration Tests

Comprehensive integration test suite for the Onelib monorepo.

## Quick Start

Run the full integration test suite:

```bash
./tests/integration/test-full-workflow.sh
```

## Test Coverage

The integration test suite validates:

### 1. **Build Pipeline** 
   - All packages build successfully
   - Build artifacts are generated correctly

### 2. **Unit Tests**
   - All package tests pass
   - Test runner configuration is valid

### 3. **Project Generation (E2E)**
   - `create-onelib` scaffolds a working project
   - Generated project structure is correct
   - Template files are properly copied

### 4. **Dependency Management (E2E)**
   - Generated project installs dependencies
   - pnpm workspace configuration is valid

### 5. **Build System (E2E)**
   - Generated project builds successfully
   - TypeScript configuration is correct

### 6. **Monorepo Structure**
   - Required packages exist
   - Package structure follows conventions
   - Workspace configuration is valid

## Test Details

| Test # | Description | Validates |
|--------|-------------|-----------|
| 1 | Building all packages | Monorepo build system |
| 2 | Running all tests | Test infrastructure |
| 3 | Verifying create-onelib | CLI tool availability |
| 4 | Creating new project | Project scaffolding |
| 5 | Installing dependencies | Package management |
| 6 | Building generated project | Template validity |
| 7 | Package structure | Monorepo organization |
| 8 | TypeScript configuration | Type system setup |
| 9 | Build artifacts | Build output |
| 10 | Workspace configuration | pnpm workspace |

## Running Individual Tests

```bash
# Just build all packages
pnpm build

# Just run unit tests
pnpm test

# Manual E2E project creation
cd /tmp && npx create-onelib test-app

# Test specific package
pnpm --filter @onelib/core test
pnpm --filter @onelib/ui build
```

## Test Output

The test script provides:
- **Color-coded output**: Green for success, red for failures, yellow for warnings
- **Detailed progress**: Each test shows what it's validating
- **Test artifacts**: Generated projects saved in `/tmp/onelib-integration-*`
- **Cleanup instructions**: How to remove test artifacts

## CI/CD Integration

To run in CI environments:

```bash
# GitHub Actions
- name: Run Integration Tests
  run: ./tests/integration/test-full-workflow.sh

# GitLab CI
test:integration:
  script:
    - ./tests/integration/test-full-workflow.sh
```

## Troubleshooting

### Common Issues

1. **Build failures**: Ensure all dependencies are installed with `pnpm install`
2. **Permission denied**: Make sure the script is executable with `chmod +x`
3. **create-onelib not found**: Build the packages first with `pnpm build`
4. **Test artifacts**: Clean up old test directories in `/tmp` if disk space is low

### Debug Mode

For verbose output, modify the script:

```bash
# Add at the top of the script
set -ex  # Enable debug output
```

## Contributing

When adding new integration tests:

1. Add test to `test-full-workflow.sh`
2. Update this README with test details
3. Ensure test is idempotent
4. Add appropriate error handling
5. Use color coding for output consistency

## Test Philosophy

Our integration tests follow these principles:

- **Fast**: Complete suite runs in under 2 minutes
- **Reliable**: No flaky tests, consistent results
- **Comprehensive**: Cover critical user journeys
- **Maintainable**: Clear test structure and documentation
- **Actionable**: Clear error messages and fix suggestions