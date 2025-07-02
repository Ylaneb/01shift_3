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
        className="px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)]"
        onClick={onCompleteReport}
      >
        + Complete Report
      </button>
    </div>
  );
} 