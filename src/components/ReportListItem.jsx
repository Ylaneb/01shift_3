import React from "react";

export default function ReportListItem({ icon, shiftType, date, status, onClick }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50" onClick={onClick}>
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold">{shiftType}</div>
        <div className="text-gray-500 text-sm">{date}</div>
      </div>
      {status && (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{status}</span>
      )}
    </div>
  );
} 