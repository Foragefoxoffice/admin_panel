import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fetchChatUsage } from "../../utils/api";

const formatInr = (n) => `₹${(n ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
const formatNumber = (n) => (n ?? 0).toLocaleString();

const STATUS_COLORS = {
  PREMIUM: "bg-green-100 text-green-800",
  TRIALED: "bg-blue-100 text-blue-800",
  REGISTERED: "bg-gray-100 text-gray-700",
  SUSPENDED: "bg-red-100 text-red-800",
};

const AiChatUsage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchChatUsage();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load AI chat usage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stat = (label, value, color) => (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">AI Chat — Usage & Cost</h1>

      <p className="text-xs text-gray-500 mb-6">
        Covers AI Chat only (Module 2). AI Dictionary content is shared/deduplicated across every student, so it
        doesn't have a meaningful per-user cost — its generation cost is tracked separately on the Batch Generation
        page. Cost below is an estimate from token counts × a configured USD price-per-model table, converted to INR
        at a fixed rate (both configurable in ai-service) — not a figure pulled from your actual provider invoice, so
        spot-check it. Token/cost data only exists for messages sent after this tracking shipped; anything older
        shows 0 tokens even though the message itself is still counted.
      </p>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-400">Loading…</div>
      ) : !data ? null : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-[#35095E] mb-3">Overall</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stat("AI-Using Students", formatNumber(data.overall.totalUsers), "#35095E")}
              {stat("Total Messages", formatNumber(data.overall.totalMessages), "#2563eb")}
              {stat("Input Tokens", formatNumber(data.overall.totalInputTokens), "#059669")}
              {stat("Output Tokens", formatNumber(data.overall.totalOutputTokens), "#059669")}
              {stat("Estimated Cost", formatInr(data.overall.estimatedCostInr), "#dc2626")}
            </div>
            {data.overall.costIsPartial && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                Some messages used a provider/model with no price configured — the cost total above is a floor, not
                the real total. Add pricing for it in ai-service's chatPricing.js.
              </p>
            )}
          </div>

          {data.byDay.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-[#35095E] mb-4">Messages Per Day</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name) => (name === "estimatedCostInr" ? formatInr(value) : value)}
                  />
                  <Line type="monotone" dataKey="messageCount" stroke="#693f86" strokeWidth={2} name="Messages" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#35095E]">Per-Student Usage</h3>
              <span className="text-xs text-gray-500">
                {data.byUser.length} student{data.byUser.length === 1 ? "" : "s"} have used AI Chat
              </span>
            </div>

            <div className="border-2 border-gray-100 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Messages</th>
                    <th className="px-4 py-3">Input Tokens</th>
                    <th className="px-4 py-3">Output Tokens</th>
                    <th className="px-4 py-3">Est. Cost</th>
                    <th className="px-4 py-3">Last Used</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byUser.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No AI Chat usage yet.</td></tr>
                  ) : (
                    data.byUser.map((row) => (
                      <tr key={row.userId} className="border-t border-gray-100 hover:bg-purple-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#35095E]">{row.user?.name || `User #${row.userId}`}</p>
                          <p className="text-xs text-gray-400">{row.user?.email || "(account deleted)"}</p>
                        </td>
                        <td className="px-4 py-3">
                          {row.user?.status ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[row.user.status] || "bg-gray-100 text-gray-700"}`}>
                              {row.user.status}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{formatNumber(row.messageCount)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatNumber(row.inputTokens)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatNumber(row.outputTokens)}</td>
                        <td className="px-4 py-3 font-semibold text-red-700">{formatInr(row.estimatedCostInr)}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(row.lastUsedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatUsage;
