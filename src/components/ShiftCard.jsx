import React from "react";

export default function ShiftCard({ icon, shiftType, date, onCompleteReport }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl shadow bg-gradient-to-r from-yellow-400 to-orange-400 mb-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <div className="text-xl font-bold text-white">{shiftType}</div>
          <div className="text-white/90">{date}</div>
        </div>
      </div>
      <button
        className="px-5 py-2 bg-white/30 text-white font-semibold rounded-lg hover:bg-white/50 transition"
        onClick={onCompleteReport}
      >
        + Complete Report
      </button>
    </div>
  );
} 