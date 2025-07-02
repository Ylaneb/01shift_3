import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllShiftReports } from "../api/shiftReports";
import StatCard from "../components/StatCard";
import ShiftCard from "../components/ShiftCard";
import ReportListItem from "../components/ReportListItem";
import NewShiftReportForm from "./NewShiftReportForm";
import { Sun, CalendarDays, TrendingUp, FileText, AlertCircle } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const data = await getAllShiftReports();
      setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, [showForm]); // refetch after form closes

  // Stats
  const reportsThisWeek = reports.filter(r => {
    const d = new Date(r.shiftDate);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return d >= weekAgo && d <= now;
  }).length;
  const reportsThisMonth = reports.filter(r => {
    const d = new Date(r.shiftDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const totalReports = reports.length;
  const totalIncidents = reports.filter(r => r.incidentStatus).length;

  // Current shift (latest report or placeholder)
  const currentShift = reports.length > 0 ? reports[0] : null;

  // Recent reports (last 3)
  const recentReports = reports.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back{user ? `, ${user.displayName.split(" ")[0]}!` : "!"}</h1>
      <p className="text-gray-600 mb-6">Ready to complete your shift report?</p>

      <ShiftCard
        icon={<Sun className="text-yellow-500" />}
        shiftType={currentShift ? currentShift.shiftType : "Day Shift"}
        date={currentShift ? formatDate(currentShift.shiftDate) : formatDate(new Date().toISOString())}
        onCompleteReport={() => setShowForm(true)}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <NewShiftReportForm onCreated={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<CalendarDays />} label="Reports This Week" value={reportsThisWeek} color="bg-blue-100" />
        <StatCard icon={<TrendingUp />} label="Reports This Month" value={reportsThisMonth} color="bg-green-100" />
        <StatCard icon={<FileText />} label="Total Reports" value={totalReports} color="bg-purple-100" />
        <StatCard icon={<AlertCircle />} label="Total Incidents" value={totalIncidents} color="bg-red-100" />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Recent Reports</h2>
          <a href="/reports" className="text-blue-600 hover:underline text-sm font-medium">View All</a>
        </div>
        {recentReports.length === 0 ? (
          <div className="text-gray-500">No recent reports.</div>
        ) : (
          <div className="space-y-2">
            {recentReports.map(r => (
              <ReportListItem
                key={r.id}
                icon={<Sun className="text-yellow-500" />}
                shiftType={r.shiftType}
                date={formatDate(r.shiftDate)}
                status={r.overallRating}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 