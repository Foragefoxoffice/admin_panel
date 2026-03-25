import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FaQuestion, FaListUl, FaCheck, FaLightbulb, FaPlus, FaTrash } from "react-icons/fa6";
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { MathJaxContext } from "better-react-mathjax";
import RichTextEditor from "@/components/Tiptap";
import { API_BASE_URL, BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";
import toast from "react-hot-toast";

// Strip HTML for plain text preview
function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || "";
}

const customSelectStyles = {
  control: (p, s) => ({
    ...p,
    borderRadius: "10px",
    border: s.isFocused ? "2px solid #6F13C4" : "1px solid #ccc",
    boxShadow: s.isFocused ? "0 0 5px rgba(111,19,196,0.5)" : "none",
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: "6px",
    "&:hover": { borderColor: "#51216E" },
  }),
  placeholder: (p) => ({ ...p, color: "#6F13C4", fontSize: "14px", fontWeight: "bold" }),
  singleValue: (p) => ({ ...p, color: "#35095E", fontWeight: "bold", fontSize: "14px" }),
  menu: (p) => ({
    ...p, borderRadius: "10px", backgroundColor: "#fff",
    padding: "5px", boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
  }),
  option: (p, s) => ({
    ...p,
    backgroundColor: s.isFocused ? "#6F13C4" : "#fff",
    color: s.isFocused ? "#fff" : "#333",
    padding: "10px 12px", fontSize: "14px", fontWeight: "bold", cursor: "pointer",
    "&:active": { backgroundColor: "#51216E" },
  }),
};

