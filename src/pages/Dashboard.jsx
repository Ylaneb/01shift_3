import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllShiftReports } from "../api/shiftReports";
import { getUser } from "../api/users";
import StatCard from "../components/StatCard";
import ShiftCard from "../components/ShiftCard";
import NewShiftReportForm from "./NewShiftReportForm";
import { Sun, CalendarDays, TrendingUp, FileText, AlertCircle, Moon, CloudSun, Info, User, Mail, Phone, PhoneCall, MessageCircle, MessageSquare, Linkedin } from "lucide-react";
import ReportList from "../components/ReportList";
import ReportModal from "../components/ReportModal";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

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

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [fields, setFields] = useState([]);
  const [lang, setLang] = useState(i18n.language);
  const [showBusinessCard, setShowBusinessCard] = useState(false);

  useEffect(() => {
    async function fetchReportsAndUsers() {
      setLoading(true);
      const data = await getAllShiftReports();
      // Sort by submittedAt descending
      data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
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

  useEffect(() => {
    import("../api/formFields").then(mod => {
      mod.getAllFormFields().then(setFields);
    });
  }, []);

  // Language switcher handler
  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

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
  const totalIncidents = reports.filter(r => r.incidentStatus === true).length;

  // Current shift (latest report or placeholder)
  const currentShift = reports.length > 0 ? reports[0] : null;

  // Recent reports (5 newest)
  const recentReports = reports.slice(0, 5);

  // Determine current shift by time
  function getCurrentShiftByTime() {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 17) {
      return {
        shiftType: "Day Shift",
        gradient: "bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF]",
        icon: <Sun className="text-yellow-500" />,
      };
    } else if (hour >= 17 && hour < 23) {
      return {
        shiftType: "Evening Shift",
        gradient: "bg-gradient-to-r from-[#FFD6A5] to-[#FFB5A7]",
        icon: <CloudSun className="text-orange-500" />,
      };
    } else {
      return {
        shiftType: "Night Shift",
        gradient: "bg-gradient-to-r from-[#B5C6E0] to-[#232526]",
        icon: <Moon className="text-blue-700" />,
      };
    }
  }

  const dynamicShift = getCurrentShiftByTime();

  return (
    <div className="max-w-4xl w-full mx-auto py-8 px-2 sm:px-4 min-h-screen flex flex-col">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-[color:var(--primary-blue)] drop-shadow">
        {t('dashboard.welcome')}{user ? `, ${user.displayName?.split(" ")[0]}!` : "!"}
      </h1>
      <p className="text-[color:var(--text-secondary)] mb-6 text-base sm:text-lg">{t('dashboard.ready')}</p>

      <div className={`rounded-2xl shadow-lg bg-gradient-to-br from-[var(--soft-blue)] to-white/80 backdrop-blur-sm border border-blue-100 mb-8 p-1 transition-all duration-200`}> 
        <ShiftCard
          icon={<ShiftIcon type={dynamicShift.shiftType} />}
          shiftType={dynamicShift.shiftType}
          date={formatDate(new Date().toISOString())}
          onCompleteReport={() => setShowForm(true)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-6 w-full max-w-xs sm:max-w-lg relative backdrop-blur-sm border border-blue-100">
            <button
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <NewShiftReportForm
              initialShiftType={dynamicShift.shiftType}
              onCreated={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile: 4 small squares inline, icon+number only; sm+: normal grid with label */}
      <div className="flex sm:hidden gap-2 mb-10">
        <div className="flex-1"><StatCard icon={<CalendarDays />} value={reportsThisWeek} color="bg-[var(--soft-blue)]" small /></div>
        <div className="flex-1"><StatCard icon={<TrendingUp />} value={reportsThisMonth} color="bg-green-50" small /></div>
        <div className="flex-1"><StatCard icon={<FileText />} value={totalReports} color="bg-indigo-50" small /></div>
        <div className="flex-1"><StatCard icon={<AlertCircle />} value={totalIncidents} color="bg-red-50" small /></div>
      </div>
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard icon={<CalendarDays />} label={t('dashboard.reportsThisWeek')} value={reportsThisWeek} color="bg-[var(--soft-blue)]" />
        <StatCard icon={<TrendingUp />} label={t('dashboard.reportsThisMonth')} value={reportsThisMonth} color="bg-green-50" />
        <StatCard icon={<FileText />} label={t('dashboard.totalReports')} value={totalReports} color="bg-indigo-50" />
        <StatCard icon={<AlertCircle />} label={t('dashboard.totalIncidents')} value={totalIncidents} color="bg-red-50" />
      </div>

      <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[color:var(--primary-blue)]">{t('dashboard.recentReports')}</h2>
          <a href="/reports" className="text-[color:var(--primary-blue)] hover:underline text-sm font-medium">{t('dashboard.viewAll')}</a>
        </div>
        <ReportList
          reports={recentReports}
          users={users}
          fields={fields}
          loading={loading}
          maxItems={5}
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
      {/* Footer */}
      <footer className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-blue-100 text-xs text-gray-500 bg-white/70">
        <span>Association Name &copy; {new Date().getFullYear()} | All rights reserved</span>
        <button
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition text-[color:var(--primary-blue)]"
          onClick={() => setShowBusinessCard(true)}
          aria-label="Show business card"
        >
          <Info className="w-4 h-4" /> Info
        </button>
      </footer>
      {/* Business Card Modal */}
      {showBusinessCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-50 rounded-2xl shadow-lg p-6 w-full max-w-md relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => setShowBusinessCard(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-blue-200 mb-2">
                <Info className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">About the Author</div>
              <div className="flex flex-col items-center gap-1 text-gray-700 w-full">
                <div className="flex items-center gap-2 text-base font-medium">
                  <User className="w-5 h-5 text-blue-600" />
                  Ylane Bouchenino
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href="mailto:ylaneb@gmail.com" className="text-blue-600 underline">ylaneb@gmail.com</a>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Phone className="w-5 h-5 text-blue-600" />
                  0529529613
                  <a href="tel:0529529613" className="ml-1"><PhoneCall className="w-5 h-5 text-blue-600 hover:text-blue-800" title="Call" /></a>
                  <a href="https://wa.me/972529529613" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 text-blue-600 hover:text-green-600" title="WhatsApp" /></a>
                  <a href="sms:0529529613"><MessageSquare className="w-5 h-5 text-blue-600 hover:text-blue-800" title="SMS" /></a>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <a href="https://www.linkedin.com/in/ylane-bouchenino-77318651" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-4 w-full text-center">
                &copy; {new Date().getFullYear()} Ylane Bouchenino. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 