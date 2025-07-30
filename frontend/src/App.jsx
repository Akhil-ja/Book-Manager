/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshAuthToken,
  authCheckComplete,
} from "./store/features/authSlice";
import GlobalSnackbar from "./components/GlobalSnackbar";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
  const dispatch = useDispatch();
  const { user, status, isAuthChecked } = useSelector((state) => state.auth);
  const hasRefreshed = useRef(false); // Prevents multiple token refreshes
  const location = useLocation();

  useEffect(() => {
    // Try refreshing token only once, and only if not on login/register page
    if (
      !hasRefreshed.current &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      hasRefreshed.current = true;
      console.log("Dispatching refreshAuthToken...");
      dispatch(refreshAuthToken()).finally(() => {
        dispatch(authCheckComplete());
      });
    } else if (!hasRefreshed.current) {
      // If on login or register, skip refresh but still mark auth check done
      hasRefreshed.current = true;
      dispatch(authCheckComplete());
    }
  }, [dispatch, location.pathname]);

  // Show loading spinner until auth check is done
  if (!isAuthChecked) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={60} />
        <p style={{ marginTop: "20px", fontSize: "1.2em" }}>
          Loading application...
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <CircularProgress />
          </div>
        }
      >
        <Outlet /> {/* Renders child routes */}
      </Suspense>
      <GlobalSnackbar /> {/* Global notification component */}
    </>
  );
}

export default App;
