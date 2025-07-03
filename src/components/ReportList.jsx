import React from "react";
import { Sun, Moon, CloudSun } from "lucide-react";
import { useTranslation } from 'react-i18next';

function ShiftIcon({ type }) {
  if (type === "Day Shift") return <Sun className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5" />;
  if (type === "Night Shift") return <Moon className="text-blue-700 w-4 h-4 sm:w-5 sm:h-5" />;
  if (type === "Evening Shift") return <CloudSun className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />;
  return <Sun className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />;
}

export default function ReportList({ reports, users, fields, loading, onReportClick, maxItems }) {
  const { t } = useTranslation();
  const displayReports = maxItems ? reports.slice(0, maxItems) : reports;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-[#E3E8FF]">
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left rounded-tl-[16px]">{t('reportList.date')}</th>
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">{t('reportList.patient')}</th>
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">{t('reportList.shift')}</th>
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden xs:table-cell">{t('reportList.user')}</th>
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden xs:table-cell">{t('reportList.rating')}</th>
            {fields?.some(f => f.id === "incidentStatus") && (
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden xs:table-cell">{t('reportList.incident')}</th>
            )}
            <th className="py-2 sm:py-3 px-2 sm:px-4 text-left rounded-tr-[16px]"> </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="py-6 text-center">{t('reportList.loading')}</td></tr>
          ) : displayReports.length === 0 ? (
            <tr><td colSpan={6} className="py-6 text-center text-gray-500">{t('reportList.noReports')}</td></tr>
          ) : (
            displayReports.map(r => (
              <tr
                key={r.id}
                className="border-b last:border-none hover:bg-[#D6F0FF] cursor-pointer transition"
                onClick={() => onReportClick && onReportClick(r)}
              >
                <td className="py-2 sm:py-3 px-2 sm:px-4">{r.shiftDate ? new Date(r.shiftDate).toLocaleDateString() : "-"}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4">{r.patientName || "-"}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 flex items-center gap-1 sm:gap-2">
                  <ShiftIcon type={r.shiftType} /> {r.shiftType}
                  {r.incidentStatus && (
                    <span className="ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] sm:text-xs font-bold">Incident</span>
                  )}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 hidden xs:table-cell">{users?.[r.userId]?.displayName || users?.[r.userId]?.email || "Unknown User"}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 hidden xs:table-cell">{r.overallRating || "-"}</td>
                {fields?.some(f => f.id === "incidentStatus") && (
                  <td className="py-2 sm:py-3 px-2 sm:px-4 hidden xs:table-cell">{r.incidentStatus ? "Incident" : "None"}</td>
                )}
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                  <button className="px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base">{t('reportList.view')}</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 