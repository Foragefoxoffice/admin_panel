"use client";
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TestContext } from "@/contexts/TestContext";
import { API_BASE_URL } from "@/utils/config";
import FormulaFormatter from "@/contexts/FormulaFormatter";
import { debounce } from "lodash";
import useAuth from "@/contexts/useAuth";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [portions, setPortions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const { setTestData, testData } = useContext(TestContext);

  // Initialize all filter states as null
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);

  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(20);
  const router = useRouter();
  const searchParams = useSearchParams();
  useAuth();

  // Fetch token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Initialize filters from testData after data is loaded
  useEffect(() => {
    if (testData?.filters && subjects.length > 0 && questionTypes.length > 0) {
      const filters = testData.filters;
      
      if (filters.selectedSubject && subjects.some(s => s.value.toString() === filters.selectedSubject.toString())) {
        setSelectedSubject(filters.selectedSubject);
      }
      
      if (filters.selectedQuestionType && questionTypes.some(qt => qt.value.toString() === filters.selectedQuestionType.toString())) {
        setSelectedQuestionType(filters.selectedQuestionType);
      }
      
      if (filters.selectedPortion) {
        setSelectedPortion(filters.selectedPortion);
      }
    }
  }, [testData?.filters, subjects, questionTypes]);

  // Initialize chapter and topic filters after they're loaded
  useEffect(() => {
    if (testData?.filters && chapters.length > 0) {
      const filters = testData.filters;
      if (filters.selectedChapter && chapters.some(c => c.value.toString() === filters.selectedChapter.toString())) {
        setSelectedChapter(filters.selectedChapter);
      }
    }
  }, [testData?.filters, chapters]);

  useEffect(() => {
    if (testData?.filters && topics.length > 0) {
      const filters = testData.filters;
      if (filters.selectedTopic && topics.some(t => t.value.toString() === filters.selectedTopic.toString())) {
        setSelectedTopic(filters.selectedTopic);
      }
    }
  }, [testData?.filters, topics]);

  // Fetch initial filters (portions, subjects, question types)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        if (!token) return;

        const [portionRes, subjectRes, questionTypeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/portions`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/question-types`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setPortions(portionRes.data.map((p) => ({ value: p.id, label: p.name })));
        setSubjects(subjectRes.data.map((s) => ({ 
          value: s.id, 
          label: s.name, 
          portion: s.portion?.name || 'No portion' 
        })));
        setQuestionTypes(questionTypeRes.data.map((qt) => ({ value: qt.id, label: qt.name })));
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        setError("Failed to fetch filters.");
      }
    };

    fetchFilters();
  }, [token]);

  // Debounced fetch chapters
  const debouncedFetchChapters = useCallback(debounce(async (subjectId) => {
    try {
      if (!token || !subjectId) {
        setChapters([]);
        setSelectedChapter(null);
        setSelectedTopic(null);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/chapters/chapter/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const chaptersData = response.data.map((c) => ({ 
        value: c.id, 
        label: c.name 
      }));
      setChapters(chaptersData);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
      setChapters([]);
    }
  }, 500), [token]);

  // Fetch chapters based on selected subject
  useEffect(() => {
    if (selectedSubject) {
      debouncedFetchChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter(null);
      setSelectedTopic(null);
    }
  }, [selectedSubject, debouncedFetchChapters]);

  // Fetch topics based on selected chapter
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (!token || !selectedChapter) {
          setTopics([]);
          setSelectedTopic(null);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/topics/topic/${selectedChapter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTopics(response.data.map((t) => ({ value: t.id, label: t.name })));
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setTopics([]);
      }
    };

    fetchTopics();
  }, [selectedChapter, token]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) return;
        const response = await axios.get(`${API_BASE_URL}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      // Convert all IDs to strings for consistent comparison
      const qPortion = question.portionId?.toString() || '';
      const qSubject = question.subjectId?.toString() || '';
      const qChapter = question.chapterId?.toString() || '';
      const qTopic = question.topicId?.toString() || '';
      const qType = question.questionTypeId?.toString() || '';

      const filterPortion = selectedPortion?.toString() || '';
      const filterSubject = selectedSubject?.toString() || '';
      const filterChapter = selectedChapter?.toString() || '';
      const filterTopic = selectedTopic?.toString() || '';
      const filterType = selectedQuestionType?.toString() || '';

      return (
        (!selectedPortion || qPortion === filterPortion) &&
        (!selectedSubject || qSubject === filterSubject) &&
        (!selectedChapter || qChapter === filterChapter) &&
        (!selectedTopic || qTopic === filterTopic) &&
        (!selectedQuestionType || qType === filterType)
      );
    });
  }, [questions, selectedPortion, selectedSubject, selectedChapter, selectedTopic, selectedQuestionType]);

  // Delete Question
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/questions/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question.");
    }
  }, [token, questions]);

  // Update Question (Redirect to Update Form)
  const handleUpdate = useCallback((id) => {
    const Data = {
      QuestionId: id,
      returnPage: currentPage || 1,
      filters: {
        selectedPortion,
        selectedSubject,
        selectedChapter,
        selectedTopic,
        selectedQuestionType
      }
    };

    setTestData(Data);
    router.push(`/admin/edit/`);
  }, [setTestData, router, currentPage, selectedPortion, selectedSubject, selectedChapter, selectedTopic, selectedQuestionType]);

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Initialize page from URL on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam && !isNaN(pageParam)) {
      setCurrentPage(Number(pageParam));
    }
  }, [searchParams]);

  // Update URL when paginating
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    router.push(`/admin/questions?page=${pageNumber}`, undefined, { shallow: true });
  }, [router]);

  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage, endPage;

      if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
      } else {
        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
        
        if (currentPage <= maxPagesBeforeCurrent) {
          startPage = 1;
          endPage = maxVisiblePages;
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
          startPage = totalPages - maxVisiblePages + 1;
          endPage = totalPages;
        } else {
          startPage = currentPage - maxPagesBeforeCurrent;
          endPage = currentPage + maxPagesAfterCurrent;
        }
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="flex justify-center mt-6">
        <nav aria-label="Pagination">
          <ul className="flex items-center space-x-1">
            <li>
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"
                }`}
              >
                &lt;
              </button>
            </li>

            {getPageNumbers().map((number, index) => (
              <li key={index}>
                {number === '...' ? (
                  <span className="px-3 py-1" aria-hidden="true">...</span>
                ) : (
                  <button
                    onClick={() => paginate(number)}
                    aria-current={currentPage === number ? "page" : undefined}
                    aria-label={`Page ${number}`}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number
                        ? "bg-[#35095e] text-white"
                        : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"
                    }`}
                  >
                    {number}
                  </button>
                )}
              </li>
            ))}

            <li>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"
                }`}
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "10px",
      border: state.isFocused ? "2px solid #6F13C4" : "1px solid #ccc",
      boxShadow: state.isFocused ? "0 0 5px rgba(111, 19, 196, 0.5)" : "none",
      transition: "0.3s",
      backgroundColor: "#fff",
      fontWeight: "bold",
      padding: "10px",
      "&:hover": {
        borderColor: "#51216E",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6F13C4",
      fontSize: "15px",
      fontWeight: "bold",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#35095E",
      fontWeight: "bold",
      fontSize: "16px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "10px",
      backgroundColor: "#fff",
      padding: "5px",
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#6F13C4" : "#fff",
      color: state.isFocused ? "#fff" : "#333",
      padding: "12px",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
      "&:active": {
        backgroundColor: "#51216E",
      },
    }),
  };

  return (
    <MathJaxContext config={{ 
      loader: { load: ["input/tex", "output/chtml"] },
      tex: {
        packages: {'[+]': ['color', 'mhchem']},
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
      }
    }}>
    <div className="p-4 md:px-4 max-w-7xl mx-auto">
      <h1 className="font-bold mb-6">Questions</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          options={subjects.map((s) => ({
            value: s.value,
            label: `${s.label} (${s.portion})`,
          }))}
          value={subjects.find((s) => s.value.toString() === selectedSubject?.toString()) || null}
          onChange={(option) => {
            setSelectedSubject(option?.value || null);
            setSelectedChapter(null);
            setSelectedTopic(null);
          }}
          placeholder="Select Subject"
          isClearable
          styles={customStyles}
        />
        <Select
          options={chapters}
          value={chapters.find((c) => c.value.toString() === selectedChapter?.toString()) || null}
          onChange={(option) => {
            setSelectedChapter(option?.value || null);
            setSelectedTopic(null);
          }}
          placeholder={!selectedSubject ? "Select subject first" : chapters.length === 0 ? "No chapters available" : "Select Chapter"}
          isClearable
          isDisabled={!selectedSubject}
          styles={customStyles}
        />
        <Select
          options={topics}
          value={topics.find((t) => t.value.toString() === selectedTopic?.toString()) || null}
          onChange={(option) => setSelectedTopic(option?.value || null)}
          placeholder={!selectedChapter ? "Select chapter first" : topics.length === 0 ? "No topics available" : "Select Topic"}
          isClearable
          isDisabled={!selectedChapter}
          styles={customStyles}
        />
        <Select
          options={questionTypes}
          value={questionTypes.find((qt) => qt.value.toString() === selectedQuestionType?.toString()) || null}
          onChange={(option) => setSelectedQuestionType(option?.value || null)}
          placeholder="Select Question Type"
          isClearable
          styles={customStyles}
        />
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading questions...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div>
          {currentQuestions.length > 0 ? (
            <ul className="space-y-4">
              {currentQuestions.map((question, index) => {
                const serialNumber = (currentPage - 1) * questionsPerPage + index + 1;

                return (
                  <MathJax dynamic>
                  <li key={question.id} className="border rounded-lg shadow-sm transition-shadow">
                    <div
                      className="p-4 flex justify-between items-start cursor-pointer bg-[#35095e20] hover:bg-[#35095e2e]"
                      onClick={() => setOpenAccordion((prev) => (prev === question.id ? null : question.id))}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-gray-600 font-bold pt-1">{serialNumber}.</span>
                        <h3 className="font-bold text-lg"><FormulaFormatter text={question.question} /></h3>
                      </div>
                      <span className="text-gray-600">{openAccordion === question.id ? "▲" : "▼"}</span>
                    </div>

                    {openAccordion === question.id && (
                      <div className="p-4 bg-white border-t">
                        {question.image && <img alt="" src={`https://mitoslearning.in/${question.image}`} className="mb-4 max-w-full" />}
                        <div className="space-y-2">
                          <p><strong>Option A:</strong>  
                          <FormulaFormatter text={question.optionA} />
        </p>
                          <p><strong>Option B:</strong> <FormulaFormatter text={question.optionB} /></p>
                          <p><strong>Option C:</strong> <FormulaFormatter text={question.optionC} /></p>
                          <p><strong>Option D:</strong> <FormulaFormatter text={question.optionD} /></p>
                          <p className="text-green-600"><strong>Correct Answer:</strong> {question.correctOption}</p>
                          {question.hint && <div className="mt-2"><strong>Hint:</strong> <FormulaFormatter className="ProseMirror min-h-10 p-0" text={question.hint} /></div>}
                        </div>

                        {question.hintImage && <img alt="" src={`https://mitoslearning.in/${question.hintImage}`} className="mt-4 max-w-full" />}

                        <div className="flex justify-end mt-4 space-x-4">
                          <button
                            onClick={() => handleUpdate(question.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-blue-600"
                          >
                            <FaEdit /> <span className="text-white">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-red-600"
                          >
                            <FaTrash /> <span className="text-white" >Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  </MathJax>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No questions match the selected filters.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredQuestions.length > questionsPerPage && <Pagination />}
    </div>
    </MathJaxContext>
  );
}