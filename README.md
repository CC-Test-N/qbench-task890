# QBench Test Automation Framework

A comprehensive Playwright-based automation framework for testing QBench's Order → Sample → Test creation workflow.

## 🔒 Security First

**IMPORTANT**: This project uses environment variables for credentials. Never commit sensitive data to version control.

See [SECURITY.md](./SECURITY.md) for detailed security guidelines.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup


```bash
# Install dependencies
npm install

# Setup environment (interactive)
npm run setup

# Or manually create .env file from template
cp .env.example .env
# Edit .env with your credentials
```

### Running Tests

```bash
# Run all tests
npm test

# Run with browser UI
npm run test:headed

# Run specific test suites
npm run test:order       # Order management tests
npm run test:sample      # Sample management tests
npm run test:test        # Test management tests

# Run visual regression tests
npm run test:visual
npm run test:visual:update  # Update snapshots

# View test report
npm run report
```

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

### Design Patterns Used
- **Page Object Model**: Encapsulates page interactions
- **Base Page Pattern**: Common functionality inheritance
- **Factory Pattern**: Data generation and object creation
- **Locator Pattern**: Type-safe element selectors using Record<string, Locator>

### Key Components
- `src/pages/`: Page Object Models with BasePage inheritance and Locator pattern
- `src/data/`: Test data configuration (no credentials!)
- `src/utils/`: Environment and utility functions
- `tests/features/`: Functional test scenarios
- `tests/visual/`: Visual regression tests

## 🔐 Environment Configuration

### Required Environment Variables

```env
# Application
BASE_URL=https://your-app-url.com

# Credentials (REQUIRED - Never commit!)
TEST_EMAIL=your-test-email@domain.com
TEST_PASSWORD=your-secure-password

# Optional
HEADLESS=true
DEFAULT_TIMEOUT=30000
```

### Security Best Practices

✅ **DO:**
- Use `.env` file for credentials
- Run `npm run setup` for guided setup
- Keep `.env` in `.gitignore`
- Use environment variables in CI/CD
- Rotate test credentials regularly

❌ **DON'T:**
- Hardcode credentials in code
- Commit `.env` files
- Share credentials in documentation
- Use production credentials for testing

## 🧪 Test Strategy

### Coverage Areas
- **Authentication Flow**: Secure login validation
- **Order Management**: Creation, validation, and cleanup
- **Sample Management**: Adding samples with unique identifiers
- **Test Management**: Associating tests with samples
- **Visual Regression**: UI consistency checks
- **Error Handling**: Validation and edge cases

### Test Data Management
- Dynamic data generation to avoid conflicts
- Configuration-based test inputs
- Locator-based selectors in page objects
- Automatic cleanup after tests

## 📊 Features

### Clean Code Architecture
- No hardcoded values
- DRY principle throughout
- Modular and scalable design
- Type-safe with TypeScript

### Visual Testing
- Order details snapshots
- Sample table validation
- Responsive design checks
- Masked dynamic elements

### Advanced Capabilities
- Retry logic for flaky operations
- Configurable timeouts
- Parallel execution support
- CI/CD ready

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

### Jenkins
```groovy
withCredentials([
  string(credentialsId: 'test-email', variable: 'TEST_EMAIL'),
  string(credentialsId: 'test-password', variable: 'TEST_PASSWORD')
]) {
  sh 'npm test'
}
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [SECURITY.md](./SECURITY.md) - Security best practices
- [.env.example](./.env.example) - Environment template

## 🔄 Future Improvements

### Database Verification
**Recommendation**: It would be better to verify created records (orders, samples, tests) directly in the database rather than through UI assertions. This would provide:
- Faster test execution
- More reliable verification
- Direct data integrity checks
- Reduced UI flakiness

### Implementation Ideas
- Add database connection utilities
- Create data verification helpers
- Implement API-based validation
- Compare UI state with database state

## 🤝 Contributing

1. Never commit credentials
2. Follow the existing patterns (especially Locator pattern for selectors)
3. Update tests when changing functionality
4. Run all tests before submitting PR
5. Update documentation as needed
6. Keep login functions simple and maintainable
