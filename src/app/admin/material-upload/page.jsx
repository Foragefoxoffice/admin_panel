"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FaPlus } from "react-icons/fa6";
import { API_BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function UploadPDF() {
  const [file, setFile] = useState(null);
  const [portionId, setPortionId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [portions, setPortions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [token, setToken] = useState(null);
  const [hintImageName, setHintImageName] = useState("Select PDF to Upload");
  useAuth();
  // Fetch token from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Fetch portions from the API
  useEffect(() => {
    const fetchPortions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/portions`);
        setPortions(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching portions:", error);
        setPortions([]);
      }
    };
    fetchPortions();
  }, []);

  // Fetch subjects based on portionId
  useEffect(() => {
    if (!portionId) return setSubjects([]);

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/subjects/subject/${portionId}`);
        setSubjects(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [portionId]);

  // Fetch chapters based on subjectId
  useEffect(() => {
    if (!subjectId) return setChapters([]);

    const fetchChapters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/chapters/chapter/${subjectId}`);
        setChapters(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setChapters([]);
      }
    };
    fetchChapters();
  }, [subjectId]);

  // Fetch topics based on chapterId
  useEffect(() => {
    if (!chapterId) return setTopics([]);

    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/topics/topic/${chapterId}`);
        setTopics(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
      }
    };
    fetchTopics();
  }, [chapterId]);

  // Handle topic selection
  const handleTopicChange = (selectedOption) => {
    setTopicId(selectedOption.value);
    setTopicName(selectedOption.label);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setHintImageName(event.target.files[0]?.name || "Select Hint Image to Upload");
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("portionId", portionId);
    formData.append("subjectId", subjectId);
    formData.append("chapterId", chapterId);
    formData.append("topicId", topicId);
    formData.append("name", topicName);

    try {
      setUploading(true);
      setMessage("");
      setProgress(0);

      if (!token) {
        setMessage("Authentication error: Please log in again.");
        setUploading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      setMessage("File uploaded successfully!");
      setFile(null);
      setPortionId("");
      setSubjectId("");
      setChapterId("");
      setTopicId("");
      setTopicName("");
      setHintImageName("Select Hint Image to Upload");
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
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
    <div className="flex flex-col items-start md:items-center justify-start md:justify-center min-h-screen pt-14 md:pt-0  px-6">
      <div className="bg-white rounded-2xl p-0 md:p-8 w-full max-w-lg">
        <h1 className="font-bold text-purple-800 mb-8 text-center">Upload Materials</h1>
        <div className="space-y-6">
          <Select
            styles={customStyles}
            options={portions.map((portion) => ({ value: portion.id, label: portion.name }))}
            value={portions.find((portion) => portion.id === portionId) ? { value: portionId, label: portions.find((portion) => portion.id === portionId)?.name } : null}
            onChange={(selectedOption) => setPortionId(selectedOption.value)}
            placeholder="Select Portion"
          />

          <Select
            styles={customStyles}
            options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
            value={subjects.find((subject) => subject.id === subjectId) ? { value: subjectId, label: subjects.find((subject) => subject.id === subjectId)?.name } : null}
            onChange={(selectedOption) => setSubjectId(selectedOption.value)}
            placeholder="Select Subject"
            isDisabled={!portionId}
          />

          <Select
            styles={customStyles}
            options={chapters.map((chapter) => ({ value: chapter.id, label: chapter.name }))}
            value={chapters.find((chapter) => chapter.id === chapterId) ? { value: chapterId, label: chapters.find((chapter) => chapter.id === chapterId)?.name } : null}
            onChange={(selectedOption) => setChapterId(selectedOption.value)}
            placeholder="Select Chapter"
            isDisabled={!subjectId}
          />

          <Select
            styles={customStyles}
            options={topics.map((topic) => ({ value: topic.id, label: topic.name }))}
            value={topics.find((topic) => topic.id === topicId) ? { value: topicId, label: topics.find((topic) => topic.id === topicId)?.name } : null}
            onChange={handleTopicChange}
            placeholder="Select Topic"
            isDisabled={!chapterId}
          />

          <div>
            <label className="file_upload" htmlFor="pdf">
              <FaPlus size={40} className="file_icon" /> {hintImageName}
            </label>
            <input
              type="file"
              name="pdf"
              id="pdf"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn w-full"
          >
            {uploading ? `Uploading... ${progress}%` : "Upload PDF"}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}