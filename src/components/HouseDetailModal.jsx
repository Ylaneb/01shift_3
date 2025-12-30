import React, { useState } from "react";
import { Home, X, Filter } from "lucide-react";
import ReportList from "./ReportList";
import ReportModal from "./ReportModal";
import { useTranslation } from 'react-i18next';

const PATIENTS_BY_HOUSE = {
  1: ["רפאל", "יוסף", "שלמה", "אלי", "אייל", "ירון"],
  2: ["אדם יעקב", "יוסף", "מנחם", "מרדכי", "שי אריאל", "שמעון"],
  3: ["אהרן", "גד", "רובין", "אברהם", "שחר", "יהודה"],
  4: ["מאיר", "אושרי", "יאיר", "אביאל", "בן ציון", "משה"],
  5: ["דן", "יהושע", "דוד", "אורי", "ליאב", "סטיב", "ז'וליאן", "פרנק", "נאור", "דוד", "ברונו", "בנימין"],
};

export default function HouseDetailModal({ open, onClose, houseNumber, reports, users, fields }) {
  const { t } = useTranslation();
  const [filterShift, setFilterShift] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!open) return null;

  // Filter reports for this house
  const houseReports = reports.filter(r => r.house === String(houseNumber));
  
  // Get patients for this house
  const patients = PATIENTS_BY_HOUSE[houseNumber] || [];
  
  // Filter by shift type if selected
  const filteredReports = filterShift 
    ? houseReports.filter(r => r.shiftType === filterShift)
    : houseReports;

  // Sort by date (newest first)
  const sortedReports = [...filteredReports].sort((a, b) => 
    new Date(b.submittedAt || b.shiftDate) - new Date(a.submittedAt || a.shiftDate)
  );

  // Calculate stats
  const totalReports = houseReports.length;
  const incidents = houseReports.filter(r => r.incidentStatus === true).length;
  const dayReports = houseReports.filter(r => r.shiftType === "Day Shift").length;
  const eveningReports = houseReports.filter(r => r.shiftType === "Evening Shift").length;
  const nightReports = houseReports.filter(r => r.shiftType === "Night Shift").length;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF]">
              <Home className="w-6 h-6 text-[var(--primary-blue)]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[color:var(--primary-blue)]">
                בית {houseNumber}
              </h2>
              <p className="text-gray-600 text-sm">{patients.length} מטופלים</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-[var(--primary-blue)]">{totalReports}</div>
              <div className="text-xs text-gray-600">סה"כ דוחות</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-red-600">{incidents}</div>
              <div className="text-xs text-gray-600">תקריות</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">{dayReports}</div>
              <div className="text-xs text-gray-600">משמרת יום</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">{eveningReports + nightReports}</div>
              <div className="text-xs text-gray-600">ערב/לילה</div>
            </div>
          </div>

          {/* Patients List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[color:var(--primary-blue)] mb-3">מטופלים בבית זה</h3>
            <div className="flex flex-wrap gap-2">
              {patients.map(patient => (
                <div
                  key={patient}
                  className="px-3 py-1.5 bg-blue-50 rounded-lg text-sm font-medium text-gray-700 border border-blue-100"
                >
                  {patient}
                </div>
              ))}
            </div>
          </div>

          {/* Shift Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">סינון לפי משמרת:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterShift("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterShift === ""
                    ? "bg-[var(--primary-blue)] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                הכל
              </button>
              <button
                onClick={() => setFilterShift("Day Shift")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterShift === "Day Shift"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                משמרת יום
              </button>
              <button
                onClick={() => setFilterShift("Evening Shift")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterShift === "Evening Shift"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                משמרת ערב
              </button>
              <button
                onClick={() => setFilterShift("Night Shift")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterShift === "Night Shift"
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                משמרת לילה
              </button>
            </div>
          </div>

          {/* Reports List */}
          <div>
            <h3 className="text-lg font-bold text-[color:var(--primary-blue)] mb-3">
              דוחות אחרונים {filterShift && `- ${filterShift === "Day Shift" ? "משמרת יום" : filterShift === "Evening Shift" ? "משמרת ערב" : "משמרת לילה"}`}
            </h3>
            {sortedReports.length > 0 ? (
              <ReportList
                reports={sortedReports}
                users={users}
                fields={fields}
                loading={false}
                onReportClick={r => {
                  setSelectedReport(r);
                  setModalOpen(true);
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {filterShift ? "אין דוחות עבור משמרת זו" : "אין דוחות עדיין"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        report={selectedReport}
        user={users[selectedReport?.userId]}
        fields={fields}
      />
    </>
  );
}