export default function ManageTestQuestionsPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  useAuth();

  const [test, setTest] = useState(null);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // ── Edit mode for existing question ──────────────────────────────────────
  const [editingQuestion, setEditingQuestion] = useState(null); // question object being edited

  // ── Form state ────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
  const [imageName, setImageName] = useState("Select question Image to Upload");
  const [hintImageName, setHintImageName] = useState("Select Hint Image to Upload");
  const [imagePreview, setImagePreview] = useState(null);
  const [hintImagePreview, setHintImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [existingHintImage, setExistingHintImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteHintImage, setDeleteHintImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());

  // Scroll refs for the form panel
  const formPanelRef = useRef(null);
  const questionRef = useRef(null);
  const optionARef = useRef(null);
  const optionBRef = useRef(null);
  const optionCRef = useRef(null);
  const optionDRef = useRef(null);
  const correctOptionRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchTest();
    fetchAssigned();
    fetchSubjects();
    fetchQuestionTypes();
  }, [token]);

  useEffect(() => {
    if (!selectedSubject || !token) { setChapters([]); return; }
    axios
      .get(`${API_BASE_URL}/chapters/chapter/${selectedSubject.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setChapters(r.data.map((c) => ({ value: c.id, label: c.name }))))
      .catch(() => setChapters([]));
  }, [selectedSubject, token]);

  useEffect(() => {
    if (!selectedChapter || !token) { setTopics([]); return; }
    axios
      .get(`${API_BASE_URL}/topics/topic/${selectedChapter.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setTopics(r.data.map((t) => ({ value: t.id, label: t.name }))))
      .catch(() => setTopics([]));
  }, [selectedChapter, token]);

  const fetchTest = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/test-series/tests/${testId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTest(data);
  };

  const fetchAssigned = async () => {
    setLoading(true);
    const { data } = await axios.get(`${API_BASE_URL}/test-series/tests/${testId}/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAssignedQuestions(data);
    setLoading(false);
  };

  const fetchSubjects = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubjects(data.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.portion?.name ?? ""})`,
      portion: s.portion,
    })));
  };

  const fetchQuestionTypes = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/question-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestionTypes(data.map((qt) => ({ value: qt.id, label: qt.name })));
  };

  const scrollTo = (ref) => {
    if (ref?.current && formPanelRef?.current) {
      formPanelRef.current.scrollTo({ top: ref.current.offsetTop - 60, behavior: "smooth" });
    }
  };

  const handleImageChange = (e, setImg, setName, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setImg(file);
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type) => {
    if (type === "question") {
      setImage(null); setImagePreview(null);
      setImageName("Select question Image to Upload");
      setExistingImage(null); setDeleteImage(true);
    } else {
      setHintImage(null); setHintImagePreview(null);
      setHintImageName("Select Hint Image to Upload");
      setExistingHintImage(null); setDeleteHintImage(true);
    }
  };

  const resetForm = () => {
    setSelectedSubject(null); setSelectedChapter(null);
    setSelectedTopic(null); setSelectedQuestionType(null);
    setChapters([]); setTopics([]);
    setQuestion(""); setOptionA(""); setOptionB("");
    setOptionC(""); setOptionD(""); setCorrectOption(""); setHint("");
    setImage(null); setHintImage(null);
    setImagePreview(null); setHintImagePreview(null);
    setExistingImage(null); setExistingHintImage(null);
    setImageName("Select question Image to Upload");
    setHintImageName("Select Hint Image to Upload");
    setDeleteImage(false); setDeleteHintImage(false);
    setEditorKey(Date.now());
    setEditingQuestion(null);
    formPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditQuestion = async (item) => {
    const q = item.question;
    setEditingQuestion(q);

    // Load cascade
    const subjectOpt = subjects.find((s) => s.value === q.subjectId) ||
      { value: q.subjectId, label: q.subject?.name ?? "" };
    setSelectedSubject(subjectOpt);

    const chapRes = await axios.get(`${API_BASE_URL}/chapters/chapter/${q.subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const chapList = chapRes.data.map((c) => ({ value: c.id, label: c.name }));
    setChapters(chapList);
    const chapterOpt = chapList.find((c) => c.value === q.chapterId) || null;
    setSelectedChapter(chapterOpt);

    const topicRes = await axios.get(`${API_BASE_URL}/topics/topic/${q.chapterId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const topicList = topicRes.data.map((t) => ({ value: t.id, label: t.name }));
    setTopics(topicList);
    setSelectedTopic(topicList.find((t) => t.value === q.topicId) || null);
    setSelectedQuestionType(questionTypes.find((qt) => qt.value === q.questionTypeId) || null);

    setQuestion(q.question); setOptionA(q.optionA); setOptionB(q.optionB);
    setOptionC(q.optionC); setOptionD(q.optionD);
    setCorrectOption(q.correctOption); setHint(q.hint || "");
    setExistingImage(q.image || null); setExistingHintImage(q.hintImage || null);
    setDeleteImage(false); setDeleteHintImage(false);
    setEditorKey(Date.now());

    formPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !selectedChapter || !selectedTopic || !selectedQuestionType) {
      return toast.error("Please select Subject, Chapter, Topic and Question Type");
    }
    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption) {
      return toast.error("Question, all options and correct answer are required");
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("subjectId", selectedSubject.value);
      formData.append("chapterId", selectedChapter.value);
      formData.append("topicId", selectedTopic.value);
      formData.append("questionTypeId", selectedQuestionType.value);
      formData.append("question", question);
      formData.append("optionA", optionA);
      formData.append("optionB", optionB);
      formData.append("optionC", optionC);
      formData.append("optionD", optionD);
      formData.append("correctOption", correctOption);
      formData.append("hint", hint);
      if (image) formData.append("image", image);
      if (hintImage) formData.append("hintImage", hintImage);

      if (editingQuestion) {
        // Edit existing question
        formData.append("deleteImage", String(deleteImage));
        formData.append("deleteHintImage", String(deleteHintImage));
        await axios.put(
          `${API_BASE_URL}/test-series/questions/${editingQuestion.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        toast.success("Question updated");
      } else {
        // Create new question and assign to this test
        await axios.post(
          `${API_BASE_URL}/test-series/tests/${testId}/create-question`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        toast.success("Question added to test!");
      }

      resetForm();
      fetchAssigned();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveFromTest = async (questionId) => {
    if (!confirm("Remove this question from the test?")) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/test-series/tests/${testId}/questions/${questionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
      toast.success("Question removed");
    } catch {
      toast.error("Failed to remove question");
    }
  };

  return (
    <MathJaxContext>
      <div className="flex flex-col h-screen overflow-hidden">

        {/* ── Top Bar ─────────────────────────────────────────────────────── */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3">
          <button
            onClick={() => navigate(`/admin/test-series/${test?.package?.id ?? ""}/tests`)}
            className="flex items-center gap-2 text-sm text-white bg-purple-700 hover:bg-purple-800 px-3 py-1.5 rounded-lg mb-2"
          >
            <ArrowLeft size={14} /> Back to Tests
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{test?.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {assignedQuestions.length} / {test?.totalQuestions} questions assigned
              </p>
              {test?.subjectConfigs && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {test.subjectConfigs.map((sc) => {
                    const count = assignedQuestions.filter(
                      (q) => q.question?.subject?.name === sc.subjectName
                    ).length;
                    return (
                      <span
                        key={sc.id}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          count >= sc.questionCount
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {sc.subjectName}: {count}/{sc.questionCount}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick-nav for the form (visible on scroll) */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {[
                { ref: questionRef, icon: <FaQuestion />, label: "Q" },
                { ref: optionARef, icon: <FaListUl />, label: "A" },
                { ref: optionBRef, icon: <FaListUl />, label: "B" },
                { ref: optionCRef, icon: <FaListUl />, label: "C" },
                { ref: optionDRef, icon: <FaListUl />, label: "D" },
                { ref: correctOptionRef, icon: <FaCheck />, label: "" },
                { ref: hintRef, icon: <FaLightbulb />, label: "" },
              ].map(({ ref, icon, label }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTo(ref)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-xs font-medium"
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-column body ─────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: Assigned Questions */}
          <div className="w-[38%] border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-700 text-sm">
                Assigned Questions ({assignedQuestions.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700" />
                </div>
              ) : assignedQuestions.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  No questions added yet.<br />
                  Use the form on the right to add questions.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {assignedQuestions.map((item, idx) => (
                    <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                      <span className="text-xs text-gray-400 mt-0.5 w-5 shrink-0 font-medium">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {stripHtml(item.question?.question)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.question?.subject?.name} → {item.question?.chapter?.name}
                        </p>
                        <span
                          className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            item.question?.correctOption
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Answer: {item.question?.correctOption}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => handleEditQuestion(item)}
                          className="p-1.5 text-gray-400 hover:text-purple-600"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleRemoveFromTest(item.questionId)}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Add / Edit Question Form */}
          <div ref={formPanelRef} className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 text-sm">
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </h2>
              {editingQuestion && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-purple-600 hover:underline"
                >
                  + Add new instead
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 pb-12">
              {/* Cascade Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={selectedSubject}
                  options={subjects}
                  onChange={(val) => {
                    setSelectedSubject(val);
                    setSelectedChapter(null);
                    setSelectedTopic(null);
                    setChapters([]); setTopics([]);
                  }}
                  placeholder="Select Subject"
                  isClearable
                  styles={customSelectStyles}
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
                  styles={customSelectStyles}
                />
                <Select
                  value={selectedTopic}
                  options={topics}
                  onChange={setSelectedTopic}
                  placeholder="Select Topic"
                  isClearable
                  styles={customSelectStyles}
                />
                <Select
                  value={selectedQuestionType}
                  options={questionTypes}
                  onChange={setSelectedQuestionType}
                  placeholder="Select Question Type"
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              {/* Question */}
              <div ref={questionRef} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="space-y-2">
                  <label className="block font-bold text-base text-purple-700">Question Image:</label>
                  <label className="file_upload" htmlFor="mgr_img">
                    <FaPlus size={30} className="file_icon" /> {imageName}
                  </label>
                  <input type="file" id="mgr_img" hidden accept="image/*"
                    onChange={(e) => handleImageChange(e, setImage, setImageName, setImagePreview)} />
                  {!imagePreview && existingImage && (
                    <div className="relative group max-w-xs">
                      <img src={`${BASE_URL}/${existingImage}`} alt="current"
                        className="w-full rounded border border-gray-300" />
                      <button type="button" onClick={() => handleRemoveImage("question")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative group max-w-xs">
                      <img src={imagePreview} alt="preview"
                        className="w-full rounded border border-gray-300" />
                      <button type="button" onClick={() => handleRemoveImage("question")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-base text-purple-700">Question:</label>
                  <RichTextEditor key={editorKey} value={question} onChange={setQuestion} />
                </div>
              </div>

              {/* Options */}
              {[
                { ref: optionARef, label: "Option A", value: optionA, setter: setOptionA, key: 1 },
                { ref: optionBRef, label: "Option B", value: optionB, setter: setOptionB, key: 2 },
                { ref: optionCRef, label: "Option C", value: optionC, setter: setOptionC, key: 3 },
                { ref: optionDRef, label: "Option D", value: optionD, setter: setOptionD, key: 4 },
              ].map(({ ref, label, value, setter, key }) => (
                <div key={key} ref={ref} className="bg-white rounded-lg shadow p-4 space-y-2">
                  <label className="block font-bold text-base text-purple-700">{label}:</label>
                  <RichTextEditor key={editorKey + key} value={value} onChange={setter} />
                </div>
              ))}

              {/* Correct Answer */}
              <div ref={correctOptionRef} className="bg-white rounded-lg shadow p-4">
                <label className="block font-bold text-base text-purple-700 mb-2">Correct Answer:</label>
                <Select
                  value={correctOption ? { value: correctOption, label: `Option ${correctOption}` } : null}
                  options={["A","B","C","D"].map((v) => ({ value: v, label: `Option ${v}` }))}
                  onChange={(opt) => setCorrectOption(opt?.value ?? "")}
                  placeholder="Select Correct Answer"
                  isClearable
                  styles={customSelectStyles}
                />
              </div>

              {/* Hint */}
              <div ref={hintRef} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="space-y-2">
                  <label className="block font-bold text-base text-purple-700">Hint Image:</label>
                  <label className="file_upload" htmlFor="mgr_hint_img">
                    <FaPlus size={30} className="file_icon" /> {hintImageName}
                  </label>
                  <input type="file" id="mgr_hint_img" hidden accept="image/*"
                    onChange={(e) => handleImageChange(e, setHintImage, setHintImageName, setHintImagePreview)} />
                  {!hintImagePreview && existingHintImage && (
                    <div className="relative group max-w-xs">
                      <img src={`${BASE_URL}/${existingHintImage}`} alt="hint"
                        className="w-full rounded border border-gray-300" />
                      <button type="button" onClick={() => handleRemoveImage("hint")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                  {hintImagePreview && (
                    <div className="relative group max-w-xs">
                      <img src={hintImagePreview} alt="hint preview"
                        className="w-full rounded border border-gray-300" />
                      <button type="button" onClick={() => handleRemoveImage("hint")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-base text-purple-700">Hint:</label>
                  <RichTextEditor key={editorKey + 5} value={hint} onChange={setHint} />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg shadow transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : editingQuestion ? "Save Changes" : "Add Question to Test"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}
