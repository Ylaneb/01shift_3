import React from "react";
import { Home, FileText, AlertCircle, Clock } from "lucide-react";

export default function HouseCard({ houseNumber, reports, patients, onClick }) {
  // Filter reports for this house
  const houseReports = reports.filter(r => r.house === String(houseNumber));
  
  // Calculate stats
  const recentReports = houseReports.length;
  const incidents = houseReports.filter(r => r.incidentStatus === true).length;
  
  // Get last report date
  const lastReport = houseReports.length > 0 
    ? houseReports.sort((a, b) => new Date(b.submittedAt || b.shiftDate) - new Date(a.submittedAt || a.shiftDate))[0]
    : null;
  
  const lastReportDate = lastReport 
    ? new Date(lastReport.submittedAt || lastReport.shiftDate).toLocaleDateString('he-IL', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 hover:border-[var(--primary-blue)] transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] group aspect-square sm:aspect-auto"
    >
      {/* House Icon & Number - Always visible */}
      <div className="flex flex-col items-center mb-0 sm:mb-3">
        <Home className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[var(--primary-blue)] mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--primary-blue)]">בית {houseNumber}</span>
      </div>

      {/* Stats - Hidden on mobile, visible on sm+ */}
      <div className="hidden sm:block w-full space-y-2 mt-2">
        {/* Patients Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">מטופלים:</span>
          <span className="font-bold text-gray-800">{patients?.length || 0}</span>
        </div>

        {/* Recent Reports */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <FileText className="w-4 h-4" />
            <span>דוחות:</span>
          </div>
          <span className="font-bold text-gray-800">{recentReports}</span>
        </div>

        {/* Incidents */}
        {incidents > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>תקריות:</span>
            </div>
            <span className="font-bold text-red-600">{incidents}</span>
          </div>
        )}

        {/* Last Report Date */}
        {lastReportDate && (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-2 pt-2 border-t border-blue-100">
            <Clock className="w-3 h-3" />
            <span>דוח אחרון: {lastReportDate}</span>
          </div>
        )}

        {!lastReportDate && (
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-blue-100 text-center">
            אין דוחות עדיין
          </div>
        )}
      </div>
    </button>
  );
}

