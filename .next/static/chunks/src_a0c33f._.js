(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_a0c33f._.js", {

"[project]/src/utils/config.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "API_BASE_URL": (()=>API_BASE_URL)
});
const API_BASE_URL = "https://mitoslearning.in/api";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/types/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/utils/config.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/bi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/hi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
// Dynamically import react-select with SSR disabled
const Select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/app/admin/types/page.jsx -> " + "react-select"
        ]
    },
    ssr: false
});
_c = Select;
const UploadPage = ()=>{
    _s();
    const [selectedType, setSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [parentId, setParentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [parentOptions, setParentOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredData, setFilteredData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterType, setFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("questionType");
    const [editingItem, setEditingItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFilterVisible, setIsFilterVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    useAuth();
    const handleHamburgerClick = ()=>{
        setIsFilterVisible(!isFilterVisible);
    };
    const handleFilterClick = (filter)=>{
        setFilterType(filter);
    };
    const fetchParentData = async (type)=>{
        const endpoint = `https://mitoslearning.in/api/${type}/`;
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Failed to fetch ${type}`);
            const data = await response.json();
            setParentOptions(data.map((item)=>({
                    value: item.id.toString(),
                    label: item.name
                })));
        } catch (error) {
            setMessage(`Error fetching ${type}: ${error.message}`);
        }
    };
    const fetchData = async ()=>{
        setLoading(true);
        const endpoints = {
            questionType: "question-types",
            subject: "subjects",
            portion: "portions",
            chapter: "chapters",
            topic: "topics"
        };
        if (endpoints[filterType]) {
            try {
                const response = await fetch(`https://mitoslearning.in/api/${endpoints[filterType]}`);
                if (!response.ok) throw new Error(`Failed to fetch ${filterType}`);
                const data = await response.json();
                if ([
                    "chapter",
                    "topic",
                    "subject"
                ].includes(filterType)) {
                    const parentEndpoint = filterType === "chapter" ? "subjects" : filterType === "topic" ? "chapters" : "portions";
                    const parentResponse = await fetch(`https://mitoslearning.in/api/${parentEndpoint}`);
                    if (!parentResponse.ok) throw new Error(`Failed to fetch parent data`);
                    const parentData = await parentResponse.json();
                    console.log("Item Data:", data);
                    console.log("Parent Data:", parentData);
                    const dataWithParents = data.map((item)=>{
                        let parent;
                        if (filterType === "chapter") {
                            parent = parentData.find((p)=>p.id === item.subjectId);
                        } else if (filterType === "topic") {
                            parent = parentData.find((p)=>p.id === item.chapterId);
                        } else if (filterType === "subject") {
                            parent = parentData.find((p)=>p.id === item.portion.id);
                        }
                        return {
                            ...item,
                            parentName: parent ? parent.name : "Unknown"
                        };
                    });
                    setData(dataWithParents);
                    setFilteredData(dataWithParents);
                } else {
                    setData(data);
                    setFilteredData(data);
                }
            } catch (error) {
                setMessage(`Error fetching data: ${error.message}`);
            } finally{
                setLoading(false);
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadPage.useEffect": ()=>{
            if (filterType) {
                fetchData();
            }
        }
    }["UploadPage.useEffect"], [
        filterType
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadPage.useEffect": ()=>{
            setSelectedType(null);
            setParentId(null);
            setName("");
            setParentOptions([]);
            setSearchQuery("");
            setMessage("");
        }
    }["UploadPage.useEffect"], [
        filterType
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UploadPage.useEffect": ()=>{
            if (searchQuery) {
                setFilteredData(data.filter({
                    "UploadPage.useEffect": (item)=>item.name.toLowerCase().includes(searchQuery.toLowerCase())
                }["UploadPage.useEffect"]));
            } else {
                setFilteredData(data);
            }
        }
    }["UploadPage.useEffect"], [
        searchQuery,
        data
    ]);
    const handleTypeChange = async (selected)=>{
        setSelectedType(selected);
        setParentId(null);
        setParentOptions([]);
        if (selected?.value === "chapter") await fetchParentData("subjects");
        else if (selected?.value === "topic") await fetchParentData("chapters");
        else if (selected?.value === "subject") await fetchParentData("portions");
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setMessage("");
        setLoading(true);
        if (!parentId && (selectedType?.value === "chapter" || selectedType?.value === "topic" || selectedType?.value === "subject")) {
            setMessage("Please select a parent!");
            setLoading(false);
            return;
        }
        let endpoint = "";
        let payload = {};
        switch(selectedType?.value){
            case "questionType":
                endpoint = "https://mitoslearning.in/api/question-types/";
                payload = {
                    name
                };
                break;
            case "subject":
                endpoint = "https://mitoslearning.in/api/subjects/";
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            case "portion":
                endpoint = "https://mitoslearning.in/api/portions/";
                payload = {
                    name
                };
                break;
            case "chapter":
                endpoint = "https://mitoslearning.in/api/chapters/";
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            case "topic":
                endpoint = "https://mitoslearning.in/api/topics/";
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            default:
                setLoading(false);
                return;
        }
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Failed to upload data for ${selectedType?.value}`);
            setMessage("Data uploaded successfully!");
        } catch (error) {
            setMessage(`Error uploading data: ${error.message}`);
        } finally{
            setLoading(false);
        }
    };
    const handleEdit = async (item)=>{
        setEditingItem(item);
        setName(item.name);
        setSelectedType({
            value: filterType,
            label: filterType.charAt(0).toUpperCase() + filterType.slice(1)
        });
        if (filterType === "subject") {
            await fetchParentData("portions");
            setParentId({
                value: item.portionId.toString(),
                label: item.parentName
            });
        } else if (filterType === "chapter") {
            await fetchParentData("subjects");
            setParentId({
                value: item.subjectId.toString(),
                label: item.parentName
            });
        } else if (filterType === "topic") {
            await fetchParentData("chapters");
            setParentId({
                value: item.chapterId.toString(),
                label: item.parentName
            });
        } else {
            setParentId(null);
        }
    };
    const handleDelete = async (id, filterType)=>{
        const type = {
            questionType: "question-types",
            subject: "subjects",
            portion: "portions",
            chapter: "chapters",
            topic: "topics"
        };
        console.log("Filter Type:", filterType); // Debugging: Log the filterType
        const endpointType = type[filterType];
        if (!endpointType) {
            setMessage(`Invalid item type for deletion: ${filterType}`);
            return;
        }
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const endpoint = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$config$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/${endpointType}/${id}`;
                const response = await fetch(endpoint, {
                    method: "DELETE"
                });
                if (!response.ok) throw new Error(`Failed to delete ${filterType}`);
                setMessage("Item deleted successfully!");
                fetchData();
            } catch (error) {
                setMessage(`Error deleting item: ${error.message}`);
            }
        }
    };
    const handleUpdate = async (e)=>{
        e.preventDefault();
        setMessage("");
        setLoading(true);
        if (!parentId && (selectedType?.value === "chapter" || selectedType?.value === "topic" || selectedType?.value === "subject")) {
            setMessage("Please select a parent!");
            setLoading(false);
            return;
        }
        let endpoint = "";
        let payload = {};
        switch(selectedType?.value){
            case "questionType":
                endpoint = `https://mitoslearning.in/api/question-types/${editingItem.id}`;
                payload = {
                    name
                };
                break;
            case "portion":
                endpoint = `https://mitoslearning.in/api/portions/${editingItem.id}`;
                payload = {
                    name
                };
                break;
            case "subject":
                endpoint = `https://mitoslearning.in/api/subjects/${editingItem.id}`;
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            case "chapter":
                endpoint = `https://mitoslearning.in/api/chapters/${editingItem.id}`;
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            case "topic":
                endpoint = `https://mitoslearning.in/api/topics/${editingItem.id}`;
                payload = {
                    name,
                    parentId: parseInt(parentId.value, 10)
                };
                break;
            default:
                setLoading(false);
                return;
        }
        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Failed to update data for ${selectedType?.value}`);
            setMessage("Data updated successfully!");
            setEditingItem(null);
            setName("");
        } catch (error) {
            setMessage(`Error updating data: ${error.message}`);
        } finally{
            setLoading(false);
            fetchData();
        }
    };
    const customStyles = {
        control: (provided)=>({
                ...provided,
                borderRadius: "8px",
                width: "100%",
                border: "1px solid #ccc",
                boxShadow: "none",
                fontWeight: "bold",
                padding: "17px",
                transition: "0.3s",
                "&:hover": {
                    borderColor: "#51216E"
                }
            }),
        placeholder: (provided)=>({
                ...provided,
                color: "#888",
                fontSize: "14px"
            }),
        singleValue: (provided)=>({
                ...provided,
                color: "#35095E",
                fontWeight: "bold"
            }),
        menu: (provided)=>({
                ...provided,
                borderRadius: "8px",
                overflow: "hidden"
            }),
        option: (provided, state)=>({
                ...provided,
                backgroundColor: state.isFocused ? "#51216E" : "#fff",
                color: state.isFocused ? "#fff" : "#333",
                padding: "10px",
                cursor: "pointer",
                "&:active": {
                    backgroundColor: "#bae7ff"
                }
            })
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col justify-center ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "font-bold mb-6",
                children: "Create Types"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/types/page.jsx",
                lineNumber: 361,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: editingItem ? handleUpdate : handleSubmit,
                className: "type_form space-y-4 bg-[#35095E]/15 rounded-lg p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        placeholder: "Select Type",
                        value: selectedType,
                        onChange: handleTypeChange,
                        options: [
                            {
                                value: "questionType",
                                label: "Question Type"
                            },
                            {
                                value: "portion",
                                label: "Portion"
                            },
                            {
                                value: "subject",
                                label: "Subject"
                            },
                            {
                                value: "chapter",
                                label: "Chapter"
                            },
                            {
                                value: "topic",
                                label: "Topic"
                            }
                        ],
                        isClearable: true,
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this),
                    (selectedType?.value === "chapter" || selectedType?.value === "subject" || selectedType?.value === "topic") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                        placeholder: "Select Parent",
                        value: parentId,
                        onChange: setParentId,
                        options: parentOptions,
                        isClearable: true,
                        styles: customStyles
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 384,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "name",
                        value: name,
                        onChange: (e)=>setName(e.target.value),
                        placeholder: "Name",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 394,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: loading || !name || !selectedType || parentOptions.length > 0 && !parentId,
                        style: {
                            margin: 0
                        },
                        className: `${loading ? "bg-gray-400" : "bg-gradient-to-t from-[#35095E] to-[#6F13C4] py-4 m-0 rounded-lg text-white"}`,
                        children: loading ? "Uploading..." : editingItem ? "Update" : "Upload"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-center",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 421,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/types/page.jsx",
                lineNumber: 362,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "table content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex justify-end gap-8 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-auto relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "search",
                                        placeholder: "Search...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-80 py-3 px-10 border border-gray-300 rounded-lg focus:outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-y-0 left-0 flex items-center pl-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiSearch"], {
                                            className: "text-gray-500 w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/types/page.jsx",
                                            lineNumber: 435,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/types/page.jsx",
                                lineNumber: 426,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleHamburgerClick,
                                    className: "p-2 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HiMenuAlt3"], {
                                        size: 30
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                    lineNumber: 439,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/types/page.jsx",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this),
                            isFilterVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-option",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterClick("questionType"),
                                        children: "Question Type"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterClick("portion"),
                                        children: "Portion"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 448,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterClick("subject"),
                                        children: "Subject"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 451,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterClick("chapter"),
                                        children: "Chapter"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 454,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleFilterClick("topic"),
                                        children: "Topic"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/types/page.jsx",
                                lineNumber: 444,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 425,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 tables",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full table-content table-auto border-collapse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "ID"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Name"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 467,
                                                columnNumber: 17
                                            }, this),
                                            (filterType === "chapter" || filterType === "topic" || filterType === "subject") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Parent"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 470,
                                                columnNumber: 48
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 471,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "CreatedAt"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 472,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/types/page.jsx",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/types/page.jsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: filteredData.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: item.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 479,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 480,
                                                    columnNumber: 19
                                                }, this),
                                                (filterType === "chapter" || filterType === "topic" || filterType === "subject") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: item.parentName
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 484,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: filterType
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 486,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(item.createdAt), "dd/MM/yyyy")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 487,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleEdit(item),
                                                            className: "bg-gradient-to-t from-[#35095E] to-[#6F13C4] p-2 px-6 mr-3 rounded-lg text-white",
                                                            children: "Edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/types/page.jsx",
                                                            lineNumber: 491,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDelete(item.id, filterType),
                                                            className: "bg-[#C5B5CE] text-black p-2 px-6 rounded-md",
                                                            children: "Delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/types/page.jsx",
                                                            lineNumber: 497,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                                    lineNumber: 490,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/app/admin/types/page.jsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/types/page.jsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/types/page.jsx",
                            lineNumber: 463,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/types/page.jsx",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/types/page.jsx",
                lineNumber: 424,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/types/page.jsx",
        lineNumber: 360,
        columnNumber: 5
    }, this);
};
_s(UploadPage, "AkSwdqfLTjy1IKhKQuj3IJfRSPo=", true);
_c1 = UploadPage;
const __TURBOPACK__default__export__ = UploadPage;
var _c, _c1;
__turbopack_refresh__.register(_c, "Select");
__turbopack_refresh__.register(_c1, "UploadPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/admin/types/page.jsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_a0c33f._.js.map