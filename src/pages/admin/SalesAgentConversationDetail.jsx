import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSalesConversationDetail, setSalesConversationTakeover } from "../../utils/api";

const MESSAGE_STATUS_COLORS = {
  accepted: "text-gray-400",
  sent: "text-gray-400",
  delivered: "text-blue-500",
  read: "text-green-600",
  failed: "text-red-600",
  received: "text-gray-400",
};

const SalesAgentConversationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglingTakeover, setTogglingTakeover] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchSalesConversationDetail(id);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleTakeover = async () => {
    if (!data) return;
    const nextTakeover = data.conversation.status !== "PAUSED";
    setTogglingTakeover(true);
    try {
      const result = await setSalesConversationTakeover(id, nextTakeover);
      setData((prev) => ({
        ...prev,
        conversation: { ...prev.conversation, status: result.conversation.status },
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update takeover state.");
    } finally {
      setTogglingTakeover(false);
    }
  };

  if (loading && !data) {
    return <div className="p-6 md:p-10 text-gray-400">Loading…</div>;
  }

  if (error && !data) {
    return (
      <div className="p-6 md:p-10">
        <div className="p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { conversation, user, lead, messages, auditByMessageId } = data;
  const isPaused = conversation.status === "PAUSED";

  return (
    <div className="p-6 md:p-10">
      <button
        type="button"
        className="text-xs text-gray-500 hover:text-[#51216E] mb-4"
        onClick={() => navigate("/admin/sales-agent/conversations")}
      >
        ← Back to conversations
      </button>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-bold">{conversation.phoneNumber}</h1>
          <p className="text-sm text-gray-500">
            {user ? (
              <>
                {user.name || "—"} {user.email ? `· ${user.email}` : ""} · {user.subscriptionState}
              </>
            ) : (
              "No linked user account"
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Lead stage: <span className="font-semibold text-gray-600">{lead?.stage || "—"}</span>
            {lead?.leadScore != null && <> · Score: {lead.leadScore}</>}
          </p>
        </div>
        <button
          type="button"
          className={`btn disabled:opacity-40 disabled:cursor-not-allowed ${isPaused ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
          disabled={togglingTakeover}
          onClick={handleToggleTakeover}
        >
          {togglingTakeover
            ? "Updating…"
            : isPaused
              ? "Resume AI auto-reply"
              : "Take over (pause AI)"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet.</p>
        ) : (
          messages.map((m) => {
            const isInbound = m.direction === "INBOUND";
            const audit = auditByMessageId[m.id];
            return (
              <div key={m.id} className={`flex ${isInbound ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-lg ${isInbound ? "" : "text-right"}`}>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                      isInbound ? "bg-gray-100 text-gray-800" : "bg-purple-100 text-[#35095E]"
                    }`}
                  >
                    {m.text || <span className="text-gray-400 italic">[{m.messageType}]</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(m.createdAt).toLocaleString()}
                    {" · "}
                    <span className={MESSAGE_STATUS_COLORS[m.status] || "text-gray-400"}>{m.status}</span>
                  </div>
                  {isInbound && audit && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      → replied via {audit.provider}/{audit.model}
                      {audit.promptVersion ? ` (${audit.promptVersion})` : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SalesAgentConversationDetail;
