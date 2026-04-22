import { test, expect } from "../../src/fixtures/baseFixture";
const creds = require("../../../data/login.json");

const VALID_EMAIL = creds.email;
const VALID_PASSWORD = creds.password;

test.describe("About Me Page", () => {

  test.beforeEach(async ({ page, loginPage, aboutMePage }) => {
    // Login first
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

    // Wait for dashboard to indicate login is complete
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to about-me
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
