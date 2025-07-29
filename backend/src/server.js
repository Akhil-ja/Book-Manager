import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors()); //cors
app.use(express.json()); // Body parser

app.get("/", (req, res) => {
  res.send("Hello");
});

// Error middleware
app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
