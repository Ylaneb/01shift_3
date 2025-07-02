import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getAllFormFields, createFormField, updateFormField, deleteFormField } from "../api/formFields";
import { Pencil, Trash2, Plus, BadgeCheck, ListFilter, X } from "lucide-react";

const ROLE_ALLOWED = ["manager", "admin"];

const emptyField = {
  label: "",
  id: "",
  type: "text",
  section: "General",
  required: false,
  options: [],
  shiftTypes: ["Day Shift", "Night Shift", "Evening Shift"],
  order: 0,
  placeholder: "",
};

function toId(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_');
}

function FieldModal({ open, onClose, onSave, initial }) {
  const [field, setField] = useState(initial || emptyField);
  useEffect(() => {
    setField(initial || emptyField);
  }, [initial, open]);

  // Auto-generate ID from label (only for new fields)
  useEffect(() => {
    if (!initial) {
      setField(f => ({ ...f, id: toId(f.label) }));
    }
  }, [field.label, initial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let next = { ...field, [name]: type === "checkbox" ? checked : value };
    // If type is changed to 'dropdown', ensure options is an array
    if (name === "type") {
      if (value === "dropdown" && !Array.isArray(next.options)) {
        next.options = [""];
      }
      // If type is changed to 'emoji', remove options (use default scale)
      if (value === "emoji") {
        delete next.options;
      }
    }
    setField(next);
  };
  const handleShiftTypeToggle = (type) => {
    setField(f => ({
      ...f,
      shiftTypes: f.shiftTypes.includes(type)
        ? f.shiftTypes.filter(s => s !== type)
        : [...f.shiftTypes, type],
    }));
  };
  const handleSection = (section) => {
    setField(f => ({ ...f, section }));
  };
  // Dropdown options logic
  const handleOptionsChange = (i, value) => {
    const opts = [...(field.options || [])];
    opts[i] = value;
    setField(f => ({ ...f, options: opts }));
  };
  const addOption = () => setField(f => ({ ...f, options: [...(f.options || []), ""] }));
  const removeOption = (i) => setField(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(field);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose} aria-label="Close"><X /></button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2 text-[color:var(--primary-blue)] tracking-tight">{initial ? "Edit Field" : "Add New Field"}</h2>
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Label</label>
            <input name="label" value={field.label} onChange={handleChange} className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Type</label>
            <select name="type" value={field.type} onChange={handleChange} className="w-full border border-blue-100 rounded-xl p-2 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150" required>
              <option value="text">Text</option>
              <option value="yesno">Yes/No</option>
              <option value="star">Star Rating Scale</option>
              <option value="emoji">Emoji Smile to Sad Rating Scale</option>
              <option value="dropdown">Dropdown Options</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Section</label>
            <div className="flex gap-2">
              {['General', 'Medical'].map(sec => (
                <button
                  type="button"
                  key={sec}
                  className={`px-3 py-1 rounded-xl font-semibold transition-all duration-150 ${field.section === sec ? 'bg-[var(--primary-blue)] text-white scale-105 shadow' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                  onClick={() => handleSection(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <input type="checkbox" name="required" checked={field.required} onChange={handleChange} id="required" className="h-5 w-5 border-blue-100 rounded focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none" />
            <label htmlFor="required" className="font-semibold text-[color:var(--text-secondary)]">Required</label>
          </div>
          {field.type === "dropdown" && (
            <div className="mb-2">
              <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Dropdown Options</label>
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input value={opt} onChange={e => handleOptionsChange(i, e.target.value)} className="border border-blue-100 rounded-xl p-1 flex-1 focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none bg-white/80 transition-all duration-150" required />
                  <button type="button" onClick={() => removeOption(i)} className="text-red-500 font-semibold hover:underline">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-[var(--primary-blue)] mt-1 font-semibold hover:underline">+ Add Option</button>
            </div>
          )}
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-[color:var(--text-primary)]">Shift Types</label>
            <div className="flex gap-2 flex-wrap">
              {['Day Shift', 'Night Shift', 'Evening Shift'].map(type => (
                <label key={type} className={
                  (field.shiftTypes || []).includes(type)
                    ? 'bg-[var(--soft-blue)] text-[var(--primary-blue)] px-2 py-1 rounded-xl cursor-pointer font-semibold scale-105 shadow'
                    : 'bg-gray-100 text-gray-700 px-2 py-1 rounded-xl cursor-pointer hover:bg-blue-50'
                }>
                  <input
                    type="checkbox"
                    checked={(field.shiftTypes || []).includes(type)}
                    onChange={() => handleShiftTypeToggle(type)}
                    className="mr-1 accent-[var(--primary-blue)]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button type="submit" className="px-4 py-2 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-blue-light)] text-white rounded-2xl hover:from-[var(--primary-blue-light)] hover:to-[var(--primary-blue)] transition-all font-extrabold text-base shadow-lg tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {initial ? "Save Changes" : "Add Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Manager() {
  const { user } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);

  const userRole = user?.role || "manager"; // TODO: Replace with real role lookup

  const refreshFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFormFields();
      setFields(data);
    } catch (err) {
      setError("Failed to fetch form fields");
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshFields();
  }, []);

  const handleAdd = () => {
    setEditField(null);
    setModalOpen(true);
  };
  const handleEdit = (field) => {
    setEditField(field);
    setModalOpen(true);
  };
  const handleDelete = async (field) => {
    if (window.confirm(`Delete field "${field.label}"?`)) {
      await deleteFormField(field.id);
      refreshFields();
    }
  };
  const handleSave = async (field) => {
    if (editField) {
      await updateFormField(field.id, field);
    } else {
      await createFormField(field.id, field);
    }
    setModalOpen(false);
    refreshFields();
  };

  if (!ROLE_ALLOWED.includes(userRole)) {
    return <div className="p-8 text-red-600 font-bold">Access denied. Managers only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-[color:var(--primary-blue)] drop-shadow">Manager Settings</h1>
      <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 backdrop-blur-sm p-4 sm:p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-[color:var(--primary-blue)]">Form Fields</h2>
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-blue-light)] text-white rounded-2xl hover:from-[var(--primary-blue-light)] hover:to-[var(--primary-blue)] transition-all font-extrabold text-base shadow-lg tracking-wide"
          >
            <Plus className="w-5 h-5" /> Add Field
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white/80 rounded-2xl">
            <thead>
              <tr className="bg-[var(--soft-blue)]">
                <th className="py-3 px-4 text-left rounded-tl-2xl">Label</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Required</th>
                <th className="py-3 px-4 text-left">Shifts</th>
                <th className="py-3 px-4 text-left">Options</th>
                <th className="py-3 px-4 text-left rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="border-b last:border-none hover:bg-[var(--soft-blue)] transition">
                  <td className="py-3 px-4 font-medium text-[color:var(--text-primary)] max-w-[180px] truncate">{field.label}</td>
                  <td className="py-3 px-4 text-[color:var(--text-secondary)] capitalize">{field.type}</td>
                  <td className="py-3 px-4">{field.required ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-gray-400">No</span>}</td>
                  <td className="py-3 px-4 flex flex-wrap gap-1">
                    {(field.shiftTypes || ["Day Shift", "Night Shift", "Evening Shift"]).map(type => (
                      <span key={type} className={
                        type === "Day Shift"
                          ? "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold"
                          : type === "Night Shift"
                          ? "bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold"
                          : type === "Evening Shift"
                          ? "bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-semibold"
                          : "bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold"
                      }>{type.replace(" Shift", "")}</span>
                    ))}
                  </td>
                  <td className="py-3 px-4 max-w-[180px] truncate">
                    {field.type === "dropdown" || field.type === "emoji"
                      ? (field.options || []).join(", ")
                      : "-"}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => handleEdit(field)} className="p-1 rounded hover:bg-[var(--soft-blue)] text-[var(--primary-blue)]" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(field)} className="p-1 rounded hover:bg-red-100 text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <FieldModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editField} />
      )}
    </div>
  );
} 