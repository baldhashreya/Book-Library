import { Locator, Page } from "@playwright/test";

export class LoginPage {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async gotoLoginPage() {
    await this.page.goto("http://localhost:5173/login");
  }

  async fillLoginForm(email: string, password: string) {
    await this.page.getByPlaceholder("Email").fill(email);
    await this.page.getByPlaceholder("Password").fill(password);
  }

  async clickLoginButton() {
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

  getToastMessage(): Locator {
    return this.page.getByRole("alert");
  }

  async login(email: string, password: string) {
    await this.gotoLoginPage();
    await this.fillLoginForm(email, password);
    await this.clickLoginButton();
  }
}