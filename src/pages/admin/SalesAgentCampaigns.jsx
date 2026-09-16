import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSalesCampaigns } from "../../utils/api";

const SalesAgentCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSalesCampaigns();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load campaigns.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold">WhatsApp Sales Agent — Campaigns</h1>
        <button type="button" className="btn" onClick={() => navigate("/admin/sales-agent/campaigns/new")}>
          New Campaign
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Targeted</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Skipped</th>
              <th className="px-4 py-3">Failed</th>
              <th className="px-4 py-3">Sent at</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : campaigns.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No campaigns sent yet.</td></tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-[#35095E]">{c.templateName}</td>
                  <td className="px-4 py-3">{c.totalTargeted}</td>
                  <td className="px-4 py-3 text-green-700">{c.sentCount}</td>
                  <td className="px-4 py-3 text-yellow-700">{c.skippedCount}</td>
                  <td className="px-4 py-3 text-red-700">{c.failedCount}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesAgentCampaigns;
