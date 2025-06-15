"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaPlus, FaTrash, FaQuestion, FaListUl, FaCheck, FaLightbulb } from "react-icons/fa6";
import { API_BASE_URL } from "@/utils/config";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import useAuth from "@/contexts/useAuth";
import RichTextEditor from "@/components/Tiptap";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function QuestionsPage() {
  // State variables
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
  const [token, setToken] = useState(null);
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState("Select Hint Image to Upload");
  const [editorKey, setEditorKey] = useState(Date.now());
  const [imagePreview, setImagePreview] = useState(null);
  const [hintImagePreview, setHintImagePreview] = useState(null);

  // Refs for navigation
  const questionRef = useRef(null);
  const optionARef = useRef(null);
  const optionBRef = useRef(null);
  const optionCRef = useRef(null);
  const optionDRef = useRef(null);
  const correctOptionRef = useRef(null);
  const hintRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const scrollToRef = (ref) => {
    if (ref?.current && scrollContainerRef?.current) {
      const navbarHeight = 64; // Height of the fixed navbar
      const elementPosition = ref.current.offsetTop;
      const scrollPosition = elementPosition - navbarHeight;
      
      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
      });
    }
  };

  const handleImageChange = (e, setImageState, setFileName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'question') {
      setImage(null);
      setImagePreview(null);
      setImageName("Select question Image to Upload");
    } else {
      setHintImage(null);
      setHintImagePreview(null);
      setHintImageName("Select Hint Image to Upload");
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
            value: s.id,
            label: `${s.name} (${s.portion.name})`,
            portion: s.portion,
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
        setTimeout(() => {
          setMessage("");
        }, 5000);
        
        // Reset form
        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectOption("");
        setHint("");
        setImage(null);
        setHintImage(null);
        setImagePreview(null);
        setHintImagePreview(null);
        setImageName("Select question Image to Upload");
        setHintImageName("Select Hint Image to Upload");
        setEditorKey(Date.now());
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
      <div className="relative h-screen overflow-hidden">
        {/* Fixed Top Navigation Bar */}
        <nav className=" top-0 left-0 right-0 bg-white z-40 py-3 px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl text-purple-800">Add New Question</h1>
            <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
              <button 
                onClick={() => scrollToRef(questionRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaQuestion className="mr-1" /> 
              </button>
              <button 
                onClick={() => scrollToRef(optionARef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" />  A
              </button>
              <button 
                onClick={() => scrollToRef(optionBRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" />  B
              </button>
              <button 
                onClick={() => scrollToRef(optionCRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" /> C
              </button>
              <button 
                onClick={() => scrollToRef(optionDRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" />  D
              </button>
              <button 
                onClick={() => scrollToRef(correctOptionRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaCheck className="mr-1" /> 
              </button>
              <button 
                onClick={() => scrollToRef(hintRef)} 
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaLightbulb className="mr-1" />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Scrollable Content Container */}
        <div 
          ref={scrollContainerRef}
          className="pt-16 px-6 h-full overflow-y-auto scrollbar-hide"
        >
          <form onSubmit={handleSubmit} className="space-y-6 pb-10">
            {/* Select Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={selectedSubject}
                options={subjects}
                onChange={setSelectedSubject}
                placeholder="Select Subject"
                isClearable
                styles={customStyles}
              />
              <Select
                value={selectedChapter}
                options={chapters}
                onChange={setSelectedChapter}
                placeholder="Select Chapter"
                styles={customStyles}
                isClearable
              />
              <Select
                value={selectedTopic}
                options={topics}
                onChange={setSelectedTopic}
                placeholder="Select Topic"
                styles={customStyles}
                isClearable
              />
              <Select
                value={selectedQuestionType}
                options={questionTypes}
                onChange={setSelectedQuestionType}
                placeholder="Select Question Type"
                styles={customStyles}
                isClearable
              />
            </div>

            {/* Question Section */}
            <div ref={questionRef} className="space-y-4 bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Question Image:</label>
                <div className="grid items-center gap-4">
                  <label className="file_upload" htmlFor="image">
                    <FaPlus size={40} className="file_icon" /> {imageName}
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setImage, setImageName, setImagePreview)}
                  />
                  
                  {imagePreview && (
                    <div className="relative group max-w-md">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-auto w-full rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('question')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Question:</label>
                <RichTextEditor key={editorKey} value={question} onChange={setQuestion} />
              </div>
            </div>

            {/* Options Sections */}
            <div ref={optionARef} className="space-y-2 bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700">Option A:</label>
              <RichTextEditor key={editorKey + 1} value={optionA} onChange={setOptionA} />
            </div>
            
            <div ref={optionBRef} className="space-y-2 bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700">Option B:</label>
              <RichTextEditor key={editorKey + 2} value={optionB} onChange={setOptionB} />
            </div>
            
            <div ref={optionCRef} className="space-y-2 bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700">Option C:</label>
              <RichTextEditor key={editorKey + 3} value={optionC} onChange={setOptionC} />
            </div>
            
            <div ref={optionDRef} className="space-y-2 bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700">Option D:</label>
              <RichTextEditor key={editorKey + 4} value={optionD} onChange={setOptionD} />
            </div>

            {/* Correct Answer Section */}
            <div ref={correctOptionRef} className="bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700 mb-2">Correct Answer:</label>
              <Select
                value={correctOption ? { value: correctOption, label: `Option ${correctOption}` } : null}
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
            </div>

            {/* Hint Section */}
            <div ref={hintRef} className="space-y-4 bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Hint Image:</label>
                <div className="grid items-center gap-4">
                  <label className="file_upload" htmlFor="hintimage">
                    <FaPlus size={40} className="file_icon" /> {hintImageName}
                  </label>
                  <input
                    type="file"
                    name="hintimage"
                    id="hintimage"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setHintImage, setHintImageName, setHintImagePreview)}
                  />
                  
                  {hintImagePreview && (
                    <div className="relative group max-w-md">
                      <img 
                        src={hintImagePreview} 
                        alt="Hint Preview" 
                        className="h-auto w-full rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('hint')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Hint:</label>
                <RichTextEditor key={editorKey + 5} value={hint} onChange={setHint} />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-700  hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors duration-300 " style={{ marginBottom: "50px" }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : "Submit Question"}
            </button>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </MathJaxContext>
  );
}