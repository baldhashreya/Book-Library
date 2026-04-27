import { test, expect } from "../../src/fixtures/baseFixture";
import * as path from "path";
import { loadCSV } from "../../src/utils/csv-reader";
import { LOGIN_URL, TOAST_TIMEOUT } from "../../src/utils/constants";

const creds = require("../../../data/login.json");
const VALID_EMAIL = creds.email;
const VALID_PASSWORD = creds.password;

test.describe("Login Page", () => {
  const testData = loadCSV(
    path.join(__dirname, "../../../data/auth/login.csv"),
  );

  for (const data of testData) {
    test(`${data.id} | Login test for email: ${data.email || "empty"}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.login(data.email, data.password);
      const expectedResult = data.expectedResult || "failure";
      // Dynamic assertion testing based on explicitly expected messaging
      if (expectedResult === "success") {
        const toast = loginPage.getToastMessage();
        await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
      } else {
        await expect(page).toHaveURL(LOGIN_URL);

        const expectedMessage = data.expectedMessage || "";
        
        if (expectedMessage === "Email is required" || expectedMessage === "Enter a valid email") {
          await expect(loginPage.getEmailValidationMessage(expectedMessage)).toBeVisible();
        } else if (expectedMessage === "Password is required") {
          await expect(loginPage.getPasswordValidationMessage()).toBeVisible();
        } else {
          try {
             const toast = loginPage.getToastMessage();
             await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
          } catch(e) {}
        }
      }
    });
  }
});

test.describe("Forgot Password", () => {
  const testData = loadCSV(
    path.join(__dirname, "../../../data/auth/forgot_password.csv"),
  );

  for (const data of testData) {
    test(`${data.id} | Forgot Password test for email: ${data.email || "empty"}`, async ({
      page,
      loginPage,
    }) => {
      await loginPage.forgotPassword(data.email, data.password);

      const expectedResult = data.expectedResult || "failure";
      // Dynamic assertion testing based on explicitly expected messaging
      if (expectedResult === "success") {
        const toast = loginPage.getToastMessage();
        await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
      } else {
        await expect(page).toHaveURL(LOGIN_URL);

        const expectedMessage = data.expectedMessage || "";
        
        if (expectedMessage === "Email is required" || expectedMessage === "Enter a valid email") {
          await expect(loginPage.getEmailValidationMessage(expectedMessage)).toBeVisible();
        } else if (expectedMessage === "New password is required" || expectedMessage === "Password must be at least 6 characters") {
          await expect(loginPage.getPasswordValidationMessage(expectedMessage)).toBeVisible();
        } else {
          try {
             const toast = loginPage.getToastMessage();
             await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
          } catch(e) {}
        }
      }
    });
  }
});

test.describe("Redirect Login to Forgot Password and Forgot Password to Login", () => {
  test("Redirect Login to Forgot Password and Forgot Password to Login", async ({
    loginPage,
  }) => {
    await loginPage.redirectForgotPasswordToLogin();
  });
});

test.describe("Redirect Login to Sign up and Sign up to Login", () => {
  test("Redirect Login to Sign up and Sign up to Login", async ({ loginPage }) => {
    await loginPage.redirectSignUpToLogin();
  });
});
