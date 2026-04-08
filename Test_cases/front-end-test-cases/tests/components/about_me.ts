import { Page, Locator } from "@playwright/test";
import { CommonActions } from "../utils/common";

export class AboutMe {
  private page: Page;
  private commonActions: CommonActions;

  constructor(page: Page) {
    this.page = page;
    this.commonActions = new CommonActions(page);
  }

  async navigateTo() {
    await this.commonActions.navigateTo("/about-me");
  }

  getProfileTitle(): Locator {
    return this.page.getByRole("heading", { name: "My Profile" });
  }

  getUserName(): Locator {
    return this.page.locator(".user-info h3");
  }

  getUserRole(): Locator {
    return this.page.locator(".user-info .role");
  }

  getUserEmail(): Locator {
    return this.page.locator('label:has-text("Email") + p');
  }

  getUserPhone(): Locator {
    return this.page.locator('label:has-text("Phone") + p');
  }

  getUserAddress(): Locator {
    return this.page.locator('label:has-text("Address") + p');
  }

  getUserStatus(): Locator {
    return this.page.locator(".status-badge");
  }

  async clickUpdateUser() {
    await this.commonActions.clickButton("Update User");
  }

  async clickChangePassword() {
    await this.commonActions.clickButton("Change Password");
  }

  getEditProfileModalTitle(): Locator {
    return this.page.getByRole("heading", { name: "Edit Profile" });
  }

  getChangePasswordModalTitle(): Locator {
    return this.page.getByRole("heading", { name: "Change Password" });
  }
}
