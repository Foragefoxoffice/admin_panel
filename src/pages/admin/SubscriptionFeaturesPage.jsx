import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ChevronDown, ChevronRight, X, Check, GripVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  getSubscriptionFeaturesAdmin,
  createFeatureCategory,
  updateFeatureCategory,
  deleteFeatureCategory,
  createSubscriptionFeature,
  updateSubscriptionFeature,
  deleteSubscriptionFeature,
} from "../../utils/api";

// ── value options ──────────────────────────────────────────────
const VALUE_OPTIONS = [
  { value: "true",  label: "✓  Yes",   color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "false", label: "✕  No",    color: "text-red-500 bg-red-50 border-red-200" },
  { value: "custom", label: "Custom…", color: "text-purple-600 bg-purple-50 border-purple-200" },
];

function normaliseOption(val) {
  if (val === "true" || val === "false") return val;
  return "custom";
}

// ── small badge shown in read mode ────────────────────────────
function ValueBadge({ val }) {
  if (val === "true")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
        ✓ Yes
      </span>
    );
  if (val === "false")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-200">
        ✕ No
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
      {val}
    </span>
  );
}

// ── value selector (dropdown + optional custom text) ──────────
function ValueSelect({ value, onChange, placeholder }) {
  const option = normaliseOption(value);
  return (
    <div className="flex flex-col gap-1">
      <select
        className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 min-w-[110px]"
        value={option}
        onChange={(e) => {
          if (e.target.value !== "custom") onChange(e.target.value);
          else onChange("");
        }}
      >
        {VALUE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {option === "custom" && (
        <input
          autoFocus
          className="border border-purple-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder={placeholder || "e.g. 8000 Qs"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ── feature row ───────────────────────────────────────────────
function FeatureRow({ feature, onSaved, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: feature.name,
    freeValue: feature.freeValue,
    premValue: feature.premValue,
    sortOrder: feature.sortOrder,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Feature name is required");
    setSaving(true);
    try {
      const updated = await updateSubscriptionFeature(feature.id, form);
      onSaved(updated);
      setEditing(false);
      toast.success("Feature updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <tr className="bg-purple-50/60 border-t border-purple-100">
        <td className="px-4 py-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </td>
        <td className="px-4 py-3">
          <ValueSelect
            value={form.freeValue}
            onChange={(v) => setForm((f) => ({ ...f, freeValue: v }))}
            placeholder="e.g. Limited"
          />
        </td>
        <td className="px-4 py-3">
          <ValueSelect
            value={form.premValue}
            onChange={(v) => setForm((f) => ({ ...f, premValue: v }))}
            placeholder="e.g. 42000+ Qs"
          />
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check size={13} /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50/70 group transition-colors">
      <td className="px-4 py-3 text-sm text-gray-800">{feature.name}</td>
      <td className="px-4 py-3"><ValueBadge val={feature.freeValue} /></td>
      <td className="px-4 py-3"><ValueBadge val={feature.premValue} /></td>
      <td className="px-4 py-3 text-sm text-gray-400">{feature.sortOrder}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(feature.id)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── add feature row ───────────────────────────────────────────
function AddFeatureRow({ categoryId, onAdded, onCancel }) {
  const [form, setForm] = useState({ name: "", freeValue: "false", premValue: "true", sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error("Feature name is required");
    setSaving(true);
    try {
      const created = await createSubscriptionFeature({ ...form, categoryId });
      onAdded(created);
      toast.success("Feature added");
    } catch {
      toast.error("Failed to add feature");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="bg-emerald-50/60 border-t border-emerald-100">
      <td className="px-4 py-3">
        <input
          autoFocus
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="Feature name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
      </td>
      <td className="px-4 py-3">
        <ValueSelect
          value={form.freeValue}
          onChange={(v) => setForm((f) => ({ ...f, freeValue: v }))}
          placeholder="e.g. Limited"
        />
      </td>
      <td className="px-4 py-3">
        <ValueSelect
          value={form.premValue}
          onChange={(v) => setForm((f) => ({ ...f, premValue: v }))}
          placeholder="e.g. 42000+ Qs"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={form.sortOrder}
          onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            disabled={saving}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            <Check size={13} /> Add
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200"
          >
            <X size={13} /> Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── category block ────────────────────────────────────────────
function CategoryBlock({ category, index, onCategoryUpdated, onCategoryDeleted }) {
  const [expanded, setExpanded] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(category.name);
  const [orderInput, setOrderInput] = useState(category.sortOrder);
  const [features, setFeatures] = useState(category.features || []);
  const [addingFeature, setAddingFeature] = useState(false);

  const handleSaveName = async () => {
    try {
      const updated = await updateFeatureCategory(category.id, { name: nameInput, sortOrder: orderInput });
      onCategoryUpdated(updated);
      setEditingName(false);
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirm(`Delete "${category.name}" and all its features?`)) return;
    try {
      await deleteFeatureCategory(category.id);
      onCategoryDeleted(category.id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleFeatureSaved = (updated) =>
    setFeatures((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));

  const handleFeatureAdded = (created) => {
    setFeatures((prev) => [...prev, created]);
    setAddingFeature(false);
  };

  const handleFeatureDeleted = async (id) => {
    if (!confirm("Delete this feature?")) return;
    try {
      await deleteSubscriptionFeature(id);
      setFeatures((prev) => prev.filter((f) => f.id !== id));
      toast.success("Feature deleted");
    } catch {
      toast.error("Failed to delete feature");
    }
  };

  const ACCENT_COLORS = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-sky-600",
  ];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div layout className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* header strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

      {/* category row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>

        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 max-w-sm"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            />
            <input
              type="number"
              placeholder="Order"
              className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={orderInput}
              onChange={(e) => setOrderInput(Number(e.target.value))}
            />
            <button onClick={handleSaveName} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700">
              <Check size={13} /> Save
            </button>
            <button onClick={() => setEditingName(false)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">
              <X size={13} /> Cancel
            </button>
          </div>
        ) : (
          <span className="flex-1 font-semibold text-gray-800">{category.name}</span>
        )}

        <span className="text-xs text-gray-400 font-medium mr-2">{features.length} features</span>

        {!editingName && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditingName(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDeleteCategory}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* features table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="border-t border-gray-100">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-2/5">Feature</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Free</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/5">Premium</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Order</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f) => (
                    <FeatureRow
                      key={f.id}
                      feature={f}
                      onSaved={handleFeatureSaved}
                      onDelete={handleFeatureDeleted}
                    />
                  ))}
                  {addingFeature && (
                    <AddFeatureRow
                      categoryId={category.id}
                      onAdded={handleFeatureAdded}
                      onCancel={() => setAddingFeature(false)}
                    />
                  )}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setAddingFeature(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  <Plus size={15} /> Add Feature
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── main page ─────────────────────────────────────────────────
export default function SubscriptionFeaturesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatOrder, setNewCatOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadFeatures(); }, []);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionFeaturesAdmin();
      setCategories(data);
    } catch {
      toast.error("Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return toast.error("Category name is required");
    setSaving(true);
    try {
      const created = await createFeatureCategory({ name: newCatName, sortOrder: newCatOrder });
      setCategories((prev) => [...prev, { ...created, features: [] }]);
      setNewCatName("");
      setNewCatOrder(0);
      setAddingCategory(false);
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryUpdated = (updated) =>
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));

  const handleCategoryDeleted = (id) =>
    setCategories((prev) => prev.filter((c) => c.id !== id));

  const totalFeatures = categories.reduce((s, c) => s + (c.features?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* ── header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Features</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the FREE vs PREMIUM comparison table shown in the app.
          </p>
        </div>
        <button
          onClick={() => setAddingCategory(true)}
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 text-sm font-semibold shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* ── stats row ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Categories", value: categories.length, color: "bg-purple-50 text-purple-700 border-purple-200" },
          { label: "Total Features", value: totalFeatures, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Value types", value: "Yes / No / Custom", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-lg font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── add category form ── */}
      <AnimatePresence>
        {addingCategory && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white border-2 border-purple-200 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3 shadow-sm"
          >
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500 to-purple-700 flex-shrink-0" />
            <input
              autoFocus
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm max-w-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Category name (e.g. Test & Analysis)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <input
              type="number"
              className="w-24 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Sort order"
              value={newCatOrder}
              onChange={(e) => setNewCatOrder(Number(e.target.value))}
            />
            <button
              onClick={handleAddCategory}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check size={14} /> Create
            </button>
            <button
              onClick={() => setAddingCategory(false)}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading features…</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mb-1">📋</div>
          <p className="font-medium text-gray-500">No categories yet</p>
          <p className="text-sm">Click "Add Category" to create the first one.</p>
        </div>
      ) : (
        categories.map((cat, i) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            index={i}
            onCategoryUpdated={handleCategoryUpdated}
            onCategoryDeleted={handleCategoryDeleted}
          />
        ))
      )}
    </div>
  );
}
