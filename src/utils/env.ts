// src/utils/env.ts
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Helper functions to get environment variables with defaults
export const getEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
};

export const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

// Environment configuration object
export const ENV = {
  // Application URLs
  BASE_URL: getEnv('BASE_URL', 'https://srqaengineer-ns-uat.qbench.net/'),

  // Credentials (MUST be provided via environment variables)
  CREDENTIALS: {
    email: getEnv('TEST_EMAIL', ''),
    password: getEnv('TEST_PASSWORD', '')
  },
  
  // Aliases for backward compatibility
  TEST_EMAIL: getEnv('TEST_EMAIL', ''),
  TEST_PASSWORD: getEnv('TEST_PASSWORD', ''),

  // Timeouts
  TIMEOUTS: {
    DEFAULT: getEnvNumber('DEFAULT_TIMEOUT', 30000),
    NAVIGATION: getEnvNumber('NAVIGATION_TIMEOUT', 60000),
    API: getEnvNumber('API_TIMEOUT', 15000)
  },

  // Test Configuration
  TEST_CONFIG: {
    headless: getEnvBoolean('HEADLESS', true),
    slowMo: getEnvNumber('SLOW_MO', 0),
    videoMode: getEnv('VIDEO_MODE', 'retain-on-failure'),
    screenshotMode: getEnv('SCREENSHOT_MODE', 'only-on-failure')
  },

  // Visual Testing
  VISUAL: {
    threshold: parseFloat(getEnv('VISUAL_THRESHOLD', '0.2')),
    maxDiffPixels: getEnvNumber('VISUAL_MAX_DIFF_PIXELS', 100)
  },

  // Debugging
  DEBUG: {
    mode: getEnvBoolean('DEBUG_MODE', false),
    verboseLogging: getEnvBoolean('VERBOSE_LOGGING', true)
  }
};

// Validation function
export const validateEnvironment = (): void => {
  const requiredVars = ['BASE_URL', 'TEST_EMAIL', 'TEST_PASSWORD'];
  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please create a .env file based on .env.example and provide the required values.');
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Check if credentials are not empty
  if (!ENV.CREDENTIALS.email || !ENV.CREDENTIALS.password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD must not be empty');
  }

  // Security warning if default/example values detected
  if (ENV.CREDENTIALS.email.includes('example.com') || 
      ENV.CREDENTIALS.password === 'your-test-password') {
    console.warn('⚠️  Warning: You appear to be using example credentials. Please update your .env file with real test credentials.');
  }

  if (ENV.DEBUG.verboseLogging) {
    console.log('🔧 Environment loaded:', {
      BASE_URL: ENV.BASE_URL,
      TEST_EMAIL: ENV.CREDENTIALS.email.substring(0, 3) + '***', // Partially mask email in logs
      HEADLESS: ENV.TEST_CONFIG.headless,
      DEFAULT_TIMEOUT: ENV.TIMEOUTS.DEFAULT
    });
  }
};