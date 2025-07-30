import axios from "axios";
import { store } from "../store/store";
import { logout, refreshAuthToken } from "../store/features/authSlice";
import { showNotification } from "../store/features/notificationSlice";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/*
axiosInstance.interceptors.request.use(
  (config) => {
    const { user } = store.getState().auth;
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

// Response interceptor to handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error status is 401 and not a retry attempt, and not the refresh token endpoint itself
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/refresh" &&
      originalRequest.url !== "/user/login"
    ) {
      originalRequest._retry = true;

      try {
        // Dispatch refresh token action
        const resultAction = await store.dispatch(refreshAuthToken());

        // If refresh is successful, update the original request with new token and retry
        if (refreshAuthToken.fulfilled.match(resultAction)) {
          return axiosInstance(originalRequest);
        } else {
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    } else if (
      error.response &&
      error.response.status !== 401 &&
      originalRequest.url !== "/user/logout"
    ) {
      const message = error.response.data?.message || error.message;
      store.dispatch(showNotification({ message, type: "danger" }));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
