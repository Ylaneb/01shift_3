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
          <svg key={star} className={`w-5 h-5 ${value >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={value >= star ? '#facc15' : 'none'} viewBox="0 0 24 24"><polygon points="12,2 15,8.5 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 9,8.5" /></svg>
        ))}
      </span>
    );
  }
  if (field.type === "emoji") {
    return <span className="text-2xl">{value}</span>;
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 print:bg-transparent print:relative print:inset-auto print:z-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative print:shadow-none print:p-4 print:max-w-full">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl print:hidden" onClick={onClose} aria-label="Close">&times;</button>
        <button onClick={() => window.print()} className="absolute top-2 left-2 text-blue-600 border border-blue-200 rounded px-3 py-1 text-sm font-medium hover:bg-blue-50 transition print:hidden">Print</button>
        <h2 className="text-xl font-bold mb-2">Full Report</h2>
        <div className="mb-2 text-gray-600 text-sm">Submitted by: <span className="font-semibold">{user?.displayName || user?.email || report.userId}</span></div>
        <div className="mb-4 text-gray-600 text-sm">Date: {formatDate(report.shiftDate)}</div>
        <div className="space-y-2">
          {/* System fields */}
          {systemFields.map(field => (
            <div key={field.id} className="flex justify-between border-b pb-1">
              <span className="font-medium">{field.label}</span>
              <span>{report[field.id] || "-"}</span>
            </div>
          ))}
          {/* Dynamic fields */}
          {fields.map(field => (
            <div key={field.id} className="flex justify-between border-b pb-1">
              <span className="font-medium">{field.label}</span>
              {renderFieldValue(field, report[field.id])}
            </div>
          ))}
          {/* Notes field */}
          {report.notes && (
            <div className="pt-3">
              <div className="font-medium mb-1">Notes</div>
              <div className="bg-gray-50 rounded p-2 whitespace-pre-line border text-gray-700">{report.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 