
// src/types/environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      TEST_EMAIL: string;
      TEST_PASSWORD: string;
      DEFAULT_TIMEOUT: string;
      NAVIGATION_TIMEOUT: string;
      API_TIMEOUT: string;
      HEADLESS: string;
      SLOW_MO: string;
      VIDEO_MODE: string;
      SCREENSHOT_MODE: string;
      VISUAL_THRESHOLD: string;
      VISUAL_MAX_DIFF_PIXELS: string;
      DEBUG_MODE: string;
      VERBOSE_LOGGING: string;
    }
  }
}

export {};