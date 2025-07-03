import { Sun } from "lucide-react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginButton from "./auth/LoginButton";
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import NewShiftReportForm from "./pages/NewShiftReportForm";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllReports from "./pages/AllReports";
import Manager from "./pages/Manager";

function App() {
  const [refreshReports, setRefreshReports] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { t, i18n: i18nextInstance } = useTranslation();
  const lang = i18nextInstance.language;
  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-[color:var(--text-primary)]">
        <style>{`
          :root {
            --primary-blue: #2563eb;
            --primary-blue-light: #3b82f6;
            --accent-blue: #1e40af;
            --soft-blue: #dbeafe;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
          }
        `}</style>
        <header className="flex justify-between items-center p-4 bg-white/80 shadow relative">
          {/* Hamburger for mobile */}
          <button
            className="sm:hidden flex items-center px-3 py-2 border rounded text-[color:var(--primary-blue)] border-blue-200 focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {/* Nav links */}
          <nav className={`flex-col sm:flex-row sm:flex gap-4 absolute sm:static top-full left-0 w-full sm:w-auto bg-white/90 sm:bg-transparent shadow sm:shadow-none z-40 transition-all duration-200 ${navOpen ? 'flex' : 'hidden sm:flex'}`}>
            <Link to="/" className="font-semibold hover:underline px-4 py-2 sm:px-0 sm:py-0" onClick={() => setNavOpen(false)}>{t('nav.dashboard')}</Link>
            <Link to="/reports" className="font-semibold hover:underline px-4 py-2 sm:px-0 sm:py-0" onClick={() => setNavOpen(false)}>{t('nav.allReports')}</Link>
            <Link to="/manager" className="font-semibold hover:underline px-4 py-2 sm:px-0 sm:py-0" onClick={() => setNavOpen(false)}>{t('nav.adminSettings')}</Link>
          </nav>
          <div className="ml-auto sm:ml-0 flex items-center gap-2">
            <LoginButton />
            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={lang}
                onChange={e => handleLangChange(e.target.value)}
                className="px-2 py-1 rounded border border-blue-200 bg-white text-[color:var(--primary-blue)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="he">HE</option>
              </select>
            </div>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
