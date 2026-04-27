import { test, expect } from "../../src/fixtures/baseFixture";
import { getCredentials } from "../../src/utils/credentials";

const VALID_EMAIL = getCredentials().email;
const VALID_PASSWORD = getCredentials().password;

test.describe("About Me Page", () => {

  test.beforeEach(async ({ aboutMePage }) => {
    // Navigate to about-me (Authenticated via storageState)
    await aboutMePage.navigateTo();
    await expect(aboutMePage.getProfileTitle()).toBeVisible();
  });

  test("should display correct profile information", async ({ aboutMePage }) => {
    await expect(aboutMePage.getUserName()).toBeVisible();
    await expect(aboutMePage.getUserEmail()).toContainText(VALID_EMAIL);
    await expect(aboutMePage.getUserRole()).toBeVisible();
    await expect(aboutMePage.getUserStatus()).toBeVisible();
  });

  test("should open Update User modal", async ({ aboutMePage }) => {
    await aboutMePage.clickUpdateUser();
    await expect(aboutMePage.getEditProfileModalTitle()).toBeVisible();
  });

  test("should open Change Password modal", async ({ aboutMePage }) => {
    await aboutMePage.clickChangePassword();
    await expect(aboutMePage.getChangePasswordModalTitle()).toBeVisible();
  });
});
