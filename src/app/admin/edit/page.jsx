"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { TestContext } from "@/contexts/TestContext";
import { API_BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";
import { FaPlus } from "react-icons/fa6";
import RichTextEditor from "@/components/Tiptap";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function EditQuestionPage() {
  const router = useRouter();
  
  const { testData, setTestData } = useContext(TestContext);
  const id = testData?.QuestionId;
  const returnPage = testData?.returnPage;
  const savedFilters = testData?.filters || {};
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
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [image, setImage] = useState(null);
  const [hintImage, setHintImage] = useState(null);
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState("Select Hint Image to Upload");
  useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

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
        setSelectedQuestionType({ value: data.questionType.id, label: data.questionType.name });
        setImageName(data.image ? "Image uploaded" : "Select question Image to Upload");
        setHintImageName(data.hintImage ? "Hint image uploaded" : "Select Hint Image to Upload");
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
        setTopics(response.data.map((t) => ({ value: t.id, label: t.name })));
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
        setQuestionTypes(response.data.map((qt) => ({ value: qt.id, label: qt.name })));
      } catch (error) {
        setError("Failed to fetch question types.");
        toast.error("Failed to fetch question types.");
      }
    };

    fetchQuestionTypes();
  }, [token]);

  const handleImageChange = (e, setImageState, setFileName) => {
    const file = e.target.files[0];
    if (file) {
      setImageState(file);
      setFileName(file.name);
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
      if (image) formData.append("image", image);
      if (hintImage) formData.append("hintImage", hintImage);
  
      const response = await axios.put(`${API_BASE_URL}/questions/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        toast.success("Question updated successfully!");
  
        // Preserve savedFilters in setTestData
        setTestData({
          returnPage,
          filters: savedFilters, // Ensure filters are retained
        });
  
        router.push(`/admin/questions?page=${returnPage}`);
      } else {
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

  const correctOptionValue = [
    { value: "A", label: "Option A" },
    { value: "B", label: "Option B" },
    { value: "C", label: "Option C" },
    { value: "D", label: "Option D" },
  ].find(opt => opt.value === correctOption);

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
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
        <div>
          <label className="block font-bold">Question:</label>
          <RichTextEditor
            value={question}
            onChange={(html) => setQuestion(html)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="richoptions">
            <label className="block font-bold">Option A:</label>
            <RichTextEditor
              value={optionA}
              onChange={(html) => setOptionA(html)}
            />
          </div>
          <div className="richoptions">
            <label className="block font-bold">Option B:</label>
            <RichTextEditor
              value={optionB}
              onChange={(html) => setOptionB(html)}
            />
          </div>
          <div className="richoptions">
            <label className="block font-bold">Option C:</label>
            <RichTextEditor
              value={optionC}
              onChange={(html) => setOptionC(html)}
            />
          </div>
          <div className="richoptions">
            <label className="block font-bold">Option D:</label>
            <RichTextEditor
              value={optionD}
              onChange={(html) => setOptionD(html)}
            />
          </div>
        </div>
        <div>
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
        <div>
          <label className="block font-bold">Hint (Optional):</label>
          <RichTextEditor
            value={hint}
            onChange={(html) => setHint(html)}
          />
        </div>
        
        {/* Image Upload Inputs */}
        <div className="grid md:flex md:flex-row gap-4 mb-6">
          {/* Question Image Upload */}
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
          {/* Hint Image Upload */}
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
        <button
          type="submit"
          className="btn w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
}