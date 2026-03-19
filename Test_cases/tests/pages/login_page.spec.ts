import test, { expect } from "@playwright/test";
import { LoginPage } from "../components/login";
import * as fs from "fs";
import * as path from "path";

const VALID_EMAIL = "shreya.baldha123@tatvasoft.com";
const VALID_PASSWORD = "Shreya!123";
const DASHBOARD_URL = "http://localhost:5173/dashboard";
const LOGIN_URL = "http://localhost:5173/login";
const TOAST_TIMEOUT = 5_000;

const loadCSV = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const lines = data.split("\n").filter((line: string) => line.trim() !== "");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line: string) => {
    const values = line.split(",");
    const record: any = {};
    headers.forEach((header: string, index: number) => {
      record[header.trim()] = values[index] ? values[index].trim() : "";
    });
    return record;
  });
};

test.describe("Login Page", () => {
  let loginPage: LoginPage;
  const testData = loadCSV(path.join(__dirname, "../../data/login.csv"));

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });
  for (const data of testData) {
    test(`${data.id} | Login test for email: ${data.email || "empty"}`, async ({
      page,
    }) => {
      await loginPage.login(data.email, data.password);

      // Simple heuristic for success/failure based on the CSV data
      if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
        const toast = loginPage.getToastMessage();
        await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
      } else {
        // Ensure we stay on the login page
        await expect(page).toHaveURL(LOGIN_URL);

        if (!data.email) {
          await expect(
            loginPage.getEmailValidationMessage("Email is required"),
          ).toBeVisible();
        } else if (!data.email.includes("@")) {
          await expect(
            loginPage.getEmailValidationMessage("Enter a valid email"),
          ).toBeVisible();
        } else if (!data.password) {
          await expect(loginPage.getPasswordValidationMessage()).toBeVisible();
        } else {
          const toast = loginPage.getToastMessage();
          await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
        }
      }
    });
  }
});

test.describe("Forgot Password", () => {
  const testData = loadCSV(
    path.join(__dirname, "../../data/forgot_password.csv"),
  );
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });
  for (const data of testData) {
    test(`${data.id} | Forgot Password test for email: ${data.email || "empty"}`, async ({
      page,
    }) => {
      await loginPage.forgotPassword(data.email, data.password);

      // Simple heuristic for success/failure based on the CSV data
      if (data.email === VALID_EMAIL && data.password === VALID_PASSWORD) {
        const toast = loginPage.getToastMessage();
        await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
      } else {
        // Ensure we stay on the login page
        await expect(page).toHaveURL(LOGIN_URL);

        if (!data.email) {
          await expect(
            loginPage.getEmailValidationMessage("Email is required"),
          ).toBeVisible();
        } else if (!data.email.includes("@")) {
          await expect(
            loginPage.getEmailValidationMessage("Enter a valid email"),
          ).toBeVisible();
        } else if (!data.password) {
          await expect(loginPage.getPasswordValidationMessage()).toBeVisible();
        } else {
          const toast = loginPage.getToastMessage();
          await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
        }
      }
    });
  }
});

test.describe("Redirect Login to Fargot Password and Fargot Passwor to Login", () => {
  test("Redirect Login to Fargot Password and Fargot Passwor to Login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.clickButton("Forgot Password?");
    await expect(page.getByRole("heading", { name: "Reset Password" })).toBeVisible();
    await loginPage.clickButton("Back to Login");
    await expect(page).toHaveURL(LOGIN_URL);
  })
})
