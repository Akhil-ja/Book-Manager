import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}. Please provide a valid ID.`;
    error = new AppError(message, 400);
  }

  // Handle duplicate key error (e.g:duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists. Please use a different ${field}.`;
    error = new AppError(message, 409);
  }

  // Handle mongoose validation errors (required fields, min/max length, etc.)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => {
      let message = val.message;

      if (message.includes("required")) {
        const field = val.path;
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      }
      // Handle unique messages
      else if (message.includes("unique")) {
        const field = val.path;
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be unique.`;
      }
      // Handle minimum length/value messages
      else if (message.includes("min")) {
        message = message.replace(
          /Path `(\w+)`/,
          (match, field) => field.charAt(0).toUpperCase() + field.slice(1)
        );
      }
      // Handle maximum length/value messages
      else if (message.includes("max")) {
        message = message.replace(
          /Path `(\w+)`/,
          (match, field) => field.charAt(0).toUpperCase() + field.slice(1)
        );
      }

      return message;
    });

    const message = messages.length === 1 ? messages[0] : messages.join(". ");
    error = new AppError(message, 400);
  }

  // Handle invalid JWT token
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new AppError(message, 401);
  }

  // Handle expired JWT token
  if (err.name === "TokenExpiredError") {
    const message = "Your session has expired. Please log in again.";
    error = new AppError(message, 401);
  }

  // Handle database connection errors
  if (err.name === "MongoError" || err.name === "MongooseError") {
    const message = "Database connection error. Please try again later.";
    error = new AppError(message, 500);
  }

  // Check if error is operational (expected) or programming error
  const isOperational = error.isOperational || error instanceof AppError;

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  // Set default response message and status code
  let responseMessage = error.message || "Something went wrong";
  let statusCode = error.statusCode || 500;

  // Hide programming error details in production
  if (!isOperational && !isDevelopment) {
    responseMessage = "Something went wrong. Please try again later.";
    statusCode = 500;

    console.error("Programming Error:", err);
  }

  const response = {
    success: false,
    message: responseMessage,
  };

  if (isDevelopment) {
    response.error = err;
    response.stack = err.stack;
  }

  // Send the response
  res.status(statusCode).json(response);
};

export { errorHandler };
