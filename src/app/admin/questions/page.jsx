"use client";
import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TestContext } from "@/contexts/TestContext";
import { API_BASE_URL } from "@/utils/config";
import FormulaFormatter from "@/contexts/FormulaFormatter";
import { debounce } from "lodash";
import useAuth from "@/contexts/useAuth";
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [portions, setPortions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
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
  useAuth();
  
  const { setTestData } = useContext(TestContext);

  // Fetch token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

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
        setSubjects(subjectRes.data.map((s) => ({ value: s.id, label: s.name, portion: s.portion.name })));
        setQuestionTypes(questionTypeRes.data.map((qt) => ({ value: qt.id, label: qt.name })));
      } catch (error) {
        setError("Failed to fetch filters.");
      }
    };

    fetchFilters();
  }, [token]);

  // Debounced fetch chapters
  const debouncedFetchChapters = useCallback(debounce(async (selectedSubject, token, setChapters, setSelectedChapter, setSelectedTopic) => {
    try {
      if (!token || !selectedSubject) {
        setChapters([]);
        setSelectedChapter(null);
        setSelectedTopic(null);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/chapters/chapter/${selectedSubject}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setChapters(response.data.map((c) => ({ value: c.id, label: c.name })));
        setSelectedChapter(null);
        setSelectedTopic(null);
      } else {
        setChapters([]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setChapters([]);
      } else {
        console.error("Failed to fetch chapters:", error);
        setError("Failed to fetch chapters.");
      }
    }
  }, 300), []);

  // Fetch chapters based on selected subject
  useEffect(() => {
    debouncedFetchChapters(selectedSubject, token, setChapters, setSelectedChapter, setSelectedTopic);
  }, [selectedSubject, token, debouncedFetchChapters]);

  // Fetch topics based on selected chapter
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (!token || !selectedChapter) return;

        const response = await axios.get(`${API_BASE_URL}/topics/topic/${selectedChapter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTopics(response.data.map((t) => ({ value: t.id, label: t.name })));
        setSelectedTopic(null);
      } catch (error) {
        setError("Failed to fetch topics.");
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
        setError("Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => (
      (!selectedPortion || question.portionId === selectedPortion) &&
      (!selectedSubject || question.subjectId === selectedSubject) &&
      (!selectedChapter || question.chapterId === selectedChapter) &&
      (!selectedTopic || question.topicId === selectedTopic) &&
      (!selectedQuestionType || question.questionTypeId === selectedQuestionType)
    ));
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
      alert("Failed to delete question.");
    }
  }, [token, questions]);

  // Update Question (Redirect to Update Form)
  const handleUpdate = useCallback((id) => {
    const Data = {
      QuestionId: id,
    };

    setTestData(Data);
    router.push(`/admin/edit/`);
  }, [setTestData, router]);

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredQuestions.length / questionsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6">
        <nav>
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === number
                      ? "bg-[#35095e] text-white"
                      : "bg-[#35095e2e] text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
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
    <div className="px-4 max-w-7xl mx-auto">
      <h1 className="font-bold mb-6">Questions</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          options={subjects.map((s) => ({
            value: s.value,
            label: `${s.label} (${s.portion})`,
          }))}
          value={subjects.find((s) => s.value === selectedSubject) || null}
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
          value={chapters.find((c) => c.value === selectedChapter) || null}
          onChange={(option) => {
            setSelectedChapter(option?.value || null);
            setSelectedTopic(null);
          }}
          placeholder={chapters.length === 0 ? "No chapters available" : "Select Chapter"}
          isClearable
          isDisabled={!selectedSubject || chapters.length === 0}
          styles={customStyles}
        />
        <Select
          options={topics}
          value={topics.find((t) => t.value === selectedTopic) || null}
          onChange={(option) => setSelectedTopic(option?.value || null)}
          placeholder={!selectedChapter ? "Select a chapter first" : "Select Topic"}
          isClearable
          isDisabled={!selectedChapter}
          styles={customStyles}
        />
        <Select
          options={questionTypes}
          value={questionTypes.find((qt) => qt.value === selectedQuestionType) || null}
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
              {currentQuestions.map((question) => (
                <li key={question.id} className="border rounded-lg shadow-sm transition-shadow">
                  {/* Question Header */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer bg-[#35095e20] hover:bg-[#35095e2e]"
                    onClick={() => setOpenAccordion((prev) => (prev === question.id ? null : question.id))}
                  >
                    <h3 className="font-bold text-lg"><FormulaFormatter text={question.question} /></h3>
                    <span className="text-gray-600">{openAccordion === question.id ? "▲" : "▼"}</span>
                  </div>

                  {/* Accordion Content */}
                  {openAccordion === question.id && (
                    <div className="p-4 bg-white border-t">
                      <img alt="" src={`https://mitoslearning.in/${question.image}`} />
                      <div className="space-y-2">
                        <p><strong>Option A:</strong> <FormulaFormatter text={question.optionA} /></p>
                        <p><strong>Option B:</strong> <FormulaFormatter text={question.optionB} /></p>
                        <p><strong>Option C:</strong> <FormulaFormatter text={question.optionC} /></p>
                        <p><strong>Option D:</strong> <FormulaFormatter text={question.optionD} /></p>
                        <p className="text-green-600"><strong>Correct Answer:</strong>{question.correctOption}</p>
                        {question.hint && <p className="text-gray-500"><strong>Hint:</strong> <FormulaFormatter text={question.hint} /></p>}
                      </div>

                      <div className="space-y-2">
                        <img alt="" src={`https://mitoslearning.in/${question.hintImage}`} />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end mt-4 space-x-4">
                        <button
                          onClick={() => handleUpdate(question.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-1"
                        >
                          <FaEdit /> <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center space-x-1"
                        >
                          <FaTrash /> <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No questions available.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredQuestions.length > questionsPerPage && <Pagination />}
    </div>
  );
}