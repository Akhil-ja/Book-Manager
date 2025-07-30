import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import React, { lazy } from "react";

// Lazy load route components
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

import PrivateRoute from "../components/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Top-level layout or wrapper
    children: [
      {
        path: "login",
        element: <Login />, // Public route
      },
      {
        path: "register",
        element: <Register />, // Public route
      },
      {
        path: "/", // Protected section
        element: <PrivateRoute />, // Checks auth before rendering nested routes
        children: [
          {
            path: "home",
            element: <Home />, // Accessible only when authenticated
          },
        ],
      },
    ],
  },
]);
