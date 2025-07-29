import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}. Please provide a valid ID.`;
    error = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists. Please use a different ${field}.`;
    error = new AppError(message, 409);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => {
      let message = val.message;

      if (message.includes("required")) {
        const field = val.path;
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      } else if (message.includes("unique")) {
        const field = val.path;
        message = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be unique.`;
      } else if (message.includes("min")) {
        message = message.replace(
          /Path `(\w+)`/,
          (match, field) => field.charAt(0).toUpperCase() + field.slice(1)
        );
      } else if (message.includes("max")) {
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

  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your session has expired. Please log in again.";
    error = new AppError(message, 401);
  }

  if (err.name === "MongoError" || err.name === "MongooseError") {
    const message = "Database connection error. Please try again later.";
    error = new AppError(message, 500);
  }

  const isOperational = error.isOperational || error instanceof AppError;

  const isDevelopment = process.env.NODE_ENV === "development";

  let responseMessage = error.message || "Something went wrong";
  let statusCode = error.statusCode || 500;

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

  res.status(statusCode).json(response);
};

export { errorHandler };
