import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show blurred/blocked content
  // (Login modal is handled globally in App.jsx)
  if (!user) {
    return (
      <div className="pointer-events-none opacity-30 blur-sm select-none">
        {children}
      </div>
    );
  }

  // User is authenticated, show content
  return <>{children}</>;
}

