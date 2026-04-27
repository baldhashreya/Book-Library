import { test, expect } from "../../src/fixtures/baseFixture";
import * as path from "path";
import { loadCSV } from "../../src/utils/csv-reader";

test.describe("Book Search Page UI Testing via POM", () => {
  // Resolve data payload
  const testData = loadCSV(
    path.join(__dirname, "../../../data/books/search_books.csv")
  );

  test("Batch Search Books from CSV", async ({ bookPage }) => {
    // 1. Initial Navigation (Authenticated via global storageState)
    await bookPage.navigateTo();

    for (const data of testData) {
      // Filter out backend-only edge cases
      if (data.test_type !== "standard") continue;

      await test.step(`${data.test_case_id} | Search Books: ${data.test_case_name}`, async () => {
        // Step A: Trigger Filter GUI
        await bookPage.openFilterDrawer();
        
        // Step B: Inject variables matching DOM inputs
        const title = data.title;
        const author = data.author;
        await bookPage.fillSearchFilters(title, author);
        fvierojwro;vjw0e
        // Step C: Trigger Backend Fetch
        await bookPage.applyFilters();
        
        // Step D: UI Validation Sequence
        const rowCount = await bookPage.verifyResultsReturned();
        
        // Conditional assertions based on explicit search intent
        if (title === "NonExistentBook__1234" || title === "<script>alert('xss')</script>") {
            expect(rowCount).toBe(0); 
        }

        // Optional: Clear filters to ensure clean state for next iteration
        // Actually, opening the filter drawer again will overwrite the values if we use fill()
      });
    }
  });
});
