import test, { expect } from "@playwright/test";
import { LoginPage } from "../../components/auth/login";
import { AboutMe } from "../../components/auth/about_me";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const VALID_EMAIL = process.env.VALID_EMAIL || "";
const VALID_PASSWORD = process.env.VALID_PASSWORD || "";

test.describe("About Me Page", () => {
  let loginPage: LoginPage;
  let aboutMePage: AboutMe;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    aboutMePage = new AboutMe(page);

    // Login first
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

    // Wait for dashboard to indicate login is complete
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to about-me
    await aboutMePage.navigateTo();
    await expect(aboutMePage.getProfileTitle()).toBeVisible();
  });

  test("should display correct profile information", async () => {
    await expect(aboutMePage.getUserName()).toBeVisible();
    await expect(aboutMePage.getUserEmail()).toContainText(VALID_EMAIL);
    await expect(aboutMePage.getUserRole()).toBeVisible();
    await expect(aboutMePage.getUserStatus()).toBeVisible();
  });

  test("should open Update User modal", async () => {
    await aboutMePage.clickUpdateUser();
    await expect(aboutMePage.getEditProfileModalTitle()).toBeVisible();
  });

  test("should open Change Password modal", async () => {
    await aboutMePage.clickChangePassword();
    await expect(aboutMePage.getChangePasswordModalTitle()).toBeVisible();
  });
});
