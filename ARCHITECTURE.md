# Test Automation Architecture

## Overview
This project implements a scalable, maintainable test automation framework using Playwright with TypeScript, following best practices and design patterns.

## Architecture Principles

### 1. Page Object Model (POM)
- All page interactions are encapsulated in page classes
- Each page extends `BasePage` for common functionality
- No hardcoded selectors in tests

### 2. Data-Driven Testing
- Test data separated in JSON files (`src/data/test-data.json`)
- Environment variables for sensitive data (no hardcoded credentials)
- Locator pattern for element selectors

### 3. DRY (Don't Repeat Yourself)
- Common functionality in `BasePage` class
- Reusable helper methods
- Shared configuration and test data

### 4. Visual Regression Testing
- Snapshot testing for UI consistency
- Masked dynamic elements (timestamps, IDs)
- Responsive design validation

## Project Structure

```
qbench-task/
├── src/
│   ├── pages/          # Page Object classes
│   │   ├── BasePage.ts # Base class with common methods
│   │   ├── LoginPage.ts
│   │   ├── OrdersPage.ts
│   │   ├── SamplesPage.ts
│   │   └── TestPage.ts
│   ├── data/           # Test data
│   │   └── test-data.json
│   ├── utils/          # Utilities
│   │   └── env.ts
│   └── types/          # TypeScript definitions
│       └── environment.d.ts
├── tests/
│   ├── features/       # Functional tests
│   │   ├── order.spec.ts
│   │   ├── sample.spec.ts
│   │   └── test.spec.ts
│   └── visual/         # Visual regression tests
│       └── visual-regression.spec.ts
└── playwright.config.ts
```

## Key Features

### Base Page Class
```typescript
export abstract class BasePage {
  - Common helper methods (clickAndWait, waitForPageLoad, fillInput)
  - Navigation utilities
  - Element finder methods
  - Visual assertion helpers
}
```

### Page Object Implementation
```typescript
export class LoginPage extends BasePage {
  private selectors: Record<string, Locator>;
  
  constructor(page: Page) {
    super(page);
    // Define selectors as Locator objects
    this.selectors = {
      emailInput: page.getByRole('textbox', { name: 'Email' }),
      passwordInput: page.getByRole('textbox', { name: 'Password' }),
      loginButton: page.getByRole('button', { name: 'Log In' })
    };
  }
}
```

### Configuration Management
- **Selectors**: Using Playwright's Locator pattern directly in page classes
- **Test Data**: Test inputs and expected values in `test-data.json`
- **Timeouts**: Configurable wait times for different scenarios
- **Credentials**: Stored securely in environment variables

### Visual Testing
- Order details page snapshots
- Sample table visual validation
- Test configuration panel screenshots
- Responsive design checks (mobile, tablet, desktop)
- Full E2E flow documentation

## Test Execution

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:features    # All functional tests
npm run test:visual      # All visual tests
npm run test:order       # Order management tests
npm run test:sample      # Sample management tests
npm run test:test        # Test management tests
```

### Visual Test Commands
```bash
npm run test:visual              # Run visual tests
npm run test:visual:update       # Update visual snapshots
```

### Debug Options
```bash
npm run test:headed      # Run with browser visible
npm run test:debug       # Run in debug mode
npm run test:ui          # Open Playwright UI
```

## Best Practices Implemented

1. **No Hardcoded Values**
   - Selectors defined using Locator pattern in page classes
   - Test data in JSON files
   - Environment-specific data and credentials in .env

2. **Error Handling**
   - Retry logic for flaky operations
   - Graceful failure handling
   - Detailed error logging

3. **Maintainability**
   - Selectors encapsulated within page objects
   - Modular page objects with Record<string, Locator> pattern
   - Reusable helper methods
   - Simple, readable login flow with minimal fallback strategies

4. **Scalability**
   - Easy to add new pages
   - Simple to extend test data
   - Configurable timeouts and retries

5. **Visual Regression**
   - Automated UI consistency checks
   - Masked dynamic elements
   - Responsive design validation

## Adding New Tests

### 1. Create Page Object
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private selectors: Record<string, Locator>;
  
  constructor(page: Page) {
    super(page);
    this.selectors = {
      button: page.getByRole('button', { name: 'Click Me' }),
      input: page.getByLabel('Input Field')
    };
  }
  
  // Page-specific methods
}
```

### 2. Add Test Data
Update `src/data/test-data.json`:
```json
{
  "newFeature": {
    "input": "test value",
    "expected": "expected result"
  }
}
```

### 3. Write Test
```typescript
test('New feature test', async ({ page }) => {
  const newPage = new NewPage(page);
  await newPage.performAction();
  expect(result).toBe(testData.newFeature.expected);
});
```

## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Install browsers:
```bash
npm run install:browsers
```

3. Create `.env` file with credentials:
```env
BASE_URL=https://your-app.com
TEST_EMAIL=test@example.com
TEST_PASSWORD=password
```

4. Run tests:
```bash
npm test
```

## Continuous Integration

The framework is CI-ready with:
- Headless execution by default
- Configurable parallel execution
- HTML report generation
- Screenshot capture on failure
- Visual regression baselines

## Maintenance

### Update Visual Baselines
```bash
npm run test:visual:update
```

### View Test Reports
```bash
npm run report
```

### Debug Failed Tests
```bash
npm run test:debug
```