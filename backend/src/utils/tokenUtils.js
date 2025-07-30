import jwt from "jsonwebtoken";

// Generate access token
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

// Generate refresh token
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "5d",
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Access token cookie
  const accessCookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || true,
    sameSite: "none",
  };

  // Refresh token cookie
  const refreshCookieOptions = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || true,
    sameSite: "none",
  };

  // Set cookies with tokens
  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  res.status(statusCode).json({
    success: true,
    user: { _id: user._id, email: user.email },
  });
};
