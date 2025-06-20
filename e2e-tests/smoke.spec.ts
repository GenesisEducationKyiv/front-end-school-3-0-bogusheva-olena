import { test, expect } from "@playwright/test";

test("main page renders heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/My Music Tracks/i);
});

