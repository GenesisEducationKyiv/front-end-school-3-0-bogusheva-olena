import { test, expect } from "@playwright/experimental-ct-react";
import DropdownMenuWrapper from "./DropdownMenu.story";

test.use({ viewport: { width: 1024, height: 768 } });

test("renders and collapses DropdownMenu", async ({ mount, page }) => {
    const component = await mount(<DropdownMenuWrapper />);

    const editBtn = component.getByTestId("edit-track-id");
    const deleteBtn = component.getByTestId("delete-track-id");
    const uploadBtn = component.getByTestId("upload-track-id");

    await expect(editBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();
    await expect(uploadBtn).toBeVisible();

    // simulate first click on menu buttons
    await editBtn.click();
    await expect(editBtn).toBeHidden();
    await expect(page.getByTestId("menu-hidden")).toHaveText("Menu closed");

    // ensure buttons are removed from DOM
    await expect(page.getByTestId("edit-track-id")).toHaveCount(0);
    await expect(page.getByTestId("delete-track-id")).toHaveCount(0);
});

