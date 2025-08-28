(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_admin_export_page_jsx_b5384b._.js", {

"[project]/src/app/admin/export/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ExportQuestionsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/utils/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/contexts/useAuth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
;
const Select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/app/admin/export/page.jsx -> " + "react-select"
        ]
    },
    ssr: false
});
_c = Select;
function ExportQuestionsPage() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(); // protect the page
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Data
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [allQuestions, setAllQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [subjects, setSubjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [topics, setTopics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [questionTypes, setQuestionTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Filters
    const [selectedSubject, setSelectedSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedChapter, setSelectedChapter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedTopic, setSelectedTopic] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedQuestionType, setSelectedQuestionType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // UI
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [downloading, setDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // token
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportQuestionsPage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setToken(localStorage.getItem("token"));
            }
        }
    }["ExportQuestionsPage.useEffect"], []);
    // fetch reference lists
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportQuestionsPage.useEffect": ()=>{
            const run = {
                "ExportQuestionsPage.useEffect.run": async ()=>{
                    if (!token) return;
                    setError(null);
                    try {
                        const [subjectRes, questionTypeRes] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/subjects`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }),
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/question-types`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            })
                        ]);
                        setSubjects(subjectRes.data.map({
                            "ExportQuestionsPage.useEffect.run": (s)=>({
                                    value: s.id,
                                    label: s.name
                                })
                        }["ExportQuestionsPage.useEffect.run"]));
                        setQuestionTypes(questionTypeRes.data.map({
                            "ExportQuestionsPage.useEffect.run": (q)=>({
                                    value: q.id,
                                    label: q.name
                                })
                        }["ExportQuestionsPage.useEffect.run"]));
                    } catch (e) {
                        console.error(e);
                        setError("Failed to load filters. Please try again.");
                    }
                }
            }["ExportQuestionsPage.useEffect.run"];
            run();
        }
    }["ExportQuestionsPage.useEffect"], [
        token
    ]);
    // fetch chapters when subject changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportQuestionsPage.useEffect": ()=>{
            const run = {
                "ExportQuestionsPage.useEffect.run": async ()=>{
                    if (!token) return;
                    // Reset dependent levels
                    setChapters([]);
                    setTopics([]);
                    setSelectedChapter(null);
                    setSelectedTopic(null);
                    if (!selectedSubject) return;
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/chapters/chapter/${selectedSubject.value}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setChapters(res.data.map({
                            "ExportQuestionsPage.useEffect.run": (c)=>({
                                    value: c.id,
                                    label: c.name
                                })
                        }["ExportQuestionsPage.useEffect.run"]));
                    } catch (e) {
                        console.error(e);
                        setChapters([]);
                    }
                }
            }["ExportQuestionsPage.useEffect.run"];
            run();
        }
    }["ExportQuestionsPage.useEffect"], [
        token,
        selectedSubject
    ]);
    // fetch topics when chapter changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportQuestionsPage.useEffect": ()=>{
            const run = {
                "ExportQuestionsPage.useEffect.run": async ()=>{
                    if (!token) return;
                    setTopics([]);
                    setSelectedTopic(null);
                    if (!selectedChapter) return;
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/topics/topic/${selectedChapter.value}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setTopics(res.data.map({
                            "ExportQuestionsPage.useEffect.run": (t)=>({
                                    value: t.id,
                                    label: t.name
                                })
                        }["ExportQuestionsPage.useEffect.run"]));
                    } catch (e) {
                        console.error(e);
                        setTopics([]);
                    }
                }
            }["ExportQuestionsPage.useEffect.run"];
            run();
        }
    }["ExportQuestionsPage.useEffect"], [
        token,
        selectedChapter
    ]);
    // fetch questions (pull all, filter client-side to mirror your other page)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExportQuestionsPage.useEffect": ()=>{
            const run = {
                "ExportQuestionsPage.useEffect.run": async ()=>{
                    if (!token) return;
                    setLoading(true);
                    setError(null);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/questions`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setAllQuestions(Array.isArray(res.data) ? res.data : []);
                    } catch (e) {
                        console.error(e);
                        setError("Failed to load questions.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["ExportQuestionsPage.useEffect.run"];
            run();
        }
    }["ExportQuestionsPage.useEffect"], [
        token
    ]);
    // filter
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExportQuestionsPage.useMemo[filtered]": ()=>{
            return allQuestions.filter({
                "ExportQuestionsPage.useMemo[filtered]": (q)=>{
                    const subjOK = !selectedSubject || `${q.subjectId ?? ""}` === `${selectedSubject.value}`;
                    const chapOK = !selectedChapter || `${q.chapterId ?? ""}` === `${selectedChapter.value}`;
                    const topicOK = !selectedTopic || `${q.topicId ?? ""}` === `${selectedTopic.value}`;
                    const typeOK = !selectedQuestionType || `${q.questionTypeId ?? ""}` === `${selectedQuestionType.value}`;
                    return subjOK && chapOK && topicOK && typeOK;
                }
            }["ExportQuestionsPage.useMemo[filtered]"]);
        }
    }["ExportQuestionsPage.useMemo[filtered]"], [
        allQuestions,
        selectedSubject,
        selectedChapter,
        selectedTopic,
        selectedQuestionType
    ]);
    // CSV helpers (only required columns)
    const escapeCsv = (val)=>{
        const s = (val ?? "").toString();
        return `"${s.replace(/"/g, '""')}"`; // always wrap & escape quotes
    };
    const buildCsv = (rows)=>{
        const headers = [
            "ID",
            "Question",
            "Option A",
            "Option B",
            "Option C",
            "Option D",
            "Correct",
            "Hint"
        ];
        const headerLine = headers.map(escapeCsv).join(",");
        const lines = rows.map((q)=>{
            return [
                q.id,
                q.question ?? "",
                q.optionA ?? "",
                q.optionB ?? "",
                q.optionC ?? "",
                q.optionD ?? "",
                q.correctOption ?? "",
                q.hint ?? ""
            ].map(escapeCsv).join(",");
        });
        // Add BOM for Excel compatibility
        return `\uFEFF${headerLine}\n${lines.join("\n")}`;
    };
    const slugify = (s)=>(s || "questions").toString().trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    // choose filename based on deepest selection:
    // Topic > Chapter > Subject; if none chosen but only Type is chosen, use Type; else "questions.csv"
    const getFileName = ()=>{
        let base = "questions";
        if (selectedTopic) base = selectedTopic.label;
        else if (selectedChapter) base = selectedChapter.label;
        else if (selectedSubject) base = selectedSubject.label;
        else if (selectedQuestionType && !selectedSubject && !selectedChapter && !selectedTopic) base = selectedQuestionType.label;
        return `${slugify(base)}.csv`;
    };
    const downloadCsv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ExportQuestionsPage.useCallback[downloadCsv]": ()=>{
            if (!filtered.length) return;
            setDownloading(true);
            try {
                const csv = buildCsv(filtered);
                const blob = new Blob([
                    csv
                ], {
                    type: "text/csv;charset=utf-8"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = getFileName();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } finally{
                setDownloading(false);
            }
        }
    }["ExportQuestionsPage.useCallback[downloadCsv]"], [
        filtered,
        selectedSubject,
        selectedChapter,
        selectedTopic,
        selectedQuestionType
    ]);
    const resetFilters = ()=>{
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedTopic(null);
        setSelectedQuestionType(null);
    };
    // react-select styles (matches your theme)
    const customStyles = {
        control: (provided, state)=>({
                ...provided,
                borderRadius: "10px",
                border: state.isFocused ? "2px solid #6F13C4" : "1px solid #ccc",
                boxShadow: state.isFocused ? "0 0 5px rgba(111, 19, 196, 0.5)" : "none",
                transition: "0.3s",
                backgroundColor: "#fff",
                fontWeight: "bold",
                padding: "10px",
                "&:hover": {
                    borderColor: "#51216E"
                }
            }),
        placeholder: (provided)=>({
                ...provided,
                color: "#6F13C4",
                fontSize: "15px",
                fontWeight: "bold"
            }),
        singleValue: (provided)=>({
                ...provided,
                color: "#35095E",
                fontWeight: "bold",
                fontSize: "16px"
            }),
        menu: (provided)=>({
                ...provided,
                borderRadius: "10px",
                backgroundColor: "#fff",
                padding: "5px",
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)"
            }),
        option: (provided, state)=>({
                ...provided,
                backgroundColor: state.isFocused ? "#6F13C4" : "#fff",
                color: state.isFocused ? "#fff" : "#333",
                padding: "12px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
                "&:active": {
                    backgroundColor: "#51216E"
                }
            })
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 md:px-4 max-w-7xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "Export Questions (CSV)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/admin/questions"),
                        className: "px-4 py-2 rounded-md bg-[#35095e] text-white hover:opacity-90",
                        children: "Back to Questions"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/export/page.jsx",
                lineNumber: 266,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        options: subjects,
                        value: selectedSubject,
                        onChange: (opt)=>setSelectedSubject(opt),
                        isClearable: true,
                        placeholder: "Subject",
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        options: chapters,
                        value: selectedChapter,
                        onChange: (opt)=>setSelectedChapter(opt),
                        isClearable: true,
                        isDisabled: !selectedSubject,
                        placeholder: !selectedSubject ? "Select subject first" : "Chapter",
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        options: topics,
                        value: selectedTopic,
                        onChange: (opt)=>setSelectedTopic(opt),
                        isClearable: true,
                        isDisabled: !selectedChapter,
                        placeholder: !selectedChapter ? "Select chapter first" : "Topic",
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        options: questionTypes,
                        value: selectedQuestionType,
                        onChange: (opt)=>setSelectedQuestionType(opt),
                        isClearable: true,
                        placeholder: "Question Type",
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/export/page.jsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: resetFilters,
                        className: "flex items-center gap-2 px-4 py-2 rounded-md bg-[#35095e2e] hover:bg-[#35095e4d] text-[#35095E]",
                        title: "Reset all filters",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSyncAlt"], {}, void 0, false, {
                                fileName: "[project]/src/app/admin/export/page.jsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            " Reset"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: downloading || loading || filtered.length === 0,
                        onClick: downloadCsv,
                        className: `flex items-center gap-2 px-4 py-2 rounded-md ${filtered.length === 0 || loading ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#35095E] text-white hover:opacity-90"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDownload"], {}, void 0, false, {
                                fileName: "[project]/src/app/admin/export/page.jsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            downloading ? "Preparing..." : `Download CSV (${getFileName()})`
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-600",
                        children: loading ? "Loading questions…" : `Ready: ${filtered.length.toLocaleString()} row(s)`
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/export/page.jsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/export/page.jsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-500 mb-4",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/admin/export/page.jsx",
                lineNumber: 343,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/export/page.jsx",
        lineNumber: 265,
        columnNumber: 5
    }, this);
}
_s(ExportQuestionsPage, "0qkmVL1d906q/nBrhaadZ8ewS58=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = ExportQuestionsPage;
var _c, _c1;
__turbopack_refresh__.register(_c, "Select");
__turbopack_refresh__.register(_c1, "ExportQuestionsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/export/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_admin_export_page_jsx_b5384b._.js.map