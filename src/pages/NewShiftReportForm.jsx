import React, { useState, useEffect } from "react";
import { createShiftReport } from "../api/shiftReports";
import { useAuth } from "../auth/AuthContext";
import { getAllFormFields } from "../api/formFields";
import { Star, Home } from "lucide-react";

const PATIENTS_BY_HOUSE = {
  1: ["Alice", "Bob"],
  2: ["Charlie", "Diana"],
  3: ["Eve", "Frank"],
};

export default function NewShiftReportForm({ onCreated, initialShiftType }) {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    shiftType: initialShiftType || "Day Shift",
    house: "",
    patientName: "",
    shiftDate: "",
    notes: "",
    incidentStatus: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [fieldsLoading, setFieldsLoading] = useState(true);

  useEffect(() => {
    async function fetchFields() {
      setFieldsLoading(true);
      const data = await getAllFormFields();
      // Sort by 'order' if present
      data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setFields(data);
      setFieldsLoading(false);
    }
    fetchFields();
  }, []);

  // Update shiftType if initialShiftType changes
  useEffect(() => {
    if (initialShiftType) {
      setForm(f => ({ ...f, shiftType: initialShiftType }));
    }
  }, [initialShiftType]);

  const handleChange = (e, field) => {
    setForm({ ...form, [field?.id || e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await createShiftReport({
        ...form,
        userId: user.uid,
        submittedAt: new Date().toISOString(),
      });
      if (onCreated) onCreated();
    } catch (err) {
      setError("Failed to create report");
    }
    setLoading(false);
  };

  // Filter fields by shiftType
  const visibleFields = fields.filter(field => {
    if (!field.shiftTypes || field.shiftTypes.length === 0) return true;
    return field.shiftTypes.includes(form.shiftType);
  });

  if (fieldsLoading) return <div className="p-4">Loading form...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-4 sm:p-6 mb-4 max-w-md mx-auto max-h-[80vh] overflow-y-auto flex flex-col gap-4">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-[color:var(--primary-blue)] tracking-tight">New Shift Report</h2>
      <div className="mb-2 space-y-3">
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Shift Type</label>
          <select
            name="shiftType"
            value={form.shiftType}
            onChange={handleChange}
            className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
            required
          >
            <option value="Day Shift">Day Shift</option>
            <option value="Night Shift">Night Shift</option>
            <option value="Evening Shift">Evening Shift</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">House</label>
          <div className="flex gap-3 mb-2">
            {[1, 2, 3].map(num => (
              <button
                type="button"
                key={num}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl border-2 transition-all duration-150 focus:outline-none text-[color:var(--primary-blue)] bg-white/80 shadow-sm hover:shadow-md ${form.house === String(num) ? "border-[var(--primary-blue)] bg-[var(--soft-blue)] font-extrabold ring-2 ring-[var(--primary-blue)] scale-105" : "border-blue-100 font-normal hover:bg-blue-50"}`}
                onClick={() => setForm(f => ({ ...f, house: String(num), patientName: "" }))}
                aria-pressed={form.house === String(num)}
              >
                <Home className={`w-7 h-7 mb-1 ${form.house === String(num) ? "text-[var(--primary-blue)]" : "text-blue-200"}`} />
                <span className={`font-bold text-lg ${form.house === String(num) ? "font-extrabold" : "font-normal"}`}>{num}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Patient Name</label>
          <select
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
            required
            disabled={!form.house}
          >
            <option value="" disabled>{form.house ? "Select patient..." : "Select house first"}</option>
            {(PATIENTS_BY_HOUSE[form.house] || []).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="incidentStatus"
            checked={!!form.incidentStatus}
            onChange={e => setForm(f => ({ ...f, incidentStatus: e.target.checked }))}
            className="h-5 w-5 border-blue-100 rounded focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
            id="incidentStatus"
          />
          <label htmlFor="incidentStatus" className="font-semibold text-[color:var(--text-primary)]">Incident</label>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Date</label>
          <input
            type="date"
            name="shiftDate"
            value={form.shiftDate}
            onChange={handleChange}
            className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
            required
          />
        </div>
      </div>
      {/* Dynamic fields */}
      {visibleFields.map(field => (
        <div className="mb-2" key={field.id}>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === "text" && (
            <input
              type="text"
              name={field.id}
              value={form[field.id] || ""}
              onChange={e => handleChange(e, field)}
              className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
          {field.type === "yesno" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field.id}
                checked={!!form[field.id]}
                onChange={e => setForm({ ...form, [field.id]: e.target.checked })}
                className="h-5 w-5 border-blue-100 rounded focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
              />
              <span>{form[field.id] ? "Yes" : "No"}</span>
            </div>
          )}
          {field.type === "dropdown" && (
            <select
              name={field.id}
              value={form[field.id] || ""}
              onChange={e => handleChange(e, field)}
              className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
              required={field.required}
            >
              <option value="" disabled>Select...</option>
              {(field.options && field.options.length > 0 ? field.options : ["Option 1", "Option 2", "Option 3"]).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {field.type === "emoji" && (
            <div className="flex gap-2">
              {(Array.isArray(field.options) && field.options.length > 0
                ? field.options
                : ["😢", "🙁", "😐", "🙂", "😃"]
              ).map(opt => (
                <button
                  type="button"
                  key={opt}
                  className={`text-2xl px-2 py-1 rounded-xl transition font-bold border-2 ${form[field.id] === opt ? "bg-[var(--soft-blue)] font-extrabold ring-2 ring-[var(--primary-blue)] border-[var(--primary-blue)] scale-110" : "bg-gray-100 font-normal border-blue-100 hover:bg-blue-50"}`}
                  onClick={() => setForm({ ...form, [field.id]: opt })}
                  tabIndex={0}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          {field.type === "slider" && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                name={field.id}
                min={field.min ?? 0}
                max={field.max ?? 10}
                value={form[field.id] || field.min || 0}
                onChange={e => handleChange(e, field)}
                className="w-full accent-[var(--primary-blue)]"
              />
              <span>{form[field.id]}</span>
            </div>
          )}
          {field.type === "star" && (
            <div className="flex gap-1 items-center">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  className="focus:outline-none"
                  onClick={() => setForm({ ...form, [field.id]: star })}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star className={`w-6 h-6 ${form[field.id] >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={form[field.id] >= star ? '#facc15' : 'none'} />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">{form[field.id] || 0}/5</span>
            </div>
          )}
        </div>
      ))}
      {/* Notes field at the end */}
      <div className="mb-2">
        <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Notes <span className="text-gray-400 text-xs">(optional)</span></label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border border-blue-100 rounded-xl p-2 min-h-[60px] focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
          placeholder="Add any additional notes..."
        />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="px-4 py-2 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-blue-light)] text-white rounded-2xl hover:from-[var(--primary-blue-light)] hover:to-[var(--primary-blue)] transition-all font-extrabold text-base sm:text-lg shadow-lg tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
        {loading ? "Saving..." : "Submit Report"}
      </button>
    </form>
  );
} 