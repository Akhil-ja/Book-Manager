import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // If no token found, return 401 Unauthorized error
  if (!token) {
    return next(new AppError("Not authorized to access this route", 401));
  }

  try {
    // Verify JWT token using secret key
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user by ID stored in payload, exclude password field
    req.user = await User.findById(decoded.id).select("-password");

    // If user not found in DB, return 404 Not Found error
    if (!req.user) {
      return next(new AppError("No user found with this ID", 404));
    }

    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};
