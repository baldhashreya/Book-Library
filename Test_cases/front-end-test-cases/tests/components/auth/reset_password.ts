import { expect, Locator, Page } from "@playwright/test";
import { CommonActions } from "../../utils/common";

export class ResetPasswordPage {
  private page: Page;
  private commonActions: CommonActions;

  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);
  }

  async fillForm(
    emailPlaceholder: string,
    passwordPlaceholder: string,
    email: string,
    password: string,
  ) {
    if (
      email !== null &&
      email !== "EMPTY_FIELD" &&
      email !== "MISSING_EMAIL"
    ) {
      await this.commonActions.fillForm(emailPlaceholder, email);
    }
    if (
      password !== null &&
      password !== "EMPTY_FIELD" &&
      password !== "MISSING_PASSWORD"
    ) {
      await this.commonActions.fillForm(passwordPlaceholder, password);
    }
  }

  async clickButton(buttonText: string) {
    await this.commonActions.clickButton(buttonText);
  }

  getToastMessage(): Locator {
    return this.commonActions.getToastMessage();
  }

  getValidationMessage(message: string): Locator {
    return this.commonActions.getValidationMessage(message);
  }

  async resetPassword(email: string, password: string) {
    await this.commonActions.navigateTo("/login");
    await this.clickButton("Forgot Password?");
    // Added a short wait for transition or directly fill
    await this.fillForm("Enter email", "Enter new password", email, password);
    await this.clickButton("Update Password");
  }
}
