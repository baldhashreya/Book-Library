import { expect, Locator, Page } from "@playwright/test";
import { CommonActions } from "../../utils/common-actions";

export class EditBookPage {
  private page: Page;
  private commonActions: CommonActions;

  readonly titleInput: Locator;
  readonly authorInput: Locator;
  readonly categoryInput: Locator;
  readonly publisherInput: Locator;
  readonly quantityInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);

    this.titleInput = page.locator("#title");
    this.authorInput = page.locator("#author");
    this.categoryInput = page.locator("#category");
    this.publisherInput = page.locator("#publisher");
    this.quantityInput = page.locator("#quantity");
    this.descriptionInput = page.locator("#description");
    this.saveButton = page.getByRole("button", { name: "Update Book" });
  }

  async fillForm(data: any) {
    const LONG_STRING = "A".repeat(5001); // intentionally exceeds 50-char Yup max

    // ── Title ──────────────────────────────────────────────────────────────
    if (data.title === "OMIT") {
      await this.titleInput.clear();
    } else if (data.title === "LONG_STRING") {
      await this.titleInput.fill(LONG_STRING);
    } else if (data.title !== undefined && data.title !== "") {
      await this.titleInput.fill(data.title);
    }

    // ── Dropdowns: Author & Category (always pick first real option) ───────
    const dropdowns = [
      { input: this.authorInput, key: "author" },
      { input: this.categoryInput, key: "category" },
    ];

    for (const dd of dropdowns) {
      if (data[dd.key] === "OMIT") continue; // leave blank to test required
      await dd.input.click();
      const options = this.page.getByRole("option");
      // MUI renders a placeholder first; skip it by trying nth(1), fall back to nth(0)
      await options.nth(1).click().catch(async () => {
        await options.nth(0).click();
      });
    }

    // ── Description ────────────────────────────────────────────────────────
    if (data.description && data.description !== "OMIT") {
      await this.descriptionInput.fill(data.description);
    } else if (data.description === "OMIT") {
      await this.descriptionInput.clear();
    }

    // ── Quantity ───────────────────────────────────────────────────────────
    if (data.quantity === "OMIT") {
      await this.quantityInput.clear();
    } else if (data.quantity !== undefined && data.quantity !== "") {
      // Pass through raw value (including "-5", "NotANumber") so Yup can reject it
      await this.quantityInput.fill(String(data.quantity));
    }
  }

  async save() {
    await this.saveButton.click();
  }

  async verifySuccess() {
    // 1. Check for success notification
    await expect(this.page.getByText(/success/i)).toBeVisible();
    
    // 2. Verify modal closes (heading should disappear)
    await expect(this.page.getByRole('heading', { name: /Edit Book|Update Book/i })).not.toBeVisible();

    // 3. Verify return to listing page (table rows should be visible)
    await expect(this.page.locator('.MuiDataGrid-row').first()).toBeVisible();
  }

  async verifyError(message: string) {
    const regex = new RegExp(message, "i");
    await expect(this.page.locator('body')).toContainText(regex);
  }
}
