"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchPortions,
  fetchSubjectsByPortions,
  fetchChaptersBySubject,
  // this returns only topics that HAVE topic-level PDFs (with their PDFs)
  fetchTopicsWithPDF,
  updatePdfPremium,
} from "@/utils/api";
import { toast } from "react-hot-toast";
import {
  FiChevronDown,
  FiChevronRight,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiSearch,
  FiExternalLink,
} from "react-icons/fi";

/**
 * Admin / PDF Premium Manager
 * Portion -> Subject -> Chapter -> Topics (with PDFs) -> PDFs (toggle isPremium)
 */
export default function PdfPremiumManagerPage() {
  // Hierarchy state
  const [portions, setPortions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]); // topics that have pdf[] included

  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null); // topic id

  // Derived PDFs for the selected topic
  const pdfs = useMemo(() => {
    if (!selectedTopic) return [];
    const t = topics.find((x) => x.id === selectedTopic);
    return Array.isArray(t?.pdf) ? t.pdf : [];
  }, [topics, selectedTopic]);

  // UI state
  const [activePanel, setActivePanel] = useState("portions");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initial load: portions
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPortions();
        setPortions(data || []);
      } catch (e) {
        toast.error("Failed to load portions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Helpers
  const filterItems = (items, key = "name") => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return (items || []).filter((i) =>
      String(i?.[key] || "").toLowerCase().includes(term)
    );
  };

  const filteredPortions = filterItems(portions);
  const filteredSubjects = filterItems(subjects);
  const filteredChapters = filterItems(chapters);
  const filteredTopics = filterItems(topics);
  const filteredPdfs = filterItems(pdfs); // by pdf.name

  // Navigation label/breadcrumb
  const getCurrentPath = () => {
    const path = [];
    if (selectedPortion)
      path.push(portions.find((p) => p.id === selectedPortion)?.name);
    if (selectedSubject)
      path.push(subjects.find((s) => s.id === selectedSubject)?.name);
    if (selectedChapter)
      path.push(chapters.find((c) => c.id === selectedChapter)?.name);
    if (selectedTopic)
      path.push(topics.find((t) => t.id === selectedTopic)?.name);
    return path.filter(Boolean);
  };

  // Handlers: drilldown
  const handlePortionSelect = async (portionId) => {
    try {
      setLoading(true);
      setSelectedPortion(portionId);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedTopic(null);
      setTopics([]);
      const subs = await fetchSubjectsByPortions(portionId);
      setSubjects(subs || []);
      setChapters([]);
      setActivePanel("subjects");
      toast.success(`Loaded ${subs?.length ?? 0} subjects`);
    } catch {
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = async (subjectId) => {
    try {
      setLoading(true);
      setSelectedSubject(subjectId);
      setSelectedChapter(null);
      setSelectedTopic(null);
      setTopics([]);
      const chaps = await fetchChaptersBySubject(subjectId);
      setChapters(chaps || []);
      setActivePanel("chapters");
      toast.success(`Loaded ${chaps?.length ?? 0} chapters`);
    } catch {
      toast.error("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = async (chapterId) => {
    try {
      setLoading(true);
      setSelectedChapter(chapterId);
      setSelectedTopic(null);
      // returns only topics that have at least one topic-level PDF, and includes those PDFs
      const payload = await fetchTopicsWithPDF(chapterId);
      const list = Array.isArray(payload?.topics) ? payload.topics : [];
      setTopics(list);
      setActivePanel("topics");
      toast.success(`Loaded ${list.length} topics with PDFs`);
    } catch {
      toast.error("Failed to load topics with PDFs");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setActivePanel("pdfs");
  };

  // Toggle PDF premium flag
  const handleTogglePdfPremium = async (pdfId, current) => {
    try {
      setLoading(true);
      await updatePdfPremium(pdfId, !current);
      // update local state in-place (no refetch needed)
      setTopics((prev) =>
        prev.map((t) => {
          if (t.id !== selectedTopic) return t;
          const nextPdfs = (t.pdf || []).map((p) =>
            p.id === pdfId ? { ...p, isPremium: !current } : p
          );
          return { ...t, pdf: nextPdfs };
        })
      );
      toast.success(`PDF ${!current ? "marked Premium" : "set to Free"}`);
    } catch (e) {
      toast.error("Failed to update PDF premium flag");
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      setPortions(await fetchPortions());

      if (selectedPortion) {
        setSubjects(await fetchSubjectsByPortions(selectedPortion));
      }
      if (selectedSubject) {
        setChapters(await fetchChaptersBySubject(selectedSubject));
      }
      if (selectedChapter) {
        const payload = await fetchTopicsWithPDF(selectedChapter);
        setTopics(Array.isArray(payload?.topics) ? payload.topics : []);
      }
      toast.success("Data refreshed");
    } catch {
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    if (activePanel === "pdfs") setActivePanel("topics");
    else if (activePanel === "topics") setActivePanel("chapters");
    else if (activePanel === "chapters") setActivePanel("subjects");
    else if (activePanel === "subjects") setActivePanel("portions");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">PDF Premium Manager</h1>
          <p className="text-gray-600">Toggle isPremium for topic PDFs</p>
        </div>
        <button
          onClick={refreshAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search + Back */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={
                activePanel === "portions"
                  ? "Search portions..."
                  : activePanel === "subjects"
                  ? "Search subjects..."
                  : activePanel === "chapters"
                  ? "Search chapters..."
                  : activePanel === "topics"
                  ? "Search topics..."
                  : "Search PDFs..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {activePanel !== "portions" && (
            <button
              onClick={navigateBack}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumbs */}
      {getCurrentPath().length > 0 && (
        <div className="flex gap-2 mb-4 text-sm text-gray-600">
          {getCurrentPath().map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">/</span>}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-3 text-[#35095E]">Navigation</h3>
          <nav className="space-y-2">
            <SidebarButton
              active={activePanel === "portions"}
              onClick={() => setActivePanel("portions")}
              label={`Portions (${portions.length})`}
              enabled
            />
            <SidebarButton
              active={activePanel === "subjects"}
              onClick={() => selectedPortion && setActivePanel("subjects")}
              label={`Subjects (${subjects.length})`}
              enabled={!!selectedPortion}
            />
            <SidebarButton
              active={activePanel === "chapters"}
              onClick={() => selectedSubject && setActivePanel("chapters")}
              label={`Chapters (${chapters.length})`}
              enabled={!!selectedSubject}
            />
            <SidebarButton
              active={activePanel === "topics"}
              onClick={() => selectedChapter && setActivePanel("topics")}
              label={`Topics (${topics.length})`}
              enabled={!!selectedChapter}
            />
            <SidebarButton
              active={activePanel === "pdfs"}
              onClick={() => selectedTopic && setActivePanel("pdfs")}
              label={`PDFs (${pdfs.length})`}
              enabled={!!selectedTopic}
            />
          </nav>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {activePanel === "portions" && (
            <ListPanel
              title="Portions"
              items={filteredPortions}
              onView={(id) => handlePortionSelect(id)}
              viewLabel="View Subjects"
            />
          )}

          {activePanel === "subjects" && (
            <ListPanel
              title="Subjects"
              items={filteredSubjects}
              onView={(id) => handleSubjectSelect(id)}
              viewLabel="View Chapters"
            />
          )}

          {activePanel === "chapters" && (
            <ListPanel
              title="Chapters"
              items={filteredChapters}
              onView={(id) => handleChapterSelect(id)}
              viewLabel="View Topics (with PDFs)"
            />
          )}

          {activePanel === "topics" && (
            <ListPanel
              title="Topics (with PDFs)"
              items={filteredTopics}
              onView={(id) => handleTopicSelect(id)}
              viewLabel="View PDFs"
              // show a small badge for how many PDFs per topic
              rightSlot={(item) => (
                <span className="text-xs text-gray-600">
                  {(item?.pdf?.length ?? 0)} PDF{(item?.pdf?.length ?? 0) === 1 ? "" : "s"}
                </span>
              )}
            />
          )}

          {activePanel === "pdfs" && (
            <PdfPanel
              title="PDFs"
              pdfs={filteredPdfs}
              onToggle={(pdf) => handleTogglePdfPremium(pdf.id, !!pdf.isPremium)}
            />
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg flex items-center gap-2">
            <FiRefreshCw className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- UI Subcomponents --------------------------- */

const SidebarButton = ({ active, onClick, label, enabled = true }) => (
  <button
    onClick={enabled ? onClick : undefined}
    disabled={!enabled}
    className={`w-full text-left p-2 rounded ${
      active
        ? "bg-blue-500 text-white"
        : "text-[#fff]  hover:bg-gray-50 hover:text-black"
    } ${!enabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {label}
  </button>
);

const ListPanel = ({ title, items, onView, viewLabel = "View", rightSlot }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-[#35095E]">
          {title} ({items?.length ?? 0})
        </h3>
      </div>
      <div className="p-4">
        {Array.isArray(items) && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-4 p-3 rounded hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FiChevronRight className="text-gray-400 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {rightSlot ? (
                    <span className="shrink-0">{rightSlot(item)}</span>
                  ) : null}
                </div>
                <button
                  onClick={() => onView(item.id)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                >
                  {viewLabel}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No items found</div>
        )}
      </div>
    </div>
  );
};

const PdfPanel = ({ title, pdfs, onToggle }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-[#35095E]">
          {title} ({pdfs?.length ?? 0})
        </h3>
      </div>
      <div className="p-4">
        {Array.isArray(pdfs) && pdfs.length > 0 ? (
          <div className="space-y-2">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="flex justify-between items-center gap-4 p-3 rounded hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{pdf.name}</div>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 inline-flex items-center gap-1 mt-0.5"
                    title={pdf.url}
                  >
                    Open PDF <FiExternalLink />
                  </a>
                  {pdf.isOnlyTopic ? (
                    <div className="text-[10px] text-gray-500 mt-1">
                      topic-only
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={() => onToggle(pdf)}
                  className={`px-3 py-1 text-sm rounded ${
                    pdf.isPremium
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  } hover:opacity-80`}
                >
                  {pdf.isPremium ? (
                    <>
                      <FiX className="inline mr-1" /> Premium
                    </>
                  ) : (
                    <>
                      <FiCheck className="inline mr-1" /> Free
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No PDFs found</div>
        )}
      </div>
    </div>
  );
};
