import { test, expect } from "../../src/fixtures/baseFixture";
import * as path from "path";
import { loadCSV } from "../../src/utils/csv-reader";

test.describe("Book Search Page UI Testing via POM", () => {
  // Resolve data payload
  const testData = loadCSV(
    path.join(__dirname, "../../../data/books/search_books.csv")
  );

  test.beforeEach(async ({ bookPage }) => {
    // 1. Navigation to the Books/Search page via POM (Authenticated via global storageState)
    await bookPage.navigateTo();
  });

  // 3. Execution payload dynamically mapped
  for (const data of testData) {
    // The CSV contains many backend Edge Cases (missing_body, wrong_method) that 
    // cannot be naturally orchestrated via frontend UI DOM interaction. We skip them to prevent false negatives.
    if (data.test_type !== "standard") continue;

    test(`${data.test_case_id} | Search Books: ${data.test_case_name}`, async ({ bookPage }) => {
      
      // Step A: Trigger Filter GUI
      await bookPage.openFilterDrawer();
      
      // Step B: Inject variables matching DOM inputs. 
      // (CSV holds 'title' and 'author' which UI supports natively)
      const title = data.title;
      const author = data.author;
      await bookPage.fillSearchFilters(title, author);
      
      // Step C: Trigger Backend Fetch
      await bookPage.applyFilters();
      
      // Step D: UI Valdation Sequence
      // For Frontend Testing, we mainly validate if the UI successfully resolved the backend signal
      // Either dropping rows into the view or popping the native 'No rows' GUI empty-state.
      const rowCount = await bookPage.verifyResultsReturned();
      // Conditional assertions based on explicit search intent
      if (title === "NonExistentBook__1234" || title === "<script>alert('xss')</script>") {
          expect(rowCount).toBe(0); 
      }
    });
  }
});
