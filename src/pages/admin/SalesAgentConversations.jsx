import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSalesConversations } from "../../utils/api";

const PAGE_SIZE = 20;

const STAGE_OPTIONS = [
  "NEW",
  "CONTACTED",
  "REPLIED",
  "QUALIFIED",
  "CHECKOUT_SENT",
  "CONVERTED",
  "HANDED_OFF",
  "STOPPED",
];

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
};

const SalesAgentConversations = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSalesConversations({
        page,
        pageSize: PAGE_SIZE,
        ...(stage ? { stage } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });
      setConversations(data.conversations);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, stage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">WhatsApp Sales Agent — Conversations</h1>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Phone, name, or email"
              className="w-64 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Lead stage</label>
            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
                setPage(1);
              }}
              className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none bg-white"
            >
              <option value="">All</option>
              {STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">Search</button>
          <span className="text-xs text-gray-500 ml-auto">{total} total conversations</span>
        </form>

        <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last message</th>
                <th className="px-4 py-3">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
              ) : conversations.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No conversations found.</td></tr>
              ) : (
                conversations.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-gray-100 hover:bg-purple-50 cursor-pointer"
                    onClick={() => navigate(`/admin/sales-agent/conversations/${c.id}`)}
                  >
                    <td className="px-4 py-3 font-semibold text-[#35095E]">{c.phoneNumber}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.user ? (c.user.name || c.user.email || `#${c.user.id}`) : <span className="text-gray-300">Unknown</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.lead?.stage || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-700"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.lastMessagePreview || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : "—"}
                    </td>
                  </tr>
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

export default SalesAgentConversations;
