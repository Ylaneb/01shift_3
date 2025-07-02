import React, { useEffect, useState } from "react";
import { getAllShiftReports } from "../api/shiftReports";

export default function ShiftReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllShiftReports();
        setReports(data);
      } catch (err) {
        setError("Failed to fetch reports");
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Shift Reports</h2>
      {reports.length === 0 ? (
        <div>No reports found.</div>
      ) : (
        <ul className="space-y-2">
          {reports.map(report => (
            <li key={report.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold">{report.shiftType} - {report.shiftDate}</div>
              <div>Overall Rating: {report.overallRating || "N/A"}</div>
              <div>Submitted by: {report.userId}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 