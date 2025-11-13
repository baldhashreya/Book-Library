import express from "express";
import { connectDB } from "./common/config/db";
import mainRoutes from "./router/main.routes";
import { errors } from "celebrate";
import { errorHandler } from "./common/common-functions";
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

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
