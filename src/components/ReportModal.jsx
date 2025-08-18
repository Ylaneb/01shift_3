import React from "react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

// Helper to render field values visually
function renderFieldValue(field, value) {
  if (field.type === "star") {
    return (
      <span className="flex gap-1 items-center">
        {[1,2,3,4,5].map(star => (
          <svg key={star} className={`w-4 h-4 sm:w-5 sm:h-5 ${value >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={value >= star ? '#facc15' : 'none'} viewBox="0 0 24 24"><polygon points="12,2 15,8.5 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 9,8.5" /></svg>
        ))}
      </span>
    );
  }
  if (field.type === "emoji") {
    return <span className="text-xl sm:text-2xl">{value}</span>;
  }
  if (field.type === "yesno") {
    return <span>{value ? "Yes" : "No"}</span>;
  }
  return <span>{String(value ?? "-")}</span>;
}

// System fields config
const systemFields = [
  { id: "shiftType", label: "Shift Type" },
  { id: "house", label: "House" },
  { id: "patientName", label: "Patient Name" },
  { id: "shiftDate", label: "Date" },
];

export default function ReportModal({ open, onClose, report, user, fields }) {
  if (!open || !report) return null;

  const visibleFields = fields.filter(field => {
    if (!field.shiftTypes || field.shiftTypes.length === 0) return true;
    return field.shiftTypes.includes(report.shiftType);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 print:bg-transparent print:relative print:inset-auto print:z-auto">
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 w-full max-w-xs sm:max-w-lg relative print:shadow-none print:p-4 print:max-w-full max-h-[90vh] overflow-y-auto">
        <button className="absolute top-2 right-2 print:hidden px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base" onClick={onClose} aria-label="Close">&times;</button>
        <button onClick={() => window.print()} className="absolute top-2 left-2 print:hidden px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base">Print</button>
        <h2 className="text-lg sm:text-xl font-bold mb-2">Full Report</h2>
        <div className="mb-2 text-gray-600 text-xs sm:text-sm">Submitted by: <span className="font-semibold">{user?.displayName || user?.email || report.userId}</span></div>
        <div className="mb-4 text-gray-600 text-xs sm:text-sm">Date: {formatDate(report.shiftDate)}</div>
        <div className="space-y-2">
          {/* System fields */}
          {systemFields.map(field => (
            <div key={field.id} className="flex justify-between border-b pb-1 text-xs sm:text-base">
              <span className="font-medium">{field.label}</span>
              <span>{report[field.id] || "-"}</span>
            </div>
          ))}
          {/* Dynamic fields */}
          {visibleFields.map(field => (
            <div key={field.id} className="flex justify-between border-b pb-1 text-xs sm:text-base">
              <span className="font-medium">{field.label}</span>
              {renderFieldValue(field, report[field.id])}
            </div>
          ))}
          {/* Notes field */}
          {report.notes && (
            <div className="pt-3">
              <div className="font-medium mb-1 text-xs sm:text-base">Notes</div>
              <div className="bg-gray-50 rounded p-2 whitespace-pre-line border text-gray-700 text-xs sm:text-base">{report.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 