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
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={onClose} aria-label="Close"><X /></button>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">{initial ? "Edit Field" : "Add New Field"}</h2>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Label</label>
            <input name="label" value={field.label} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Type</label>
            <select name="type" value={field.type} onChange={handleChange} className="w-full border rounded p-2">
              <option value="text">Text</option>
              <option value="yesno">Yes/No</option>
              <option value="star">Star Rating Scale</option>
              <option value="emoji">Emoji Smile to Sad Rating Scale</option>
              <option value="dropdown">Dropdown Options</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Section</label>
            <div className="flex gap-2">
              {['General', 'Medical'].map(sec => (
                <button
                  type="button"
                  key={sec}
                  className={`px-3 py-1 rounded ${field.section === sec ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => handleSection(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <input type="checkbox" name="required" checked={field.required} onChange={handleChange} id="required" />
            <label htmlFor="required" className="font-medium">Required</label>
          </div>
          {field.type === "dropdown" && (
            <div className="mb-2">
              <label className="block mb-1 font-medium">Dropdown Options</label>
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input value={opt} onChange={e => handleOptionsChange(i, e.target.value)} className="border rounded p-1 flex-1" required />
                  <button type="button" onClick={() => removeOption(i)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-blue-600 mt-1">+ Add Option</button>
            </div>
          )}
          <div className="mb-2">
            <label className="block mb-1 font-medium">Shift Types</label>
            <div className="flex gap-2 flex-wrap">
              {["Day Shift", "Night Shift", "Evening Shift"].map(type => (
                <label key={type} className={
                  (field.shiftTypes || []).includes(type)
                    ? "bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer"
                    : "bg-gray-100 text-gray-700 px-2 py-1 rounded cursor-pointer"
                }>
                  <input
                    type="checkbox"
                    checked={(field.shiftTypes || []).includes(type)}
                    onChange={() => handleShiftTypeToggle(type)}
                    className="mr-1"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Administrator Settings</h1>
      <div className="mb-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 hover:bg-blue-700" onClick={handleAdd}>
          <Plus className="w-4 h-4" /> Add New Field
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded flex items-center gap-2" disabled>
          <ListFilter className="w-4 h-4" /> Filter by shift (coming soon)
        </button>
      </div>
      <FieldModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editField} />
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-4">Manage Report Fields</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : fields.length === 0 ? (
          <div className="text-gray-500">No fields found.</div>
        ) : (
          <div className="space-y-6">
            {fields.map(field => (
              <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{field.type === "emoji" ? "😃" : field.type === "slider" ? "🎚️" : "🔤"}</span>
                  <span className="font-bold text-lg">{field.label}</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-xs font-mono">{field.id}</span>
                  <span className="ml-2 text-xs text-gray-500">{field.type.charAt(0).toUpperCase() + field.type.slice(1)}</span>
                  <span className="ml-2 text-xs text-gray-500">• {field.section}</span>
                  {field.required && <BadgeCheck className="w-4 h-4 text-green-500 ml-2" title="Required" />}
                </div>
                <div className="flex gap-2 mb-2">
                  {field.shiftTypes && field.shiftTypes.map(s => (
                    <span key={s} className={
                      (s === "Day Shift" ? "bg-yellow-100 text-yellow-800" :
                      s === "Night Shift" ? "bg-blue-100 text-blue-800" :
                      s === "Evening Shift" ? "bg-orange-100 text-orange-800" :
                      "bg-gray-100 text-gray-800") + " px-2 py-0.5 rounded text-xs font-semibold"
                    }>{s}</span>
                  ))}
                </div>
                {field.placeholder && (
                  <div className="text-gray-500 text-sm mb-1">Placeholder Text: <span className="italic">"{field.placeholder}"</span></div>
                )}
                {field.options && field.options.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500">Options:</span>
                    {field.options.map((opt, i) => (
                      <span key={i} className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">{opt}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1 text-sm hover:bg-gray-300" onClick={() => handleEdit(field)}>
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1 text-sm hover:bg-red-200" onClick={() => handleDelete(field)}>
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 