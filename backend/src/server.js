import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import Routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
})); //cors
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser

app.use("/api", Routes);

// Error middleware
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
