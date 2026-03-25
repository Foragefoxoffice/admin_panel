import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { FaQuestion, FaListUl, FaCheck, FaLightbulb, FaPlus, FaTrash } from "react-icons/fa6";
import useAuth from "@/contexts/useAuth";
import { API_BASE_URL, BASE_URL } from "@/utils/config";
import RichTextEditor from "@/components/Tiptap";
import { MathJaxContext } from "better-react-mathjax";

export default function TestSeriesQuestionFormPage() {
  const { questionId } = useParams();
  const isEdit = Boolean(questionId);
  const navigate = useNavigate();

  // Cascade selects
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);

  // Question content
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [hint, setHint] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Images
  const [image, setImage] = useState(null);
  const [hintImage, setHintImage] = useState(null);
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState("Select Hint Image to Upload");
  const [imagePreview, setImagePreview] = useState(null);
  const [hintImagePreview, setHintImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [existingHintImage, setExistingHintImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteHintImage, setDeleteHintImage] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [editorKey, setEditorKey] = useState(Date.now());

  // Scroll refs
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
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Load subjects & question types
  useEffect(() => {
    if (!token) return;
    const fetchFilters = async () => {
      try {
        const [subjectRes, qtRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/question-types`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setSubjects(
          subjectRes.data.map((s) => ({
            value: s.id,
            label: `${s.name} (${s.portion?.name ?? ""})`,
            portion: s.portion,
          }))
        );
        setQuestionTypes(qtRes.data.map((qt) => ({ value: qt.id, label: qt.name })));
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, [token]);

  // Load chapters when subject changes
  useEffect(() => {
    if (!selectedSubject || !token) { setChapters([]); return; }
    axios
      .get(`${API_BASE_URL}/chapters/chapter/${selectedSubject.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setChapters(r.data.map((c) => ({ value: c.id, label: c.name }))))
      .catch(() => setChapters([]));
  }, [selectedSubject, token]);

  // Load topics when chapter changes
  useEffect(() => {
    if (!selectedChapter || !token) { setTopics([]); return; }
    axios
      .get(`${API_BASE_URL}/topics/topic/${selectedChapter.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setTopics(r.data.map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => setTopics([]));
  }, [selectedChapter, token]);

  // Load existing question for edit mode
  useEffect(() => {
    if (!isEdit || !token) return;
    const fetchQuestion = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/test-series/questions/${questionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set subject first, then chapters will load via useEffect
        const subjectOpt = { value: data.subjectId, label: `${data.subject?.name} (${data.subject?.portion?.name ?? ""})` };
        setSelectedSubject(subjectOpt);

        // Chapters/topics need sequential loading
        const chaptersRes = await axios.get(`${API_BASE_URL}/chapters/chapter/${data.subjectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chapterList = chaptersRes.data.map((c) => ({ value: c.id, label: c.name }));
        setChapters(chapterList);
        const chapterOpt = chapterList.find((c) => c.value === data.chapterId) || null;
        setSelectedChapter(chapterOpt);

        const topicsRes = await axios.get(`${API_BASE_URL}/topics/topic/${data.chapterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topicList = topicsRes.data.map((t) => ({ value: t.id, label: t.name }));
        setTopics(topicList);
        setSelectedTopic(data.topicId ? (topicList.find((t) => t.value === data.topicId) || null) : null);

        setSelectedQuestionType(data.questionTypeId ? { value: data.questionTypeId, label: data.questionType?.name } : null);

        setQuestion(data.question);
        setOptionA(data.optionA);
        setOptionB(data.optionB);
        setOptionC(data.optionC);
        setOptionD(data.optionD);
        setCorrectOption(data.correctOption);
        setHint(data.hint || "");
        setVideoUrl(data.videoUrl || "");
        setEditorKey(Date.now());

        if (data.image) setExistingImage(data.image);
        if (data.hintImage) setExistingHintImage(data.hintImage);
      } catch (err) {
        console.error("Error loading question:", err);
        setMessage("Failed to load question.");
      } finally {
        setFetching(false);
      }
    };
    fetchQuestion();
  }, [isEdit, questionId, token]);

  const scrollToRef = (ref) => {
    if (ref?.current && scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({
        top: ref.current.offsetTop - 64,
        behavior: "smooth",
      });
    }
  };

  const handleImageChange = (e, setImageState, setFileName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === "question") {
      setImage(null);
      setImagePreview(null);
      setImageName("Select question Image to Upload");
      setExistingImage(null);
      setDeleteImage(true);
    } else {
      setHintImage(null);
      setHintImagePreview(null);
      setHintImageName("Select Hint Image to Upload");
      setExistingHintImage(null);
      setDeleteHintImage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("subjectId", selectedSubject?.value ?? "");
      formData.append("chapterId", selectedChapter?.value ?? "");
      if (selectedTopic?.value) formData.append("topicId", selectedTopic.value);
      if (selectedQuestionType?.value) formData.append("questionTypeId", selectedQuestionType.value);
      formData.append("question", question);
      formData.append("optionA", optionA);
      formData.append("optionB", optionB);
      formData.append("optionC", optionC);
      formData.append("optionD", optionD);
      formData.append("correctOption", correctOption);
      formData.append("hint", hint);
      formData.append("videoUrl", videoUrl);
      if (image) formData.append("image", image);
      if (hintImage) formData.append("hintImage", hintImage);
      if (isEdit) {
        formData.append("deleteImage", String(deleteImage));
        formData.append("deleteHintImage", String(deleteHintImage));
      }

      const url = isEdit
        ? `${API_BASE_URL}/test-series/questions/${questionId}`
        : `${API_BASE_URL}/test-series/questions`;
      const method = isEdit ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (isEdit) {
        setMessage("Question updated successfully!");
        setTimeout(() => navigate("/admin/test-series/questions"), 1500);
      } else {
        setMessage("Question added to Test Series bank!");
        // Reset form for next entry
        setTimeout(() => setMessage(""), 5000);
        setQuestion("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectOption("");
        setHint("");
        setVideoUrl("");
        setImage(null);
        setHintImage(null);
        setImagePreview(null);
        setHintImagePreview(null);
        setImageName("Select question Image to Upload");
        setHintImageName("Select Hint Image to Upload");
        setEditorKey(Date.now());
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Failed to save question.");
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
      "&:hover": { borderColor: "#51216E" },
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
      "&:active": { backgroundColor: "#51216E" },
    }),
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <MathJaxContext>
      <div className="relative h-screen overflow-hidden">
        {/* Fixed Top Nav */}
        <nav className="top-0 left-0 right-0 bg-white z-40 py-3 px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-xl text-purple-800">
                {isEdit ? "Edit Question" : "Add New Question"}
              </h1>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                Test Series Bank
              </span>
            </div>
            <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => scrollToRef(questionRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaQuestion className="mr-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(optionARef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" /> A
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(optionBRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" /> B
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(optionCRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" /> C
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(optionDRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaListUl className="mr-1" /> D
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(correctOptionRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaCheck className="mr-1" />
              </button>
              <button
                type="button"
                onClick={() => scrollToRef(hintRef)}
                className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                <FaLightbulb className="mr-1" />
              </button>
            </div>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="pt-16 px-6 h-full overflow-y-auto scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-6 pb-10">

            {/* Cascade Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={selectedSubject}
                options={subjects}
                onChange={(val) => {
                  setSelectedSubject(val);
                  setSelectedChapter(null);
                  setSelectedTopic(null);
                  setChapters([]);
                  setTopics([]);
                }}
                placeholder="Select Subject"
                isClearable
                styles={customStyles}
              />
              <Select
                value={selectedChapter}
                options={chapters}
                onChange={(val) => {
                  setSelectedChapter(val);
                  setSelectedTopic(null);
                  setTopics([]);
                }}
                placeholder="Select Chapter"
                isClearable
                styles={customStyles}
              />
              <Select
                value={selectedTopic}
                options={topics}
                onChange={setSelectedTopic}
                placeholder="Select Topic"
                isClearable
                styles={customStyles}
              />
              <Select
                value={selectedQuestionType}
                options={questionTypes}
                onChange={setSelectedQuestionType}
                placeholder="Select Question Type"
                isClearable
                styles={customStyles}
              />
            </div>

            {/* Question */}
            <div ref={questionRef} className="space-y-4 bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Question Image:</label>
                <div className="grid items-center gap-4">
                  <label className="file_upload" htmlFor="ts_image">
                    <FaPlus size={40} className="file_icon" /> {imageName}
                  </label>
                  <input
                    type="file"
                    id="ts_image"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setImage, setImageName, setImagePreview)}
                  />

                  {/* Show existing image in edit mode */}
                  {!imagePreview && existingImage && (
                    <div className="relative group max-w-md">
                      <img
                        src={`${BASE_URL}/${existingImage}`}
                        alt="Current"
                        className="h-auto w-full rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("question")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="relative group max-w-md">
                      <img src={imagePreview} alt="Preview" className="h-auto w-full rounded border border-gray-300" />
                      <button
                        type="button"
                        onClick={() => removeImage("question")}
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

            {/* Options */}
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

            {/* Correct Answer */}
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
                onChange={(opt) => setCorrectOption(opt?.value ?? "")}
                placeholder="Select Correct Answer"
                isClearable
                styles={customStyles}
              />
            </div>

            {/* Hint */}
            <div ref={hintRef} className="space-y-4 bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <label className="block font-bold text-lg text-purple-700">Hint Image:</label>
                <div className="grid items-center gap-4">
                  <label className="file_upload" htmlFor="ts_hintimage">
                    <FaPlus size={40} className="file_icon" /> {hintImageName}
                  </label>
                  <input
                    type="file"
                    id="ts_hintimage"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setHintImage, setHintImageName, setHintImagePreview)}
                  />

                  {!hintImagePreview && existingHintImage && (
                    <div className="relative group max-w-md">
                      <img
                        src={`${BASE_URL}/${existingHintImage}`}
                        alt="Current hint"
                        className="h-auto w-full rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("hint")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}

                  {hintImagePreview && (
                    <div className="relative group max-w-md">
                      <img src={hintImagePreview} alt="Hint Preview" className="h-auto w-full rounded border border-gray-300" />
                      <button
                        type="button"
                        onClick={() => removeImage("hint")}
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

            {/* Video Explanation */}
            <div className="space-y-2 bg-white p-4 rounded-lg shadow">
              <label className="block font-bold text-lg text-purple-700">Video Explanation (YouTube URL):</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {videoUrl && (
                <p className="text-xs text-green-600 mt-1">✓ Video URL set — students will see a "Watch Video" button after the test.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors duration-300"
              style={{ marginBottom: "50px" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : isEdit ? "Save Changes" : "Submit Question"}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes("success") || message.includes("updated")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </MathJaxContext>
  );
}
