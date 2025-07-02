import React, { useState, useEffect } from "react";
import { createShiftReport } from "../api/shiftReports";
import { useAuth } from "../auth/AuthContext";
import { getAllFormFields } from "../api/formFields";
import { Star } from "lucide-react";

export default function NewShiftReportForm({ onCreated }) {
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    shiftType: "Day Shift",
    house: "",
    patientName: "",
    shiftDate: "",
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

  if (fieldsLoading) return <div className="p-4">Loading form...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">New Shift Report</h2>
      <div className="mb-4 space-y-2">
        <div>
          <label className="block mb-1 font-medium">Shift Type</label>
          <select
            name="shiftType"
            value={form.shiftType}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="Day Shift">Day Shift</option>
            <option value="Night Shift">Night Shift</option>
            <option value="Evening Shift">Evening Shift</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">House</label>
          <input
            type="text"
            name="house"
            value={form.house}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="shiftDate"
            value={form.shiftDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
      </div>
      {fields.map(field => (
        <div className="mb-2" key={field.id}>
          <label className="block mb-1 font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === "text" && (
            <input
              type="text"
              name={field.id}
              value={form[field.id] || ""}
              onChange={e => handleChange(e, field)}
              className="w-full border rounded p-2"
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
                className="h-5 w-5"
              />
              <span>{form[field.id] ? "Yes" : "No"}</span>
            </div>
          )}
          {field.type === "dropdown" && (
            <select
              name={field.id}
              value={form[field.id] || ""}
              onChange={e => handleChange(e, field)}
              className="w-full border rounded p-2"
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
                  className={`text-2xl px-2 py-1 rounded transition font-bold ${form[field.id] === opt ? "bg-blue-100 font-extrabold ring-2 ring-blue-400" : "bg-gray-100 font-normal"}`}
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
                className="w-full"
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
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" disabled={loading}>
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
} 