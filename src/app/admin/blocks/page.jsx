"use client";
import { useEffect, useState } from "react";
import {
  fetchPortions,
  fetchSubjectsByPortions,
  fetchChaptersBySubject,
  fetchChapterTopics,
  updateBlockStatus,
} from "@/utils/api";
import { FiChevronDown, FiChevronRight, FiRefreshCw, FiCheck, FiX, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

const BlockContentPage = () => {
  // State
  const [portions, setPortions] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanel, setActivePanel] = useState("portions");

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPortions();
        setPortions(data);
      } catch (error) {
        toast.error("Failed to load portions");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter items based on search term
  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handlers
  const handlePortionSelect = async (portionId) => {
    try {
      setLoading(true);
      setSelectedPortion(portionId);
      setSelectedSubject(null);
      setSelectedChapter(null);
      const subs = await fetchSubjectsByPortions(portionId);
      setSubjects(subs);
      setChapters([]);
      setTopics([]);
      setActivePanel("subjects");
      toast.success(`Loaded ${subs.length} subjects`);
    } catch (error) {
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
      const chaps = await fetchChaptersBySubject(subjectId);
      setChapters(chaps);
      setTopics([]);
      setActivePanel("chapters");
      toast.success(`Loaded ${chaps.length} chapters`);
    } catch (error) {
      toast.error("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = async (chapterId) => {
    try {
      setLoading(true);
      setSelectedChapter(chapterId);
      const tops = await fetchChapterTopics(chapterId);
      setTopics(tops);
      setActivePanel("topics");
      toast.success(`Loaded ${tops.length} topics`);
    } catch (error) {
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (type, id, currentState) => {
    try {
      setLoading(true);
      await updateBlockStatus(type, id, !currentState);
      
      // Refresh data
      const refreshData = async () => {
        switch (type) {
          case "portion":
            setPortions(await fetchPortions());
            break;
          case "subject":
            if (selectedPortion) setSubjects(await fetchSubjectsByPortions(selectedPortion));
            break;
          case "chapter":
            if (selectedSubject) setChapters(await fetchChaptersBySubject(selectedSubject));
            break;
          case "topic":
            if (selectedChapter) setTopics(await fetchChapterTopics(selectedChapter));
            break;
        }
      };
      
      await refreshData();
      toast.success(`Content ${!currentState ? 'blocked' : 'unblocked'}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      setPortions(await fetchPortions());
      if (selectedPortion) setSubjects(await fetchSubjectsByPortions(selectedPortion));
      if (selectedSubject) setChapters(await fetchChaptersBySubject(selectedSubject));
      if (selectedChapter) setTopics(await fetchChapterTopics(selectedChapter));
      toast.success("Data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    if (activePanel === "topics") setActivePanel("chapters");
    else if (activePanel === "chapters") setActivePanel("subjects");
    else if (activePanel === "subjects") setActivePanel("portions");
  };

  // Get current path for display
  const getCurrentPath = () => {
    const path = [];
    if (selectedPortion) path.push(portions.find(p => p.id === selectedPortion)?.name);
    if (selectedSubject) path.push(subjects.find(s => s.id === selectedSubject)?.name);
    if (selectedChapter) path.push(chapters.find(c => c.id === selectedChapter)?.name);
    return path;
  };

  // Filtered data
  const filteredPortions = filterItems(portions);
  const filteredSubjects = filterItems(subjects);
  const filteredChapters = filterItems(chapters);
  const filteredTopics = filterItems(topics);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Manager</h1>
          <p className="text-gray-600">Manage your learning materials</p>
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

      {/* Search */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
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

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-medium mb-3 text-[#35095E]">Navigation</h3>
          <nav className="space-y-2">
            <button
              onClick={() => setActivePanel("portions")}
              className={`w-full text-left p-2 rounded text-white ${activePanel === "portions" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} `}
            >
              Portions ({portions.length})
            </button>
            <button
              onClick={() => selectedPortion && setActivePanel("subjects")}
              disabled={!selectedPortion}
              className={`w-full text-left p-2 rounded text-white ${activePanel === "subjects" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedPortion ? 'opacity-50' : ''}`}
            >
              Subjects ({subjects.length})
            </button>
            <button
              onClick={() => selectedSubject && setActivePanel("chapters")}
              disabled={!selectedSubject}
              className={`w-full text-left p-2 rounded text-white ${activePanel === "chapters" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedSubject ? 'opacity-50' : ''}`}
            >
              Chapters ({chapters.length})
            </button>
            <button
              onClick={() => selectedChapter && setActivePanel("topics")}
              disabled={!selectedChapter}
              className={`w-full text-left p-2 rounded text-white ${activePanel === "topics" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedChapter ? 'opacity-50' : ''}`}
            >
              Topics ({topics.length})
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activePanel === "portions" && (
            <ContentPanel
              title="Portions"
              items={filteredPortions}
              onSelect={handlePortionSelect}
              onToggleBlock={(id, isPremium) => toggleBlock("portion", id, isPremium)}
              loading={loading}
            />
          )}

          {activePanel === "subjects" && (
            <ContentPanel
              title="Subjects"
              items={filteredSubjects}
              onSelect={handleSubjectSelect}
              onToggleBlock={(id, isPremium) => toggleBlock("subject", id, isPremium)}
              loading={loading}
            />
          )}

          {activePanel === "chapters" && (
            <ContentPanel
              title="Chapters"
              items={filteredChapters}
              onSelect={handleChapterSelect}
              onToggleBlock={(id, isPremium) => toggleBlock("chapter", id, isPremium)}
              loading={loading}
            />
          )}

          {activePanel === "topics" && (
            <ContentPanel
              title="Topics"
              items={filteredTopics}
              onToggleBlock={(id, isPremium) => toggleBlock("topic", id, isPremium)}
              loading={loading}
              gridView
            />
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg flex items-center gap-2">
            <FiRefreshCw className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Panel Component
const ContentPanel = ({ title, items, onSelect, onToggleBlock, loading, gridView = false }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium text-[#35095E]">{title} ({items.length})</h3>
      </div>
      <div className="p-4">
        {items.length > 0 ? (
          gridView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items.map(item => (
                <BlockItem
                  key={item.id}
                  item={item}
                  onToggleBlock={onToggleBlock}
                  loading={loading}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center gap-4 p-3 hover:bg-gray-50 rounded">
                  <BlockItem
                    item={item}
                    onToggleBlock={onToggleBlock}
                    loading={loading}
                  />
                  {onSelect && (
                    <button
                      onClick={() => onSelect(item.id)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

// Block Item Component
const BlockItem = ({ item, onToggleBlock, loading }) => {
  return (
    <div className="flex items-center justify-between flex-1">
      <span className="truncate">{item.name}</span>
      <button
        onClick={() => onToggleBlock(item.id, item.isPremium)}
        disabled={loading}
        className={`px-3 py-1 text-sm rounded ${item.isPremium ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} hover:opacity-80 disabled:opacity-50`}
      >
        {item.isPremium ? (
          <>
            <FiX className="inline mr-1" /> Blocked
          </>
        ) : (
          <>
            <FiCheck className="inline mr-1" /> Unblocked
          </>
        )}
      </button>
    </div>
  );
};

export default BlockContentPage;