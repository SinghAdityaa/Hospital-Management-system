
import React from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useApp } from "../../context/AppContext";

export default function ProtectedRoute({
  children,
  roles,
}) {
  const { user, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <main className="auth-page">
        <div className="card auth-card center">
          <p>Checking login...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
