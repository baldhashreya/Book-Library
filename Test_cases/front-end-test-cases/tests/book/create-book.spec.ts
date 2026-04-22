import { test, expect } from "../../src/fixtures/baseFixture";
import * as path from "path";
import * as fs from "fs";
import { loadCSV } from "../../src/utils/csv-reader";

// Read the global auth data
const authPath = path.join(__dirname, "../../.auth/auth.json");
const auth = JSON.parse(fs.readFileSync(authPath, "utf-8"));

/**
 * PRODUCTION-GRADE TEST SUITE: Create Book Functionality
 * Pattern: Data-Driven | POM | Strict Lifecycle (Login-Action-Logout)
 */
test.describe("Create Book - Comprehensive Test Suite", () => {
  // Load data from centralized CSV
  const testData = loadCSV(
    path.join(__dirname, "../../../data/books/create_book_test_data.csv"),
  );

  test.beforeEach(async ({ bookPage, page }) => {
    // Optimization: Avoid full page reload if we are already on the books page
    if (!page.url().endsWith('/') && !page.url().includes('book')) {
      await bookPage.navigateTo();
    }
    await bookPage.clickAddBook();
  });

  for (const data of testData) {
    test(`${data.test_case_id} | Create Book: ${data.title || data.description}`, async ({
      page,
      createBookPage,
    }) => {
      let responsePromise;
      if (data.expected_status_code === "200" || data.expected_status_code === "201") {
        responsePromise = page.waitForResponse(
          (response) =>
            response.url().includes("/books") &&
            response.request().method() === "POST" &&
            !response.url().includes("search")
        );
      }
      // Execute the test steps
      await createBookPage.fillForm(data);
      await createBookPage.submit();

      // 5. Verify the API Response (Faster than waiting for UI text only)
      if ((data.expected_status_code === "200" || data.expected_status_code === "201") && responsePromise) {
        const response = await responsePromise;
        expect(response.ok(), `API failed with status ${response.status()}`).toBeTruthy();
        const payload = JSON.parse(response.request().postData() || "{}");

        // Assert: Author and Category MUST be valid MongoDB ObjectIDs (24 char hex)
        const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

        expect(
          payload.author,
          `Expected Author to be an ObjectID, but got "${payload.author}"`,
        ).toMatch(mongoIdRegex);
        expect(
          payload.category,
          `Expected Category to be an ObjectID, but got "${payload.category}"`,
        ).toMatch(mongoIdRegex);

        await createBookPage.verifySuccess();
      } else {
        // For negative cases (400), we validate the error message in the UI
        const expectedError = data.expected_result;
        await createBookPage.verifyErrorMessage(expectedError);

        // Assert that the modal is still open (submission blocked or failed)
        await expect(page.locator(".modal-content")).toBeVisible();
      }
    });
  }
});
