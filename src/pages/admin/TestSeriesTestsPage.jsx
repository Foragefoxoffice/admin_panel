import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import {
  ArrowLeft, Plus, Trash2, Edit, ToggleLeft, ToggleRight,
  Clock, FileQuestion, BookOpen, ChevronRight, ChevronUp, ChevronDown,
  CheckCircle2, AlertCircle,
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
    setReordering(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/test-series/packages/${packageId}/tests/reorder`,
        { order: updated.map((t, i) => ({ id: t.id, order: i })) },
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
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/test-series")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            All Packages
          </button>
          <h1 className="text-xl font-bold text-gray-800">{pkg?.title ?? "Tests"}</h1>
          {pkg?.description && (
            <p className="text-sm text-gray-400 mt-0.5">{pkg.description}</p>
          )}
        </div>
        <Link
          to={`/admin/test-series/${packageId}/tests/create`}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
        >
          <Plus size={14} />
          Add Test
        </Link>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Tests", value: tests.length, icon: <FileQuestion size={15} />, color: "text-purple-600 bg-purple-50" },
          { label: "Published", value: publishedCount, icon: <CheckCircle2 size={15} />, color: "text-green-600 bg-green-50" },
          { label: "Unpublished", value: tests.length - publishedCount, icon: <AlertCircle size={15} />, color: "text-amber-600 bg-amber-50" },
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

      {/* ── Tests List ────────────────────────────────────────────── */}
      {tests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen size={24} className="text-purple-300" />
          </div>
          <p className="font-semibold text-gray-700">No tests yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Add the first test to this package</p>
          <Link
            to={`/admin/test-series/${packageId}/tests/create`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition"
          >
            <Plus size={14} /> Add Test
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {tests.map((test, idx) => (
            <div
              key={test.id}
              className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-200 overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Left accent */}
                <div className={`w-1 shrink-0 ${test.isPublished ? "bg-green-500" : "bg-amber-400"}`} />

                {/* Reorder */}
                <div className="flex flex-col items-center justify-center gap-0 px-2 py-3 shrink-0 border-r border-gray-50">
                  <button
                    onClick={() => moveTest(idx, -1)}
                    disabled={idx === 0 || reordering}
                    className="p-1 rounded hover:bg-purple-50 text-gray-300 hover:text-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <span className="text-xs font-bold text-gray-300 w-5 text-center py-0.5">{idx + 1}</span>
                  <button
                    onClick={() => moveTest(idx, 1)}
                    disabled={idx === tests.length - 1 || reordering}
                    className="p-1 rounded hover:bg-purple-50 text-gray-300 hover:text-purple-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center gap-4 px-4 py-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-gray-800 text-sm">{test.name}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${test.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {test.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        <Clock size={11} className="text-gray-400" />
                        {test.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        <FileQuestion size={11} className="text-gray-400" />
                        {test._count?.questions ?? 0}/{test.totalQuestions} Qs
                      </span>
                    </div>

                    {test.subjectConfigs && test.subjectConfigs.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {test.subjectConfigs.map((sc) => (
                          <span key={sc.id} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-medium">
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
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title={test.isPublished ? "Unpublish" : "Publish"}
                    >
                      {test.isPublished
                        ? <ToggleRight size={20} className="text-green-500" />
                        : <ToggleLeft size={20} className="text-gray-400" />}
                    </button>
                    <Link
                      to={`/admin/test-series/tests/${test.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                    <Link
                      to={`/admin/test-series/tests/${test.id}/manage-questions`}
                      className="flex items-center gap-1 ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Questions
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
