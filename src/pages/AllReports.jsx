import React, { useEffect, useState } from "react";
import { getAllShiftReports } from "../api/shiftReports";
import { useAuth } from "../auth/AuthContext";
import { Sun, Moon, CloudSun } from "lucide-react";
import { getUser } from "../api/users";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

function ShiftIcon({ type }) {
  if (type === "Day Shift") return <Sun className="text-yellow-500 w-5 h-5" />;
  if (type === "Night Shift") return <Moon className="text-blue-700 w-5 h-5" />;
  if (type === "Evening Shift") return <CloudSun className="text-orange-500 w-5 h-5" />;
  return <Sun className="text-gray-400 w-5 h-5" />;
}

function IncidentBadge({ status }) {
  return status ? (
    <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">Incident</span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">None</span>
  );
}

function ReportModal({ open, onClose, report, user, fields }) {
  if (!open || !report) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose} aria-label="Close">&times;</button>
        <h2 className="text-xl font-bold mb-2">Full Report</h2>
        <div className="mb-2 text-gray-600 text-sm">Submitted by: <span className="font-semibold">{user?.displayName || report.userId}</span></div>
        <div className="mb-4 text-gray-600 text-sm">Date: {formatDate(report.shiftDate)}</div>
        <div className="space-y-2">
          {fields.map(field => (
            <div key={field.id} className="flex justify-between border-b pb-1">
              <span className="font-medium">{field.label}</span>
              <span>{String(report[field.id] ?? "-")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AllReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    async function fetchReportsAndUsers() {
      setLoading(true);
      const data = await getAllShiftReports();
      setReports(data);
      // Fetch unique userIds
      const userIds = Array.from(new Set(data.map(r => r.userId)));
      const userMap = {};
      for (const uid of userIds) {
        userMap[uid] = await getUser(uid);
      }
      setUsers(userMap);
      setLoading(false);
    }
    fetchReportsAndUsers();
  }, []);

  // Fetch form fields for modal display
  useEffect(() => {
    import("../api/formFields").then(mod => {
      mod.getAllFormFields().then(setFields);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Reports</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Shift</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Incident</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-6 text-center">Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-500">No reports found.</td></tr>
            ) : (
              reports.map(r => (
                <tr
                  key={r.id}
                  className="border-b last:border-none hover:bg-blue-50 cursor-pointer"
                  onClick={() => { setSelectedReport(r); setModalOpen(true); }}
                >
                  <td className="py-3 px-4 flex items-center gap-2"><ShiftIcon type={r.shiftType} /> {r.shiftType}</td>
                  <td className="py-3 px-4">{formatDate(r.shiftDate)}</td>
                  <td className="py-3 px-4">{users[r.userId]?.displayName || r.userId}</td>
                  <td className="py-3 px-4">{r.overallRating || "-"}</td>
                  <td className="py-3 px-4"><IncidentBadge status={r.incidentStatus} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        report={selectedReport}
        user={users[selectedReport?.userId]}
        fields={fields}
      />
    </div>
  );
} 