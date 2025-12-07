import React, { useEffect, useState } from "react";
import {
  fetchSubjects,
  fetchChaptersBySubject,
  uploadFreeMaterial,
} from "../../utils/api";

const UploadFreeMaterial = () => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects().then((data) => setSubjects(data));
  }, []);

  useEffect(() => {
    if (subjectId) {
      fetchChaptersBySubject(subjectId).then((data) => setChapters(data));
    }
  }, [subjectId]);

  const handleUpload = async () => {
    if (!subjectId || !chapterId || !title || !file) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("chapterId", chapterId);
    formData.append("description", description);

    try {
      await uploadFreeMaterial(formData);
      alert("Material uploaded successfully!");

      setTitle("");
      setDescription("");
      setFile(null);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📤 Upload Free Materials
      </h1>

      {/* MAIN CARD */}
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-3xl border mx-auto">
        
        {/* Subject */}
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Select Subject *</label>
          <select
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Choose Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Select Chapter *</label>
          <select
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
          >
            <option value="">Choose Chapter</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Material Title */}
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Material Title *</label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter material name"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Description (Optional)</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a short description"
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="mb-5">
          <label className="block font-semibold mb-2 text-gray-700">Upload File *</label>

          <div className="border-2 border-dashed p-6 rounded-lg text-center hover:bg-gray-50 cursor-pointer transition">
            <input
              type="file"
              className="hidden"
              id="fileUpload"
              accept="*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              {file ? (
                <span className="text-indigo-600 font-medium">{file.name}</span>
              ) : (
                <span className="text-gray-500">
                  Click to choose a file or drag & drop here
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Material"}
        </button>
      </div>
    </div>
  );
};

export default UploadFreeMaterial;
