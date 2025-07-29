import { registerUser, authUser } from "../services/authService.js";
import { sendTokenResponse, generateAccessToken } from "../utils/tokenUtils.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import STATUS_CODES from "../utils/statusCodes.js";

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Call service to register user and create user record
    const user = await registerUser(name, email, password);

    // Send token in response cookies and JSON
    sendTokenResponse(user, STATUS_CODES.CREATED, res);
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/user/login
// @access  Public
export const authUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user credentials
    const user = await authUser(email, password);

    // Send token response upon successful authentication
    sendTokenResponse(user, STATUS_CODES.OK, res);
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Private
export const logoutUserController = (req, res) => {
  // Define common the options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  };

  // Clear both cookies
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(STATUS_CODES.OK).json({ success: true, message: "Logged out" });
};

// @desc    Refresh Access Token
// @route   GET /api/user/refresh
// @access  Public
export const refreshAccessTokenController = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token exists in cookies
  if (!refreshToken) {
    return next(
      new AppError("No refresh token found", STATUS_CODES.UNAUTHORIZED)
    );
  }

  try {
    // Verify refresh token and decode payload
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user by decoded ID in token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError("No user found with this ID", STATUS_CODES.NOT_FOUND)
      );
    }

    // Send new access token in response, reusing token utility
    sendTokenResponse(user, STATUS_CODES.OK, res);
  } catch (error) {
    return next(
      new AppError("Invalid refresh token", STATUS_CODES.UNAUTHORIZED)
    );
  }
};
