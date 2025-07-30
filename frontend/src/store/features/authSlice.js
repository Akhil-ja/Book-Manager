import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import { showNotification } from "./notificationSlice";

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/register", userData);
      dispatch(
        showNotification({
          message: "Registration successful!",
          type: "success",
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Registration failed",
          type: "danger",
        })
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", userData);
      dispatch(
        showNotification({ message: "Login successful!", type: "success" })
      );
      return response.data.user;
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Login failed",
          type: "danger",
        })
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/logout");
      dispatch(
        showNotification({
          message: "Logged out successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: error.response?.data?.message || "Logout failed",
          type: "danger",
        })
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Refresh auth token (used for maintaining session)
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshAuthToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/refresh");
      return response.data.user;
    } catch (error) {
      console.error(
        "Token refresh failed:",
        error.response?.data?.message || error.message
      );
      dispatch(
        showNotification({
          message:
            error.response?.data?.message ||
            "Session expired. Please log in again.",
          type: "danger",
        })
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Auth slice manages user authentication state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
    isAuthChecked: false, // flag to track initial auth check
  },
  reducers: {
    authCheckComplete: (state) => {
      // Mark initial token check as done
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register reducers
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Login reducers
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Logout reducer
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // Refresh token reducers
      .addCase(refreshAuthToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.user = null;
      });
  },
});

export const { authCheckComplete } = authSlice.actions;

export default authSlice.reducer;
