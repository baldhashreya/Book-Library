import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async gotoLoginPage() {
    await this.page.goto("http://localhost:5173/login");
  }

  async fillForm(emailPaceholder:string,   passwordPaceholder:string,email: string, password: string) {
    await this.page.getByPlaceholder(emailPaceholder).fill(email);
    await this.page.getByPlaceholder(passwordPaceholder).fill(password);
  }

  async clickButton(buttonText:string) {
    await this.page.getByRole("button", { name: buttonText }).click();
  }


  getToastMessage(): Locator {
    return this.page.getByRole("alert");
  }

  getEmailValidationMessage(message: string = "Email is required"): Locator {
    return this.page.locator(`text=${message}`);
  }

  getPasswordValidationMessage(): Locator {
    return this.page.locator("text=Password is required");
  }


  async login(email: string, password: string) {
    await this.gotoLoginPage();
    await this.fillForm("Enter email", "Enter password", email, password);
    await this.clickButton("Sign In");
  }

  async forgotPassword(email: string, password: string) {
    await this.gotoLoginPage();
    await this.clickButton("Forgot Password?");
    // Wait for the transition to the ForgotPassword component
    await expect(this.page.getByRole("heading", { name: "Reset Password" })).toBeVisible();
    await this.fillForm("Enter email", "Enter new password", email, password);
    await this.clickButton("Update Password");
  }
}