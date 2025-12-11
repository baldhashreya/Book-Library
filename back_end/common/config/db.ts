import mongoose from "mongoose";
import { LogLevel } from "../common-functions/enum";
import { addLog } from "../common-functions/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/book-library");
    addLog(LogLevel.info, "MongoDB Connected");
  } catch (error) {
    addLog(LogLevel.error, "MongoDB Connection Failed", error as Error);
  }

  process.on("SIGINT", async () => {
    // This is sent when you press Ctrl + C in the terminal.
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination (SIGINT)");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    // This is sent by systems or hosting providers (like Docker, PM2, Kubernetes, AWS) when they want your app to stop.
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination (SIGTERM)");
    process.exit(0);
  });
};
