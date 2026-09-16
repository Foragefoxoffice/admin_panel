import React, { useEffect, useState } from "react";
import {
  fetchSalesTemplates,
  searchSalesRecipientUsers,
  createSalesCampaign,
  fetchRecipientCandidates,
} from "../../utils/api";

const MAX_RECIPIENTS = 100;

const SalesAgentCampaignNew = () => {
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [recipientMode, setRecipientMode] = useState("specific"); // "status" | "date" | "specific"

  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  const [rawNumbers, setRawNumbers] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const [statusFilter, setStatusFilter] = useState("TRIALED");
  const [dateField, setDateField] = useState("trialEndsAt");
  const [dateCondition, setDateCondition] = useState("in_next");
  const [dateDays, setDateDays] = useState(3);
  const [includeContacted, setIncludeContacted] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [candidatesTotal, setCandidatesTotal] = useState(0);
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesError, setCandidatesError] = useState("");

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendResult, setSendResult] = useState(null);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    setTemplatesError("");
    try {
      const data = await fetchSalesTemplates();
      setTemplates(data.templates || []);
    } catch (err) {
      setTemplatesError(err.response?.data?.message || "Failed to load templates.");
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    setCandidates([]);
    setCandidatesTotal(0);
    setCandidatesPage(1);
    setCandidatesError("");
  }, [recipientMode]);

  const loadCandidates = async (page = 1) => {
    setCandidatesLoading(true);
    setCandidatesError("");
    try {
      const params = { filterType: recipientMode, includeContacted, page, pageSize: 100 };
      if (recipientMode === "status") params.status = statusFilter;
      if (recipientMode === "date") {
        params.field = dateField;
        params.condition = dateCondition;
        params.days = dateDays;
      }
      const data = await fetchRecipientCandidates(params);
      setCandidates((prev) => (page === 1 ? data.users || [] : [...prev, ...(data.users || [])]));
      setCandidatesTotal(data.totalMatching || 0);
      setCandidatesPage(page);
    } catch (err) {
      setCandidatesError(err.response?.data?.message || "Failed to load candidates.");
    } finally {
      setCandidatesLoading(false);
    }
  };

  const addAllCandidates = () => {
    setSelectedRecipients((prev) => {
      const existing = new Set(prev.map((r) => r.phoneNumber));
      const additions = candidates
        .filter((c) => c.phoneNumber && !existing.has(c.phoneNumber))
        .map((c) => ({ phoneNumber: c.phoneNumber, userId: c.id }));
      return [...prev, ...additions];
    });
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setUserSearchLoading(true);
    try {
      const data = await searchSalesRecipientUsers(userQuery.trim());
      setUserResults(data.users || []);
    } catch (err) {
      setUserResults([]);
    } finally {
      setUserSearchLoading(false);
    }
  };

  const addRecipient = (recipient) => {
    setSelectedRecipients((prev) => {
      if (prev.some((r) => r.phoneNumber === recipient.phoneNumber)) return prev;
      return [...prev, recipient];
    });
  };

  const removeRecipient = (phoneNumber) => {
    setSelectedRecipients((prev) => prev.filter((r) => r.phoneNumber !== phoneNumber));
  };

  const addRawNumbers = () => {
    const numbers = rawNumbers
      .split(/[\n,]+/)
      .map((n) => n.replace(/\D/g, ""))
      .filter(Boolean);
    setSelectedRecipients((prev) => {
      const existing = new Set(prev.map((r) => r.phoneNumber));
      const additions = numbers.filter((n) => !existing.has(n)).map((phoneNumber) => ({ phoneNumber }));
      return [...prev, ...additions];
    });
    setRawNumbers("");
  };

  const handleSend = async () => {
    if (!selectedTemplate || selectedRecipients.length === 0) return;
    setSending(true);
    setSendError("");
    setSendResult(null);
    try {
      const result = await createSalesCampaign({
        templateName: selectedTemplate.name,
        templateLanguage: selectedTemplate.language,
        recipients: selectedRecipients,
      });
      setSendResult(result);
    } catch (err) {
      setSendError(err.response?.data?.message || "Failed to send campaign.");
    } finally {
      setSending(false);
    }
  };

  const overLimit = selectedRecipients.length > MAX_RECIPIENTS;

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">WhatsApp Sales Agent — New Campaign</h1>

      {templatesError && (
        <div className="p-4 mb-6 rounded-lg bg-red-100 text-red-800 border border-red-200">{templatesError}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#35095E]">1. Choose a template</h2>
          <button type="button" className="btn text-xs" onClick={loadTemplates} disabled={templatesLoading}>
            {templatesLoading ? "Refreshing…" : "Refresh from WhatsApp"}
          </button>
        </div>
        {templates.length === 0 && !templatesLoading ? (
          <p className="text-sm text-gray-400">No approved marketing/utility templates found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                type="button"
                key={`${t.name}_${t.language}`}
                onClick={() => setSelectedTemplate(t)}
                className={`text-left border-2 rounded-lg p-4 ${
                  selectedTemplate?.name === t.name && selectedTemplate?.language === t.language
                    ? "border-[#51216E] bg-purple-50"
                    : "border-gray-100 bg-white hover:border-purple-200"
                }`}
              >
                <p className="font-semibold text-sm text-[#35095E]">
                  {t.name} <span className="text-xs text-gray-400">({t.category}, {t.language})</span>
                </p>
                {t.headerText && <p className="text-xs font-semibold text-gray-600 mt-1">{t.headerText}</p>}
                <p className="text-sm text-gray-700 mt-1">{t.bodyText}</p>
                {t.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.buttons.map((b, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {b.text}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        <h2 className="font-semibold text-[#35095E]">2. Choose recipients (max {MAX_RECIPIENTS})</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRecipientMode("status")}
            className={`text-left border-2 rounded-lg p-4 ${
              recipientMode === "status" ? "border-[#51216E] bg-purple-50" : "border-gray-100 bg-white hover:border-purple-200"
            }`}
          >
            <p className="font-semibold text-sm text-[#35095E]">By Status</p>
            <p className="text-xs text-gray-500">Filter by subscription</p>
          </button>
          <button
            type="button"
            onClick={() => setRecipientMode("date")}
            className={`text-left border-2 rounded-lg p-4 ${
              recipientMode === "date" ? "border-[#51216E] bg-purple-50" : "border-gray-100 bg-white hover:border-purple-200"
            }`}
          >
            <p className="font-semibold text-sm text-[#35095E]">By Date</p>
            <p className="text-xs text-gray-500">Trial / Premium dates</p>
          </button>
          <button
            type="button"
            onClick={() => setRecipientMode("specific")}
            className={`text-left border-2 rounded-lg p-4 ${
              recipientMode === "specific" ? "border-[#51216E] bg-purple-50" : "border-gray-100 bg-white hover:border-purple-200"
            }`}
          >
            <p className="font-semibold text-sm text-[#35095E]">Specific Users</p>
            <p className="text-xs text-gray-500">Search or paste numbers</p>
          </button>
        </div>

        {recipientMode === "status" && (
          <div className="flex flex-wrap gap-3 items-end border-t border-gray-100 pt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              >
                <option value="REGISTERED">Registered</option>
                <option value="TRIALED">Trial</option>
                <option value="PREMIUM">Premium</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600 pb-2">
              <input type="checkbox" checked={includeContacted} onChange={(e) => setIncludeContacted(e.target.checked)} />
              Include already-contacted users
            </label>
            <button type="button" className="btn" onClick={() => loadCandidates(1)} disabled={candidatesLoading}>
              {candidatesLoading ? "Loading…" : "Load candidates"}
            </button>
          </div>
        )}

        {recipientMode === "date" && (
          <div className="flex flex-wrap gap-3 items-end border-t border-gray-100 pt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date field</label>
              <select
                value={dateField}
                onChange={(e) => setDateField(e.target.value)}
                className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              >
                <option value="trialStartedAt">Trial started</option>
                <option value="trialEndsAt">Trial ends</option>
                <option value="premiumExpiry">Premium expiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Condition</label>
              <select
                value={dateCondition}
                onChange={(e) => setDateCondition(e.target.value)}
                className="border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm outline-none bg-white"
              >
                <option value="today">Today</option>
                <option value="in_next">In next N days</option>
                <option value="expired_within">Expired within N days</option>
                <option value="exactly_days_ago">Exactly N days ago</option>
              </select>
            </div>
            {dateCondition !== "today" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Days (N)</label>
                <input
                  type="number"
                  min="0"
                  value={dateDays}
                  onChange={(e) => setDateDays(e.target.value)}
                  className="w-20 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-xs text-gray-600 pb-2">
              <input type="checkbox" checked={includeContacted} onChange={(e) => setIncludeContacted(e.target.checked)} />
              Include already-contacted users
            </label>
            <button type="button" className="btn" onClick={() => loadCandidates(1)} disabled={candidatesLoading}>
              {candidatesLoading ? "Loading…" : "Load candidates"}
            </button>
          </div>
        )}

        {candidatesError && (
          <div className="p-3 rounded-lg bg-red-100 text-red-800 border border-red-200 text-sm">{candidatesError}</div>
        )}

        {(recipientMode === "status" || recipientMode === "date") && candidates.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-gray-500">
                {candidatesTotal} not-yet-contacted user(s) match this filter — showing {candidates.length}
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn text-xs" onClick={addAllCandidates}>
                  Add all {candidates.length} shown
                </button>
                {candidatesTotal > candidates.length && (
                  <button
                    type="button"
                    className="btn text-xs"
                    onClick={() => loadCandidates(candidatesPage + 1)}
                    disabled={candidatesLoading}
                  >
                    {candidatesLoading ? "Loading…" : "Load next 100"}
                  </button>
                )}
              </div>
            </div>
            <div className="border-2 border-gray-100 rounded-lg divide-y max-h-64 overflow-y-auto">
              {candidates.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span>
                    {c.name || c.phoneNumber} <span className="text-gray-400">({c.phoneNumber})</span>
                  </span>
                  <button
                    type="button"
                    className="btn text-xs"
                    onClick={() => addRecipient({ phoneNumber: c.phoneNumber, userId: c.id })}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipientMode === "specific" && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <form onSubmit={handleUserSearch} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Search existing users</label>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Name, email, or phone"
                  className="w-64 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>
              <button type="submit" className="btn" disabled={userSearchLoading}>
                {userSearchLoading ? "Searching…" : "Search"}
              </button>
            </form>

            {userResults.length > 0 && (
              <div className="border-2 border-gray-100 rounded-lg divide-y">
                {userResults.map((u) => (
                  <div key={u.id} className="flex items-center justify-between px-4 py-2 text-sm">
                    <span>
                      {u.name || u.email || u.phoneNumber} <span className="text-gray-400">({u.phoneNumber})</span>
                    </span>
                    <button
                      type="button"
                      className="btn text-xs"
                      onClick={() => addRecipient({ phoneNumber: u.phoneNumber, userId: u.id })}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Or paste phone numbers (comma or newline separated)
              </label>
              <textarea
                value={rawNumbers}
                onChange={(e) => setRawNumbers(e.target.value)}
                rows={3}
                className="w-full border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="916379034696, 91XXXXXXXXXX"
              />
              <button type="button" className="btn text-xs mt-2" onClick={addRawNumbers} disabled={!rawNumbers.trim()}>
                Add numbers
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            {selectedRecipients.length} recipient(s) selected
            {overLimit && (
              <span className="text-red-600"> — over the {MAX_RECIPIENTS} limit, remove some before sending</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedRecipients.map((r) => (
              <span
                key={r.phoneNumber}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-2"
              >
                {r.phoneNumber}
                <button
                  type="button"
                  onClick={() => removeRecipient(r.phoneNumber)}
                  className="text-gray-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {sendError && (
          <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-800 border border-red-200">{sendError}</div>
        )}
        <button
          type="button"
          className="btn disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!selectedTemplate || selectedRecipients.length === 0 || overLimit || sending}
          onClick={handleSend}
        >
          {sending ? "Sending…" : `Send to ${selectedRecipients.length} recipient(s)`}
        </button>

        {sendResult && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Sent: {sendResult.sentCount} · Skipped: {sendResult.skippedCount} · Failed: {sendResult.failedCount}
            </p>
            <div className="border-2 border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {sendResult.results.map((r) => (
                    <tr key={r.phoneNumber} className="border-t border-gray-100">
                      <td className="px-4 py-2">{r.phoneNumber}</td>
                      <td className="px-4 py-2">{r.status}</td>
                      <td className="px-4 py-2 text-gray-500">{r.error || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAgentCampaignNew;
