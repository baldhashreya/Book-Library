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

  async openFirstRowEditModal() {
    const firstRow = this.page.locator('.MuiDataGrid-row').first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
    
    // Get the Edit button in the first row
    const editButton = firstRow.getByLabel("Edit");
    
    // Ensure the button is in view and ready to be clicked
    await editButton.scrollIntoViewIfNeeded();
    
    // Perform a 'force' click if the standard click is blocked by an overlay or ripple
    await editButton.click({ force: true });
    
    // Wait for the modal to appear (flexible heading check)
    await expect(this.page.getByRole('heading', { name: /Edit Book|Update Book/i })).toBeVisible({ timeout: 10000 });
    
    // Return the ID of the first row (so the spec can use it for interception/validation)
    const bookId = await firstRow.getAttribute('data-id');
    console.log(`[BookPage] Successfully opened Edit Modal for Book ID: ${bookId}`);
    return bookId;
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

  async openEditModal(bookId: string, bookTitle?: string) {
    // Attempt to locate row directly first
    const row = this.page.locator(`[data-id="${bookId}"]`);
    
    if (!(await row.isVisible())) {
       console.log(`[BookPage] Book ID ${bookId} not found in current view. Applying filters...`);
       await this.openFilterDrawer();
       await this.fillSearchFilters(bookTitle || bookId, "");
       await this.applyFilters();
       // Wait for grid to reload
       await this.page.waitForSelector('.MuiDataGrid-loadingOverlay', { state: 'detached' });
    }

    await row.getByLabel("Edit").click();
    
    // Wait for the modal to appear (it could be 'Edit Book' or 'Update Book')
    await expect(this.page.getByRole('heading', { name: /Edit Book|Update Book/i })).toBeVisible();
  }
}
