import { test, expect } from "@playwright/test";
import { waitForTrackInApi } from "./utils";
import { waitForTrackToDisappear } from "./utils";
import { Track } from "../src/types";

test("delete a track, including failure and success scenarios", async ({
    page,
}) => {
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

    await page.getByTestId("submit-button").click();

    await expect(page.getByText("Track created successfully!")).toBeVisible({
        timeout: 3000,
    });
    await page.goto("/?page=1");

    await waitForTrackInApi(page, uniqueTitle);

    // Find the track ID
    const res = await page.request.get(
        "http://localhost:8000/api/tracks?page=1&limit=10&sort=createdAt&order=desc"
    );
    const body = await res.json();
    const trackData = body.data?.find((t: Track) => t.title === uniqueTitle);
    if (!trackData) throw new Error("Track not found in API");
    const trackId = trackData.id;

    // Simulate server error (500) when deleting this track
    await page.route(`**/api/tracks/${trackId}`, (route) => {
        if (route.request().method() === "DELETE") {
            route.fulfill({ status: 500, body: "Internal Server Error" });
        } else {
            route.continue();
        }
    });

    // Try to delete with error
    const trackItem = page.locator(`[data-testid="track-item-${trackId}"]`);
    await expect(trackItem).toBeVisible({ timeout: 2000 });
    await trackItem.getByTestId(`track-item-${trackId}-options-button`).click();
    await trackItem.getByTestId(`delete-track-${trackId}`).click();
    await page.getByTestId("confirm-delete").click();

    await expect(page.getByText(/failed to delete/i)).toBeVisible({
        timeout: 3000,
    });
    await page.getByTestId("cancel-delete").click();
    await expect(page.getByTestId("delete-track-modal")).toBeHidden({
        timeout: 3000,
    });

    // Remove route interception to allow actual deletion
    await page.unroute(`**/api/tracks/${trackId}`);

    // ——— Delete the track (happy path)
    const refreshedTrackItem = page.locator(
        `[data-testid="track-item-${trackId}"]`
    );
    await expect(refreshedTrackItem).toBeVisible({ timeout: 5000 });

    const optionsButton = refreshedTrackItem.getByTestId(
        `track-item-${trackId}-options-button`
    );
    await expect(optionsButton).toBeVisible({ timeout: 5000 });

    await optionsButton.click();
    await refreshedTrackItem.getByTestId(`delete-track-${trackId}`).click();
    await page.getByTestId("confirm-delete").click();

    await expect(page.getByText("Track deleted successfully!")).toBeVisible({
        timeout: 3000,
    });

    // Verify track is removed from the UI
    await expect
        .poll(
            async () => {
                const response = await page.request.get(
                    "http://localhost:8000/api/tracks"
                );
                const body = await response.json();
                const titles = body.data?.map((t: Track) => t.title) ?? [];
                return titles.includes(uniqueTitle);
            },
            {
                timeout: 3000,
                message: `Track "${uniqueTitle}" still found in API`,
            }
        )
        .toBe(false);
    await waitForTrackToDisappear(page, uniqueTitle);
});
