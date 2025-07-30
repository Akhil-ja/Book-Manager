import { createSlice } from "@reduxjs/toolkit";

// Slice to manage notification banners or alerts
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: null,
    type: "info",
    visible: false, // controls visibility of the notification
  },
  reducers: {
    // Show notification with a message and optional type
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.visible = true;
    },
    // Hide and reset the notification
    hideNotification: (state) => {
      state.message = null;
      state.type = "info";
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
