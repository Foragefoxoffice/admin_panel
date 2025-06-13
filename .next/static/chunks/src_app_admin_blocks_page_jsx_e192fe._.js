(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_admin_blocks_page_jsx_e192fe._.js", {

"[project]/src/app/admin/blocks/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/api/admin/api'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
const BlockContentPage = ()=>{
    _s();
    const [portions, setPortions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPortion, setSelectedPortion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subjects, setSubjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chapters, setChapters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [topics, setTopics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlockContentPage.useEffect": ()=>{
            fetchPortions().then(setPortions);
        }
    }["BlockContentPage.useEffect"], []);
    const handlePortionSelect = async (portionId)=>{
        setSelectedPortion(portionId);
        const subs = await fetchSubjectsByPortions(portionId);
        setSubjects(subs);
        setChapters([]);
        setTopics([]);
    };
    const handleSubjectSelect = async (subjectId)=>{
        const chaps = await fetchChaptersBySubject(subjectId);
        setChapters(chaps);
        setTopics([]);
    };
    const handleChapterSelect = async (chapterId)=>{
        const tops = await fetchChapterTopics(chapterId);
        setTopics(tops);
    };
    const toggleBlock = async (type, id, currentState)=>{
        try {
            setLoading(true);
            await updateBlockStatus(type, id, !currentState);
            // Refresh the data
            if (type === "portion") fetchPortions().then(setPortions);
            if (type === "subject") handlePortionSelect(selectedPortion);
            if (type === "chapter") handleSubjectSelect(subjects.find((s)=>s.id === id)?.id);
            if (type === "topic") handleChapterSelect(chapters.find((c)=>c.id === id)?.id);
        } catch (error) {
            console.error("Toggle error:", error);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-4",
                children: "Block/Unblock Content"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "font-medium",
                        children: "Select Portion:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        onChange: (e)=>handlePortionSelect(Number(e.target.value)),
                        className: "border ml-2 px-2 py-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "--Select--"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/blocks/page.jsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            portions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: p.id,
                                    children: p.name
                                }, p.id, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            portions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold",
                        children: "Portions"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this),
                    portions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                            label: p.name,
                            isPremium: p.isPremium,
                            onToggle: ()=>toggleBlock("portion", p.id, p.isPremium)
                        }, p.id, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            subjects.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold",
                        children: "Subjects"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    subjects.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                                    label: s.name,
                                    isPremium: s.isPremium,
                                    onToggle: ()=>toggleBlock("subject", s.id, s.isPremium)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 96,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSubjectSelect(s.id),
                                    className: "text-sm text-blue-600 underline ml-2",
                                    children: "Load Chapters"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 101,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, s.id, true, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 95,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            chapters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold",
                        children: "Chapters"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this),
                    chapters.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                                    label: c.name,
                                    isPremium: c.isPremium,
                                    onToggle: ()=>toggleBlock("chapter", c.id, c.isPremium)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleChapterSelect(c.id),
                                    className: "text-sm text-blue-600 underline ml-2",
                                    children: "Load Topics"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/blocks/page.jsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, c.id, true, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 116,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 113,
                columnNumber: 9
            }, this),
            topics.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold",
                        children: "Topics"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/blocks/page.jsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    topics.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockItem, {
                            label: t.name,
                            isPremium: t.isPremium,
                            onToggle: ()=>toggleBlock("topic", t.id, t.isPremium)
                        }, t.id, false, {
                            fileName: "[project]/src/app/admin/blocks/page.jsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 mt-4",
                children: "Updating..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 147,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/blocks/page.jsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
};
_s(BlockContentPage, "aaPiSk3/vp1wwFscE5CUPT/X7Zo=");
_c = BlockContentPage;
const BlockItem = ({ label, isPremium, onToggle })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4 py-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 154,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                className: `px-3 py-1 text-sm rounded ${isPremium ? "bg-red-500 text-white" : "bg-green-500 text-white"}`,
                children: isPremium ? "Blocked (Premium)" : "Unblocked (Free)"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/blocks/page.jsx",
                lineNumber: 155,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/blocks/page.jsx",
        lineNumber: 153,
        columnNumber: 3
    }, this);
_c1 = BlockItem;
const __TURBOPACK__default__export__ = BlockContentPage;
var _c, _c1;
__turbopack_refresh__.register(_c, "BlockContentPage");
__turbopack_refresh__.register(_c1, "BlockItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/blocks/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_admin_blocks_page_jsx_e192fe._.js.map