/// <reference types="node" />
import dotenv from "dotenv";
import { defineConfig } from "@playwright/test";

dotenv.config();

export default defineConfig({
    testDir: "./e2e-tests",
    timeout: 30 * 1000,
    retries: 0,
    use: {
        headless: true,
        baseURL: `http://localhost:${process.env.TEST_PORT}`,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: "retain-on-failure",
    },
    webServer: {
        command: "npm run dev",
        port: Number(process.env.TEST_PORT) || 3000,
        timeout: 30 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
