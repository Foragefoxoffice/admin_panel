(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_ffde24._.js", {

"[project]/src/utils/api.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__),
    "fetchChapter": (()=>fetchChapter),
    "fetchChapterTopics": (()=>fetchChapterTopics),
    "fetchChaptersBySubject": (()=>fetchChaptersBySubject),
    "fetchCustomTestQuestions": (()=>fetchCustomTestQuestions),
    "fetchFullTestByChapter": (()=>fetchFullTestByChapter),
    "fetchFullTestByPortion": (()=>fetchFullTestByPortion),
    "fetchFullTestBySubject": (()=>fetchFullTestBySubject),
    "fetchFullTestQuestion": (()=>fetchFullTestQuestion),
    "fetchLeaderBoard": (()=>fetchLeaderBoard),
    "fetchPortions": (()=>fetchPortions),
    "fetchQuestion": (()=>fetchQuestion),
    "fetchQuestionType": (()=>fetchQuestionType),
    "fetchQuestions": (()=>fetchQuestions),
    "fetchQuestionsByTypes": (()=>fetchQuestionsByTypes),
    "fetchResultByUser": (()=>fetchResultByUser),
    "fetchSubjects": (()=>fetchSubjects),
    "fetchSubjectsByPortions": (()=>fetchSubjectsByPortions),
    "fetchTopics": (()=>fetchTopics),
    "getAllWrongQuestionReports": (()=>getAllWrongQuestionReports),
    "submitWrongQuestionReport": (()=>submitWrongQuestionReport),
    "updateBlockStatus": (()=>updateBlockStatus),
    "updateWrongQuestionReportStatus": (()=>updateWrongQuestionReportStatus)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Axios instance with base URL
const API = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "https://mitoslearning.in/api"
});
// Interceptor to attach the token with every request
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>Promise.reject(error));
const fetchSubjects = async ()=>{
    try {
        const { data } = await API.get("/subjects");
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
const fetchPortions = async ()=>{
    try {
        const { data } = await API.get("/portions");
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
const fetchSubjectsByPortions = async (portionId)=>{
    try {
        const { data } = await API.get(`/subjects/subject/${portionId}`);
        return data;
    } catch (error) {
        console.error("Error fetching subjects by portion:", error);
        throw error;
    }
};
const fetchChaptersBySubject = async (subjectId)=>{
    try {
        const { data } = await API.get(`/chapters/chapter/${subjectId}`);
        return data;
    } catch (error) {
        console.error("Error fetching chapters by subject:", error);
        throw error;
    }
};
const fetchChapter = async (subjectId)=>{
    try {
        const { data } = await API.get(`/chapters/chapter/${subjectId}`);
        return data;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
    }
};
const fetchChapterTopics = async (chapterId)=>{
    try {
        const { data } = await API.get(`/topics/chapter/${chapterId}`);
        return data;
    } catch (error) {
        console.error("Error fetching topics by chapter:", error);
        throw error;
    }
};
const fetchTopics = (chapterId)=>API.get(`/topics/topic/${chapterId}`);
const fetchQuestionType = ()=>API.get("/question-types");
const fetchQuestion = (topicId)=>API.get(`/questions?topicId=${topicId}`);
const fetchQuestions = (topics)=>{
    const topicIds = topics.join(",");
    return API.get(`/questions/topics?topicIds=${topicIds}`);
};
const fetchQuestionsByTypes = (selectedQuestionTypes, chapterId)=>{
    const questionTypeIds = selectedQuestionTypes.join(",");
    return API.get(`/questions/questiontype?questionTypeIds=${questionTypeIds}&chapterId=${chapterId}`);
};
const fetchFullTestQuestion = ()=>API.get("/questions/fulltest");
const fetchFullTestByPortion = (portionId)=>API.get(`/questions/portion/${portionId}`);
const fetchFullTestBySubject = (portionId, subjectId)=>API.get(`/questions/portion/${portionId}/subject/${subjectId}`);
const fetchFullTestByChapter = (portionId, subjectId, chapterId)=>API.get(`/questions/portion/${portionId}/subject/${subjectId}/chapter/${chapterId}`);
const fetchCustomTestQuestions = async (portionId, subjectId, chapterId, topicIds, questionCount)=>{
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found. Please log in.");
    }
    const response = await fetch("https://mitoslearning.in/api/questions/custom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            portionId,
            subjectId,
            chapterId,
            topicIds,
            questionCount
        })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch custom test questions");
    }
    return response.json();
};
const fetchResultByUser = (userId)=>API.get(`/tests/${userId}`);
const fetchLeaderBoard = async ()=>{
    try {
        const { data } = await API.get(`/tests/a`);
        return data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};
const updateBlockStatus = async (type, id, isPremium)=>{
    try {
        const { data } = await API.post("/block", {
            type,
            id,
            isPremium
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return data;
    } catch (error) {
        console.error("Error updating block status:", error);
        throw error;
    }
};
const getAllWrongQuestionReports = async ()=>{
    try {
        const { data } = await API.get("/wrong-reports");
        return data;
    } catch (error) {
        console.error("Error fetching wrong question reports:", error);
        throw error;
    }
};
const updateWrongQuestionReportStatus = async (id, status)=>{
    try {
        const { data } = await API.patch(`/wrong-reports/${id}`, {
            status
        });
        return data;
    } catch (error) {
        console.error("Error updating report status:", error);
        throw error;
    }
};
const submitWrongQuestionReport = async (questionId, reason)=>{
    try {
        const { data } = await API.post("/wrong-reports", {
            questionId,
            reason
        });
        return data;
    } catch (error) {
        console.error("Error submitting wrong question report:", error);
        throw error;
    }
};
const __TURBOPACK__default__export__ = API;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/blocks/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/utils/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
const BlockContentPage = ()=>{
    _s();
    // State
    const [portions, setPortions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPortion, setSelectedPortion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedSubject, setSelectedSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedChapter, setSelectedChapter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subjects, setSubjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [topics, setTopics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [activePanel, setActivePanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("portions");
    // Fetch initial data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlockContentPage.useEffect": ()=>{
            const loadData = {
                "BlockContentPage.useEffect.loadData": async ()=>{
                    try {
                        setLoading(true);
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPortions"])();
                        setPortions(data);
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to load portions");
                    } finally{
                        setLoading(false);
                    }
                }
            }["BlockContentPage.useEffect.loadData"];
            loadData();
        }
    }["BlockContentPage.useEffect"], []);
    // Filter items based on search term
    const filterItems = (items)=>{
        if (!searchTerm) return items;
        return items.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };
    // Handlers
    const handlePortionSelect = async (portionId)=>{
        try {
            setLoading(true);
            setSelectedPortion(portionId);
            setSelectedSubject(null);
            setSelectedChapter(null);
            const subs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSubjectsByPortions"])(portionId);
            setSubjects(subs);
            setChapters([]);
            setTopics([]);
            setActivePanel("subjects");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Loaded ${subs.length} subjects`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to load subjects");
        } finally{
            setLoading(false);
        }
    };
    const handleSubjectSelect = async (subjectId)=>{
        try {
            setLoading(true);
            setSelectedSubject(subjectId);
            setSelectedChapter(null);
            const chaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChaptersBySubject"])(subjectId);
            setChapters(chaps);
            setTopics([]);
            setActivePanel("chapters");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Loaded ${chaps.length} chapters`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to load chapters");
        } finally{
            setLoading(false);
        }
    };
    const handleChapterSelect = async (chapterId)=>{
        try {
            setLoading(true);
            setSelectedChapter(chapterId);
            const tops = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChapterTopics"])(chapterId);
            setTopics(tops);
            setActivePanel("topics");
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Loaded ${tops.length} topics`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to load topics");
        } finally{
            setLoading(false);
        }
    };
    const toggleBlock = async (type, id, currentState)=>{
        try {
            setLoading(true);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateBlockStatus"])(type, id, !currentState);
            // Refresh data
            const refreshData = async ()=>{
                switch(type){
                    case "portion":
                        setPortions(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPortions"])());
                        break;
                    case "subject":
                        if (selectedPortion) setSubjects(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSubjectsByPortions"])(selectedPortion));
                        break;
                    case "chapter":
                        if (selectedSubject) setChapters(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChaptersBySubject"])(selectedSubject));
                        break;
                    case "topic":
                        if (selectedChapter) setTopics(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChapterTopics"])(selectedChapter));
                        break;
                }
            };
            await refreshData();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Content ${!currentState ? 'blocked' : 'unblocked'}`);
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to update status");
        } finally{
            setLoading(false);
        }
    };
    const refreshAll = async ()=>{
        try {
            setLoading(true);
            setPortions(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPortions"])());
            if (selectedPortion) setSubjects(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSubjectsByPortions"])(selectedPortion));
            if (selectedSubject) setChapters(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChaptersBySubject"])(selectedSubject));
            if (selectedChapter) setTopics(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchChapterTopics"])(selectedChapter));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Data refreshed");
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to refresh data");
        } finally{
            setLoading(false);
        }
    };
    const navigateBack = ()=>{
        if (activePanel === "topics") setActivePanel("chapters");
        else if (activePanel === "chapters") setActivePanel("subjects");
        else if (activePanel === "subjects") setActivePanel("portions");
    };
    // Get current path for display
    const getCurrentPath = ()=>{
        const path = [];
        if (selectedPortion) path.push(portions.find((p)=>p.id === selectedPortion)?.name);
        if (selectedSubject) path.push(subjects.find((s)=>s.id === selectedSubject)?.name);
        if (selectedChapter) path.push(chapters.find((c)=>c.id === selectedChapter)?.name);
        return path;
    };
    // Filtered data
    const filteredPortions = filterItems(portions);
    const filteredSubjects = filterItems(subjects);
    const filteredChapters = filterItems(chapters);
    const filteredTopics = filterItems(topics);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 max-w-6xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold",
                                children: "Content Manager"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Manage your learning materials"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: refreshAll,
                        disabled: loading,
                        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiRefreshCw"], {
                                className: loading ? "animate-spin" : ""
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            "Refresh"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 173,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 bg-white p-4 rounded shadow",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiSearch"], {
                                    className: "absolute left-3 top-3 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search...",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    className: "w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this),
                        activePanel !== "portions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: navigateBack,
                            className: "px-4 py-2 bg-gray-100 rounded hover:bg-gray-200",
                            children: "Back"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            getCurrentPath().length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 mb-4 text-sm text-gray-600",
                children: getCurrentPath().map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mx-1",
                                children: "/"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 217,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: item
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 218,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 216,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 214,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded shadow p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium mb-3 text-[#35095E]",
                                children: "Navigation"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActivePanel("portions"),
                                        className: `w-full text-left p-2 rounded text-white ${activePanel === "portions" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} `,
                                        children: [
                                            "Portions (",
                                            portions.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>selectedPortion && setActivePanel("subjects"),
                                        disabled: !selectedPortion,
                                        className: `w-full text-left p-2 rounded text-white ${activePanel === "subjects" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedPortion ? 'opacity-50' : ''}`,
                                        children: [
                                            "Subjects (",
                                            subjects.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                                        lineNumber: 236,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>selectedSubject && setActivePanel("chapters"),
                                        disabled: !selectedSubject,
                                        className: `w-full text-left p-2 rounded text-white ${activePanel === "chapters" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedSubject ? 'opacity-50' : ''}`,
                                        children: [
                                            "Chapters (",
                                            chapters.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>selectedChapter && setActivePanel("topics"),
                                        disabled: !selectedChapter,
                                        className: `w-full text-left p-2 rounded text-white ${activePanel === "topics" ? 'bg-blue-500 text-[#35095E]' : 'hover:bg-transparent hover:shadow hover:text-[#35095E]'} ${!selectedChapter ? 'opacity-50' : ''}`,
                                        children: [
                                            "Topics (",
                                            topics.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-3",
                        children: [
                            activePanel === "portions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentPanel, {
                                title: "Portions",
                                items: filteredPortions,
                                onSelect: handlePortionSelect,
                                onToggleBlock: (id, isPremium)=>toggleBlock("portion", id, isPremium),
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this),
                            activePanel === "subjects" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentPanel, {
                                title: "Subjects",
                                items: filteredSubjects,
                                onSelect: handleSubjectSelect,
                                onToggleBlock: (id, isPremium)=>toggleBlock("subject", id, isPremium),
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            activePanel === "chapters" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentPanel, {
                                title: "Chapters",
                                items: filteredChapters,
                                onSelect: handleChapterSelect,
                                onToggleBlock: (id, isPremium)=>toggleBlock("chapter", id, isPremium),
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            activePanel === "topics" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContentPanel, {
                                title: "Topics",
                                items: filteredTopics,
                                onToggleBlock: (id, isPremium)=>toggleBlock("topic", id, isPremium),
                                loading: loading,
                                gridView: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded shadow-lg flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiRefreshCw"], {
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Loading..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 307,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 306,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/blocks/page.jsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
};
_s(BlockContentPage, "8cPxU5oE29xNRTH1jnJfDG+ZtvM=");
_c = BlockContentPage;
// Content Panel Component
const ContentPanel = ({ title, items, onSelect, onToggleBlock, loading, gridView = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded shadow overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "font-medium text-[#35095E]",
                    children: [
                        title,
                        " (",
                        items.length,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: items.length > 0 ? gridView ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                    children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                            item: item,
                            onToggleBlock: onToggleBlock,
                            loading: loading
                        }, item.id, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 329,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 327,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center gap-4 p-3 hover:bg-gray-50 rounded",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                                    item: item,
                                    onToggleBlock: onToggleBlock,
                                    loading: loading
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 341,
                                    columnNumber: 19
                                }, this),
                                onSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onSelect(item.id),
                                    className: "px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100",
                                    children: "View"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 347,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 340,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 338,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-8 text-gray-500",
                    children: "No items found"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                    lineNumber: 359,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 324,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/blocks/page.jsx",
        lineNumber: 320,
        columnNumber: 5
    }, this);
};
_c1 = ContentPanel;
// Block Item Component
const BlockItem = ({ item, onToggleBlock, loading })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between flex-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "truncate",
                children: item.name
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 372,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onToggleBlock(item.id, item.isPremium),
                disabled: loading,
                className: `px-3 py-1 text-sm rounded ${item.isPremium ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} hover:opacity-80 disabled:opacity-50`,
                children: item.isPremium ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiX"], {
                            className: "inline mr-1"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 380,
                            columnNumber: 13
                        }, this),
                        " Blocked"
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCheck"], {
                            className: "inline mr-1"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 384,
                            columnNumber: 13
                        }, this),
                        " Unblocked"
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 373,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/blocks/page.jsx",
        lineNumber: 371,
        columnNumber: 5
    }, this);
};
_c2 = BlockItem;
const __TURBOPACK__default__export__ = BlockContentPage;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "BlockContentPage");
__turbopack_refresh__.register(_c1, "ContentPanel");
__turbopack_refresh__.register(_c2, "BlockItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/blocks/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_ffde24._.js.map