import React from "react";
import { Sun, Moon, CloudSun } from "lucide-react";

function ShiftIcon({ type }) {
  if (type === "Day Shift") return <Sun className="text-yellow-500 w-5 h-5" />;
  if (type === "Night Shift") return <Moon className="text-blue-700 w-5 h-5" />;
  if (type === "Evening Shift") return <CloudSun className="text-orange-500 w-5 h-5" />;
  return <Sun className="text-gray-400 w-5 h-5" />;
}

export default function ReportList({ reports, users, fields, loading, onReportClick, maxItems }) {
  const displayReports = maxItems ? reports.slice(0, maxItems) : reports;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[#E3E8FF]">
            <th className="py-3 px-4 text-left rounded-tl-[16px]">Date</th>
            <th className="py-3 px-4 text-left">Patient</th>
            <th className="py-3 px-4 text-left">Shift</th>
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Rating</th>
            {fields?.some(f => f.id === "incidentStatus") && (
              <th className="py-3 px-4 text-left">Incident</th>
            )}
            <th className="py-3 px-4 text-left rounded-tr-[16px]"> </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="py-6 text-center">Loading...</td></tr>
          ) : displayReports.length === 0 ? (
            <tr><td colSpan={6} className="py-6 text-center text-gray-500">No reports found.</td></tr>
          ) : (
            displayReports.map(r => (
              <tr
                key={r.id}
                className="border-b last:border-none hover:bg-[#D6F0FF] cursor-pointer transition"
                onClick={() => onReportClick && onReportClick(r)}
              >
                <td className="py-3 px-4">{r.shiftDate ? new Date(r.shiftDate).toLocaleDateString() : "-"}</td>
                <td className="py-3 px-4">{r.patientName || "-"}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <ShiftIcon type={r.shiftType} /> {r.shiftType}
                  {r.incidentStatus && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">Incident</span>
                  )}
                </td>
                <td className="py-3 px-4">{users?.[r.userId]?.displayName || users?.[r.userId]?.email || "Unknown User"}</td>
                <td className="py-3 px-4">{r.overallRating || "-"}</td>
                {fields?.some(f => f.id === "incidentStatus") && (
                  <td className="py-3 px-4">{r.incidentStatus ? "Incident" : "None"}</td>
                )}
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-500 hover:underline text-xs font-medium">View</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 