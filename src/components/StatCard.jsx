import React from "react";

export default function StatCard({ icon, label, value, color = "bg-blue-100" }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl shadow ${color}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-lg font-semibold">{value}</div>
        <div className="text-gray-600 text-sm">{label}</div>
      </div>
    </div>
  );
} 