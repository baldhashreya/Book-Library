import express from "express";
import { connectDB } from "./common/config/db";
import mainRoutes from "./router/main.routes";
import { errors } from "celebrate";
import { errorHandler } from "./common/common-functions";
// import dotenv from "dotenv";

// dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use("/api", mainRoutes);

app.use(errors());
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
