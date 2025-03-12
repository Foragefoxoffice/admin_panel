"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { TestContext } from "@/contexts/TestContext";
import { API_BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function EditQuestionPage() {
  const router = useRouter();
  const { testData } = useContext(TestContext);
  const id = testData?.QuestionId;
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/questions/update/${id}`,
        {
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          correctOption,
          hint,
          topicId: selectedTopic?.value,
          questionTypeId: selectedQuestionType?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Question updated successfully!");
        router.push("/admin/questions");
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


  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-bold">Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold">Option A:</label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Option B:</label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Option C:</label>
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Option D:</label>
            <input
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              className="w-full p-2 border rounded"
              required
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
          onChange={(opt) => setCorrectOption(opt?.value)}
          placeholder="Select Correct Answer"
          isClearable
          styles={customStyles}
        />
        </div>
        <div>
          <label className="block font-bold">Hint (Optional):</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
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
        <button
          type="submit"
          className="btn w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
}