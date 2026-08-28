import React, { useEffect, useState } from "react";
import { fetchDictionaryEntries, retryDictionaryTerm } from "../../utils/api";

const STATUS_COLORS = {
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-700",
};

const PAGE_SIZE = 20;

const AiDictionaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [manualTerm, setManualTerm] = useState("");
  // Tracks which term is currently being (re)generated — used to disable
  // just that one button rather than the whole page while it's in flight.
  const [retryingTerm, setRetryingTerm] = useState(null);
  const [retryMessage, setRetryMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDictionaryEntries({
        page,
        pageSize: PAGE_SIZE,
        ...(status ? { status } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
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
  }, [page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  // Works for both an existing "failed" row (retry) and a brand-new term
  // the AI keyword extractor never picked up (manually adding an important
  // keyword) — ai-service upserts either way.
  const handleRetry = async (term) => {
    setRetryingTerm(term);
    setRetryMessage("");
    try {
      const { entry } = await retryDictionaryTerm(term);
      setRetryMessage(
        entry.status === "completed"
          ? `"${entry.term}" generated successfully.`
          : `"${entry.term}" failed again: ${entry.failureReason}`
      );
      await load();
    } catch (err) {
      setRetryMessage(err.response?.data?.message || "Retry failed.");
    } finally {
      setRetryingTerm(null);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const term = manualTerm.trim();
    if (!term || retryingTerm) return;
    await handleRetry(term);
    setManualTerm("");
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">AI Dictionary — Generated Entries</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Search term</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. mitochondria"
              className="w-56 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
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

        <form onSubmit={handleManualSubmit} className="flex flex-wrap gap-3 items-end border-t border-gray-100 pt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Add / retry a term</label>
            <input
              type="text"
              value={manualTerm}
              onChange={(e) => setManualTerm(e.target.value)}
              placeholder="e.g. vernier caliper"
              className="w-64 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <button type="submit" className="btn disabled:opacity-40 disabled:cursor-not-allowed" disabled={!manualTerm.trim() || !!retryingTerm}>
            {retryingTerm && retryingTerm === manualTerm.trim() ? "Generating…" : "Generate"}
          </button>
          {retryMessage && <span className="text-xs text-gray-600">{retryMessage}</span>}
        </form>

        <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Meaning</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No entries found.</td></tr>
              ) : (
                entries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <tr
                      className="border-t border-gray-100 hover:bg-purple-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <td className="px-4 py-3 font-semibold text-[#35095E]">{entry.term}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {entry.meaning || <span className="text-gray-300">—</span>}
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
                        <td colSpan={5} className="px-4 py-4">
                          {entry.status === "failed" ? (
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-sm text-red-700">
                                <span className="font-semibold">Failure reason:</span> {entry.failureReason}
                              </p>
                              <button
                                type="button"
                                className="btn text-xs whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={retryingTerm === entry.term}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetry(entry.term);
                                }}
                              >
                                {retryingTerm === entry.term ? "Retrying…" : "Retry"}
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><p className="font-semibold text-[#35095E] mb-1">Simple Explanation</p><p className="text-gray-700">{entry.simpleExplanation || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">ELI5</p><p className="text-gray-700">{entry.eli5 || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Detailed Explanation</p><p className="text-gray-700">{entry.detailedExplanation || "—"}</p></div>
                              <div><p className="font-semibold text-[#35095E] mb-1">Mnemonic</p><p className="text-gray-700">{entry.mnemonic || "—"}</p></div>
                              <div className="md:col-span-2"><p className="font-semibold text-[#35095E] mb-1">Real-life Example</p><p className="text-gray-700">{entry.realLifeExample || "—"}</p></div>
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

export default AiDictionaryEntries;
