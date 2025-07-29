import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";
import STATUS_CODES from "../utils/statusCodes.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // If no token found, return 401 Unauthorized error
  if (!token) {
    return next(new AppError("Not authorized to access this route", STATUS_CODES.UNAUTHORIZED));
  }

  try {
    // Verify JWT token using secret key
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user by ID stored in payload, exclude password field
    req.user = await User.findById(decoded.id).select("-password");

    // If user not found in DB, return 404 Not Found error
    if (!req.user) {
      return next(new AppError("No user found with this ID", STATUS_CODES.NOT_FOUND));
    }

    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", STATUS_CODES.UNAUTHORIZED));
  }
};
