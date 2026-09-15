import React, { useEffect, useState } from "react";
import { fetchTranslationEntries, fetchTranslationLanguages } from "../../utils/api";

const STATUS_COLORS = {
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-700",
  generating: "bg-blue-100 text-blue-800",
};

const SOURCE_LABELS = { practice: "Practice", test_series: "Test Series" };

const stripHtml = (html) => (html || "").replace(/<[^>]+>/g, "");

const PAGE_SIZE = 20;

const TranslationEntries = () => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState("");
  const [questionIdSearch, setQuestionIdSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchTranslationLanguages()
      .then((data) => setLanguages(data.languages || []))
      .catch(() => {});
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTranslationEntries({
        page,
        pageSize: PAGE_SIZE,
        ...(status ? { status } : {}),
        ...(source ? { source } : {}),
        ...(languageId ? { languageId } : {}),
        ...(questionIdSearch.trim() ? { questionId: questionIdSearch.trim() } : {}),
      });
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, source, languageId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">Regional Language Translation — Entries</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Question ID</label>
            <input
              type="number"
              value={questionIdSearch}
              onChange={(e) => setQuestionIdSearch(e.target.value)}
              placeholder="e.g. 529"
              className="w-32 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Source</label>
            <select
              value={source}
              onChange={(e) => { setSource(e.target.value); setPage(1); }}
              className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none bg-white"
            >
              <option value="">All</option>
              <option value="practice">Practice</option>
              <option value="test_series">Test Series</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Language</label>
            <select
              value={languageId}
              onChange={(e) => { setLanguageId(e.target.value); setPage(1); }}
              className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none bg-white"
            >
              <option value="">All</option>
              {languages.map((l) => (
                <option key={l.id} value={l.id}>{l.name} ({l.nativeName})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none bg-white"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button type="submit" className="btn">Search</button>
          <span className="text-xs text-gray-500 ml-auto">{total} total entries</span>
        </form>

        <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Question ID</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Question (preview)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No entries found.</td></tr>
              ) : (
                entries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="border-t border-gray-100 hover:bg-purple-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <td className="px-4 py-3 font-semibold text-[#35095E]">{entry.questionId}</td>
                      <td className="px-4 py-3 text-gray-600">{SOURCE_LABELS[entry.source] || entry.source}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" dir="auto">
                        {entry.question ? stripHtml(entry.question) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[entry.status] || "bg-gray-100 text-gray-700"}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {entry.generatedByProvider ? `${entry.generatedByProvider}/${entry.generatedByModel}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                    {expandedId === entry.id && (
                      <tr className="bg-purple-50/50 border-t border-gray-100">
                        <td colSpan={6} className="px-4 py-4">
                          {entry.status === "failed" ? (
                            <p className="text-sm text-red-700">
                              <span className="font-semibold">Failure reason:</span> {entry.failureReason || "—"}
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" dir="auto">
                              <div className="md:col-span-2">
                                <p className="font-semibold text-[#35095E] mb-1">Question</p>
                                <p className="text-gray-700">{stripHtml(entry.question) || "—"}</p>
                              </div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Option A</p><p className="text-gray-700">{stripHtml(entry.optionA) || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Option B</p><p className="text-gray-700">{stripHtml(entry.optionB) || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Option C</p><p className="text-gray-700">{stripHtml(entry.optionC) || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Option D</p><p className="text-gray-700">{stripHtml(entry.optionD) || "—"}</p></div>
                              <div className="md:col-span-2">
                                <p className="font-semibold text-[#35095E] mb-1">Hint</p>
                                <p className="text-gray-700 whitespace-pre-line">{stripHtml(entry.hint) || "—"}</p>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm">
          <button
            className="btn disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <button
            className="btn disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationEntries;
