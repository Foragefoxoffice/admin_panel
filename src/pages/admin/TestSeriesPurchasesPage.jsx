import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import {
  Users, Package, Star, ExternalLink, Search,
  ShoppingCart, TrendingUp, IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TestSeriesPurchasesPage() {
  const [tab, setTab] = useState("individual");
  const [individual, setIndividual] = useState([]);
  const [bundle, setBundle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [indRes, bunRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/test-series/payment/all`, { headers }),
          axios.get(`${API_BASE_URL}/test-series/bundle/purchases`, { headers }),
        ]);
        setIndividual(indRes.data);
        setBundle(bunRes.data);
      } catch { toast.error("Failed to load purchases"); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const filterRows = (rows) => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.user?.name?.toLowerCase().includes(q) ||
        r.user?.email?.toLowerCase().includes(q) ||
        r.user?.phoneNumber?.toLowerCase().includes(q) ||
        r.package?.title?.toLowerCase().includes(q) ||
        r.paymentId?.toLowerCase().includes(q)
    );
  };

  const indFiltered = filterRows(individual);
  const bunFiltered = filterRows(bundle);

  const totalIndRevenue = individual.reduce((s, r) => s + (r.amount || 0), 0);
  const totalBunRevenue = bundle.reduce((s, r) => s + (r.amount || 0), 0);

  const receiptUrl = (paymentId, type) =>
    `${API_BASE_URL}/test-series/receipt?paymentId=${paymentId}&type=${type}`;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#3d1a5c] via-[#512878] to-[#693f86] px-8 pt-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart size={14} className="text-purple-300" />
            <span className="text-purple-300 text-xs font-semibold tracking-widest uppercase">Test Series</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Purchases</h1>
          <p className="text-purple-200 text-sm mt-1">All individual & bundle purchases</p>

          {/* Stats */}
          {!loading && (
            <div className="flex gap-4 mt-6 flex-wrap">
              {[
                { label: "Individual Sales", value: individual.length, icon: <Package size={14} />, color: "bg-white/10" },
                { label: "Bundle Sales", value: bundle.length, icon: <Star size={14} />, color: "bg-amber-400/20" },
                { label: "Individual Revenue", value: `₹${totalIndRevenue.toLocaleString("en-IN")}`, icon: <IndianRupee size={14} />, color: "bg-green-400/20" },
                { label: "Bundle Revenue", value: `₹${totalBunRevenue.toLocaleString("en-IN")}`, icon: <TrendingUp size={14} />, color: "bg-white/10" },
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

      <div className="max-w-6xl mx-auto px-8 -mt-4 pb-10">
        {/* ── Search + Tabs ────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or payment ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shrink-0 p-1 gap-1">
            <button
              onClick={() => setTab("individual")}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "individual" ? "bg-purple-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white"}`}
            >
              <span className="flex items-center gap-2">
                <Package size={14} />
                Individual
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "individual" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {individual.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setTab("bundle")}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "bundle" ? "bg-amber-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-white"}`}
            >
              <span className="flex items-center gap-2">
                <Star size={14} />
                Bundle
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "bundle" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {bundle.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center h-48 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
          </div>
        ) : tab === "individual" ? (
          <IndividualTable rows={indFiltered} formatDate={formatDate} receiptUrl={receiptUrl} />
        ) : (
          <BundleTable rows={bunFiltered} formatDate={formatDate} receiptUrl={receiptUrl} />
        )}
      </div>
    </div>
  );
}

function IndividualTable({ rows, formatDate, receiptUrl }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Package</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-purple-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}>
                <td className="px-5 py-4">
                  <span className="text-xs font-bold text-gray-300 bg-gray-100 w-6 h-6 rounded-lg flex items-center justify-center">{i + 1}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-800 text-sm">{r.user?.name ?? "—"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.user?.email}</div>
                  {r.user?.phoneNumber && <div className="text-xs text-gray-400">{r.user.phoneNumber}</div>}
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                    {r.package?.title ?? "—"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-bold text-gray-800">₹{r.amount?.toLocaleString("en-IN")}</span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(r.purchasedAt)}</td>
                <td className="px-5 py-4"><ShippingCell r={r} /></td>
                <td className="px-5 py-4">
                  {r.paymentId ? (
                    <a href={receiptUrl(r.paymentId, "individual")} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors">
                      <ExternalLink size={12} /> View
                    </a>
                  ) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-100 bg-gray-50/50">
        {rows.length} record{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function BundleTable({ rows, formatDate, receiptUrl }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Bundle</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping</th>
              <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={`border-b border-gray-50 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}>
                <td className="px-5 py-4">
                  <span className="text-xs font-bold text-gray-300 bg-gray-100 w-6 h-6 rounded-lg flex items-center justify-center">{i + 1}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-800 text-sm">{r.user?.name ?? "—"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.user?.email}</div>
                  {r.user?.phoneNumber && <div className="text-xs text-gray-400">{r.user.phoneNumber}</div>}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold">
                    <Star size={11} /> All Tests Bundle
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-bold text-gray-800">₹{r.amount?.toLocaleString("en-IN")}</span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(r.purchasedAt)}</td>
                <td className="px-5 py-4"><ShippingCell r={r} /></td>
                <td className="px-5 py-4">
                  {r.paymentId ? (
                    <a href={receiptUrl(r.paymentId, "bundle")} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-semibold bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors">
                      <ExternalLink size={12} /> View
                    </a>
                  ) : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-100 bg-gray-50/50">
        {rows.length} record{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function ShippingCell({ r }) {
  const [open, setOpen] = useState(false);
  if (!r.shippingName && !r.shippingAddress) {
    return <span className="text-gray-300 text-xs">—</span>;
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
      >
        {open ? "Hide" : "View"}
      </button>
      {open && (
        <div className="absolute left-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-56 text-xs text-gray-700 space-y-1">
          {r.shippingName && <p className="font-bold text-gray-800">{r.shippingName}</p>}
          {r.shippingPhone && <p className="text-gray-500">{r.shippingPhone}</p>}
          {r.shippingAddress && <p>{r.shippingAddress}</p>}
          {(r.shippingCity || r.shippingPincode) && (
            <p>{[r.shippingCity, r.shippingPincode].filter(Boolean).join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users size={28} className="text-purple-300" />
      </div>
      <p className="font-semibold text-gray-700">No purchases yet</p>
      <p className="text-sm text-gray-400 mt-1">Purchases will appear here once students buy</p>
    </div>
  );
}
