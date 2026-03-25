import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import {
  ArrowLeft, Plus, Trash2, Edit, ToggleLeft, ToggleRight,
  Clock, FileQuestion, BookOpen, ChevronRight, ChevronUp, ChevronDown,
  Package, CheckCircle2, AlertCircle, GripVertical,
} from "lucide-react";

export default function TestSeriesTestsPage() {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, [packageId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pkgRes, testsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/test-series/packages/${packageId}`, { headers }),
        axios.get(`${API_BASE_URL}/test-series/packages/${packageId}/tests`, { headers }),
      ]);
      setPkg(pkgRes.data);
      setTests(testsRes.data);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  const handleTogglePublish = async (test) => {
    setTests((prev) => prev.map((t) => (t.id === test.id ? { ...t, isPublished: !t.isPublished } : t)));
    try {
      await axios.patch(`${API_BASE_URL}/test-series/tests/${test.id}/toggle-publish`, {}, { headers });
      toast.success("Publish status updated");
    } catch {
      setTests((prev) => prev.map((t) => (t.id === test.id ? { ...t, isPublished: test.isPublished } : t)));
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this test and all its questions? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/test-series/tests/${id}`, { headers });
      setTests((prev) => prev.filter((t) => t.id !== id));
      toast.success("Test deleted");
    } catch { toast.error("Failed to delete test"); }
  };

  const moveTest = async (idx, direction) => {
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= tests.length) return;
    const updated = [...tests];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setTests(updated);
    const orderPayload = updated.map((t, i) => ({ id: t.id, order: i }));
    setReordering(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/test-series/packages/${packageId}/tests/reorder`,
        { order: orderPayload },
        { headers }
      );
      toast.success("Order saved");
    } catch {
      toast.error("Failed to save order");
      fetchData();
    } finally { setReordering(false); }
  };

  const publishedCount = tests.filter((t) => t.isPublished).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700" />
          <p className="text-sm text-gray-400">Loading tests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#3d1a5c] via-[#512878] to-[#693f86] px-8 pt-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/admin/test-series")}
            className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={15} />
            All Packages
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package size={14} className="text-purple-300" />
                <span className="text-purple-300 text-xs font-semibold tracking-widest uppercase">Package</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{pkg?.title}</h1>
              {pkg?.description && (
                <p className="text-purple-200 text-sm mt-1">{pkg.description}</p>
              )}
            </div>
            <Link
              to={`/admin/test-series/${packageId}/tests/create`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-purple-800 rounded-xl hover:bg-purple-50 text-sm font-semibold shadow-lg shadow-black/20 transition-all"
            >
              <Plus size={15} />
              Add Test
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            {[
              { label: "Total Tests", value: tests.length, icon: <FileQuestion size={14} />, color: "bg-white/10" },
              { label: "Published", value: publishedCount, icon: <CheckCircle2 size={14} />, color: "bg-green-400/20" },
              { label: "Unpublished", value: tests.length - publishedCount, icon: <AlertCircle size={14} />, color: "bg-white/10" },
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
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-4 pb-10">
        {tests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-purple-300" />
            </div>
            <p className="font-semibold text-gray-700">No tests yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">Add the first test to this package</p>
            <Link
              to={`/admin/test-series/${packageId}/tests/create`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white rounded-xl text-sm font-semibold hover:bg-purple-800 transition"
            >
              <Plus size={15} /> Add Test
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test, idx) => (
              <div
                key={test.id}
                className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-stretch">
                  {/* Left accent */}
                  <div className={`w-1.5 shrink-0 rounded-l-2xl ${test.isPublished ? "bg-gradient-to-b from-green-400 to-green-600" : "bg-gradient-to-b from-amber-400 to-amber-500"}`} />

                  {/* Reorder controls */}
                  <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-4 shrink-0">
                    <button
                      onClick={() => moveTest(idx, -1)}
                      disabled={idx === 0 || reordering}
                      className="p-1 rounded-lg hover:bg-purple-50 text-gray-300 hover:text-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <span className="text-xs font-bold text-gray-300 w-5 text-center">{idx + 1}</span>
                    <button
                      onClick={() => moveTest(idx, 1)}
                      disabled={idx === tests.length - 1 || reordering}
                      className="p-1 rounded-lg hover:bg-purple-50 text-gray-300 hover:text-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-4 py-4 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-gray-800 text-base">{test.name}</h2>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${test.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {test.isPublished ? "Published" : "Unpublished"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <Clock size={12} className="text-gray-400" />
                            {test.duration} min
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                            <FileQuestion size={12} className="text-gray-400" />
                            {test._count?.questions ?? 0} / {test.totalQuestions} questions
                          </span>
                        </div>

                        {test.subjectConfigs && test.subjectConfigs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {test.subjectConfigs.map((sc) => (
                              <span key={sc.id} className="text-xs bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full font-medium">
                                {sc.subjectName}: {sc.questionCount}Q
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleTogglePublish(test)}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                          title={test.isPublished ? "Unpublish" : "Publish"}
                        >
                          {test.isPublished
                            ? <ToggleRight size={22} className="text-green-500" />
                            : <ToggleLeft size={22} className="text-gray-400" />}
                        </button>
                        <Link
                          to={`/admin/test-series/tests/${test.id}/edit`}
                          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Link
                          to={`/admin/test-series/tests/${test.id}/manage-questions`}
                          className="flex items-center gap-1.5 ml-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-purple-200 transition-all"
                        >
                          Questions
                          <ChevronRight size={14} />
                        </Link>
                      </div>
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
