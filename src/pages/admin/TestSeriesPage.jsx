import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import {
  Plus, Trash2, Edit, ToggleLeft, ToggleRight, BookOpen,
  ChevronRight, ChevronDown, ChevronUp, Smartphone, Package,
  CheckCircle2, XCircle, FileQuestion, IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TestSeriesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  const [bundleLoading, setBundleLoading] = useState(true);
  const [bundleForm, setBundleForm] = useState({ price: "", mrp: "", physicalPrice: "", physicalMrp: "", label: "", premiumExpiry: "", paymentSubtitle: "", features: [] });
  const [newBundleFeature, setNewBundleFeature] = useState("");
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
        premiumExpiry: data.premiumExpiry ? data.premiumExpiry.split("T")[0] : "",
        paymentSubtitle: data.paymentSubtitle || "",
        features: Array.isArray(data.features) ? data.features : [],
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
          premiumExpiry: bundleForm.premiumExpiry || null,
          paymentSubtitle: bundleForm.paymentSubtitle.trim() || null,
          features: bundleForm.features.length > 0 ? bundleForm.features : null,
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

  const handleMove = async (idx, direction) => {
    const newPackages = [...packages];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newPackages.length) return;
    [newPackages[idx], newPackages[swapIdx]] = [newPackages[swapIdx], newPackages[idx]];
    setPackages(newPackages);
    try {
      await axios.patch(
        `${API_BASE_URL}/test-series/packages/reorder`,
        { order: newPackages.map((p, i) => ({ id: p.id, position: i })) },
        { headers }
      );
    } catch {
      toast.error("Failed to save order");
      fetchPackages();
    }
  };

  const activeCount = packages.filter((p) => p.isActive).length;
  const totalTests = packages.reduce((sum, p) => sum + (p._count?.tests ?? 0), 0);
  const bundleDiscount = bundleForm.mrp && bundleForm.price && Number(bundleForm.mrp) > Number(bundleForm.price)
    ? Math.round(((Number(bundleForm.mrp) - Number(bundleForm.price)) / Number(bundleForm.mrp)) * 100) : null;
  const bundlePhysicalDiscount = bundleForm.physicalMrp && bundleForm.physicalPrice && Number(bundleForm.physicalMrp) > Number(bundleForm.physicalPrice)
    ? Math.round(((Number(bundleForm.physicalMrp) - Number(bundleForm.physicalPrice)) / Number(bundleForm.physicalMrp)) * 100) : null;

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Test Series Packages</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage NEET mock test packages</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/test-series/questions"
            className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-700 rounded-lg text-sm font-medium transition-all"
          >
            <BookOpen size={14} />
            Question Bank
          </Link>
          <Link
            to="/admin/test-series/create"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            <Plus size={14} />
            New Package
          </Link>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      {!loading && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Packages", value: packages.length, icon: <BookOpen size={15} />, color: "text-purple-600 bg-purple-50" },
            { label: "Active", value: activeCount, icon: <CheckCircle2 size={15} />, color: "text-green-600 bg-green-50" },
            { label: "Inactive", value: packages.length - activeCount, icon: <XCircle size={15} />, color: "text-gray-500 bg-gray-100" },
            { label: "Total Tests", value: totalTests, icon: <FileQuestion size={15} />, color: "text-blue-600 bg-blue-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800 leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bundle Pricing Accordion ─────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setBundleOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <IndianRupee size={14} className="text-purple-700" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm">Bundle Pricing — "Buy All Tests"</h2>
            <p className="text-xs text-gray-400 mt-0.5">Configure the all-in-one bundle price</p>
          </div>
          {bundleLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700 mr-1" />
          ) : bundle ? (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold mr-2">
              Active · ₹{bundle.price}{bundle.physicalPrice ? ` · Physical ₹${bundle.physicalPrice}` : ""}
            </span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold mr-2">
              Not configured
            </span>
          )}
          <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${bundleOpen ? "rotate-180" : ""}`} />
        </button>

        {bundleOpen && (
          <div className="px-5 pb-5 border-t border-gray-100">
            {bundleLoading ? (
              <div className="h-10 flex items-center pt-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700" />
              </div>
            ) : (
              <div className="pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Bundle Label</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="e.g. All Tests Bundle"
                      value={bundleForm.label}
                      onChange={(e) => setBundleForm((f) => ({ ...f, label: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Premium Access Expiry</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      value={bundleForm.premiumExpiry}
                      onChange={(e) => setBundleForm((f) => ({ ...f, premiumExpiry: e.target.value }))}
                    />
                    {bundleForm.premiumExpiry && (
                      <p className="text-xs text-purple-600 mt-1">
                        Until {new Date(bundleForm.premiumExpiry).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Payment Screen Subtitle</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="e.g. Full NEET mock test series with detailed analysis"
                    value={bundleForm.paymentSubtitle}
                    onChange={(e) => setBundleForm((f) => ({ ...f, paymentSubtitle: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    What's Included <span className="text-gray-400 normal-case font-normal">(shown on payment screen)</span>
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {bundleForm.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span className="flex-1 text-sm text-gray-700">{feat}</span>
                        <button
                          type="button"
                          onClick={() => setBundleForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))}
                          className="text-gray-400 hover:text-red-500 text-sm font-bold"
                        >✕</button>
                      </div>
                    ))}
                    {bundleForm.features.length === 0 && (
                      <p className="text-xs text-gray-400 italic py-1">No features added. Default list will be used.</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="e.g. Full 180-question NEET pattern mock tests"
                      value={newBundleFeature}
                      onChange={(e) => setNewBundleFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newBundleFeature.trim()) {
                          setBundleForm((f) => ({ ...f, features: [...f.features, newBundleFeature.trim()] }));
                          setNewBundleFeature("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBundleFeature.trim()) {
                          setBundleForm((f) => ({ ...f, features: [...f.features, newBundleFeature.trim()] }));
                          setNewBundleFeature("");
                        }
                      }}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition"
                    >Add</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">
                      <Smartphone size={12} /> Online Test
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Selling Price (₹) *</label>
                        <input type="number" min="0"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="999" value={bundleForm.price}
                          onChange={(e) => setBundleForm((f) => ({ ...f, price: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">MRP (₹)</label>
                        <input type="number" min="0"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="1499" value={bundleForm.mrp}
                          onChange={(e) => setBundleForm((f) => ({ ...f, mrp: e.target.value }))} />
                      </div>
                    </div>
                    {bundleDiscount && (
                      <p className="text-xs text-green-600 font-bold mt-2">{bundleDiscount}% OFF · Save ₹{Number(bundleForm.mrp) - Number(bundleForm.price)}</p>
                    )}
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 mb-1 uppercase tracking-wide">
                      <Package size={12} /> Physical Print
                    </div>
                    <p className="text-xs text-orange-400 mb-3">Leave blank to hide</p>
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Selling Price (₹)</label>
                        <input type="number" min="0"
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                          placeholder="Optional" value={bundleForm.physicalPrice}
                          onChange={(e) => setBundleForm((f) => ({ ...f, physicalPrice: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">MRP (₹)</label>
                        <input type="number" min="0"
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                          placeholder="Optional" value={bundleForm.physicalMrp}
                          onChange={(e) => setBundleForm((f) => ({ ...f, physicalMrp: e.target.value }))} />
                      </div>
                    </div>
                    {bundlePhysicalDiscount && (
                      <p className="text-xs text-green-600 font-bold mt-2">{bundlePhysicalDiscount}% OFF · Save ₹{Number(bundleForm.physicalMrp) - Number(bundleForm.physicalPrice)}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveBundle}
                  disabled={bundleSaving}
                  className="px-5 py-2 bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-800 disabled:opacity-60 font-semibold transition-all"
                >
                  {bundleSaving ? "Saving…" : bundle ? "Update Bundle" : "Save Bundle"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Packages List ──────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} className="text-purple-300" />
          </div>
          <p className="font-semibold text-gray-700">No packages yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Create your first test series package</p>
          <Link to="/admin/test-series/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition">
            <Plus size={14} /> New Package
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Left accent */}
                <div className={`w-1 shrink-0 ${pkg.isActive ? "bg-purple-500" : "bg-gray-200"}`} />

                {/* Reorder */}
                <div className="flex flex-col items-center justify-center gap-0 px-2 py-3 shrink-0 border-r border-gray-50">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-purple-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp size={13} className="text-purple-500" />
                  </button>
                  <span className="text-xs font-bold text-gray-300 w-5 text-center py-0.5">{idx + 1}</span>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === packages.length - 1}
                    className="p-1 rounded hover:bg-purple-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown size={13} className="text-purple-500" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 flex items-center gap-4 px-4 py-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-gray-800 text-sm">{pkg.title}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkg.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">{pkg.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        {pkg._count?.tests ?? 0} test{pkg._count?.tests !== 1 ? "s" : ""}
                      </span>
                      {pkg.price > 0 ? (
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          ₹{pkg.price}
                          {pkg.mrp ? <span className="text-gray-400 font-normal line-through ml-1">₹{pkg.mrp}</span> : null}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Free</span>
                      )}
                      {pkg.physicalPrice && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                          Physical ₹{pkg.physicalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggle(pkg)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title={pkg.isActive ? "Deactivate" : "Activate"}
                    >
                      {pkg.isActive
                        ? <ToggleRight size={20} className="text-green-500" />
                        : <ToggleLeft size={20} className="text-gray-400" />}
                    </button>
                    <Link
                      to={`/admin/test-series/${pkg.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                    <Link
                      to={`/admin/test-series/${pkg.id}/tests`}
                      className="flex items-center gap-1 ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      View Tests
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
