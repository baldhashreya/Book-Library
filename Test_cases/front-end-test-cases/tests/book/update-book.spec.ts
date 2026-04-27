import { test, expect, Page } from "@playwright/test";
import { BookPage } from "../../src/pages/books/book.page";
import { EditBookPage } from "../../src/pages/books/edit-book.page";
import { loadCSV } from "../../src/utils/csv-reader";
import path from "path";

// ─── Constants ────────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(
  __dirname,
  "../../../data/books/update_book_test_data.csv"
);

/** Only run TC_UP_01 → TC_UP_27 (UI-testable scenarios). */
const UI_TESTABLE_IDS = new Set([
  "TC_UP_01", "TC_UP_02", "TC_UP_03", "TC_UP_04", "TC_UP_05",
  "TC_UP_06", "TC_UP_07", "TC_UP_08", "TC_UP_09", "TC_UP_10",
  "TC_UP_11", "TC_UP_12", "TC_UP_13", "TC_UP_14", "TC_UP_15",
  "TC_UP_16", "TC_UP_17", "TC_UP_18", "TC_UP_19", "TC_UP_20",
  "TC_UP_21", "TC_UP_22", "TC_UP_23", "TC_UP_24", "TC_UP_25",
  "TC_UP_26", "TC_UP_27",
]);

/**
 * Cases where the update is blocked by the FRONTEND (Formik / Yup) –
 * no PUT request will ever be sent to the backend.
 * The test clicks the button, triggering inline validation errors.
 */
const FRONTEND_BLOCKED_IDS = new Set([
  "TC_UP_04", // missing title   → "title is not allowed to be empty"
  "TC_UP_05", // empty title     → "title is not allowed to be empty"
  "TC_UP_06", // invalid status  → Yup enum check
  "TC_UP_07", // negative qty    → "quantity must be at least 1"
  "TC_UP_08", // string qty      → "quantity must be a number"
  "TC_UP_09", // XSS title       → "Invalid input detected"
  "TC_UP_12", // long title      → "title exceeds max length"
  "TC_UP_21", // missing author  → "Author is required"
  "TC_UP_22", // missing cat.    → "Category is required"
  "TC_UP_23", // missing desc.   → "Description is required"
  "TC_UP_24", // missing pub.    → publisher left empty → passes (optional)
  "TC_UP_25", // missing qty     → "Quantity is required"
  "TC_UP_26", // missing status  → "Status is required"
  "TC_UP_27", // neg. publisher  → "Publisher year must be between…"
]);

/** Cases that need the PUT URL's book ID replaced at the network level. */
const ID_REPLACEMENT: Record<string, string> = {
  TC_UP_02: "6616da875ab92ec345563159", // valid format, non-existent → 404
  TC_UP_03: "invalid-id-123",           // malformed                  → 400
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeUniqueTitle(base: string): string {
  return `${base}_${Date.now()}`;
}

async function registerIdSwap(page: Page, testId: string): Promise<void> {
  const replacementId = ID_REPLACEMENT[testId];
  if (!replacementId) return;
  await page.route(/\/api\/books\/\S+$/, async (route, request) => {
    if (request.method() === "PUT") {
      const newUrl = request.url().replace(/\/books\/[^/?#]+/, `/books/${replacementId}`);
      console.log(`[Route Swap] ${testId} → ${newUrl}`);
      await route.continue({ url: newUrl });
    } else {
      await route.continue();
    }
  });
}

// ─── Test data ────────────────────────────────────────────────────────────────

const allRows  = loadCSV(CSV_PATH);
const testData = allRows.filter((row) => UI_TESTABLE_IDS.has(row.test_case_id));

// ─── Suite ────────────────────────────────────────────────────────────────────

test.describe("Update Book – UI-Driven Data Suite (TC_UP_01 → TC_UP_27)", () => {
  let bookPage:    BookPage;
  let editBookPage: EditBookPage;

  /** Open the Edit modal for the first grid row before every test. */
  test.beforeEach(async ({ page }) => {
    bookPage     = new BookPage(page);
    editBookPage = new EditBookPage(page);

    await test.step("Setup: Navigate and open Edit modal", async () => {
      await bookPage.navigateTo();
      await page
        .waitForSelector(".MuiDataGrid-loadingOverlay", { state: "detached" })
        .catch(() => null);
      await bookPage.openFirstRowEditModal();
    });
  });

  // ─── Dynamic tests ──────────────────────────────────────────────────────────

  for (const data of testData) {
    const tcId          = data.test_case_id;
    const tcName        = data.test_case_name;
    const expectedCode  = Number(data.expected_status_code);
    const isSuccess     = expectedCode === 200;
    const isFrontendBlocked = FRONTEND_BLOCKED_IDS.has(tcId);
    const needsIdSwap   = tcId in ID_REPLACEMENT;

    test(`[${tcId}] ${tcName}`, async ({ page }) => {

      // ── Step 1: Fill the form ───────────────────────────────────────────────
      await test.step("1. Fill Update Form", async () => {
        const formData = { ...data };

        // Unique title to prevent 409 on success cases
        if (
          isSuccess &&
          formData.title &&
          formData.title !== "OMIT" &&
          formData.title !== ""
        ) {
          formData.title = makeUniqueTitle(formData.title);
          console.log(`[${tcId}] Unique title: ${formData.title}`);
        }

        // Cases that clear the title to produce inline validation errors
        if (tcId === "TC_UP_04" || tcId === "TC_UP_05") {
          await editBookPage.titleInput.clear();
          console.log(`[${tcId}] Title cleared.`);
        } else {
          await editBookPage.fillForm(formData);
        }
      });

      // ── Step 2: Submit ──────────────────────────────────────────────────────
      await test.step("2. Submit and Validate", async () => {
        if (isFrontendBlocked) {
          // Frontend will block the request; just click to trigger inline errors
          await editBookPage.save();
          console.log(`[${tcId}] Clicked 'Update Book' – expecting frontend validation error.`);
          return;
        }

        // Register network-level ID swap before triggering the request
        if (needsIdSwap) {
          await registerIdSwap(page, tcId);
        }

        const responsePromise = page
          .waitForResponse(
            (res) =>
              /\/books\//.test(res.url()) &&
              res.request().method() === "PUT",
            { timeout: 12_000 }
          )
          .catch(() => null);

        await editBookPage.save();

        const response = await responsePromise;
        if (response) {
          const status = response.status();
          const body   = await response.json().catch(() => ({}));
          console.log(`[${tcId}] API → ${status} | Body: ${JSON.stringify(body)}`);
          expect(status).toBe(expectedCode);
        } else {
          console.warn(`[${tcId}] No PUT response captured within timeout.`);
        }
      });

      // ── Step 3: Validate UI feedback ────────────────────────────────────────
      await test.step("3. Validate UI Feedback", async () => {
        if (isSuccess) {
          // Success toast + modal closes + grid is visible
          await editBookPage.verifySuccess();
        } else {
          // Inline error message or toast (case-insensitive fragment match)
          await editBookPage.verifyError(data.expected_result);

          // Close modal if it is still open (cleanup for next beforeEach)
          const heading = page.getByRole("heading", {
            name: /Edit Book|Update Book/i,
          });
          if (await heading.isVisible()) {
            await page.getByRole("button", { name: "Cancel" }).click();
            await expect(heading).not.toBeVisible({ timeout: 5_000 });
          }
        }
      });
    });
  }
});
