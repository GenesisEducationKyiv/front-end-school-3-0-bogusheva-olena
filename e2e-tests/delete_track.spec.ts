import { test, expect } from "@playwright/test";
import { waitForTrackInApi } from "./utils";
import { waitForTrackToDisappear } from "./utils";

test("delete a track", async ({ page }) => {
    const uniqueTitle = `1.${Date.now()}`;

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
    await page.goto("/?page=1");

    await waitForTrackInApi(page, uniqueTitle);

    const trackItem = page
        .locator('[data-testid^="track-item"]')
        .filter({ hasText: uniqueTitle })
        .first();

    await expect(trackItem).toBeVisible({ timeout: 5000 });

    const trackTestId = await trackItem.getAttribute("data-testid");
    if (!trackTestId) throw new Error("Track test ID not found");
    const trackId = trackTestId.replace("track-item-", "");

    await trackItem.getByTestId(`track-item-${trackId}-options-button`).click();
    await trackItem.getByTestId(`delete-track-${trackId}`).click();
    await page.getByTestId("confirm-delete").click();

    await expect(page.getByText("Track deleted successfully!")).toBeVisible({
        timeout: 5000,
    });
    await expect
        .poll(
            async () => {
                const response = await page.request.get(
                    "http://localhost:8000/tracks"
                );
                const body = await response.json();
                const titles = body.data?.map((t: any) => t.title) ?? [];
                return titles.includes(uniqueTitle);
            },
            {
                timeout: 5000,
                message: `Track "${uniqueTitle}" still found in API`,
            }
        )
        .toBe(false);
    await waitForTrackToDisappear(page, uniqueTitle);
});

