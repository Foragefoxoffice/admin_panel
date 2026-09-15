import React, { useEffect, useRef, useState } from "react";
import { runTranslationBatch, fetchTranslationProgress, fetchTranslationEntries } from "../../utils/api";

// Manual batches only — no Auto Mode yet (unlike AI Dictionary), by design:
// this pipeline was just verified at small scale, so scaling up stays a
// deliberate click-by-click decision for now rather than something that
// starts consuming the whole question bank unattended. See the regional-
// language-translation design doc / project memory for why.
const stat = (label, value, color) => (
  <div className="bg-gray-50 rounded-lg p-4 text-center">
    <p className="text-2xl font-bold" style={{ color }}>{value ?? "—"}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const SourceCard = ({ title, source, job, isProcessing, onRun, running, batchSize, setBatchSize }) => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <h3 className="font-bold text-[#35095E]">{title}</h3>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stat("Processed", job?.totalProcessed, "#35095E")}
      {stat("Created", job?.totalCreated, "#059669")}
      {stat("Failed", job?.totalFailed, "#dc2626")}
      {stat("Cursor", job?.cursor, "#51216E")}
    </div>

    <p className="text-xs text-gray-500">
      Status: <span className={`font-semibold ${job?.status === "failed" ? "text-red-600" : ""}`}>{job?.status || "not started"}</span>
      {isProcessing && (
        <span className="ml-2 inline-flex items-center gap-1 text-[#51216E] font-semibold">
          <span className="w-2 h-2 bg-[#51216E] rounded-full animate-pulse" /> processing…
        </span>
      )}
    </p>
    {job?.status === "failed" && job?.lastError && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
        <span className="font-semibold">Last batch failed:</span> {job.lastError}
      </div>
    )}

    {isProcessing && job?.currentActivity && (
      <div className="p-4 bg-purple-50 border-2 border-[#51216E] rounded-lg">
        <p className="text-xs font-bold text-[#51216E] uppercase tracking-wide mb-1">Working now</p>
        <p className="text-sm text-[#35095E] font-medium">{job.currentActivity}</p>
        {job.currentBatchTotal != null && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{job.currentBatchProcessed ?? 0} / {job.currentBatchTotal} questions</span>
              <span>{Math.round(((job.currentBatchProcessed ?? 0) / job.currentBatchTotal) * 100)}%</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div className="bg-[#51216E] h-2 rounded-full transition-all" style={{ width: `${Math.round(((job.currentBatchProcessed ?? 0) / job.currentBatchTotal) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>
    )}

    <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-gray-100">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Batch size (questions)</label>
        <input
          type="number" min={1} max={20} value={batchSize}
          onChange={(e) => setBatchSize(Math.max(1, Math.min(20, Number(e.target.value))))}
          className="w-28 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none"
        />
      </div>
      <button
        onClick={() => onRun(source)}
        disabled={running || isProcessing}
        className="btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Batch running…" : running ? "Starting…" : "Run Batch"}
      </button>
    </div>
  </div>
);

const Translation = () => {
  const [progress, setProgress] = useState({ practice: {}, test_series: {} });
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [runningSource, setRunningSource] = useState(null);
  const [practiceBatchSize, setPracticeBatchSize] = useState(5);
  const [tsBatchSize, setTsBatchSize] = useState(5);
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const pollRef = useRef(null);

  const isProcessing = (source) => !!progress?.[source]?.isProcessing;

  const loadProgress = async () => {
    try {
      const data = await fetchTranslationProgress();
      setProgress(data);
      setAlert({ type: "", text: "" });
      return { ok: true, anyProcessing: data.practice?.isProcessing || data.test_series?.isProcessing };
    } catch (error) {
      setAlert({ type: "error", text: error.response?.data?.message || "Failed to load progress." });
      return { ok: false, anyProcessing: null };
    }
  };

  const loadEntries = async () => {
    setEntriesLoading(true);
    try {
      const data = await fetchTranslationEntries({ languageId: 1, page: 1, pageSize: 10 });
      setEntries(data.entries || []);
    } catch (error) {
      // Non-fatal — the batch controls above still work even if this fails.
    } finally {
      setEntriesLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
    loadEntries();
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    clearInterval(pollRef.current);
    const anyProcessing = isProcessing("practice") || isProcessing("test_series");
    if (anyProcessing) {
      pollRef.current = setInterval(async () => {
        const result = await loadProgress();
        if (result.ok && !result.anyProcessing) {
          clearInterval(pollRef.current);
          loadEntries();
        }
      }, 3000);
    }
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.practice?.isProcessing, progress.test_series?.isProcessing]);

  const handleRun = async (source) => {
    setRunningSource(source);
    setAlert({ type: "", text: "" });
    try {
      const batchSize = source === "test_series" ? tsBatchSize : practiceBatchSize;
      const result = await runTranslationBatch(source, batchSize);
      setAlert({ type: "success", text: result.message || "Batch started." });
      await loadProgress();
    } catch (error) {
      if (error.response?.status === 409) {
        setAlert({ type: "error", text: "A batch is already running for this source — wait for it to finish." });
      } else {
        setAlert({ type: "error", text: error.response?.data?.message || "Failed to start batch." });
      }
    } finally {
      setRunningSource(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-2">Regional Language Translation — Batch Generation</h1>
      <p className="text-sm text-gray-500 mb-6">
        Hindi only for now. Translates question text, options, and hint — run in small batches, safe to repeat.
      </p>

      {alert.text && (
        <div className={`p-4 mb-6 rounded-lg ${alert.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
          {alert.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SourceCard
          title="Practice Questions" source="practice"
          job={progress.practice?.job} isProcessing={isProcessing("practice")}
          onRun={handleRun} running={runningSource === "practice"}
          batchSize={practiceBatchSize} setBatchSize={setPracticeBatchSize}
        />
        <SourceCard
          title="Test Series Questions" source="test_series"
          job={progress.test_series?.job} isProcessing={isProcessing("test_series")}
          onRun={handleRun} running={runningSource === "test_series"}
          batchSize={tsBatchSize} setBatchSize={setTsBatchSize}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-[#35095E] mb-4">Recent Translations (Hindi)</h3>
        {entriesLoading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-400">No translations yet — run a batch above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-2 pr-4">Question ID</th>
                  <th className="pb-2 pr-4">Source</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Translated Question (preview)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4">{e.questionId}</td>
                    <td className="py-2 pr-4">{e.source}</td>
                    <td className="py-2 pr-4">
                      <span className={e.status === "completed" ? "text-emerald-700" : e.status === "failed" ? "text-red-600" : "text-gray-500"}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600" dir="auto">
                      {(e.question || "").replace(/<[^>]+>/g, "").slice(0, 80)}
                      {(e.question || "").length > 80 ? "…" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;
