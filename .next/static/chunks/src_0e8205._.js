(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_0e8205._.js", {

"[project]/src/contexts/FormulaFormatter.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
const FormulaFormatter = ({ text, className = "" })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `preview ${className}`,
        dangerouslySetInnerHTML: {
            __html: text
        }
    }, void 0, false, {
        fileName: "[project]/src/contexts/FormulaFormatter.js",
        lineNumber: 8,
        columnNumber: 5
    }, this);
};
_c = FormulaFormatter;
const __TURBOPACK__default__export__ = FormulaFormatter;
var _c;
__turbopack_refresh__.register(_c, "FormulaFormatter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/questions/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>QuestionsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TestContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/contexts/TestContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/utils/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/contexts/FormulaFormatter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/lodash/debounce.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/contexts/useAuth.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$react$2d$mathjax$2f$esm$2f$MathJaxContext$2f$MathJaxContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MathJaxContext$3e$__ = __turbopack_import__("[project]/node_modules/better-react-mathjax/esm/MathJaxContext/MathJaxContext.js [app-client] (ecmascript) <export default as MathJaxContext>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$react$2d$mathjax$2f$esm$2f$MathJax$2f$MathJax$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MathJax$3e$__ = __turbopack_import__("[project]/node_modules/better-react-mathjax/esm/MathJax/MathJax.js [app-client] (ecmascript) <export default as MathJax>");
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
;
;
;
;
const Select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/app/admin/questions/page.jsx -> " + "react-select"
        ]
    },
    ssr: false
});
_c = Select;
function QuestionsPage() {
    _s();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [topics, setTopics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [portions, setPortions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [subjects, setSubjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [questionTypes, setQuestionTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const { setTestData, testData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$TestContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TestContext"]);
    // Initialize all filter states as null
    const [selectedTopic, setSelectedTopic] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedPortion, setSelectedPortion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedSubject, setSelectedSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedChapter, setSelectedChapter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedQuestionType, setSelectedQuestionType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openAccordion, setOpenAccordion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [questionsPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(20);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    // Fetch token from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                setToken(localStorage.getItem("token"));
            }
        }
    }["QuestionsPage.useEffect"], []);
    // Function to reset pagination to page 1
    const resetPagination = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionsPage.useCallback[resetPagination]": ()=>{
            setCurrentPage(1);
            router.push(`/admin/questions?page=1`, undefined, {
                shallow: true
            });
        }
    }["QuestionsPage.useCallback[resetPagination]"], [
        router
    ]);
    // Initialize filters from testData after data is loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            if (testData?.filters && subjects.length > 0 && questionTypes.length > 0) {
                const filters = testData.filters;
                if (filters.selectedSubject && subjects.some({
                    "QuestionsPage.useEffect": (s)=>s.value.toString() === filters.selectedSubject.toString()
                }["QuestionsPage.useEffect"])) {
                    setSelectedSubject(filters.selectedSubject);
                }
                if (filters.selectedQuestionType && questionTypes.some({
                    "QuestionsPage.useEffect": (qt)=>qt.value.toString() === filters.selectedQuestionType.toString()
                }["QuestionsPage.useEffect"])) {
                    setSelectedQuestionType(filters.selectedQuestionType);
                }
                if (filters.selectedPortion) {
                    setSelectedPortion(filters.selectedPortion);
                }
            }
        }
    }["QuestionsPage.useEffect"], [
        testData?.filters,
        subjects,
        questionTypes
    ]);
    // Initialize chapter and topic filters after they're loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            if (testData?.filters && chapters.length > 0) {
                const filters = testData.filters;
                if (filters.selectedChapter && chapters.some({
                    "QuestionsPage.useEffect": (c)=>c.value.toString() === filters.selectedChapter.toString()
                }["QuestionsPage.useEffect"])) {
                    setSelectedChapter(filters.selectedChapter);
                }
            }
        }
    }["QuestionsPage.useEffect"], [
        testData?.filters,
        chapters
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            if (testData?.filters && topics.length > 0) {
                const filters = testData.filters;
                if (filters.selectedTopic && topics.some({
                    "QuestionsPage.useEffect": (t)=>t.value.toString() === filters.selectedTopic.toString()
                }["QuestionsPage.useEffect"])) {
                    setSelectedTopic(filters.selectedTopic);
                }
            }
        }
    }["QuestionsPage.useEffect"], [
        testData?.filters,
        topics
    ]);
    // Fetch initial filters (portions, subjects, question types)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            const fetchFilters = {
                "QuestionsPage.useEffect.fetchFilters": async ()=>{
                    try {
                        if (!token) return;
                        const [portionRes, subjectRes, questionTypeRes] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/portions`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }),
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
                        setPortions(portionRes.data.map({
                            "QuestionsPage.useEffect.fetchFilters": (p)=>({
                                    value: p.id,
                                    label: p.name
                                })
                        }["QuestionsPage.useEffect.fetchFilters"]));
                        setSubjects(subjectRes.data.map({
                            "QuestionsPage.useEffect.fetchFilters": (s)=>({
                                    value: s.id,
                                    label: s.name,
                                    portion: s.portion?.name || 'No portion'
                                })
                        }["QuestionsPage.useEffect.fetchFilters"]));
                        setQuestionTypes(questionTypeRes.data.map({
                            "QuestionsPage.useEffect.fetchFilters": (qt)=>({
                                    value: qt.id,
                                    label: qt.name
                                })
                        }["QuestionsPage.useEffect.fetchFilters"]));
                    } catch (error) {
                        console.error("Failed to fetch filters:", error);
                        setError("Failed to fetch filters.");
                    }
                }
            }["QuestionsPage.useEffect.fetchFilters"];
            fetchFilters();
        }
    }["QuestionsPage.useEffect"], [
        token
    ]);
    // Debounced fetch chapters
    const debouncedFetchChapters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lodash$2f$debounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "QuestionsPage.useCallback[debouncedFetchChapters]": async (subjectId)=>{
            try {
                if (!token || !subjectId) {
                    setChapters([]);
                    setSelectedChapter(null);
                    setSelectedTopic(null);
                    return;
                }
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/chapters/chapter/${subjectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const chaptersData = response.data.map({
                    "QuestionsPage.useCallback[debouncedFetchChapters].chaptersData": (c)=>({
                            value: c.id,
                            label: c.name
                        })
                }["QuestionsPage.useCallback[debouncedFetchChapters].chaptersData"]);
                setChapters(chaptersData);
            } catch (error) {
                console.error("Failed to fetch chapters:", error);
                setChapters([]);
            }
        }
    }["QuestionsPage.useCallback[debouncedFetchChapters]"], 500), [
        token
    ]);
    // Fetch chapters based on selected subject
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            if (selectedSubject) {
                debouncedFetchChapters(selectedSubject);
            } else {
                setChapters([]);
                setSelectedChapter(null);
                setSelectedTopic(null);
            }
        }
    }["QuestionsPage.useEffect"], [
        selectedSubject,
        debouncedFetchChapters
    ]);
    // Fetch topics based on selected chapter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            const fetchTopics = {
                "QuestionsPage.useEffect.fetchTopics": async ()=>{
                    try {
                        if (!token || !selectedChapter) {
                            setTopics([]);
                            setSelectedTopic(null);
                            return;
                        }
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/topics/topic/${selectedChapter}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setTopics(response.data.map({
                            "QuestionsPage.useEffect.fetchTopics": (t)=>({
                                    value: t.id,
                                    label: t.name,
                                    isPremium: t.isPremium
                                })
                        }["QuestionsPage.useEffect.fetchTopics"]));
                    } catch (error) {
                        console.error("Failed to fetch topics:", error);
                        setTopics([]);
                    }
                }
            }["QuestionsPage.useEffect.fetchTopics"];
            fetchTopics();
        }
    }["QuestionsPage.useEffect"], [
        selectedChapter,
        token
    ]);
    // Fetch questions
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            const fetchQuestions = {
                "QuestionsPage.useEffect.fetchQuestions": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        if (!token) return;
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/questions`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setQuestions(response.data);
                    } catch (error) {
                        console.error("Failed to fetch questions:", error);
                        setError("Failed to fetch questions.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["QuestionsPage.useEffect.fetchQuestions"];
            fetchQuestions();
        }
    }["QuestionsPage.useEffect"], [
        token
    ]);
    // Filter questions based on selected filters and search term
    const filteredQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "QuestionsPage.useMemo[filteredQuestions]": ()=>{
            return questions.filter({
                "QuestionsPage.useMemo[filteredQuestions]": (question)=>{
                    // Convert all IDs to strings for consistent comparison
                    const qPortion = question.portionId?.toString() || '';
                    const qSubject = question.subjectId?.toString() || '';
                    const qChapter = question.chapterId?.toString() || '';
                    const qTopic = question.topicId?.toString() || '';
                    const qType = question.questionTypeId?.toString() || '';
                    const filterPortion = selectedPortion?.toString() || '';
                    const filterSubject = selectedSubject?.toString() || '';
                    const filterChapter = selectedChapter?.toString() || '';
                    const filterTopic = selectedTopic?.toString() || '';
                    const filterType = selectedQuestionType?.toString() || '';
                    // Search term matching logic
                    const matchesSearchTerm = searchTerm === '' || question.id.toString().includes(searchTerm.toLowerCase()) || question.question.toLowerCase().includes(searchTerm.toLowerCase()) || question.subject?.name && question.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || question.chapter?.name && question.chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) || question.topic?.name && question.topic.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return (!selectedPortion || qPortion === filterPortion) && (!selectedSubject || qSubject === filterSubject) && (!selectedChapter || qChapter === filterChapter) && (!selectedTopic || qTopic === filterTopic) && (!selectedQuestionType || qType === filterType) && matchesSearchTerm;
                }
            }["QuestionsPage.useMemo[filteredQuestions]"]);
        }
    }["QuestionsPage.useMemo[filteredQuestions]"], [
        questions,
        selectedPortion,
        selectedSubject,
        selectedChapter,
        selectedTopic,
        selectedQuestionType,
        searchTerm
    ]);
    // Delete Question
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionsPage.useCallback[handleDelete]": async (id)=>{
            if (!window.confirm("Are you sure you want to delete this question?")) return;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/questions/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuestions(questions.filter({
                    "QuestionsPage.useCallback[handleDelete]": (q)=>q.id !== id
                }["QuestionsPage.useCallback[handleDelete]"]));
            } catch (error) {
                console.error("Failed to delete question:", error);
                alert("Failed to delete question.");
            }
        }
    }["QuestionsPage.useCallback[handleDelete]"], [
        token,
        questions
    ]);
    // Update Question (Redirect to Update Form)
    const handleUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionsPage.useCallback[handleUpdate]": (id)=>{
            const Data = {
                QuestionId: id,
                returnPage: currentPage || 1,
                filters: {
                    selectedPortion,
                    selectedSubject,
                    selectedChapter,
                    selectedTopic,
                    selectedQuestionType
                }
            };
            setTestData(Data);
            router.push(`/admin/edit/`);
        }
    }["QuestionsPage.useCallback[handleUpdate]"], [
        setTestData,
        router,
        currentPage,
        selectedPortion,
        selectedSubject,
        selectedChapter,
        selectedTopic,
        selectedQuestionType
    ]);
    // Pagination Logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    // Initialize page from URL on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuestionsPage.useEffect": ()=>{
            const pageParam = searchParams.get('page');
            if (pageParam && !isNaN(pageParam)) {
                setCurrentPage(Number(pageParam));
            }
        }
    }["QuestionsPage.useEffect"], [
        searchParams
    ]);
    // Update URL when paginating
    const paginate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuestionsPage.useCallback[paginate]": (pageNumber)=>{
            setCurrentPage(pageNumber);
            router.push(`/admin/questions?page=${pageNumber}`, undefined, {
                shallow: true
            });
        }
    }["QuestionsPage.useCallback[paginate]"], [
        router
    ]);
    // Pagination component
    const Pagination = ()=>{
        const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
        if (totalPages <= 1) return null;
        const getPageNumbers = ()=>{
            const pages = [];
            const maxVisiblePages = 5;
            let startPage, endPage;
            if (totalPages <= maxVisiblePages) {
                startPage = 1;
                endPage = totalPages;
            } else {
                const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
                const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
                if (currentPage <= maxPagesBeforeCurrent) {
                    startPage = 1;
                    endPage = maxVisiblePages;
                } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                    startPage = totalPages - maxVisiblePages + 1;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - maxPagesBeforeCurrent;
                    endPage = currentPage + maxPagesAfterCurrent;
                }
            }
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }
            for(let i = startPage; i <= endPage; i++){
                pages.push(i);
            }
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
            return pages;
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center mt-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Pagination",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "flex items-center space-x-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>paginate(Math.max(1, currentPage - 1)),
                                disabled: currentPage === 1,
                                "aria-label": "Previous page",
                                className: `px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"}`,
                                children: "<"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 348,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 347,
                            columnNumber: 13
                        }, this),
                        getPageNumbers().map((number, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: number === '...' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-3 py-1",
                                    "aria-hidden": "true",
                                    children: "..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                    lineNumber: 365,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>paginate(number),
                                    "aria-current": currentPage === number ? "page" : undefined,
                                    "aria-label": `Page ${number}`,
                                    className: `px-3 py-1 rounded-md ${currentPage === number ? "bg-[#35095e] text-white" : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"}`,
                                    children: number
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                    lineNumber: 367,
                                    columnNumber: 19
                                }, this)
                            }, index, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 363,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>paginate(Math.min(totalPages, currentPage + 1)),
                                disabled: currentPage === totalPages,
                                "aria-label": "Next page",
                                className: `px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-[#35095e2e] text-gray-700 hover:bg-[#35095e4d]"}`,
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 384,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 383,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 346,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/questions/page.jsx",
                lineNumber: 345,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/questions/page.jsx",
            lineNumber: 344,
            columnNumber: 7
        }, this);
    };
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$react$2d$mathjax$2f$esm$2f$MathJaxContext$2f$MathJaxContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MathJaxContext$3e$__["MathJaxContext"], {
        config: {
            loader: {
                load: [
                    "input/tex",
                    "output/chtml"
                ]
            },
            tex: {
                packages: {
                    '[+]': [
                        'color',
                        'mhchem'
                    ]
                },
                inlineMath: [
                    [
                        '$',
                        '$'
                    ],
                    [
                        '\\(',
                        '\\)'
                    ]
                ],
                displayMath: [
                    [
                        '$$',
                        '$$'
                    ],
                    [
                        '\\[',
                        '\\]'
                    ]
                ]
            }
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 md:px-4 max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "font-bold mb-6",
                    children: "Questions"
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 461,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search by ID, question, subject, chapter, or topic...",
                                className: "w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-[#6F13C4] focus:ring-2 focus:ring-[#6F13C4] transition-all",
                                value: searchTerm,
                                onChange: (e)=>{
                                    setSearchTerm(e.target.value.toLowerCase());
                                    resetPagination();
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 466,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSearch"], {
                                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/questions/page.jsx",
                        lineNumber: 465,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 464,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                            options: subjects.map((s)=>({
                                    value: s.value,
                                    label: `${s.label} (${s.portion})`
                                })),
                            value: subjects.find((s)=>s.value.toString() === selectedSubject?.toString()) || null,
                            onChange: (option)=>{
                                setSelectedSubject(option?.value || null);
                                setSelectedChapter(null);
                                setSelectedTopic(null);
                                resetPagination();
                            },
                            placeholder: "Select Subject",
                            isClearable: true,
                            styles: customStyles
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 482,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                            options: chapters,
                            value: chapters.find((c)=>c.value.toString() === selectedChapter?.toString()) || null,
                            onChange: (option)=>{
                                setSelectedChapter(option?.value || null);
                                setSelectedTopic(null);
                                resetPagination();
                            },
                            placeholder: !selectedSubject ? "Select subject first" : chapters.length === 0 ? "No chapters available" : "Select Chapter",
                            isClearable: true,
                            isDisabled: !selectedSubject,
                            styles: customStyles
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 498,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                            options: topics,
                            value: topics.find((t)=>t.value.toString() === selectedTopic?.toString()) || null,
                            onChange: (option)=>{
                                setSelectedTopic(option?.value || null);
                                resetPagination();
                            },
                            placeholder: !selectedChapter ? "Select chapter first" : topics.length === 0 ? "No topics available" : "Select Topic",
                            isClearable: true,
                            isDisabled: !selectedChapter,
                            styles: customStyles
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 511,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                            options: questionTypes,
                            value: questionTypes.find((qt)=>qt.value.toString() === selectedQuestionType?.toString()) || null,
                            onChange: (option)=>{
                                setSelectedQuestionType(option?.value || null);
                                resetPagination();
                            },
                            placeholder: "Select Question Type",
                            isClearable: true,
                            styles: customStyles
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/questions/page.jsx",
                            lineNumber: 523,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 481,
                    columnNumber: 7
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center h-40",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading questions..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/questions/page.jsx",
                        lineNumber: 539,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 538,
                    columnNumber: 9
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500 text-center",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 542,
                    columnNumber: 9
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: currentQuestions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-4",
                        children: currentQuestions.map((question, index)=>{
                            const serialNumber = (currentPage - 1) * questionsPerPage + index + 1;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$react$2d$mathjax$2f$esm$2f$MathJax$2f$MathJax$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MathJax$3e$__["MathJax"], {
                                dynamic: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "border rounded-lg shadow-sm transition-shadow",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 flex justify-between items-start cursor-pointer bg-[#35095e20] hover:bg-[#35095e2e]",
                                            onClick: ()=>setOpenAccordion((prev)=>prev === question.id ? null : question.id),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600 font-bold pt-1",
                                                            children: [
                                                                serialNumber,
                                                                "."
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 558,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "font-bold text-lg",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        text: question.question
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                        lineNumber: 560,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 560,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-500 mt-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "ID: ",
                                                                                question.id
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                            lineNumber: 562,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        question.subject?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                " | Subject: ",
                                                                                question.subject.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                            lineNumber: 563,
                                                                            columnNumber: 56
                                                                        }, this),
                                                                        question.chapter?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                " | Chapter: ",
                                                                                question.chapter.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                            lineNumber: 564,
                                                                            columnNumber: 56
                                                                        }, this),
                                                                        question.topic?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                " | Topic: ",
                                                                                question.topic.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                            lineNumber: 565,
                                                                            columnNumber: 54
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 561,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 559,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 557,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-600",
                                                    children: openAccordion === question.id ? "▲" : "▼"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 569,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                            lineNumber: 553,
                                            columnNumber: 21
                                        }, this),
                                        openAccordion === question.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-white border-t",
                                            children: [
                                                question.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    alt: "",
                                                    src: `https://mitoslearning.in/${question.image}`,
                                                    className: "mb-4 max-w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 574,
                                                    columnNumber: 44
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Option A:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    text: question.optionA
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 577,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 576,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Option B:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 579,
                                                                    columnNumber: 30
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    text: question.optionB
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 579,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 579,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Option C:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 30
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    text: question.optionC
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 580,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Option D:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 581,
                                                                    columnNumber: 30
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    text: question.optionD
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 581,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 581,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-green-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Correct Answer:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 582,
                                                                    columnNumber: 57
                                                                }, this),
                                                                " ",
                                                                question.correctOption
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 582,
                                                            columnNumber: 27
                                                        }, this),
                                                        question.hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Hint:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 583,
                                                                    columnNumber: 67
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$FormulaFormatter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    className: "ProseMirror min-h-10 p-0",
                                                                    text: question.hint
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 583,
                                                                    columnNumber: 90
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 583,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 575,
                                                    columnNumber: 25
                                                }, this),
                                                question.hintImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    alt: "",
                                                    src: `https://mitoslearning.in/${question.hintImage}`,
                                                    className: "mt-4 max-w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 586,
                                                    columnNumber: 48
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-end mt-4 space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleUpdate(question.id),
                                                            className: "bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-blue-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEdit"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 593,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white",
                                                                    children: "Edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 593,
                                                                    columnNumber: 40
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 589,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDelete(question.id),
                                                            className: "bg-red-500 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-red-600",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrash"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 599,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-white",
                                                                    children: "Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                                    lineNumber: 599,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                                            lineNumber: 595,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                                    lineNumber: 588,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/questions/page.jsx",
                                            lineNumber: 573,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, question.id, true, {
                                    fileName: "[project]/src/app/admin/questions/page.jsx",
                                    lineNumber: 552,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/questions/page.jsx",
                                lineNumber: 551,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/questions/page.jsx",
                        lineNumber: 546,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-center",
                        children: "No questions match the selected filters."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/questions/page.jsx",
                        lineNumber: 610,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 544,
                    columnNumber: 9
                }, this),
                filteredQuestions.length > questionsPerPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pagination, {}, void 0, false, {
                    fileName: "[project]/src/app/admin/questions/page.jsx",
                    lineNumber: 616,
                    columnNumber: 55
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/questions/page.jsx",
            lineNumber: 460,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/questions/page.jsx",
        lineNumber: 452,
        columnNumber: 5
    }, this);
}
_s(QuestionsPage, "xBV7Nzem4sYwssgyznLLcY+394g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$useAuth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c1 = QuestionsPage;
var _c, _c1;
__turbopack_refresh__.register(_c, "Select");
__turbopack_refresh__.register(_c1, "QuestionsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/questions/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_0e8205._.js.map