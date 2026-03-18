import test, { expect } from "@playwright/test";
import { LoginPage } from "../components/login";

const VALID_EMAIL = "shreya.baldha123@tatvasoft.com";
const VALID_PASSWORD = "Shreya!123";
const WRONG_PASSWORD = "WrongPass@999";
const WRONG_EMAIL = "notregistered@example.com";
const DASHBOARD_URL = "http://localhost:5173/dashboard";
const LOGIN_URL = "http://localhost:5173/login";

const TOAST_TIMEOUT = 6_000;

test.describe("Login Page : Toast Notification Tests", () => {
  let loginPage: any;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test("TC-01 | Successful login redirects to dashboard", async ({ page }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await page.screenshot({ path: 'test-result\success\login\viewport.png' });
    await expect(page).toHaveURL(DASHBOARD_URL);
  });

  test("TC-02 | Wrong password : toast is visible", async ({ page }) => {
    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-03 | Wrong password : toast contains error text", async ({
    page,
  }) => {
    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);

    const toast = loginPage.getToastMessage();
    await expect(toast).toContainText(/invalid|incorrect|wrong|failed/i, {
      timeout: TOAST_TIMEOUT,
    });
  });

  test("TC-04 | Wrong password : user stays on login page", async ({
    page,
  }) => {
    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);
    await expect(page).toHaveURL(LOGIN_URL);
  });

  test("TC-05 | Unregistered email : toast is visible", async ({ page }) => {
    await loginPage.login(WRONG_EMAIL, VALID_PASSWORD);

    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-06 | Unregistered email : toast contains error text", async ({
    page,
  }) => {
    await loginPage.login(WRONG_EMAIL, VALID_PASSWORD);

    const toast = loginPage.getToastMessage();
    await expect(toast).toContainText(/invalid|not found|incorrect|failed/i, {
      timeout: TOAST_TIMEOUT,
    });
  });

  test("TC-07 | Empty email : toast/validation message appears", async ({
    page,
  }) => {
    await loginPage.login("", VALID_PASSWORD);
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-08 | Empty password : toast/validation message appears", async ({
    page,
  }) => {
    await loginPage.login(VALID_EMAIL, "");
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-09 | Both fields empty : toast/validation message appears", async ({
    page,
  }) => {
    await loginPage.login("", "");
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-10 | Invalid email format : toast/validation message appears", async ({
    page,
  }) => {
    await loginPage.login("not-an-email", VALID_PASSWORD);
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
  });

  test("TC-11 | Error toast auto-dismisses after display", async ({ page }) => {
    await loginPage.login(VALID_EMAIL, WRONG_PASSWORD);
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
    await expect(toast).not.toBeVisible({ timeout: 10_000 });
  });

  test("TC-12 | SQL injection in email : shows error toast, no crash", async ({
    page,
  }) => {
    await loginPage.login("' OR '1'='1", "' OR '1'='1");
    const toast = loginPage.getToastMessage();
    await expect(toast).toBeVisible({ timeout: TOAST_TIMEOUT });
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
