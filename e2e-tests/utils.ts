import { Page, expect } from "@playwright/test";
import { Track } from "../src/types";

export const BASE_URL = "http://localhost:8000";

export async function waitForTrackInApi(
    page: Page,
    title: string,
    timeout = 1000
) {
    await expect
        .poll(
            async () => {
                const response = await page.request.get(
                    `${BASE_URL}/api/tracks`
                );
                const body = await response.json();
                const titles = Array.isArray(body.data)
                    ? body.data.map((t: Track) => t.title)
                    : [];

                return titles.includes(title);
            },
            {
                timeout,
                message: `Track "${title}" was not found in API after ${timeout}ms`,
            }
        )
        .toBe(true);
}

export async function waitForTrackToDisappear(
    page: Page,
    title: string,
    timeout = 5000
) {
    await expect
        .poll(
            async () => {
                return await page.evaluate((title) => {
                    const items = Array.from(
                        document.querySelectorAll('[data-testid^="track-item"]')
                    );
                    return items.some((el) => el.textContent?.includes(title));
                }, title);
            },
            {
                timeout,
                message: `Track "${title}" is still present after ${timeout}ms`,
            }
        )
        .toBe(false);
}
