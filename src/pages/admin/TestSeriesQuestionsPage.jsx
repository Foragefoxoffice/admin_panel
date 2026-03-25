import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || "";
}

export default function TestSeriesQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const LIMIT = 20;

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filterSubject, filterChapter, page]);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/subjects`, { headers });
      setSubjects(data);
    } catch {}
  };

  const fetchChaptersBySubject = async (subjectId) => {
    if (!subjectId) { setChapters([]); return; }
    try {
      const { data } = await axios.get(`${API_BASE_URL}/chapters/subject/${subjectId}`, { headers });
      setChapters(data);
    } catch {}
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filterSubject) params.subjectId = filterSubject;
      if (filterChapter) params.chapterId = filterChapter;
      const { data } = await axios.get(`${API_BASE_URL}/test-series/questions`, { headers, params });
      setQuestions(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (val) => {
    setFilterSubject(val);
    setFilterChapter("");
    setChapters([]);
    setPage(1);
    if (val) fetchChaptersBySubject(val);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question permanently?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/test-series/questions/${id}`, { headers });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setTotal((t) => t - 1);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate("/admin/test-series")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft size={16} />
            Back to Packages
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Test Series Question Bank</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total} question{total !== 1 ? "s" : ""} in the test series bank
          </p>
        </div>
        <Link
          to="/admin/test-series/questions/add"
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium"
        >
          <Plus size={16} />
          Add Question
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select
          value={filterSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[160px]"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={filterChapter}
          onChange={(e) => { setFilterChapter(e.target.value); setPage(1); }}
          disabled={!chapters.length}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[160px] disabled:opacity-50"
        >
          <option value="">All Chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="font-medium">No questions found</p>
          <p className="text-sm mt-1">Add questions to the test series bank</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium w-10">#</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Question</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Subject</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Chapter</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Difficulty</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {questions.map((q, idx) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{(page - 1) * LIMIT + idx + 1}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-2 text-gray-800">{stripHtml(q.question)}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{q.subject?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{q.chapter?.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {q.difficulty === 1 ? "Easy" : q.difficulty === 2 ? "Medium" : "Hard"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/test-series/questions/edit/${q.id}`}
                        className="p-1.5 text-gray-400 hover:text-purple-600"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>{total} total questions</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
