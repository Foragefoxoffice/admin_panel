"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaDownload, FaSyncAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function ExportQuestionsPage() {
  useAuth(); // protect the page

  const router = useRouter();

  // Data
  const [token, setToken] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  // token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // fetch reference lists
  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setError(null);
      try {
        const [subjectRes, questionTypeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/question-types`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setSubjects(subjectRes.data.map(s => ({ value: s.id, label: s.name })));
        setQuestionTypes(questionTypeRes.data.map(q => ({ value: q.id, label: q.name })));
      } catch (e) {
        console.error(e);
        setError("Failed to load filters. Please try again.");
      }
    };
    run();
  }, [token]);

  // fetch chapters when subject changes
  useEffect(() => {
    const run = async () => {
      if (!token) return;
      // Reset dependent levels
      setChapters([]);
      setTopics([]);
      setSelectedChapter(null);
      setSelectedTopic(null);

      if (!selectedSubject) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/chapters/chapter/${selectedSubject.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChapters(res.data.map(c => ({ value: c.id, label: c.name })));
      } catch (e) {
        console.error(e);
        setChapters([]);
      }
    };
    run();
  }, [token, selectedSubject]);

  // fetch topics when chapter changes
  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setTopics([]);
      setSelectedTopic(null);

      if (!selectedChapter) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/topics/topic/${selectedChapter.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(res.data.map(t => ({ value: t.id, label: t.name })));
      } catch (e) {
        console.error(e);
        setTopics([]);
      }
    };
    run();
  }, [token, selectedChapter]);

  // fetch questions (pull all, filter client-side to mirror your other page)
  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllQuestions(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  // filter
  const filtered = useMemo(() => {
    return allQuestions.filter(q => {
      const subjOK = !selectedSubject || `${q.subjectId ?? ""}` === `${selectedSubject.value}`;
      const chapOK = !selectedChapter || `${q.chapterId ?? ""}` === `${selectedChapter.value}`;
      const topicOK = !selectedTopic || `${q.topicId ?? ""}` === `${selectedTopic.value}`;
      const typeOK = !selectedQuestionType || `${q.questionTypeId ?? ""}` === `${selectedQuestionType.value}`;
      return subjOK && chapOK && topicOK && typeOK;
    });
  }, [allQuestions, selectedSubject, selectedChapter, selectedTopic, selectedQuestionType]);

  // CSV helpers (only required columns)
  const escapeCsv = (val) => {
    const s = (val ?? "").toString();
    return `"${s.replace(/"/g, '""')}"`; // always wrap & escape quotes
  };

  const buildCsv = (rows) => {
    const headers = [
      "ID",
      "Question",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct",
      "Hint",
    ];
    const headerLine = headers.map(escapeCsv).join(",");

    const lines = rows.map(q => {
      return [
        q.id,
        q.question ?? "",
        q.optionA ?? "",
        q.optionB ?? "",
        q.optionC ?? "",
        q.optionD ?? "",
        q.correctOption ?? "",
        q.hint ?? "",
      ].map(escapeCsv).join(",");
    });

    // Add BOM for Excel compatibility
    return `\uFEFF${headerLine}\n${lines.join("\n")}`;
  };

  const slugify = (s) =>
    (s || "questions")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // choose filename based on deepest selection:
  // Topic > Chapter > Subject; if none chosen but only Type is chosen, use Type; else "questions.csv"
  const getFileName = () => {
    let base = "questions";
    if (selectedTopic) base = selectedTopic.label;
    else if (selectedChapter) base = selectedChapter.label;
    else if (selectedSubject) base = selectedSubject.label;
    else if (selectedQuestionType && !selectedSubject && !selectedChapter && !selectedTopic)
      base = selectedQuestionType.label;

    return `${slugify(base)}.csv`;
  };

  const downloadCsv = useCallback(() => {
    if (!filtered.length) return;
    setDownloading(true);
    try {
      const csv = buildCsv(filtered);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [filtered, selectedSubject, selectedChapter, selectedTopic, selectedQuestionType]);

  const resetFilters = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedQuestionType(null);
  };

  // react-select styles (matches your theme)
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
      "&:hover": { borderColor: "#51216E" },
    }),
    placeholder: (provided) => ({
      ...provided, color: "#6F13C4", fontSize: "15px", fontWeight: "bold",
    }),
    singleValue: (provided) => ({
      ...provided, color: "#35095E", fontWeight: "bold", fontSize: "16px",
    }),
    menu: (provided) => ({
      ...provided, borderRadius: "10px", backgroundColor: "#fff", padding: "5px",
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
      "&:active": { backgroundColor: "#51216E" },
    }),
  };

  return (
    <div className="p-4 md:px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Export Questions (CSV)</h1>
        <button
          onClick={() => router.push("/admin/questions")}
          className="px-4 py-2 rounded-md bg-[#35095e] text-white hover:opacity-90"
        >
          Back to Questions
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          options={subjects}
          value={selectedSubject}
          onChange={(opt) => setSelectedSubject(opt)}
          isClearable
          placeholder="Subject"
          styles={customStyles}
        />
        <Select
          options={chapters}
          value={selectedChapter}
          onChange={(opt) => setSelectedChapter(opt)}
          isClearable
          isDisabled={!selectedSubject}
          placeholder={!selectedSubject ? "Select subject first" : "Chapter"}
          styles={customStyles}
        />
        <Select
          options={topics}
          value={selectedTopic}
          onChange={(opt) => setSelectedTopic(opt)}
          isClearable
          isDisabled={!selectedChapter}
          placeholder={!selectedChapter ? "Select chapter first" : "Topic"}
          styles={customStyles}
        />
        <Select
          options={questionTypes}
          value={selectedQuestionType}
          onChange={(opt) => setSelectedQuestionType(opt)}
          isClearable
          placeholder="Question Type"
          styles={customStyles}
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#35095e2e] hover:bg-[#35095e4d] text-[#35095E]"
          title="Reset all filters"
        >
          <FaSyncAlt /> Reset
        </button>

        <button
          disabled={downloading || loading || filtered.length === 0}
          onClick={downloadCsv}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            filtered.length === 0 || loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#35095E] text-white hover:opacity-90"
          }`}
        >
          <FaDownload />
          {downloading ? "Preparing..." : `Download CSV (${getFileName()})`}
        </button>

        <span className="text-sm text-gray-600">
          {loading
            ? "Loading questions…"
            : `Ready: ${filtered.length.toLocaleString()} row(s)`}
        </span>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Tiny preview table */}
      {/* {!loading && filtered.length > 0 && (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-[#35095e20]">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Question</th>
                <th className="px-3 py-2 text-left">A</th>
                <th className="px-3 py-2 text-left">B</th>
                <th className="px-3 py-2 text-left">C</th>
                <th className="px-3 py-2 text-left">D</th>
                <th className="px-3 py-2 text-left">Correct</th>
                <th className="px-3 py-2 text-left">Hint</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 15).map((q) => (
                <tr key={q.id} className="border-t">
                  <td className="px-3 py-2">{q.id}</td>
                  <td className="px-3 py-2 truncate max-w-[480px]">{q.question}</td>
                  <td className="px-3 py-2">{q.optionA ?? ""}</td>
                  <td className="px-3 py-2">{q.optionB ?? ""}</td>
                  <td className="px-3 py-2">{q.optionC ?? ""}</td>
                  <td className="px-3 py-2">{q.optionD ?? ""}</td>
                  <td className="px-3 py-2">{q.correctOption ?? ""}</td>
                  <td className="px-3 py-2 truncate max-w-[320px]">{q.hint ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 15 && (
            <div className="p-2 text-xs text-gray-500">
              Showing 15 of {filtered.length.toLocaleString()}…
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
