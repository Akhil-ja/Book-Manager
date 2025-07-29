import express from "express";
import {
  getBooksController,
  createBookController,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBook } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getBooksController);

//Protected Route
router.post("/", protect, validateBook, createBookController);

export default router;
