import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
