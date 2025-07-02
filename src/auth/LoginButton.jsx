import React from "react";
import { useAuth } from "./AuthContext";

export default function LoginButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) return <button className="px-4 py-2 bg-gray-200 rounded">Loading...</button>;

  if (!user) {
    return (
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
      <span className="font-medium">{user.displayName}</span>
      <button
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        onClick={signOutUser}
      >
        Logout
      </button>
    </div>
  );
} 