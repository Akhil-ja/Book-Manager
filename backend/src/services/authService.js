import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import STATUS_CODES from "../utils/statusCodes.js";

export const registerUser = async (name, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", STATUS_CODES.CONFLICT);
  }

  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  // Create new user document
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    // Return user data excluding password
    return { _id: user._id, name: user.name, email: user.email };
  } else {
    throw new Error("Invalid user data");
  }
};

export const authUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Email not found", STATUS_CODES.UNAUTHORIZED);
  }

  // Verify provided password matches hashed password in DB
  if (!(await comparePassword(password, user.password))) {
    throw new AppError("Incorrect password", STATUS_CODES.UNAUTHORIZED);
  }

  // Return user info without password field
  return { _id: user._id, name: user.name, email: user.email };
};
