"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa6";
import { API_BASE_URL } from "@/utils/config";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import useAuth from "@/contexts/useAuth";
import RichTextEditor from "@/components/Tiptap";
import FormulaFormatter from "@/contexts/FormulaFormatter";

// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function QuestionsPage() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [hint, setHint] = useState("");
  const [image, setImage] = useState(null);
  const [hintImage, setHintImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState("Select Hint Image to Upload");
  const [editorKey, setEditorKey] = useState(Date.now());

  useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const handleImageChange = (e, setImageState, setFileName) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
      setFileName(file.name);
    }
  };

  // Fetch filters (topics, subjects, chapters, question types)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        if (!token) throw new Error("Token is missing");

        const [subjectRes, questionTypeRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/question-types`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSubjects(
          subjectRes.data.map((s) => ({
            value: s.id, // Subject ID
            label: `${s.name} (${s.portion.name})`, // Subject Name + Portion Name
            portion: s.portion, // Keep the portion object for later use
          }))
        );
        setQuestionTypes(questionTypeRes.data.map((qt) => ({ value: qt.id, label: qt.name })));
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, [token]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubject) {
        try {
          const response = await axios.get(`${API_BASE_URL}/chapters/chapter/${selectedSubject.value}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChapters(response.data.map((c) => ({ value: c.id, label: c.name })));
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      } else {
        setChapters([]);
      }
    };

    fetchChapters();
  }, [selectedSubject, token]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedChapter) {
        try {
          const response = await axios.get(`${API_BASE_URL}/topics/topic/${selectedChapter.value}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTopics(response.data.map((t) => ({ value: t.id, label: t.name })));
        } catch (error) {
          console.error("Error fetching topics:", error);
        }
      } else {
        setTopics([]);
      }
    };

    fetchTopics();
  }, [selectedChapter, token]);

  useEffect(() => {
    console.log("Question Length:", question.length);
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      const formData = new FormData();
      formData.append("questionTypeId", selectedQuestionType?.value);
      formData.append("portionId", selectedSubject?.portion?.id);
      formData.append("subjectId", selectedSubject?.value);
      formData.append("chapterId", selectedChapter?.value);
      formData.append("topicId", selectedTopic?.value);
      formData.append("question", question);
      formData.append("optionA", optionA);
      formData.append("optionB", optionB);
      formData.append("optionC", optionC);
      formData.append("optionD", optionD);
      formData.append("correctOption", correctOption);
      formData.append("hint", hint);
      if (image) formData.append("image", image);
      if (hintImage) formData.append("hintImage", hintImage);
  
      const response = await axios.post(`${API_BASE_URL}/questions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201) {
        setMessage("Question added successfully!");
  
        // Clear all inputs
        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectOption("");
        setHint("");
  
        // Reset rich text editors by updating key
        setEditorKey(Date.now());
  
        // Clear image states
        setImage(null);
        setHintImage(null);
        setImageName("Select question Image to Upload");
        setHintImageName("Select Hint Image to Upload");
  
        // Reset Select fields
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedTopic(null);
        setSelectedQuestionType(null);
      } else {
        setMessage("Error adding question.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to add question.");
    } finally {
      setLoading(false);
    }
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
    <MathJaxContext>
      <div className="p-6 md:p-0 pt-12">
        <h1 className="font-bold mb-4">Add a Question</h1>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="questionform">
          {/* Select Filters */}
          <div className="questionadd">
            <Select
              options={subjects}
              onChange={setSelectedSubject}
              placeholder="Select Subject"
              isClearable
              styles={customStyles}
            />
            <Select
              options={chapters}
              onChange={setSelectedChapter}
              placeholder="Select Chapter"
              styles={customStyles}
              isClearable
            />
          </div>
          <div className="questionadd">
            <Select
              options={topics}
              onChange={setSelectedTopic}
              placeholder="Select Topic"
              styles={customStyles}
              isClearable
            />
            <Select
              options={questionTypes}
              onChange={setSelectedQuestionType}
              placeholder="Select Question Type"
              styles={customStyles}
              isClearable
            />
          </div>

          <div className="richeeditos"> <span>Question:</span><RichTextEditor key={editorKey} value={question} onChange={setQuestion} /></div>


          <div className="my-5 richoptions"><span >OptionA:</span><RichTextEditor   key={editorKey + 1} value={optionA} onChange={setOptionA} /></div>
          <div className="my-5 richoptions"><span>OptionB:</span><RichTextEditor  key={editorKey + 2} value={optionB} onChange={setOptionB} /></div>
          <div className="my-5 richoptions"><span>OptionC:</span><RichTextEditor  key={editorKey + 3} value={optionC} onChange={setOptionC} /></div>
          <div className="my-5 richoptions"><span>OptionD:</span><RichTextEditor  key={editorKey + 4} value={optionD} onChange={setOptionD} /></div>

          <Select
            options={[
              { value: "A", label: "Option A" },
              { value: "B", label: "Option B" },
              { value: "C", label: "Option C" },
              { value: "D", label: "Option D" },
            ]}
            onChange={(opt) => setCorrectOption(opt?.value)}
            placeholder="Select Correct Answer"
            isClearable
            styles={customStyles}
          />

          <div className="my-5 richeeditos"><span>Hint:</span><RichTextEditor key={editorKey + 5} value={hint} onChange={setHint} /></div>


          {/* Image Upload Inputs */}
          <div className="grid md:flex md:flex-row gap-4 mb-6">
            {/* First File Upload */}
            <div>
              <label className="file_upload" htmlFor="image">
                <FaPlus size={40} className="file_icon" /> {imageName}
              </label>
              <input
                type="file"
                name="image"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, setImage, setImageName)}
              />
            </div>

            {/* Second File Upload */}
            <div>
              <label className="file_upload" htmlFor="hintimage">
                <FaPlus size={40} className="file_icon" /> {hintImageName}
              </label>
              <input
                type="file"
                name="hintimage"
                id="hintimage"
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, setHintImage, setHintImageName)}
              />
            </div>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Question"}
          </button>

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </form>
      </div>
    </MathJaxContext>
  );
}