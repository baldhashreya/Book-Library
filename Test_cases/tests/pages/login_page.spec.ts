import test, { expect } from "@playwright/test";
import { LoginPage } from "../components/login";
import * as fs from "fs";
import * as path from "path";
import { LOGIN_URL, DASHBOARD_URL, TOAST_TIMEOUT } from "../utils/constants";

const VALID_EMAIL = process.env.VALID_EMAIL || "";
const VALID_PASSWORD = process.env.VALID_PASSWORD || "";

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
      if (data.expectedResult === "success") {
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
          await expect(
            loginPage.getPasswordValidationMessage("New password is required"),
          ).toBeVisible();
        } else if (data.password && data.password.length < 6) {
          await expect(
            loginPage.getPasswordValidationMessage(
              "Password must be at least 6 characters",
            ),
          ).toBeVisible();
        } else {
          const toast = loginPage.getToastMessage();
          await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
        }
      }
    });
  }
});

test.describe("Redirect Login to Forgot Password and Forgot Password to Login", () => {
  test("Redirect Login to Forgot Password and Forgot Password to Login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.redirectForgotPasswordToLogin();
  })
})

test.describe("Redirect Login to Sign up and Sign up to Login", () => {
  test("Redirect Login to Sign up and Sign up to Login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.redirectSignUpToLogin();
  })
})
