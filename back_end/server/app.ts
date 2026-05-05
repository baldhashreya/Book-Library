import express from "express";
import { connectDB, errorHandler } from "common";
import mainRoutes from "./router/main.routes";
import { errors } from "celebrate";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./src/utils/logger";

dotenv.config();

import { requestLogger } from "./src/middleware/loggerMiddleware";

import { startScheduler } from "./src/utils/scheduler";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api", mainRoutes);

app.use(errors());
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
  connectDB();
  startScheduler();
});
 
 
 
 
 
 
