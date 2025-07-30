import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  // If the initial authentication check is not yet complete, show a loading state
  if (!isAuthChecked) {
    return <div>Checking authentication...</div>;
  }

  // If authentication check is complete and no user is present, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authentication check is complete and user is present, render the protected content
  return <Outlet />;
};

export default PrivateRoute;
