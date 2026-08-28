import React, { useEffect, useRef, useState } from "react";
import {
  runTestSeriesDictionaryBatch,
  fetchTestSeriesDictionaryProgress,
  startTestSeriesDictionaryAutoRun,
  stopTestSeriesDictionaryAutoRun,
} from "../../utils/api";

// Sibling to AiDictionary.jsx (Practice questions) — same batch-generation
// UI/behavior, pointed at the separate Test Series job. A deliberately
// SEPARATE page (not a tab/toggle on the existing one) so it's always
// obvious at a glance which question bank a given run's progress belongs
// to, especially as more question banks are added over time.
//
// No "Retry Failed Terms" section here — extracted terms are shared with
// the Practice pipeline (see ai-service's createDictionaryBatchJob.js), so
// a failed term is already sweepable from the existing AI Dictionary page;
// duplicating that control here would just retry the same shared term
// twice for no benefit.
const TestSeriesAiDictionary = () => {
  const [job, setJob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSize, setBatchSize] = useState(5);
  const [starting, setStarting] = useState(false);
  const [autoActionLoading, setAutoActionLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const pollRef = useRef(null);

  const autoRunEnabled = !!job?.autoRunEnabled;

  const loadProgress = async () => {
    try {
      const data = await fetchTestSeriesDictionaryProgress();
      setJob(data.job);
      setIsProcessing(data.isProcessing);
      setAlert({ type: "", text: "" });
      return { ok: true, isProcessing: data.isProcessing, autoRunEnabled: !!data.job?.autoRunEnabled };
    } catch (error) {
      setAlert({ type: "error", text: error.response?.data?.message || "Failed to load progress." });
      return { ok: false, isProcessing: null, autoRunEnabled: null };
    }
  };

  useEffect(() => {
    loadProgress();
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    clearInterval(pollRef.current);
    if (isProcessing || autoRunEnabled) {
      pollRef.current = setInterval(async () => {
        const result = await loadProgress();
        if (result.ok && !result.isProcessing && !result.autoRunEnabled) {
          clearInterval(pollRef.current);
        }
      }, 3000);
    }
    return () => clearInterval(pollRef.current);
  }, [isProcessing, autoRunEnabled]);

  const handleRunBatch = async () => {
    setStarting(true);
    setAlert({ type: "", text: "" });
    try {
      const result = await runTestSeriesDictionaryBatch(batchSize);
      setAlert({ type: "success", text: result.message || "Batch started." });
      setIsProcessing(true);
    } catch (error) {
      if (error.response?.status === 409) {
        setAlert({ type: "error", text: "A batch is already running — wait for it to finish." });
        setIsProcessing(true);
      } else {
        setAlert({ type: "error", text: error.response?.data?.message || "Failed to start batch." });
      }
    } finally {
      setStarting(false);
    }
  };

  const handleStartAuto = async () => {
    setAutoActionLoading(true);
    setAlert({ type: "", text: "" });
    try {
      const result = await startTestSeriesDictionaryAutoRun();
      setJob(result.job);
      setAlert({ type: "success", text: "Auto mode started — processing one question at a time until stopped." });
    } catch (error) {
      setAlert({ type: "error", text: error.response?.data?.message || "Failed to start auto mode." });
    } finally {
      setAutoActionLoading(false);
    }
  };

  const handleStopAuto = async () => {
    setAutoActionLoading(true);
    setAlert({ type: "", text: "" });
    try {
      const result = await stopTestSeriesDictionaryAutoRun();
      setJob(result.job);
      setAlert({ type: "success", text: "Stopping — the current question will finish, then auto mode halts." });
    } catch (error) {
      setAlert({ type: "error", text: error.response?.data?.message || "Failed to stop auto mode." });
    } finally {
      setAutoActionLoading(false);
    }
  };

  const stat = (label, value, color) => (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-bold mb-6">AI Dictionary — Test Series — Batch Generation</h1>

      {alert.text && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            alert.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {alert.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h3 className="font-bold text-[#35095E] mb-3">Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stat("Processed", job?.totalProcessed, "#35095E")}
            {stat("Created", job?.totalCreated, "#059669")}
            {stat("Reused", job?.totalSkipped, "#2563eb")}
            {stat("Failed", job?.totalFailed, "#dc2626")}
            {stat("Cursor (last question id)", job?.cursor, "#51216E")}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Status:{" "}
            <span className={`font-semibold ${job?.status === "failed" ? "text-red-600" : ""}`}>
              {job?.status || "not started"}
            </span>
            {autoRunEnabled && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" /> auto mode on
              </span>
            )}
            {isProcessing && (
              <span className="ml-2 inline-flex items-center gap-1 text-[#51216E] font-semibold">
                <span className="w-2 h-2 bg-[#51216E] rounded-full animate-pulse" /> processing…
              </span>
            )}
            {autoRunEnabled && !isProcessing && (
              <span className="ml-2 text-gray-400">(idle — waiting, will resume automatically)</span>
            )}
          </p>
          {job?.lastRunAt && (
            <p className="text-xs text-gray-400 mt-1">Last run: {new Date(job.lastRunAt).toLocaleString()}</p>
          )}
          {job?.status === "failed" && job?.lastError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <span className="font-semibold">Last batch failed:</span> {job.lastError}
            </div>
          )}

          {isProcessing && job?.currentActivity && (
            <div className="mt-4 p-4 bg-purple-50 border-2 border-[#51216E] rounded-lg">
              <p className="text-xs font-bold text-[#51216E] uppercase tracking-wide mb-1">Working now</p>
              <p className="text-sm text-[#35095E] font-medium">{job.currentActivity}</p>

              {job.currentBatchTotal != null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>
                      This batch: {job.currentBatchProcessed ?? 0} / {job.currentBatchTotal} questions
                    </span>
                    <span>{Math.round(((job.currentBatchProcessed ?? 0) / job.currentBatchTotal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className="bg-[#51216E] h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.round(((job.currentBatchProcessed ?? 0) / job.currentBatchTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    ~15s+ per remaining step (each new term found adds more) —{" "}
                    {job.currentBatchTotal - (job.currentBatchProcessed ?? 0)} question(s) left in this batch.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5 space-y-3">
          <h3 className="font-bold text-emerald-800">Automatic Mode</h3>
          <p className="text-xs text-emerald-700">
            Keeps processing one Test Series question at a time, continuously, including questions added later — no
            need to keep clicking. Stop only takes effect after the current question finishes; nothing is ever cut
            off mid-work. Keeps running even if the service restarts.
          </p>
          <button
            onClick={autoRunEnabled ? handleStopAuto : handleStartAuto}
            disabled={autoActionLoading}
            className={`btn disabled:opacity-50 disabled:cursor-not-allowed ${
              autoRunEnabled ? "!bg-red-600 hover:!bg-red-700" : "!bg-emerald-600 hover:!bg-emerald-700"
            }`}
          >
            {autoActionLoading ? "Please wait…" : autoRunEnabled ? "Stop Auto Mode" : "Start Auto Mode"}
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-5 space-y-3">
          <h3 className="font-bold text-[#35095E]">Run Next Batch (manual, one-off)</h3>
          <p className="text-xs text-gray-500">
            Processes a small chunk of Test Series questions starting from where the last run stopped — safe to run
            repeatedly. Terms already generated (from either question bank) are reused, never regenerated.
            {autoRunEnabled && " Disabled while Auto Mode is running, to avoid two runs overlapping."}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Batch size (questions)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Math.max(1, Math.min(50, Number(e.target.value))))}
                disabled={autoRunEnabled}
                className="w-32 border-2 border-[#282C35] rounded-lg px-3 py-2 text-sm focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 outline-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleRunBatch}
              disabled={starting || isProcessing || autoRunEnabled}
              className="btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Batch running…" : starting ? "Starting…" : "Run Batch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesAiDictionary;
