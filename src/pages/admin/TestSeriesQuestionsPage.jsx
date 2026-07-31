import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, ChevronLeft, ChevronRight, ArrowLeft, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function QuestionItem({ q, index, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header - Light Blue/Grey background */}
      <div 
        className="p-4 bg-[#F1F3F9] cursor-pointer hover:bg-[#EBEEF5] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <span className="font-bold text-gray-800 shrink-0">{index}.</span>
              <div className="font-semibold text-gray-800 leading-relaxed">
                <MathJax dynamic>
                  <div dangerouslySetInnerHTML={{ __html: q.question }} className="inline question-content" />
                </MathJax>
                {q.topic?.name?.toLowerCase().includes("neet") && (
                   <span className="ml-2 font-bold">[NEET]</span>
                )}
              </div>
            </div>
            
            {/* Metadata Line */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 font-medium uppercase tracking-wider">
              <span>ID: {q.id}</span>
              <span className="text-gray-300">|</span>
              <span>Subject: {q.subject?.name}</span>
              <span className="text-gray-300">|</span>
              <span>Chapter: {q.chapter?.name}</span>
              {q.topic?.name && (
                <>
                  <span className="text-gray-300">|</span>
                  <span>Topic: {q.topic?.name}</span>
                </>
              )}
            </div>
          </div>
          
          <button className="text-gray-400 mt-1">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 bg-white border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
          {q.image && (
            <div className="mb-6 max-w-2xl">
              <img src={`${BASE_URL}/${q.image}`} alt="Question" className="rounded-lg border border-gray-200 max-h-[400px] object-contain" />
            </div>
          )}

          {/* Options */}
          <div className="space-y-5 mb-6">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt} className="flex flex-col gap-1.5">
                <span className="text-[13px] font-bold text-gray-900">Option {opt}:</span>
                <div className="text-gray-700 text-[15px] pl-1">
                  <MathJax dynamic>
                    <div dangerouslySetInnerHTML={{ __html: q[`option${opt}`] }} />
                  </MathJax>
                </div>
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <div className="mb-6 bg-green-50/50 inline-block px-3 py-1.5 rounded-lg border border-green-100">
            <span className="text-green-700 font-bold text-sm">Correct Answer: </span>
            <span className="text-green-700 font-extrabold text-sm">{q.correctOption}</span>
          </div>

          {/* Hint */}
          {(q.hint || q.hintImage) && (
            <div className="mb-8 p-5 bg-purple-50/30 rounded-xl border border-purple-100/50">
              <span className="block font-bold text-gray-800 text-sm mb-3">Hint:</span>
              {q.hintImage && (
                <img src={`${BASE_URL}/${q.hintImage}`} alt="Hint" className="mb-4 max-w-xl rounded-lg border border-gray-200 max-h-[300px] object-contain" />
              )}
              {q.hint && (
                <div className="text-[14.5px] text-gray-700 leading-relaxed italic">
                  <MathJax dynamic>
                    <div dangerouslySetInnerHTML={{ __html: q.hint }} />
                  </MathJax>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/admin/test-series/questions/edit/${q.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold transition-all shadow-sm hover:shadow"
            >
              <Edit size={15} />
              Edit Question
            </Link>
            <button
              onClick={() => onDelete(q.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold shadow-sm"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestSeriesQuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const LIMIT = 20;

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 400);
    return () => clearTimeout(timer);
  }, [filterSubject, filterChapter, searchTerm, page]);

  const fetchSubjects = async () => {
    try {
      // Use filter-meta to get only subjects that have TS questions
      const { data } = await axios.get(`${API_BASE_URL}/test-series/filter-meta`, { headers });
      setSubjects(data.subjects || []);
    } catch {
      // Fallback to all subjects if endpoint fails
      try {
        const { data } = await axios.get(`${API_BASE_URL}/subjects`, { headers });
        setSubjects(data);
      } catch {}
    }
  };

  const fetchChaptersBySubject = async (subjectId) => {
    if (!subjectId) { setChapters([]); return; }
    setChaptersLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/test-series/filter-meta`, { headers, params: { subjectId } });
      setChapters(data.chapters || []);
    } catch {
      setChapters([]);
    } finally {
      setChaptersLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filterSubject) params.subjectId = filterSubject;
      if (filterChapter) params.chapterId = filterChapter;
      if (searchTerm) params.search = searchTerm;
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
    <MathJaxContext
      config={{
        loader: { load: ["input/tex", "output/chtml"] },
        tex: {
          packages: { "[+]": ["color", "mhchem", "amsmath", "physics"] },
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
        },
      }}
    >
      <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gray-50/30">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate("/admin/test-series")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-700 transition-colors mb-2 font-medium"
            >
              <ArrowLeft size={16} />
              Back to Packages
            </button>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Question Bank</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all <span className="font-bold text-purple-700">{total}</span> questions across the test series packages
            </p>
          </div>
          <Link
            to="/admin/test-series/questions/add"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition-all shadow-sm hover:shadow-md text-sm font-bold shrink-0"
          >
            <Plus size={18} strokeWidth={3} />
            Add New Question
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-6 mb-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          {/* Search Box */}
          <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
            <label className="text-xs font-extrabold text-gray-400 uppercase ml-1 tracking-widest">Search Questions</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by question text..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 font-semibold text-gray-700 placeholder:text-gray-400 hover:border-purple-200 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); setPage(1); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <label className="text-xs font-extrabold text-gray-400 uppercase ml-1 tracking-widest">Filter by Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 font-bold text-gray-700 cursor-pointer hover:border-purple-200 transition-colors"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <label className="text-xs font-extrabold text-gray-400 uppercase ml-1 tracking-widest">Filter by Chapter</label>
            <div className="relative">
              <select
                value={filterChapter}
                onChange={(e) => { setFilterChapter(e.target.value); setPage(1); }}
                disabled={!filterSubject || chaptersLoading}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50/50 disabled:opacity-50 font-bold text-gray-700 cursor-pointer hover:border-purple-200 transition-colors"
              >
                <option value="">
                  {!filterSubject ? "Select a subject first" : chaptersLoading ? "Loading…" : chapters.length === 0 ? "No chapters found" : "All Chapters"}
                </option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {chaptersLoading && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-100 border-t-purple-700" />
            <p className="text-gray-400 font-medium animate-pulse uppercase tracking-widest text-xs">Fetching questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Plus className="text-gray-300" size={40} />
            </div>
            <p className="font-extrabold text-gray-800 text-xl tracking-tight">No questions found</p>
            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">We couldn't find any questions matching your filters. Try adjusting them or add a new question.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionItem 
                key={q.id} 
                q={q} 
                index={(page - 1) * LIMIT + idx + 1} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 py-8 border-t border-gray-200 gap-6">
            <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">{total} questions found in total</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                disabled={page === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 disabled:opacity-30 bg-white hover:border-purple-300 hover:text-purple-700 transition-all font-bold disabled:cursor-not-allowed text-sm shadow-sm"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              
              <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => { setPage(pageNum); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        page === pageNum 
                        ? "bg-purple-700 text-white shadow-md shadow-purple-200" 
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                disabled={page === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 disabled:opacity-30 bg-white hover:border-purple-300 hover:text-purple-700 transition-all font-bold disabled:cursor-not-allowed text-sm shadow-sm"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MathJaxContext>
  );
}
