# Testing Guide

This project uses Vitest for unit, integration, and end-to-end testing.

## Test Structure

- `src/**/*.test.ts` - Unit and integration tests
- `src/**/*.e2e.test.ts` - End-to-end tests
- `src/test/` - Test helpers and setup
- `coverage/` - Test coverage reports
  - `unit/` - Unit test coverage
  - `e2e/` - E2E test coverage

## Running Tests

```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests
npm run test:e2e

# Run end-to-end tests in watch mode
npm run test:e2e:watch

# Run end-to-end tests with coverage
npm run test:e2e:coverage

# Run mutation tests
npm run test:mutation
```

## Coverage Requirements

- Unit Tests:
  
  - Statements: 90%
  - Branches: 85%
  - Functions: 90%
  - Lines: 90%
- E2E Tests:
  
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should work as expected', () => {
    const result = someFunction();
    expect(result).toBe(expected);
  });
});
 ```

### E2E Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../server';

describe('API E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle requests correctly', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
  });
});
 ```

### Mocking

```typescript
// Mock a module
vi.mock('./module', () => ({
  function: vi.fn(),
}));

// Mock environment variables
vi.mock('../env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3333,
  },
}));
 ```

## Test Organization

- Group related tests in describe blocks
- Use clear, descriptive test names
- Follow the Arrange-Act-Assert pattern
- Keep tests focused and isolated
- Clean up after tests using afterEach/afterAll

## Continuous Integration

Tests are automatically run on:

- Pull requests to main branch
- Push to main branch
- Daily scheduled runs
Coverage reports are automatically generated and uploaded to the repository.
