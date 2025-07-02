import { Sun } from "lucide-react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginButton from "./auth/LoginButton";
import NewShiftReportForm from "./pages/NewShiftReportForm";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllReports from "./pages/AllReports";
import Manager from "./pages/Manager";

function App() {
  const [refreshReports, setRefreshReports] = useState(false);
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
        <header className="flex justify-between items-center p-4 bg-white/80 shadow">
          <nav className="flex gap-4">
            <Link to="/" className="font-semibold hover:underline">Dashboard</Link>
            <Link to="/reports" className="font-semibold hover:underline">All Reports</Link>
            <Link to="/manager" className="font-semibold hover:underline">Admin Settings</Link>
          </nav>
          <LoginButton />
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
