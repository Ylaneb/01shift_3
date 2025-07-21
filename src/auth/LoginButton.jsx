import React from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@heroui/react";

export default function LoginButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) return <Button>Loading...</Button>;

  if (!user) {
    return (
      <Button onClick={signInWithGoogle}>
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
      <span className="font-medium">{user.displayName}</span>
      <Button onClick={signOutUser}>
        Logout
      </Button>
    </div>
  );
} 