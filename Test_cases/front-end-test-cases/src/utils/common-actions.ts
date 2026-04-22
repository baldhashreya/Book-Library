import { Page, Locator } from "@playwright/test";

export class CommonActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async clickButton(buttonText: string) {
    await this.page.getByRole("button", { name: buttonText }).click();
  }

  async fillForm(Placeholder: string, value: string) {
    await this.page.getByPlaceholder(Placeholder).fill(value);
  }

  async selectDropdown(Placeholder: string, value: string) {
    if (!value) {
      return;
    }
    await this.page.getByLabel(Placeholder).click();
    await this.page.getByRole("option", { name: value }).click();
  }

  getToastMessage(): Locator {
    return this.page.getByRole("alert");
  }

  getValidationMessage(message: string): Locator {
    return this.page.getByText(message, { exact: true }).first();
  }
}
