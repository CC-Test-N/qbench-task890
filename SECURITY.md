# Security Best Practices

## 🔒 Credential Management

### NEVER commit credentials to version control

This project uses environment variables to manage sensitive information securely. All credentials have been removed from the codebase and must be provided via environment variables.

### Setup Process

1. **Initial Setup**
   ```bash
   npm run setup
   ```
   This interactive script will help you create a secure `.env` file.

2. **Manual Setup**
   - Copy `.env.example` to `.env`
   - Add your actual credentials
   - Never commit `.env` to version control

### Required Environment Variables

```env
TEST_EMAIL=your-actual-test-email@domain.com
TEST_PASSWORD=your-actual-test-password
```

### Security Checklist

✅ **DO:**
- Store credentials in `.env` file
- Use `.env.example` as a template
- Keep `.env` in `.gitignore`
- Use environment variables in CI/CD
- Rotate test credentials regularly
- Use dedicated test accounts
- Use Playwright's Locator pattern to avoid selector exposure

❌ **DON'T:**
- Hardcode credentials in code or JSON files
- Commit `.env` files
- Share credentials in documentation
- Use production credentials for testing
- Log passwords in console output
- Store credentials in test-data.json or any committed files

### CI/CD Configuration

For CI/CD pipelines, set environment variables as secrets:

**GitHub Actions:**
```yaml
env:
  TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

**Jenkins:**
```groovy
withCredentials([
  string(credentialsId: 'test-email', variable: 'TEST_EMAIL'),
  string(credentialsId: 'test-password', variable: 'TEST_PASSWORD')
]) {
  sh 'npm test'
}
```

**GitLab CI:**
```yaml
variables:
  TEST_EMAIL: $TEST_EMAIL
  TEST_PASSWORD: $TEST_PASSWORD
```

### Environment Validation

The framework validates required environment variables on startup:
- Missing variables will cause tests to fail immediately
- Empty credentials are not allowed
- Warning for example/default values
- No fallback to hardcoded values - security first approach

### Secure Logging

- Passwords are never logged
- Emails are partially masked in logs
- Sensitive data is excluded from error reports

### Credential Rotation

Best practices for credential management:
1. Use dedicated test accounts
2. Rotate passwords quarterly
3. Monitor for exposed credentials
4. Use strong, unique passwords
5. Enable MFA where possible

### Local Development

For local development:
```bash
# Create .env file
npm run setup

# Verify environment
node -e "require('./src/utils/env').validateEnvironment()"
```

### Code Architecture Security

- **No External Config Files**: Selectors are defined directly in page classes using Locator pattern
- **Environment Variables Only**: All sensitive data must come from environment variables
- **Simple Login Flow**: Minimal complexity in authentication to reduce attack surface
- **Type Safety**: TypeScript ensures proper typing and reduces runtime errors

### Security Scanning

Regular security checks:
```bash
# Check for exposed secrets
git secrets --scan

# Audit dependencies
npm audit

# Check for sensitive data in history
git log -p | grep -E "(password|secret|token|key)"
```

### Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT create a public issue
2. Email security concerns to: security@yourcompany.com
3. Include steps to reproduce
4. Allow time for patching before disclosure

### Test Data Security

- **test-data.json**: Contains only non-sensitive test data
- **Credentials**: Always loaded from environment variables via `ENV.CREDENTIALS`
- **Dynamic Data**: Use timestamps and random values to avoid data conflicts
- **Cleanup**: Always clean up test data after execution

### Additional Resources

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Playwright Security](https://playwright.dev/docs/test-best-practices#security)