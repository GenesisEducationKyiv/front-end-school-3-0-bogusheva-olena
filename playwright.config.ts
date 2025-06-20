/// <reference types="node" />
import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e-tests",
    timeout: 30 * 1000,
    retries: 0,
    use: {
        headless: true,
        baseURL: "http://localhost:3000",
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: "retain-on-failure",
    },
    webServer: {
        command: "npm run dev",
        port: 3000,
        timeout: 30 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
