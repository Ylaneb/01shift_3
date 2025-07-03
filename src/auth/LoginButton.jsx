import React from "react";
import { useAuth } from "./AuthContext";

const buttonClass = "px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base";

export default function LoginButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) return <button className={buttonClass}>Loading...</button>;

  if (!user) {
    return (
      <button
        className={buttonClass}
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
        className={buttonClass}
        onClick={signOutUser}
      >
        Logout
      </button>
    </div>
  );
} 