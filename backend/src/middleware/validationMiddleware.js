import { body, validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

// Validation middleware for user registration
export const validateRegister = [
  // Name must not be empty
  body("name").notEmpty().withMessage("Name is required"),

  // Email must be a valid email format
  body("email").isEmail().withMessage("Please include a valid email"),

  // Password must be at least 6 characters long
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return next(new AppError(errorMessages.join(", "), 400));
    }
    next();
  },
];

// Validation middleware for user login
export const validateLogin = [
  // Email must be valid
  body("email").isEmail().withMessage("Please include a valid email"),

  // Password must not be empty
  body("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return next(new AppError(errorMessages.join(", "), 400));
    }
    next();
  },
];

// Validation middleware for book data
export const validateBook = [
  // Title must not be empty
  body("title").notEmpty().withMessage("Title is required"),

  // Author must not be empty
  body("author").notEmpty().withMessage("Author is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return next(new AppError(errorMessages.join(", "), 400));
    }
    next();
  },
];
