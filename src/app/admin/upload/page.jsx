"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa6";
import { API_BASE_URL } from "@/utils/config";

const Select = dynamic(() => import("react-select"), { ssr: false });

const CSVImporter = () => {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [file, setFile] = useState(null);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [portions, setPortions] = useState([]);
  const [chapterId, setChapterId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [portionId, setPortionId] = useState(null);
  const [token, setToken] = useState(null);
  const [fileName, setFileName] = useState("Select Questions to Upload");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          "question-types",
          "subjects",
          "chapters",
          "topics",
          "portions",
        ];

        const requests = endpoints.map((endpoint) =>
          fetch(`${API_BASE_URL}/${endpoint}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }).then((res) => res.json())
        );

        const [questionTypesData, subjectsData, chaptersData, topicsData, portionsData] = await Promise.all(requests);

        setQuestionTypes(questionTypesData);
        setSubjects(subjectsData);
        setChapters(chaptersData);
        setTopics(topicsData);
        setPortions(portionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Error fetching data");
      }
    };

    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    if (topicId) {
      const selectedTopic = topics.find((topic) => topic.id === topicId);
      if (selectedTopic) {
        setChapterId(selectedTopic.chapterId);
        const selectedChapter = chapters.find((chapter) => chapter.id === selectedTopic.chapterId);
        if (selectedChapter) {
          setSubjectId(selectedChapter.subjectId);
          const selectedSubject = subjects.find((subject) => subject.id === selectedChapter.subjectId);
          if (selectedSubject) {
            if (!selectedSubject.portion?.id) {
              setMessage("Error: portionId is missing or null for the selected subject.");
              return;
            }
            setPortionId(selectedSubject.portion.id);
          }
        }
      }
    }
  }, [topicId, topics, chapters, subjects]);

  const createQuestions = async (questions) => {
    try {
      if (!token) throw new Error("No JWT token found in localStorage");

      const payload = {
        portionId,
        subjectId,
        chapterId,
        topicId,
        questions,
      };

      const response = await fetch(`${API_BASE_URL}/questions/many`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Failed to import questions");

      setMessage("Questions imported successfully");
    } catch (error) {
      console.error("Error importing questions:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }
    setImporting(true);
    setMessage(null);

    const Papa = await import("papaparse");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questions = results.data
          .map((question) => {
            const questionType = questionTypes.find(
              (qt) => qt.name.trim().toLowerCase() === question.questionType.trim().toLowerCase()
            );
            if (!questionType) return null;

            return {
              questionTypeId: questionType.id,
              question: question.question,
              image: question.image || null,
              optionA: question.optionA,
              optionB: question.optionB,
              optionC: question.optionC,
              optionD: question.optionD,
              answer: question.answer,
              hint: question.hint || null,
              hintImage: question.hintimage || null, 
            };
          })
          .filter(Boolean);

        if (!questions.length) {
          setMessage("No valid questions found in the CSV file.");
          setImporting(false);
          return;
        }

        try {
          await createQuestions(questions);
        } catch {
          setMessage("Error importing questions");
        } finally {
          setImporting(false);
        }
      },
    });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      width: "100%",
      border: "1px solid #ccc",
      boxShadow: "none",
      fontWeight: "bold",
      padding: "17px",
      transition: "0.3s",
      "&:hover": { borderColor: "#51216E" },
    }),
    placeholder: (provided) => ({ ...provided, color: "#888", fontSize: "14px" }),
    singleValue: (provided) => ({ ...provided, color: "#35095E", fontWeight: "bold" }),
    menu: (provided) => ({ ...provided, borderRadius: "8px", overflow: "hidden" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#51216E" : "#fff",
      color: state.isFocused ? "#fff" : "#333",
      padding: "10px",
      cursor: "pointer",
      "&:active": { backgroundColor: "#bae7ff" },
    }),
  };

  return (
    <div className="p-6 md:p-0 pt-12">
      <h1 className="font-bold mb-6">Questions Upload</h1>
      <form onSubmit={handleSubmit}>
        <div className="uploadflex">
      {/* Subject Selection Dropdown */}
<Select
  options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
  onChange={(selectedOption) => {
    setSubjectId(selectedOption?.value ?? null);
    setChapterId(null); // Reset chapter when subject changes
    setTopicId(null); // Reset topic when subject changes
  }}
  placeholder="Select a Subject"
  isClearable
  styles={customStyles}
/>

{/* Chapter Selection Dropdown (Filtered by Subject) */}
<Select
  options={chapters
    .filter((chapter) => chapter.subjectId === subjectId) // Show only chapters for selected subject
    .map((chapter) => ({ value: chapter.id, label: chapter.name }))}
  onChange={(selectedOption) => {
    setChapterId(selectedOption?.value ?? null);
    setTopicId(null); // Reset topic when chapter changes
  }}
  placeholder="Select a Chapter"
  isClearable
  styles={customStyles}
  isDisabled={!subjectId} // Disable if no subject is selected
/>

{/* Topic Selection Dropdown (Filtered by Chapter) */}
<Select
  options={topics
    .filter((topic) => topic.chapterId === chapterId) // Show only topics for selected chapter
    .map((topic) => ({ value: topic.id, label: topic.name }))}
  onChange={(selectedOption) => setTopicId(selectedOption?.value ?? null)}
  placeholder="Select a Topic"
  isClearable
  styles={customStyles}
  isDisabled={!chapterId} // Disable if no chapter is selected
/>


        </div >
        <div className="p-8 md:p-20 my-8 border-dashed border-2 grid gap-3 place-items-center">
          <label className="text-2xl text-center font-bold text-[#B9B9B9]" htmlFor="file">
            Drag & Drop to Upload
          </label>
          <p className="text-2xl font-bold text-[#B9B9B9]">or</p>
          <label className="file_upload" htmlFor="file">
            <FaPlus size={40} className="file_icon" /> {fileName}
          </label>
          <input
            type="file"
            name="file"
            id="file"
            hidden
            accept=".csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setFileName(e.target.files?.[0]?.name || "Select Questions to Upload");
            }}
            required
            disabled={importing}
          />
        </div>
        <button type="submit" className="btn" disabled={importing}>
          {importing ? "Importing..." : "Upload"}
        </button>
        <div>{message && <p>{message}</p>}</div>
      </form>
    </div>
  );
};

export default CSVImporter;