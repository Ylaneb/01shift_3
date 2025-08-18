import React, { useState, useEffect } from "react";
import { createShiftReport } from "../api/shiftReports";
import { useAuth } from "../auth/AuthContext";
import { getAllFormFields } from "../api/formFields";
import { Star, Home } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PATIENTS_BY_HOUSE = {
  1: ["רפאל", "יוסף", "שלמה", "אלי", "אייל", "ירון"],
  2: ["אדם יעקב", "יוסף", "מנחם", "מרדכי", "שי אריאל", "שמעון"],
  3: ["אהרן", "גד", "רובין", "אברהם", "שחר", "יהודה"],
  4: ["מאיר", "אושרי", "יאיר", "אביאל", "בן ציון", "משה"],
  5: ["דן", "יהושע", "דוד", "אורי", "ליאב", "סטיב", "ז'וליאן", "פרנק", "נאור", "דוד", "ברונו", "בנימין"],
};

export default function NewShiftReportForm({ onCreated, initialShiftType }) {
  const { t } = useTranslation();
  const initialFormState = {
    shiftType: initialShiftType || "Day Shift",
    house: "",
    patientName: "",
    shiftDate: new Date().toISOString().slice(0, 10),
    notes: "",
    incidentStatus: false,
  };
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage(""); // Clear success message on change
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
      setForm({ ...initialFormState });
      setSuccessMessage(t('newReport.success'));
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

  if (fieldsLoading) return <div className="p-4">{t('newReport.loading')}</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-4 sm:p-6 mb-4 max-w-md mx-auto max-h-[80vh] overflow-y-auto flex flex-col gap-4">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-[color:var(--primary-blue)] tracking-tight">{t('newReport.title')}</h2>
      <div className="mb-2 space-y-3">
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">{t('newReport.shiftType')}</label>
          <select
            name="shiftType"
            value={form.shiftType}
            onChange={handleChange}
            className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
            required
          >
            <option value="Day Shift">{t('shiftTypes.Day_Shift')}</option>
            <option value="Evening Shift">{t('shiftTypes.Evening_Shift')}</option>
            <option value="Night Shift">{t('shiftTypes.Night_Shift')}</option>
            
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">{t('newReport.house')}</label>
          <div className="flex gap-3 mb-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                type="button"
                key={num}
                className={`flex flex-col items-center justify-center px-4 sm:px-6 py-2 rounded-[16px] font-bold transition-all duration-150 ${form.house === String(num)
                  ? 'bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] scale-105 shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-2 border-[var(--primary-blue)] ring-2 ring-[var(--primary-blue)]'
                  : 'bg-gray-100 text-gray-700 border-2 border-blue-100 hover:bg-blue-50'}`}
                onClick={() => setForm(f => ({ ...f, house: String(num), patientName: "" }))}
                aria-pressed={form.house === String(num)}
              >
                <Home className={`w-7 h-7 mb-1 ${form.house === String(num) ? "text-[#6C63FF]" : "text-blue-200"}`} />
                <span className={`font-bold text-lg ${form.house === String(num) ? "font-extrabold" : "font-normal"}`}>{num}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">{t('newReport.patientName')}</label>
          <select
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
            required
            disabled={!form.house}
          >
            <option value="" disabled>{form.house ? t('newReport.selectPatient') : t('newReport.selectHouseFirst')}</option>
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
          <label htmlFor="incidentStatus" className="font-semibold text-[color:var(--text-primary)]">{t('newReport.incident')}</label>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">{t('newReport.date')}</label>
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
              placeholder={field.placeholder || t('newReport.textPlaceholder')}
              required={field.required}
            />
          )}
          {field.type === "yesno" && (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={field.id}
                  checked={form[field.id] === true}
                  onChange={() => setForm({ ...form, [field.id]: true })}
                  className="h-5 w-5 border-blue-100 rounded-full focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
                />
                <span>{t('newReport.yes')}</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={field.id}
                  checked={form[field.id] === false}
                  onChange={() => setForm({ ...form, [field.id]: false })}
                  className="h-5 w-5 border-blue-100 rounded-full focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none"
                />
                <span>{t('newReport.no')}</span>
              </label>
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
              <option value="" disabled>{t('newReport.selectOption')}</option>
              {(field.options && field.options.length > 0 ? field.options : [t('newReport.option1'), t('newReport.option2'), t('newReport.option3')]).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {field.type === "emoji" && (
            <div className="flex gap-2">
              {(Array.isArray(field.options) && field.options.length > 0
                ? field.options
                : ["😢", "🙁", "😐", "🙂", "😊"]
              ).map(opt => (
                <button
                  type="button"
                  key={opt}
                  className={`text-2xl px-4 sm:px-6 py-2 rounded-[16px] font-bold transition-all duration-150 ${form[field.id] === opt
                    ? 'bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] scale-110 shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-2 border-[var(--primary-blue)] ring-2 ring-[var(--primary-blue)]'
                    : 'bg-gray-100 text-gray-700 border-2 border-blue-100 hover:bg-blue-50'}`}
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
                  className={`px-4 sm:px-6 py-2 rounded-[16px] font-bold transition-all duration-150 focus:outline-none ${form[field.id] >= star
                    ? 'bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
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
        <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">{t('newReport.notes')} <span className="text-gray-400 text-xs">({t('newReport.optional')})</span></label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border border-blue-100 rounded-xl p-2 min-h-[60px] focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150"
          placeholder={t('newReport.notesPlaceholder')}
        />
      </div>
      {error && <div className="text-red-500 mb-2">{t('newReport.error')}</div>}
      <button type="submit" className="px-4 sm:px-6 py-2 rounded-[16px] bg-gradient-to-r from-[#E3E8FF] to-[#D6F0FF] text-[#6C63FF] font-bold shadow-[0_4px_16px_0_rgba(60,60,120,0.10)] shadow-inner border-none outline-none transition-all duration-200 active:scale-95 hover:from-[#D6F0FF] hover:to-[#E3E8FF] hover:shadow-[0_6px_24px_0_rgba(60,60,120,0.15)] text-xs sm:text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
        {loading ? t('newReport.saving') : t('newReport.submit')}
      </button>
      {successMessage && <div className="text-green-600 mt-2 text-sm font-semibold">{successMessage}</div>}
    </form>
  );
}