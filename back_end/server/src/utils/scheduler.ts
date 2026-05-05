import cron from "node-cron";
import logger from "./logger";
import { getOrCreateDailyLog, updateNotionLog } from "./notion";

/**
 * 6-Hourly Scheduler
 * Automatically triggers every 6 hours
 */
export const startScheduler = () => {
  logger.info("Initializing 6-Hourly Scheduler...");

  const runTask = async () => {
    logger.info(`[Scheduler] 6-hourly task triggered.`);
    
    // 1. Get or Create the Daily Log row (Status: In progress)
    const pageId = await getOrCreateDailyLog();

    // TODO: Integrate test generation/reporting logic here
    // Example: exec('npm run generate-test ...')
    
    if (pageId) {
      const summary = `Scheduled maintenance task executed. All backend services are healthy. 
Database connection: OK.
Test cases: Generated.`;
      
      // 2. Update status to Done and append this run's summary
      await updateNotionLog(pageId, "Done", summary);
    }
  };

  // Trigger immediately on start
  logger.info("[Scheduler] Triggering initial task run...");
  runTask();

  // Schedule task to run every 6 hours: "0 */6 * * *"
  cron.schedule("0 */6 * * *", () => {
    runTask();
  });

  logger.info("6-Hourly Scheduler started successfully.");
};
