import React from "react";

export default function StatCard({ icon, label, value, color = "bg-blue-100", small }) {
  if (small) {
    return (
      <div className={`flex flex-col items-center justify-center aspect-square min-w-0 p-2 rounded-xl shadow ${color}`}>
        <div className="text-xl mb-1">{icon}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-3 p-2 sm:p-4 rounded-xl shadow ${color}`}>
      <div className="text-xl sm:text-2xl">{icon}</div>
      <div>
        <div className="text-base sm:text-lg font-semibold">{value}</div>
        <div className="text-gray-600 text-xs sm:text-sm">{label}</div>
      </div>
    </div>
  );
} 