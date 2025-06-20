import { test, expect } from "@playwright/test";
import { waitForTrackInApi } from "./utils";

test("create a new track", async ({ page }) => {
    const uniqueTitle = `Test Track ${Date.now()}`;

    await page.goto("/");

    await page.getByTestId("create-track-button").click();
    await page.getByLabel("Title").fill(uniqueTitle);
    await page.keyboard.press("Tab");

    await page.getByLabel("Artist").fill("Test Artist");
    await page.keyboard.press("Tab");

    await page.getByLabel("Album").fill("Test Album");
    await page.keyboard.press("Tab");

    await page
        .getByLabel("Cover Image URL")
        .fill("https://example.com/image.jpg");
    await page.keyboard.press("Tab");

    await page.getByRole("button", { name: "+ Rock" }).click();

    await page.waitForTimeout(100);
    await page.getByTestId("submit-button").click();

    await expect(page.getByText("Track created successfully!")).toBeVisible({
        timeout: 5000,
    });

    await page.reload();
    await waitForTrackInApi(page, uniqueTitle);
});

