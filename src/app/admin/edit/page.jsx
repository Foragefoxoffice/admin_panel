"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { TestContext } from "@/contexts/TestContext";
import { API_BASE_URL, BASE_URL } from "@/utils/config";
import { updateWrongQuestionReportStatus } from "@/utils/api";
import useAuth from "@/contexts/useAuth";
import {
  FaPlus,
  FaTrash,
  FaQuestion,
  FaListUl,
  FaCheck,
  FaLightbulb,
} from "react-icons/fa6";
import RichTextEditor from "@/components/Tiptap";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function EditQuestionPage() {
  const router = useRouter();

  const { testData, setTestData } = useContext(TestContext);
  const id = testData?.QuestionId;
  const returnPage = testData?.returnPage;
  const savedFilters = testData?.filters || {};
  const page = testData?.Page;
  const reportId = testData?.ReportId;
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [hint, setHint] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [image, setImage] = useState(null);
  const [hintImage, setHintImage] = useState(null);
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState(
    "Select Hint Image to Upload"
  );
  const [existingImage, setExistingImage] = useState(null);
  const [existingHintImage, setExistingHintImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hintImagePreview, setHintImagePreview] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteHintImage, setDeleteHintImage] = useState(false);

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
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const scrollToRef = (ref) => {
    if (ref?.current && scrollContainerRef?.current) {
      const navbarHeight = 64; // Height of the fixed navbar
      const elementPosition = ref.current.offsetTop;
      const scrollPosition = elementPosition - navbarHeight;

      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!token || !id) return;

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setQuestion(data.question);
        setOptionA(data.optionA);
        setOptionB(data.optionB);
        setOptionC(data.optionC);
        setOptionD(data.optionD);
        setCorrectOption(data.correctOption);
        setHint(data.hint);
        setSelectedTopic({ value: data.topic.id, label: data.topic.name });
        setSelectedQuestionType({
          value: data.questionType.id,
          label: data.questionType.name,
        });

        setChapterName(data.chapter.name);
        setSubjectName(data.subject.name);

        // Handle existing images
        if (data.image) {
          setExistingImage(`${BASE_URL}/${data.image}`);
          setImageName("Image uploaded");
        }
        if (data.hintImage) {
          setExistingHintImage(`${BASE_URL}/${data.hintImage}`);
          setHintImageName("Hint image uploaded");
        }
      } catch (error) {
        setError("Failed to fetch question.");
        toast.error("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [token, id]);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/topics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(
          response.data.map((t) => ({
            value: t.id,
            label: t.name,
            isPremium: t.isPremium,
          }))
        );
      } catch (error) {
        setError("Failed to fetch topics.");
        toast.error("Failed to fetch topics.");
      }
    };

    fetchTopics();
  }, [token]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/question-types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestionTypes(
          response.data.map((qt) => ({ value: qt.id, label: qt.name }))
        );
      } catch (error) {
        setError("Failed to fetch question types.");
        toast.error("Failed to fetch question types.");
      }
    };

    fetchQuestionTypes();
  }, [token]);

  const handleImageChange = (e, setImageState, setFileName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
      setFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === "question") {
      setImage(null);
      setImagePreview(null);
      setImageName("Select question Image to Upload");
      setDeleteImage(true);
    } else {
      setHintImage(null);
      setHintImagePreview(null);
      setHintImageName("Select Hint Image to Upload");
      setDeleteHintImage(true);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("optionA", optionA);
      formData.append("optionB", optionB);
      formData.append("optionC", optionC);
      formData.append("optionD", optionD);
      formData.append("correctOption", correctOption);
      formData.append("hint", hint);
      formData.append("topicId", selectedTopic?.value);
      formData.append("questionTypeId", selectedQuestionType?.value);

      // Append new images if they exist
      if (image) formData.append("image", image);
      if (hintImage) formData.append("hintImage", hintImage);

      // Handle image deletion flags
      if (deleteImage) formData.append("deleteImage", "true");
      if (deleteHintImage) formData.append("deleteHintImage", "true");

      const response = await axios.put(
        `${API_BASE_URL}/questions/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
  toast.success("Question updated successfully!");

  if (deleteImage) {
    setExistingImage(null);
    setImagePreview(null);
  }
  if (deleteHintImage) {
    setExistingHintImage(null);
    setHintImagePreview(null);
  }

  setTestData({
    returnPage,
    filters: savedFilters,
  });

  // ✅ Update report status if applicable
  if (page === "report" && reportId) {
    try {
      await updateWrongQuestionReportStatus(reportId, "resolved");
    } catch (err) {
      console.warn("Failed to mark report as resolved:", err);
    }
  }

  if (page === "report") {
    router.push("/admin/reports");
  } else {
    router.push(`/admin/questions?page=${returnPage}`);
  }
}
 else {
        toast.error("Failed to update question.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question.");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      width: "300px",
      border: "1px solid #ccc",
      boxShadow: "none",
      fontWeight: "bold",
      padding: "17px",
      transition: "0.3s",
      "&:hover": {
        borderColor: "#51216E",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#888",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#35095E",
      fontWeight: "bold",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#51216E" : "#fff",
      color: state.isFocused ? "#fff" : "#333",
      padding: "10px",
      cursor: "pointer",
      "&:active": { backgroundColor: "#bae7ff" },
    }),
  };

  const correctOptionValue = [
    { value: "A", label: "Option A" },
    { value: "B", label: "Option B" },
    { value: "C", label: "Option C" },
    { value: "D", label: "Option D" },
  ].find((opt) => opt.value === correctOption);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fixed Top Navigation Bar */}
      <nav className="top-0 left-0 right-0 bg-white z-40 py-3 px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-purple-800">Edit Question</h1>

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
              <FaListUl className="mr-1" /> A
            </button>
            <button
              onClick={() => scrollToRef(optionBRef)}
              className="flex items-center px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            >
              <FaListUl className="mr-1" /> B
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
              <FaListUl className="mr-1" /> D
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
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleUpdate} className="space-y-6 pb-10">
          {(subjectName || chapterName) && (
            <div className="grid gap-6  text-gray-600 mt-1">
              <p className="text-md">
                <strong className="text-lg">Subject:</strong> {subjectName}
              </p>

              <p className="text-md">
                <strong className="text-lg">Chapter:</strong> {chapterName}
              </p>
            </div>
          )}
          <div className="flex gap-8">
            <div>
              <label className="block font-bold">Topic:</label>
              <Select
                options={topics}
                value={selectedTopic}
                onChange={(option) => setSelectedTopic(option)}
                placeholder="Select Topic"
                isClearable
                styles={customStyles}
              />
            </div>
            <div>
              <label className="block font-bold">Question Type:</label>
              <Select
                options={questionTypes}
                value={selectedQuestionType}
                onChange={(option) => setSelectedQuestionType(option)}
                placeholder="Select Question Type"
                isClearable
                styles={customStyles}
              />
            </div>
          </div>

          {/* Question Section */}
          <div
            ref={questionRef}
            className="space-y-4 bg-white p-4 rounded-lg shadow"
          >
            <div className="space-y-2 w-6/12">
              <label className="block font-bold">Question Image:</label>
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
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      setImage,
                      setImageName,
                      setImagePreview
                    )
                  }
                />

                {existingImage && !imagePreview && !deleteImage && (
                  <div className="relative group">
                    <img
                      src={existingImage}
                      alt="Question"
                      className="h-full w-full rounded border border-gray-300"
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
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full rounded border border-gray-300"
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
              </div>
            </div>

            <div>
              <label className="block font-bold">Question:</label>
              <RichTextEditor
                value={question}
                onChange={(html) => setQuestion(html)}
              />
            </div>
          </div>

          {/* Options Sections */}
          <div
            ref={optionARef}
            className="space-y-2 bg-white p-4 rounded-lg shadow"
          >
            <label className="block font-bold">Option A:</label>
            <RichTextEditor
              value={optionA}
              onChange={(html) => setOptionA(html)}
            />
          </div>

          <div
            ref={optionBRef}
            className="space-y-2 bg-white p-4 rounded-lg shadow"
          >
            <label className="block font-bold">Option B:</label>
            <RichTextEditor
              value={optionB}
              onChange={(html) => setOptionB(html)}
            />
          </div>

          <div
            ref={optionCRef}
            className="space-y-2 bg-white p-4 rounded-lg shadow"
          >
            <label className="block font-bold">Option C:</label>
            <RichTextEditor
              value={optionC}
              onChange={(html) => setOptionC(html)}
            />
          </div>

          <div
            ref={optionDRef}
            className="space-y-2 bg-white p-4 rounded-lg shadow"
          >
            <label className="block font-bold">Option D:</label>
            <RichTextEditor
              value={optionD}
              onChange={(html) => setOptionD(html)}
            />
          </div>

          {/* Correct Answer Section */}
          <div
            ref={correctOptionRef}
            className="bg-white p-4 rounded-lg shadow"
          >
            <label className="block font-bold">Correct Option:</label>
            <Select
              options={[
                { value: "A", label: "Option A" },
                { value: "B", label: "Option B" },
                { value: "C", label: "Option C" },
                { value: "D", label: "Option D" },
              ]}
              value={correctOptionValue}
              onChange={(opt) => setCorrectOption(opt?.value)}
              placeholder="Select Correct Answer"
              isClearable
              styles={customStyles}
            />
          </div>

          {/* Hint Section */}
          <div
            ref={hintRef}
            className="space-y-4 bg-white p-4 rounded-lg shadow"
          >
            <div className="space-y-2 w-6/12">
              <label className="block font-bold">Hint Image:</label>
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
                  onChange={(e) =>
                    handleImageChange(
                      e,
                      setHintImage,
                      setHintImageName,
                      setHintImagePreview
                    )
                  }
                />

                {hintImagePreview && (
                  <div className="relative group">
                    <img
                      src={hintImagePreview}
                      alt="Hint Preview"
                      className="h-full w-full rounded border border-gray-300"
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

                {existingHintImage && !hintImagePreview && !deleteHintImage && (
                  <div className="relative group">
                    <img
                      src={existingHintImage}
                      alt="Hint"
                      className="h-full w-full rounded border border-gray-300"
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
              </div>
            </div>

            <div>
              <label className="block font-bold">Hint (Optional):</label>
              <RichTextEditor value={hint} onChange={(html) => setHint(html)} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors duration-300"
            style={{ marginBottom: "50px" }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Question"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
