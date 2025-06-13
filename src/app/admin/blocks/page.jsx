"use client";
import { useEffect, useState } from "react";
import {
  fetchPortions,
  fetchSubjectsByPortions,
  fetchChaptersBySubject,
  fetchChapterTopics,
  updateBlockStatus,
} from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronRight, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

const BlockContentPage = () => {
  const [portions, setPortions] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    portions: true,
    subjects: false,
    chapters: false,
    topics: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadPortions = async () => {
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
    loadPortions();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      setExpandedSections({
        ...expandedSections,
        subjects: true,
        chapters: false,
        topics: false
      });
      toast.success(`Loaded subjects for selected portion`);
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
      setExpandedSections({
        ...expandedSections,
        chapters: true,
        topics: false
      });
      toast.success(`Loaded chapters for selected subject`);
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
      setExpandedSections({
        ...expandedSections,
        topics: true
      });
      toast.success(`Loaded topics for selected chapter`);
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
      
      // Refresh the appropriate data based on what was updated
      switch (type) {
        case "portion":
          const updatedPortions = await fetchPortions();
          setPortions(updatedPortions);
          break;
        case "subject":
          if (selectedPortion) {
            const updatedSubjects = await fetchSubjectsByPortions(selectedPortion);
            setSubjects(updatedSubjects);
          }
          break;
        case "chapter":
          if (selectedSubject) {
            const updatedChapters = await fetchChaptersBySubject(selectedSubject);
            setChapters(updatedChapters);
          }
          break;
        case "topic":
          if (selectedChapter) {
            const updatedTopics = await fetchChapterTopics(selectedChapter);
            setTopics(updatedTopics);
          }
          break;
        default:
          break;
      }
      
      toast.success(`Content ${!currentState ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      const updatedPortions = await fetchPortions();
      setPortions(updatedPortions);
      
      if (selectedPortion) {
        const updatedSubjects = await fetchSubjectsByPortions(selectedPortion);
        setSubjects(updatedSubjects);
        
        if (selectedSubject) {
          const updatedChapters = await fetchChaptersBySubject(selectedSubject);
          setChapters(updatedChapters);
          
          if (selectedChapter) {
            const updatedTopics = await fetchChapterTopics(selectedChapter);
            setTopics(updatedTopics);
          }
        }
      }
      
      toast.success("All data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const filteredPortions = portions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredChapters = chapters.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Content Management</h2>
        <button
          onClick={refreshAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
          Refresh All
        </button>
      </div>

      <div className="mb-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Content</label>
            <input
              type="text"
              placeholder="Search portions, subjects, chapters, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Portion</label>
            <select
              onChange={(e) => handlePortionSelect(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPortion || ""}
            >
              <option value="">-- Select Portion --</option>
              {portions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Portions Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => toggleSection("portions")}
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              {expandedSections.portions ? <FiChevronDown /> : <FiChevronRight />}
              Portions
              <span className="text-sm text-gray-500 ml-2">({portions.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {portions.filter(p => p.isPremium).length} blocked
              </span>
            </div>
          </div>
          
          <AnimatePresence>
            {expandedSections.portions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 border-t">
                  {filteredPortions.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPortions.map((p) => (
                        <BlockItem
                          key={p.id}
                          label={p.name}
                          isPremium={p.isPremium}
                          onToggle={() => toggleBlock("portion", p.id, p.isPremium)}
                          loading={loading}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      {searchTerm ? "No matching portions found" : "No portions available"}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subjects Section */}
        {subjects.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleSection("subjects")}
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {expandedSections.subjects ? <FiChevronDown /> : <FiChevronRight />}
                Subjects
                <span className="text-sm text-gray-500 ml-2">({subjects.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {subjects.filter(s => s.isPremium).length} blocked
                </span>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSections.subjects && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-t">
                    {filteredSubjects.length > 0 ? (
                      <div className="space-y-3">
                        {filteredSubjects.map((s) => (
                          <div key={s.id} className="group">
                            <div className="flex justify-between items-center">
                              <BlockItem
                                label={s.name}
                                isPremium={s.isPremium}
                                onToggle={() => toggleBlock("subject", s.id, s.isPremium)}
                                loading={loading}
                              />
                              <button
                                onClick={() => handleSubjectSelect(s.id)}
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                View Chapters
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        {searchTerm ? "No matching subjects found" : "No subjects available"}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Chapters Section */}
        {chapters.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleSection("chapters")}
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {expandedSections.chapters ? <FiChevronDown /> : <FiChevronRight />}
                Chapters
                <span className="text-sm text-gray-500 ml-2">({chapters.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {chapters.filter(c => c.isPremium).length} blocked
                </span>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSections.chapters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-t">
                    {filteredChapters.length > 0 ? (
                      <div className="space-y-3">
                        {filteredChapters.map((c) => (
                          <div key={c.id} className="group">
                            <div className="flex justify-between items-center">
                              <BlockItem
                                label={c.name}
                                isPremium={c.isPremium}
                                onToggle={() => toggleBlock("chapter", c.id, c.isPremium)}
                                loading={loading}
                              />
                              <button
                                onClick={() => handleChapterSelect(c.id)}
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                View Topics
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        {searchTerm ? "No matching chapters found" : "No chapters available"}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Topics Section */}
        {topics.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => toggleSection("topics")}
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {expandedSections.topics ? <FiChevronDown /> : <FiChevronRight />}
                Topics
                <span className="text-sm text-gray-500 ml-2">({topics.length})</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {topics.filter(t => t.isPremium).length} blocked
                </span>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSections.topics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-t">
                    {filteredTopics.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredTopics.map((t) => (
                          <BlockItem
                            key={t.id}
                            label={t.name}
                            isPremium={t.isPremium}
                            onToggle={() => toggleBlock("topic", t.id, t.isPremium)}
                            loading={loading}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        {searchTerm ? "No matching topics found" : "No topics available"}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <FiRefreshCw className="animate-spin text-3xl text-blue-600 mb-2" />
            <p className="text-gray-700">Updating content...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const BlockItem = ({ label, isPremium, onToggle, loading }) => {
  return (
    <motion.div 
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <span className="font-medium text-gray-800 truncate">{label}</span>
      <button
        onClick={onToggle}
        disabled={loading}
        className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
          isPremium 
            ? "bg-red-100 text-red-800 hover:bg-red-200" 
            : "bg-green-100 text-green-800 hover:bg-green-200"
        }`}
      >
        {isPremium ? (
          <>
            <FiX className="inline" /> Blocked
          </>
        ) : (
          <>
            <FiCheck className="inline" /> Unblocked
          </>
        )}
      </button>
    </motion.div>
  );
};

export default BlockContentPage;