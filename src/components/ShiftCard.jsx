import React from "react";
import { useTranslation } from 'react-i18next';

// Helper to normalize shiftType keys
const shiftTypeKey = (type) => {
  if (!type) return '';
  // Remove spaces and make first letter uppercase, rest lowercase, or use a mapping
  // Or, more robust: replace spaces with underscores and remove case sensitivity
  return type.replace(/\s+/g, '_');
};

export default function ShiftCard({ icon, shiftType, date, onCompleteReport }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:p-6 rounded-2xl shadow bg-gradient-to-r from-yellow-400 to-orange-400 mb-4 sm:mb-6 gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 w-full">
        <div className="text-2xl sm:text-4xl mb-1 sm:mb-0">{icon}</div>
        <div className="flex flex-col items-center sm:items-start w-full">
          <div className="text-base sm:text-xl font-bold text-white">{t(`shiftTypes.${shiftTypeKey(shiftType)}`)}</div>
          <div className="text-white/90 text-xs sm:text-base">{date}</div>
        </div>
      </div>
      <div className="flex justify-center w-full sm:w-auto">
        <button
          className="px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base"
          onClick={onCompleteReport}
        >
          + {t('actions.completeReport')}
        </button>
      </div>
    </div>
  );
} 