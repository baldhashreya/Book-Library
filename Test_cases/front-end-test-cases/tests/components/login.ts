import { expect, Locator, Page } from "@playwright/test";
import { CommonActions } from "../utils/common";

export class LoginPage {
  private page: Page;
  private commonActions: CommonActions;
  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);
  }
  async fillForm(emailPlaceholder:string,   passwordPlaceholder:string,email: string, password: string) {
    await this.commonActions.fillForm(emailPlaceholder,email);
    await this.commonActions.fillForm(passwordPlaceholder,password);
  }

  async clickButton(buttonText:string) {
    await this.commonActions.clickButton(buttonText);
  }


  getToastMessage(): Locator {
    return this.commonActions.getToastMessage();
  }

  getEmailValidationMessage(message: string = "Email is required"): Locator {
    return this.commonActions.getValidationMessage(message);
  }

  getPasswordValidationMessage(message: string = "Password is required"): Locator {
    return this.commonActions.getValidationMessage(message);
  }


  async login(email: string, password: string) {
    await this.commonActions.navigateTo("/login");
    await this.fillForm("Enter email", "Enter password", email, password);
    await this.clickButton("Sign In");
  }

  async forgotPassword(email: string, password: string) {
    await this.commonActions.navigateTo("/login");
    await this.clickButton("Forgot Password?");
    await expect(this.page.getByRole("heading", { name: "Reset Password" })).toBeVisible();
    await this.fillForm("Enter email", "Enter new password", email, password);
    await this.clickButton("Update Password");
  }

  async redirectForgotPasswordToLogin() {
    await this.commonActions.navigateTo("/login");
    await this.clickButton("Forgot Password?");
    await expect(this.page.getByRole("heading", { name: "Reset Password" })).toBeVisible();
    await this.clickButton("Back to Login");
    await expect(this.page).toHaveURL("/login");
  }

  async redirectSignUpToLogin() {
    await this.commonActions.navigateTo("/login");
    await this.clickButton("SignUp");
    await expect(this.page).toHaveURL("/signup");
    await expect(this.page.getByRole("heading", { name: "Create your TatvaLib account", exact: true })).toBeVisible();
    await this.clickButton("Sign In");
    await expect(this.page.getByRole("heading", { name: "Welcome Back To TatvaLib", exact: true })).toBeVisible();
    await expect(this.page).toHaveURL("/login");
  }
}