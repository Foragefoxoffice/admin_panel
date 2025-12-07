import React, { useEffect, useState } from "react";
import {
    fetchSubjects,
    fetchChaptersBySubject,
    fetchFreeMaterialsByChapter,
    fetchFreeMaterialsBySubject,
    deleteFreeMaterial,
} from "../../utils/api";

const ViewFreeMaterials = () => {
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [subjectId, setSubjectId] = useState("");
    const [chapterId, setChapterId] = useState("");
    const [loading, setLoading] = useState(false);

    // Load ALL free materials initially
    useEffect(() => {
        loadAllMaterials();
        fetchSubjects().then((data) => setSubjects(data));
    }, []);

    const loadAllMaterials = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://mitoslearning.in/api/freematerials");
            const data = await res.json();
            setMaterials(data);
        } catch (err) {
            console.error("Error loading all materials");
        } finally {
            setLoading(false);
        }
    };

    // Load chapters on subject select
    useEffect(() => {
        if (subjectId) {
            fetchChaptersBySubject(subjectId).then((data) => setChapters(data));
            setChapterId("");
        }
    }, [subjectId]);

    // Filter logic
    const applyFilter = async () => {
        setLoading(true);
        if (!subjectId && !chapterId) {
            return loadAllMaterials();
        }

        if (subjectId && !chapterId) {
            const data = await fetchFreeMaterialsBySubject(subjectId);
            setMaterials(data);
            setLoading(false);
            return;
        }

        if (chapterId) {
            const data = await fetchFreeMaterialsByChapter(chapterId);
            setMaterials(data);
            setLoading(false);
            return;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;
        await deleteFreeMaterial(id);
        applyFilter();
    };

    return (
        <div className="p-6 md:p-10">
            <h1 className="font-bold mb-6">📚 Free Materials</h1>

            {/* FILTER BOX */}
            <div className="bg-purple-50 p-5 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-end">
                {/* Subject Filter */}
                <div className="flex flex-col w-full md:w-1/3">
                    <label className="font-semibold mb-1 text-[#35095E]">Filter by Subject</label>
                    <select
                        className="border-2 border-[#282C35] p-3 rounded-md text-[#35095E] font-bold focus:border-[#51216E] transition-all"
                        value={subjectId}
                        onChange={(e) => {
                            setSubjectId(e.target.value);
                            setMaterials([]);
                        }}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chapter Filter */}
                <div className="flex flex-col w-full md:w-1/3">
                    <label className="font-semibold mb-1 text-[#35095E]">Filter by Chapter</label>
                    <select
                        className="border-2 border-[#282C35] p-3 rounded-md text-[#35095E] font-bold focus:border-[#51216E] transition-all"
                        value={chapterId}
                        onChange={(e) => setChapterId(e.target.value)}
                        disabled={!subjectId}
                    >
                        <option value="">All Chapters</option>
                        {chapters.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filter Button */}
                <button
                    onClick={applyFilter}
                    className="bg-[#51216E] hover:bg-[#35095E] text-white px-6 py-3 rounded-md font-bold transition-all"
                >
                    Apply
                </button>
            </div>

            {/* Materials Count */}
            <div className="mb-4">
                <p className="text-[#282C35] font-medium">
                    {loading ? "Loading..." : `${materials.length} material${materials.length !== 1 ? 's' : ''} found`}
                </p>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#51216E] text-white">
                            <th className="py-3 px-4 text-left font-semibold">#</th>
                            <th className="py-3 px-4 text-left font-semibold">Material Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500 font-medium">
                                    Loading materials...
                                </td>
                            </tr>
                        ) : materials.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center py-6 text-gray-500 font-medium"
                                >
                                    No materials found
                                </td>
                            </tr>
                        ) : (
                            materials.map((m, index) => (
                                <tr key={m.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-bold text-[#35095E]">{index + 1}</td>
                                    <td className="py-3 px-4 text-[#282C35]">{m.title}</td>
                                    <td className="py-3 px-4 flex gap-3">
                                        <a
                                            href={`https://mitoslearning.in${m.fileUrl}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
                                        >
                                            View
                                        </a>

                                        <button
                                            onClick={() => handleDelete(m.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewFreeMaterials;
