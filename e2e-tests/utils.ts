import { Page, expect } from "@playwright/test";
import { Track } from "../src/types";

export async function waitForTrackInApi(
    page: Page,
    title: string,
    timeout = 1000
) {
    let found = false;

    page.on("response", async (response) => {
        if (
            response.url().includes("/tracks") &&
            response.request().method() === "GET"
        ) {
            const body = await response.json();
            const titles = body.data?.map((t: Track) => t.title);
            if (titles?.includes(title)) {
                found = true;
            }
        }
    });

    const start = Date.now();
    while (!found && Date.now() - start < timeout) {
        await page.waitForTimeout(250);
    }

    expect(found).toBe(true);
}

export async function waitForTrackToDisappear(
    page: Page,
    title: string,
    timeout = 5000
) {
    let stillPresent = true;

    const start = Date.now();
    while (stillPresent && Date.now() - start < timeout) {
        const exists = await page.evaluate((title) => {
            const items = Array.from(
                document.querySelectorAll('[data-testid^="track-item"]')
            );
            return items.some((el) => el.textContent?.includes(title));
        }, title);

        if (!exists) {
            stillPresent = false;
            break;
        }

        await page.waitForTimeout(300);
    }

    expect(stillPresent).toBe(false);
}
