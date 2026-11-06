import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks run against a production build (animations, hydration and
 * static rendering behave differently in `next dev`).
 *
 *   npm run test:e2e                        # builds, starts on :3101, runs
 *   E2E_BASE_URL=http://localhost:3000 npm run test:e2e   # use a server you already started
 */
const externalBase = process.env.E2E_BASE_URL;
const port = 3101;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: externalBase ?? `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(externalBase
    ? {}
    : {
        webServer: {
          command: `npm run build && npm run start -- -p ${port}`,
          url: `http://localhost:${port}/de`,
          timeout: 300_000,
          reuseExistingServer: true,
        },
      }),
});
