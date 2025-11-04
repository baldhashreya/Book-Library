import { MongoClient, Db } from "mongodb";
import { logger } from "../logger";
import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/book-library");
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error("MongoDB Connection Failed", error as Error);
  }

  process.on("SIGINT", async () => {      // This is sent when you press Ctrl + C in the terminal.
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination (SIGINT)");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {     // This is sent by systems or hosting providers (like Docker, PM2, Kubernetes, AWS) when they want your app to stop.
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination (SIGTERM)");
    process.exit(0);
  });
};
