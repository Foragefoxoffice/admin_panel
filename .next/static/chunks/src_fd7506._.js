(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_fd7506._.js", {

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
    "updateBlockStatus": (()=>updateBlockStatus),
    "updateWrongQuestionReportStatus": (()=>updateWrongQuestionReportStatus)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "https://mitoslearning.in/api"
});
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>Promise.reject(error));
const fetchSubjects = async ()=>{
    try {
        const { data } = await API.get("/subjects"); // Directly return the data
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Propagate the error to the calling function
    }
};
const fetchPortions = async ()=>{
    try {
        const { data } = await API.get("/portions"); // Directly return the data
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Propagate the error to the calling function
    }
};
const fetchSubjectsByPortions = async (portionId)=>{
    try {
        const response = await API.get(`/subjects/subject/${portionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
    }
};
const fetchChaptersBySubject = async (subjectId)=>{
    try {
        const response = await API.get(`/chapters/chapter/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
    }
};
const fetchChapter = async (subjectId)=>{
    try {
        const response = await API.get(`/chapters/chapter/${subjectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
    }
};
const fetchChapterTopics = async (chapterId)=>{
    try {
        const response = await API.get(`/topics/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
    }
};
const fetchTopics = (chapterId)=>API.get(`/topics/topic/${chapterId}`);
const fetchQuestionType = ()=>API.get("/question-types");
const fetchQuestion = (topicId)=>API.get(`/questions?topicId=${topicId}`);
const fetchQuestions = (topics)=>{
    const topicIds = topics.join(","); // Ensure topics are serialized correctly
    return API.get(`/questions/topics?topicIds=${topicIds}`); // Use 'topicIds' here
};
const fetchQuestionsByTypes = (selectedQuestionTypes, chapterId)=>{
    const questionTypeIds = selectedQuestionTypes.join(","); // Ensure topics are serialized correctly
    return API.get(`/questions/questiontype?questionTypeIds=${questionTypeIds}&chapterId=${chapterId}`); // Use 'topicIds' here
};
const fetchFullTestQuestion = ()=>API.get(`/questions/fulltest`);
const fetchFullTestByPortion = (portionId)=>API.get(`/questions/portion/${portionId}`);
const fetchFullTestBySubject = (portionId, subjectId)=>API.get(`/questions/portion/${portionId}/subject/${subjectId}`);
const fetchFullTestByChapter = (portionId, subjectId, chapterId)=>API.get(`/questions/portion/${portionId}/subject/${subjectId}/chapter/${chapterId}`);
const fetchCustomTestQuestions = async (portionId, subjectId, chapterId, topicIds, questionCount)=>{
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
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
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.message || "Failed to fetch custom test questions");
    }
    return response.json();
};
const fetchResultByUser = (userId)=>API.get(`/tests/${userId}`);
const fetchLeaderBoard = async ()=>{
    try {
        const { data } = await API.get(`/tests/a`); // Use correct endpoint
        return data; // Directly return data
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};
const updateBlockStatus = async (type, id, isPremium)=>{
    try {
        const token = localStorage.getItem("token");
        const { data } = await API.post("/block", {
            type,
            id,
            isPremium
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
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
const __TURBOPACK__default__export__ = API;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/reports/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>WrongQuestionReportsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/utils/api.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/Notification'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
function WrongQuestionReportsPage() {
    _s();
    const [reports, setReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notification, setNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        show: false,
        message: "",
        type: "success"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WrongQuestionReportsPage.useEffect": ()=>{
            const fetchReports = {
                "WrongQuestionReportsPage.useEffect.fetchReports": async ()=>{
                    try {
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllWrongQuestionReports"])();
                        setReports(data);
                    } catch (err) {
                        setError("Failed to load reports. Please try again.");
                        console.error("Error fetching reports:", err);
                    } finally{
                        setLoading(false);
                    }
                }
            }["WrongQuestionReportsPage.useEffect.fetchReports"];
            fetchReports();
        }
    }["WrongQuestionReportsPage.useEffect"], []);
    const handleStatusUpdate = async (reportId, newStatus)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateWrongQuestionReportStatus"])(reportId, newStatus);
            // Update local state
            setReports((prev)=>prev.map((report)=>report.id === reportId ? {
                        ...report,
                        status: newStatus
                    } : report));
            setNotification({
                show: true,
                message: "Report status updated successfully",
                type: "success"
            });
        } catch (error) {
            console.error("Error updating report status:", error);
            setNotification({
                show: true,
                message: "Failed to update report status",
                type: "error"
            });
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container py-6",
            children: "Loading reports..."
        }, void 0, false, {
            fileName: "[project]/src/app/admin/reports/page.jsx",
            lineNumber: 57,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container py-6 text-red-500",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/app/admin/reports/page.jsx",
            lineNumber: 61,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-6",
                children: "Wrong Question Reports"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/reports/page.jsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            reports.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No reports found."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/reports/page.jsx",
                lineNumber: 69,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "bg-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "Question ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 76,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "Reason"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 77,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "Created At"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 px-4 border",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/reports/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/reports/page.jsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/reports/page.jsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: reports.map((report)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: report.id
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: report.questionId
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: report.reason
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded-full text-xs ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`,
                                                children: report.status
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/reports/page.jsx",
                                                lineNumber: 90,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 89,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: new Date(report.createdAt).toLocaleString()
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-2 px-4 border",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: report.status,
                                                    onChange: (e)=>handleStatusUpdate(report.id, e.target.value),
                                                    className: "border rounded p-1 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "pending",
                                                            children: "Pending"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                                            lineNumber: 108,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "resolved",
                                                            children: "Resolved"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                                            lineNumber: 109,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "rejected",
                                                            children: "Rejected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                                            lineNumber: 110,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/reports/page.jsx",
                                                    lineNumber: 103,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/reports/page.jsx",
                                                lineNumber: 102,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/reports/page.jsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, report.id, true, {
                                    fileName: "[project]/src/app/admin/reports/page.jsx",
                                    lineNumber: 85,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/reports/page.jsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/reports/page.jsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/reports/page.jsx",
                lineNumber: 71,
                columnNumber: 9
            }, this),
            notification.show && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Notification, {
                message: notification.message,
                type: notification.type,
                onClose: ()=>setNotification((prev)=>({
                            ...prev,
                            show: false
                        }))
            }, void 0, false, {
                fileName: "[project]/src/app/admin/reports/page.jsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/reports/page.jsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(WrongQuestionReportsPage, "CNOgs45F9pXIHNV4lK0cBsNw4nc=");
_c = WrongQuestionReportsPage;
var _c;
__turbopack_refresh__.register(_c, "WrongQuestionReportsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/reports/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_fd7506._.js.map