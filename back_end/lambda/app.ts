import express from "express";
<<<<<<< HEAD:back_end/app.ts
import { connectDB } from "./common/config/db";
import mainRoutes from "./src/router/main.routes";
=======
import { connectDB,errorHandler } from "common";
import mainRoutes from "./router/main.routes";
>>>>>>> 74355e3e0d8474fbefe72dfaf8d3a107a1bc230d:back_end/lambda/app.ts
import { errors } from "celebrate";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", mainRoutes);

app.use(errors());
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
