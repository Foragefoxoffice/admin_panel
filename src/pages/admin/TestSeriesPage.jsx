import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import {
  Plus, Trash2, Edit, ToggleLeft, ToggleRight, BookOpen,
  ChevronRight, ChevronDown, Smartphone, Package, Layers,
  TrendingUp, CheckCircle2, XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TestSeriesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [bundleLoading, setBundleLoading] = useState(true);
  const [bundleForm, setBundleForm] = useState({ price: "", mrp: "", physicalPrice: "", physicalMrp: "", label: "" });
  const [bundleSaving, setBundleSaving] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchPackages(); fetchBundle(); }, []);

  const fetchBundle = async () => {
    try {
      setBundleLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/test-series/bundle/price`, { headers });
      setBundle(data);
      setBundleForm({
        price: String(data.price),
        mrp: String(data.mrp ?? ""),
        physicalPrice: String(data.physicalPrice ?? ""),
        physicalMrp: String(data.physicalMrp ?? ""),
        label: data.label ?? "",
      });
    } catch { setBundle(null); }
    finally { setBundleLoading(false); }
  };

  const handleSaveBundle = async () => {
    if (!bundleForm.price) { toast.error("Price is required"); return; }
    try {
      setBundleSaving(true);
      const { data } = await axios.put(
        `${API_BASE_URL}/test-series/bundle/config`,
        {
          price: Number(bundleForm.price),
          mrp: bundleForm.mrp ? Number(bundleForm.mrp) : null,
          physicalPrice: bundleForm.physicalPrice ? Number(bundleForm.physicalPrice) : null,
          physicalMrp: bundleForm.physicalMrp ? Number(bundleForm.physicalMrp) : null,
          label: bundleForm.label || null,
          isActive: true,
        },
        { headers }
      );
      setBundle(data);
      toast.success("Bundle pricing saved");
    } catch { toast.error("Failed to save bundle config"); }
    finally { setBundleSaving(false); }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/test-series/packages`, { headers });
      setPackages(data);
    } catch { toast.error("Failed to fetch packages"); }
    finally { setLoading(false); }
  };

  const handleToggle = async (pkg) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, isActive: !p.isActive } : p)));
    try {
      await axios.patch(`${API_BASE_URL}/test-series/packages/${pkg.id}/toggle`, {}, { headers });
      toast.success("Status updated");
    } catch {
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, isActive: pkg.isActive } : p)));
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package and all its tests? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/test-series/packages/${id}`, { headers });
      setPackages((prev) => prev.filter((p) => p.id !== id));
      toast.success("Package deleted");
    } catch { toast.error("Failed to delete package"); }
  };

  const activeCount = packages.filter((p) => p.isActive).length;
  const totalTests = packages.reduce((sum, p) => sum + (p._count?.tests ?? 0), 0);

  const bundleDiscount = bundleForm.mrp && bundleForm.price && Number(bundleForm.mrp) > Number(bundleForm.price)
    ? Math.round(((Number(bundleForm.mrp) - Number(bundleForm.price)) / Number(bundleForm.mrp)) * 100) : null;
  const bundlePhysicalDiscount = bundleForm.physicalMrp && bundleForm.physicalPrice && Number(bundleForm.physicalMrp) > Number(bundleForm.physicalPrice)
    ? Math.round(((Number(bundleForm.physicalMrp) - Number(bundleForm.physicalPrice)) / Number(bundleForm.physicalMrp)) * 100) : null;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#3d1a5c] via-[#512878] to-[#693f86] px-8 pt-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers size={16} className="text-purple-300" />
                <span className="text-purple-300 text-xs font-semibold tracking-widest uppercase">Test Series</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Packages</h1>
              <p className="text-purple-200 text-sm mt-1">Manage NEET mock test packages</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/test-series/questions"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-sm"
              >
                <BookOpen size={15} />
                Question Bank
              </Link>
              <Link
                to="/admin/test-series/create"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-purple-800 rounded-xl hover:bg-purple-50 text-sm font-semibold shadow-lg shadow-black/20 transition-all"
              >
                <Plus size={15} />
                New Package
              </Link>
            </div>
          </div>

          {/* Stats row */}
          {!loading && (
            <div className="flex gap-4 mt-6">
              {[
                { label: "Total Packages", value: packages.length, icon: <Package size={14} />, color: "bg-white/10" },
                { label: "Active", value: activeCount, icon: <CheckCircle2 size={14} />, color: "bg-green-400/20" },
                { label: "Inactive", value: packages.length - activeCount, icon: <XCircle size={14} />, color: "bg-white/10" },
                { label: "Total Tests", value: totalTests, icon: <TrendingUp size={14} />, color: "bg-white/10" },
              ].map((s) => (
                <div key={s.label} className={`flex items-center gap-2 ${s.color} border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm`}>
                  <span className="text-purple-200">{s.icon}</span>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                    <p className="text-purple-300 text-xs mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-4 pb-10">
        {/* ── Bundle Pricing Accordion ─────────────────────────── */}
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setBundleOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <BookOpen size={15} className="text-purple-700" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800 text-sm">Bundle Pricing — "Buy All Tests"</h2>
              <p className="text-xs text-gray-400 mt-0.5">Configure the all-in-one bundle price</p>
            </div>
            {bundleLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-1" />
            ) : bundle ? (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold mr-2">
                ✓ Active · E-Test ₹{bundle.price}{bundle.physicalPrice ? ` · Physical ₹${bundle.physicalPrice}` : ""}
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold mr-2">
                Not configured
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-gray-400 shrink-0 transition-transform duration-200 ${bundleOpen ? "rotate-180" : ""}`}
            />
          </button>

          {bundleOpen && (
            <div className="px-6 pb-6 border-t border-gray-100">
              {bundleLoading ? (
                <div className="h-10 flex items-center pt-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700" />
                </div>
              ) : (
                <div className="pt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block uppercase tracking-wide">Bundle Label</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      placeholder="e.g. All Tests Bundle"
                      value={bundleForm.label}
                      onChange={(e) => setBundleForm((f) => ({ ...f, label: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* E-Test */}
                    <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">
                        <Smartphone size={12} /> E-Test Series
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Selling Price (₹) *</label>
                          <input type="number" min="0"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="999" value={bundleForm.price}
                            onChange={(e) => setBundleForm((f) => ({ ...f, price: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">MRP / Strikethrough (₹)</label>
                          <input type="number" min="0"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            placeholder="1499" value={bundleForm.mrp}
                            onChange={(e) => setBundleForm((f) => ({ ...f, mrp: e.target.value }))} />
                        </div>
                      </div>
                      {bundleDiscount && (
                        <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 px-2 py-1 rounded-lg inline-block">
                          {bundleDiscount}% OFF · Save ₹{Number(bundleForm.mrp) - Number(bundleForm.price)}
                        </p>
                      )}
                    </div>

                    {/* Physical */}
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 mb-1 uppercase tracking-wide">
                        <Package size={12} /> Physical Print
                      </div>
                      <p className="text-xs text-orange-400 mb-3">Leave blank to hide</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Selling Price (₹)</label>
                          <input type="number" min="0"
                            className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="Optional" value={bundleForm.physicalPrice}
                            onChange={(e) => setBundleForm((f) => ({ ...f, physicalPrice: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">MRP / Strikethrough (₹)</label>
                          <input type="number" min="0"
                            className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                            placeholder="Optional" value={bundleForm.physicalMrp}
                            onChange={(e) => setBundleForm((f) => ({ ...f, physicalMrp: e.target.value }))} />
                        </div>
                      </div>
                      {bundlePhysicalDiscount && (
                        <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 px-2 py-1 rounded-lg inline-block">
                          {bundlePhysicalDiscount}% OFF · Save ₹{Number(bundleForm.physicalMrp) - Number(bundleForm.physicalPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveBundle}
                    disabled={bundleSaving}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white text-sm rounded-xl hover:from-purple-800 hover:to-purple-700 disabled:opacity-60 font-semibold shadow-md shadow-purple-200 transition-all"
                  >
                    {bundleSaving ? "Saving…" : bundle ? "Update Bundle Price" : "Set Bundle Price"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Packages List ────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-purple-300" />
            </div>
            <p className="font-semibold text-gray-700">No packages yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Create your first test series package</p>
            <Link to="/admin/test-series/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition">
              <Plus size={15} /> New Package
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-center gap-0">
                  {/* Left accent bar */}
                  <div className={`w-1.5 self-stretch rounded-l-2xl shrink-0 ${pkg.isActive ? "bg-gradient-to-b from-purple-500 to-purple-700" : "bg-gray-200"}`} />

                  <div className="flex items-center gap-4 flex-1 p-5">
                    {/* Index badge */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${pkg.isActive ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"}`}>
                      {idx + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-gray-800 text-base">{pkg.title}</h2>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {pkg.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-gray-400 mt-0.5 truncate">{pkg.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                          {pkg._count?.tests ?? 0} test{pkg._count?.tests !== 1 ? "s" : ""}
                        </span>
                        {pkg.price > 0 ? (
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                            ₹{pkg.price}
                            {pkg.mrp ? <span className="text-gray-400 font-normal line-through ml-1">₹{pkg.mrp}</span> : null}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Free</span>
                        )}
                        {pkg.physicalPrice && (
                          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                            Physical ₹{pkg.physicalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggle(pkg)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        title={pkg.isActive ? "Deactivate" : "Activate"}
                      >
                        {pkg.isActive
                          ? <ToggleRight size={22} className="text-green-500" />
                          : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                      <Link
                        to={`/admin/test-series/${pkg.id}/edit`}
                        className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Link
                        to={`/admin/test-series/${pkg.id}/tests`}
                        className="flex items-center gap-1.5 ml-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-purple-200 transition-all group-hover:shadow-purple-300"
                      >
                        View Tests
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
