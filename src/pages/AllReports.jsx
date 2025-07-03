import React, { useEffect, useState } from "react";
import { getAllShiftReports } from "../api/shiftReports";
import { useAuth } from "../auth/AuthContext";
import { Sun, Moon, CloudSun } from "lucide-react";
import { getUser } from "../api/users";
import ReportList from "../components/ReportList";
import ReportModal from "../components/ReportModal";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

export default function AllReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fields, setFields] = useState([]);
  // Filters
  const [filterShift, setFilterShift] = useState("");
  const [filterPatient, setFilterPatient] = useState("");
  const [filterIncident, setFilterIncident] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [search, setSearch] = useState("");

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

  // Filtering logic
  const filteredReports = reports.filter(r => {
    if (filterShift && r.shiftType !== filterShift) return false;
    if (filterPatient && !(r.patientName || "").toLowerCase().includes(filterPatient.toLowerCase())) return false;
    if (filterIncident && ((filterIncident === "yes" && !r.incidentStatus) || (filterIncident === "no" && r.incidentStatus))) return false;
    if (filterDateFrom && new Date(r.shiftDate) < new Date(filterDateFrom)) return false;
    if (filterDateTo && new Date(r.shiftDate) > new Date(filterDateTo)) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!((r.patientName || "").toLowerCase().includes(s) || (r.house || "").toLowerCase().includes(s) || (users[r.userId]?.displayName || "").toLowerCase().includes(s))) return false;
    }
    return true;
  })
  // Sort by submittedAt descending
  .sort((a, b) => {
    const dateA = new Date(a.submittedAt);
    const dateB = new Date(b.submittedAt);
    return dateB - dateA;
  });

  return (
    <div className="max-w-5xl w-full mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-[color:var(--primary-blue)] drop-shadow">All Reports</h1>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2 items-end bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-4">
        <input
          type="text"
          placeholder="Search by patient, house, or user..."
          className="border border-blue-100 rounded px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border border-blue-100 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
          <option value="">All Shifts</option>
          <option value="Day Shift">Day Shift</option>
          <option value="Night Shift">Night Shift</option>
          <option value="Evening Shift">Evening Shift</option>
        </select>
        <input
          type="text"
          placeholder="Patient Name"
          className="border border-blue-100 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
          value={filterPatient}
          onChange={e => setFilterPatient(e.target.value)}
        />
        <select className="border border-blue-100 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none" value={filterIncident} onChange={e => setFilterIncident(e.target.value)}>
          <option value="">All Incidents</option>
          <option value="yes">Incident</option>
          <option value="no">No Incident</option>
        </select>
        <input
          type="date"
          className="border border-blue-100 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="border border-blue-100 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
        />
      </div>
      <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-4 sm:p-6">
        <ReportList
          reports={filteredReports}
          users={users}
          fields={fields}
          loading={loading}
          onReportClick={r => { setSelectedReport(r); setModalOpen(true); }}
        />
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