import { expect, Locator, Page } from "@playwright/test";
import { CommonActions } from "../../utils/common-actions";

export class BookPage {
  private page: Page;
  private commonActions: CommonActions;

  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);
  }

  async navigateTo() {
    await this.commonActions.navigateTo("/books");
    try {
      await expect(this.page).toHaveURL(/\/books/, { timeout: 7000 });
    } catch (e) {
      if (this.page.url().includes("/login")) {
        throw new Error("Navigation to /books failed: Redirected to /login. The session (auth.json) likely expired during the run.");
      }
      throw e;
    }
  }

  async clickAddBook() {
    await this.page.getByRole('button', { name: 'Add Book' }).click();
    await expect(this.page.getByRole('heading', { name: 'Add Book' })).toBeVisible();
  }

  async openFilterDrawer() {
    await this.commonActions.clickButton("Filter");
    await expect(this.page.getByRole('heading', { name: 'Filters' })).toBeVisible();
  }

  async fillSearchFilters(title: string, author: string) {
    if (title && title !== "OMIT") {
      await this.page.getByPlaceholder("Enter book name").fill(title);
    }
    if (author && author !== "OMIT") {
      await this.page.getByPlaceholder("Enter author name").fill(author);
    }
  }

  async applyFilters() {
    await this.commonActions.clickButton("Apply Filters");
    await expect(this.page.getByRole('heading', { name: 'Filters' })).not.toBeVisible();
  }
  
  async clearFilters() {
    await this.commonActions.clickButton("Clear");
  }

  async verifyResultsReturned() {
    const hasRows = await this.page.locator('.MuiDataGrid-row').count();
    const emptyOverlay = await this.page.getByText('No rows').count();
    
    expect(hasRows > 0 || emptyOverlay > 0).toBeTruthy();
    return hasRows;
  }
}
