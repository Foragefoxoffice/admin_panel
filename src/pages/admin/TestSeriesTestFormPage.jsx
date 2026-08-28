import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const DEFAULT_SUBJECT_CONFIGS = [
  { subjectName: "Biology", questionCount: 90 },
  { subjectName: "Chemistry", questionCount: 45 },
  { subjectName: "Physics", questionCount: 45 },
];

export default function TestSeriesTestFormPage() {
  const { packageId, testId } = useParams();
  const isEdit = Boolean(testId);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState(200);
  const [videoUrl, setVideoUrl] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [subjectConfigs, setSubjectConfigs] = useState(DEFAULT_SUBJECT_CONFIGS);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [fetchedPackageId, setFetchedPackageId] = useState(null);

  const [notesUrl, setNotesUrl] = useState("");
  const [notesFileName, setNotesFileName] = useState("");
  const [pendingNotesFile, setPendingNotesFile] = useState(null); // create mode — uploaded after the test itself is saved
  const [notesUploading, setNotesUploading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const totalQuestions = subjectConfigs.reduce((sum, sc) => sum + Number(sc.questionCount || 0), 0);

  useEffect(() => {
    if (!isEdit) return;
    const fetchTest = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/test-series/tests/${testId}`, { headers });
        setName(data.name);
        setDuration(data.duration);
        setVideoUrl(data.videoUrl || "");
        setSyllabus(data.syllabus || "");
        setNotesUrl(data.notesUrl || "");
        setNotesFileName(data.notesFileName || "");
        setFetchedPackageId(data.packageId);
        setSubjectConfigs(
          data.subjectConfigs.length > 0
            ? data.subjectConfigs.map((sc) => ({
                subjectName: sc.subjectName,
                questionCount: sc.questionCount,
              }))
            : DEFAULT_SUBJECT_CONFIGS
        );
      } catch {
        toast.error("Failed to load test");
      } finally {
        setFetching(false);
      }
    };
    fetchTest();
  }, [testId]);

  const updateConfig = (idx, field, value) => {
    setSubjectConfigs((prev) =>
      prev.map((sc, i) => (i === idx ? { ...sc, [field]: value } : sc))
    );
  };

  const addSubjectConfig = () => {
    setSubjectConfigs((prev) => [...prev, { subjectName: "", questionCount: 0 }]);
  };

  const removeSubjectConfig = (idx) => {
    setSubjectConfigs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleNotesUpload = async (id, file) => {
    setNotesUploading(true);
    try {
      const form = new FormData();
      form.append("notes", file);
      const { data } = await axios.post(`${API_BASE_URL}/test-series/tests/${id}/notes`, form, { headers });
      setNotesUrl(data.notesUrl);
      setNotesFileName(data.notesFileName);
      toast.success("Notes uploaded");
    } catch {
      toast.error("Failed to upload notes");
    } finally {
      setNotesUploading(false);
    }
  };

  const handleNotesSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") return toast.error("Only PDF files are allowed");

    if (isEdit) {
      handleNotesUpload(testId, file);
    } else {
      setPendingNotesFile(file);
      setNotesFileName(file.name);
    }
  };

  const handleNotesDelete = async () => {
    if (isEdit) {
      try {
        await axios.delete(`${API_BASE_URL}/test-series/tests/${testId}/notes`, { headers });
        toast.success("Notes removed");
      } catch {
        toast.error("Failed to remove notes");
        return;
      }
    }
    setNotesUrl("");
    setNotesFileName("");
    setPendingNotesFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Test name is required");
    if (subjectConfigs.some((sc) => !sc.subjectName.trim())) {
      return toast.error("All subject names are required");
    }
    if (totalQuestions === 0) return toast.error("Total questions must be greater than 0");

    setLoading(true);
    try {
      const payload = { name, duration: Number(duration), totalQuestions, subjectConfigs, videoUrl: videoUrl.trim() || null, syllabus: syllabus.trim() || null };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/test-series/tests/${testId}`, payload, { headers });
        toast.success("Test updated");
        navigate(`/admin/test-series/${packageId || fetchedPackageId}/tests`);
      } else {
        const { data } = await axios.post(
          `${API_BASE_URL}/test-series/packages/${packageId}/tests`,
          payload,
          { headers }
        );
        if (pendingNotesFile) await handleNotesUpload(data.id, pendingNotesFile);
        toast.success("Test created");
        navigate(`/admin/test-series/${packageId || fetchedPackageId}/tests`);
      }
    } catch {
      toast.error("Failed to save test");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-1">
      <div className="mb-5">
        <button
          onClick={() => navigate(`/admin/test-series/${packageId || fetchedPackageId}/tests`)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Tests
        </button>
        <h1 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Test" : "Create Test"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
        {/* Test Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. NEET Mock Test 1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={1}
            placeholder="200"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Video Explanation URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Explanation URL
            <span className="ml-2 text-xs text-gray-400 font-normal">(YouTube link — optional)</span>
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {videoUrl && (
            <p className="mt-1 text-xs text-green-600">✓ Video URL set — users will see a "Video" button after attempting the test</p>
          )}
        </div>

        {/* Syllabus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Syllabus
            <span className="ml-2 text-xs text-gray-400 font-normal">(optional — shown as expandable section on test card)</span>
          </label>
          <textarea
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            rows={4}
            placeholder={"Physics: Basic Mathematics\nChemistry: Some Basic Concept of Chemistry\nBiology: Plant Kingdom"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-400">One topic per line, e.g. "Physics: Laws of Motion"</p>
        </div>

        {/* Test Notes (PDF) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Notes (PDF)
            <span className="ml-2 text-xs text-gray-400 font-normal">(optional — students can view/download this)</span>
          </label>

          {notesFileName ? (
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                {notesUrl ? (
                  <a
                    href={`${API_BASE_URL.replace(/\/api$/, "")}${notesUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-purple-700 hover:underline truncate"
                  >
                    {notesFileName}
                  </a>
                ) : (
                  <span className="text-sm text-gray-700 truncate">{notesFileName}</span>
                )}
                {pendingNotesFile && <span className="text-xs text-orange-500 flex-shrink-0">(will upload on save)</span>}
              </div>
              <button
                type="button"
                onClick={handleNotesDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-3 py-4 text-sm text-gray-400 hover:border-purple-300 hover:text-purple-600 cursor-pointer transition-colors">
              {notesUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
              ) : (
                <>Click to upload PDF notes</>
              )}
              <input type="file" accept="application/pdf" onChange={handleNotesSelect} disabled={notesUploading} className="hidden" />
            </label>
          )}
        </div>

        {/* Subject Distribution */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Subject Distribution *</label>
            <button
              type="button"
              onClick={addSubjectConfig}
              className="flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 font-medium"
            >
              <Plus size={14} />
              Add Subject
            </button>
          </div>

          <div className="space-y-3">
            {subjectConfigs.map((sc, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={sc.subjectName}
                  onChange={(e) => updateConfig(idx, "subjectName", e.target.value)}
                  placeholder="Subject name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center gap-2 w-36">
                  <input
                    type="number"
                    value={sc.questionCount}
                    onChange={(e) => updateConfig(idx, "questionCount", Number(e.target.value))}
                    min={0}
                    placeholder="Questions"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-400 whitespace-nowrap">Qs</span>
                </div>
                {subjectConfigs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubjectConfig(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Total Questions</span>
            <span
              className={`font-semibold ${
                totalQuestions === 180 ? "text-green-600" : "text-orange-500"
              }`}
            >
              {totalQuestions}
              {totalQuestions !== 180 && " (NEET standard: 180)"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold text-sm disabled:opacity-60 transition-all"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Save size={16} />
          )}
          {isEdit ? "Save Changes" : "Create Test"}
        </button>
    </form>
    </div>
  );
}
