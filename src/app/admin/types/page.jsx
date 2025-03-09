"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HiMenuAlt3 } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { format } from "date-fns";
import { API_BASE_URL } from "@/utils/config";

// Dynamically import react-select with SSR disabled
const Select = dynamic(() => import("react-select"), { ssr: false });

const UploadPage = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [parentOptions, setParentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("questionType");
  const [editingItem, setEditingItem] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [questions, setQuestions] = useState([]); // State for questions

  // Timeout for message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // Clear message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [message]);

  const handleHamburgerClick = () => {
    setIsFilterVisible(!isFilterVisible); // Toggle the filter visibility on hamburger icon click
  };

  const handleFilterClick = (filter) => {
    setFilterType(filter); // Set the selected filter when clicked
  };

  const fetchParentData = async (type) => {
    const endpoint = `${API_BASE_URL}/${type}/`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`Failed to fetch ${type}`);
      const data = await response.json();
      setParentOptions(
        data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );
    } catch (error) {
      setMessage(`Error fetching ${type}: ${error.message}`);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const endpoints = {
      questionType: "question-types",
      subject: "subjects",
      portion: "portions",
      chapter: "chapters",
      topic: "topics",
    };

    if (endpoints[filterType]) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/${endpoints[filterType]}`
        );
        if (!response.ok) throw new Error(`Failed to fetch ${filterType}`);
        const data = await response.json();

        console.log("Fetched data:", data);

        if (filterType === "question") {
          setQuestions(data); // Set questions data
        } else {
          // Fetch parent data for chapters, topics, and subjects
          if (
            filterType === "chapter" ||
            filterType === "topic" ||
            filterType === "subject"
          ) {
            const parentEndpoint =
              filterType === "chapter"
                ? "subjects"
                : filterType === "topic"
                ? "chapters"
                : "portions"; // Fetch portions for subjects
            const parentResponse = await fetch(
              `${API_BASE_URL}/${parentEndpoint}`
            );
            if (!parentResponse.ok)
              throw new Error(`Failed to fetch parent data`);
            const parentData = await parentResponse.json();

            console.log("Fetched parent data:", parentData);

            // Map parent data to the main data
            const dataWithParents = data.map((item) => {
              const parent =
                parentData.find(
                  (p) =>
                    p.id === item.parentId ||
                    p.id === item.subjectId ||
                    p.id === item.chapterId ||
                    p.id === item.portionId
                ) || {};
              console.log("Matching parent:", parent);
              return { ...item, parentName: parent.name || "Unknown" }; // Set to 'Unknown' if parent name is not found
            });
            setData(dataWithParents);
            setFilteredData(dataWithParents);
          } else {
            setData(data);
            setFilteredData(data);
          }
        }
      } catch (error) {
        setMessage(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (filterType) {
      fetchData();
    }
  }, [filterType]);

  useEffect(() => {
    // Reset form fields whenever the filter type changes
    setSelectedType(null);
    setParentId(null);
    setName("");
    setParentOptions([]);
    setSearchQuery("");
    setMessage("");
  }, [filterType]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredData(data); // Reset filtered data if no search query
    }
  }, [searchQuery, data]);

  const handleTypeChange = async (selected) => {
    setSelectedType(selected);
    setParentId(null);
    setParentOptions([]);
    if (selected?.value === "chapter") await fetchParentData("subjects");
    else if (selected?.value === "topic") await fetchParentData("chapters");
    else if (selected?.value === "subject") await fetchParentData("portions"); // Fetch portions for subjects
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (
      !parentId &&
      (selectedType?.value === "chapter" ||
        selectedType?.value === "topic" ||
        selectedType?.value === "subject")
    ) {
      setMessage("Please select a parent!");
      setLoading(false);
      return;
    }
    let endpoint = "";
    let payload = {};
    switch (selectedType?.value) {
      case "questionType":
        endpoint = `${API_BASE_URL}/question-types/`;
        payload = { name };
        break;
      case "subject":
        endpoint = `${API_BASE_URL}/subjects/`;
        payload = { name, parentId: parseInt(parentId.value, 10) }; // Include parentId for subjects
        break;
      case "portion":
        endpoint = `${API_BASE_URL}/portions/`;
        payload = { name };
        break;
      case "chapter":
        endpoint = `${API_BASE_URL}/chapters/`;
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      case "topic":
        endpoint = `${API_BASE_URL}/topics/`;
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      default:
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`Failed to upload data for ${selectedType?.value}`);
      setMessage("Data uploaded successfully!");
  
      // Re-fetch data to reflect the changes
      await fetchData();
  
      // Reset form fields
      setSelectedType(null);
      setName("");
      setParentId(null);
      setParentOptions([]);
    } catch (error) {
      setMessage(`Error uploading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (
      !parentId &&
      (selectedType?.value === "chapter" ||
        selectedType?.value === "topic" ||
        selectedType?.value === "subject")
    ) {
      setMessage("Please select a parent!");
      setLoading(false);
      return;
    }
    let endpoint = "";
    let payload = {};
    switch (selectedType?.value) {
      case "questionType":
        endpoint = `${API_BASE_URL}/question-types/${editingItem.id}`;
        payload = { name };
        break;
      case "portion":
        endpoint = `${API_BASE_URL}/portions/${editingItem.id}`;
        payload = { name };
        break;
      case "subject":
        endpoint = `${API_BASE_URL}/subjects/${editingItem.id}`;
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      case "chapter":
        endpoint = `${API_BASE_URL}/chapters/${editingItem.id}`;
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      case "topic":
        endpoint = `${API_BASE_URL}/topics/${editingItem.id}`;
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      default:
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`Failed to update data for ${selectedType?.value}`);
      setMessage("Data updated successfully!");
  
      // Re-fetch data to reflect the changes
      await fetchData();
  
      // Reset form fields
      setEditingItem(null);
      setName("");
      setSelectedType(null);
      setParentId(null);
      setParentOptions([]);
    } catch (error) {
      setMessage(`Error updating data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (item) => {
    setEditingItem(item);
    setName(item.name);
    setSelectedType({
      value: filterType,
      label: filterType.charAt(0).toUpperCase() + filterType.slice(1),
    });

    if (filterType === "subject") {
      await fetchParentData("portions");
      setParentId({ value: item.portionId.toString(), label: item.parentName });
    } else if (filterType === "chapter") {
      await fetchParentData("subjects");
      setParentId({ value: item.subjectId.toString(), label: item.parentName });
    } else if (filterType === "topic") {
      await fetchParentData("chapters");
      setParentId({ value: item.chapterId.toString(), label: item.parentName });
    } else {
      setParentId(null);
    }
  };

  const handleDelete = async (id, filterType) => {
    console.log("Type:", filterType);
  
    const type = {
      questionType: "question-types",
      subject: "subjects",
      portion: "portions",
      chapter: "chapters",
      topic: "topics",
    };
  
    const endpointType = type[filterType]; // Ensure filterType exists in the type object
   
    console.log("Type:", endpointType);
    
    if (!endpointType) {
      console.error("Invalid filterType:", filterType);
      setMessage("Invalid item type for deletion.");
      return;
    }
  
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const endpoint = `${API_BASE_URL}/${endpointType}/${id}`;
        const response = await fetch(endpoint, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error(`Failed to delete ${filterType}`);
  
        setMessage("Item deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Error deleting item:", error);
        setMessage(`Error deleting item: ${error.message}`);
      }
    }
  };
  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      width: "100%",
      border: "1px solid #ccc",
      boxShadow: "none",
      fontWeight: "bold",
      padding: "17px",
      transition: "0.3s",
      "&:hover": {
        borderColor: "#51216E",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#888",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#35095E",
      fontWeight: "bold",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#51216E" : "#fff",
      color: state.isFocused ? "#fff" : "#333",
      padding: "10px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#bae7ff",
      },
    }),
  };

  return (
    <div className="flex flex-col justify-center p-6 md:p-0">
       <h1 className=" font-bold mb-6">Create Types</h1>
      <form
        onSubmit={editingItem ? handleUpdate : handleSubmit}
        className="type_form space-y-4  bg-[#35095E]/15 rounded-lg p-6 "
      >
        <Select
          placeholder="Select Type"
          value={selectedType}
          onChange={handleTypeChange}
          options={[
            { value: "questionType", label: "Question Type" },
            { value: "portion", label: "Portion" },
            { value: "subject", label: "Subject" },
            { value: "chapter", label: "Chapter" },
            { value: "topic", label: "Topic" },
          ]}
          isClearable
          styles={customStyles}
        />

        {(selectedType?.value === "chapter" ||
          selectedType?.value === "subject" ||
          selectedType?.value === "topic") && (
          <Select
            placeholder="Select Parent"
            value={parentId}
            onChange={setParentId}
            options={parentOptions}
            isClearable
            styles={customStyles}
          />
        )}

        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />

        <button
          type="submit"
          disabled={
            loading ||
            !name ||
            !selectedType ||
            (parentOptions.length > 0 && !parentId)
          }
          style={{ margin: 0 }}
          className={` ${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-t from-[#35095E] to-[#6F13C4] py-4 m-0 rounded-lg text-white"
          }`}
        >
          {loading ? "Uploading..." : editingItem ? "Update" : "Upload"}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>

      <div className="table content ">
        {/* Search and Filter Section */}
        <div className="mt-8 flex justify-start md:justify-end gap-8 relative">
          <div className=" w-auto relative">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 md:w-80 py-3  px-10 border border-gray-300 rounded-lg focus:outline-none"
            />
            <div className="absolute inset-y-0  left-0 flex items-center pl-3">
              <BiSearch className="text-gray-500 w-5 h-5" />
            </div>
          </div>
          <div className="flex ">
            <button onClick={handleHamburgerClick} className="p-2 rounded-lg">
              <HiMenuAlt3 size={30} /> {/* Hamburger Icon */}
            </button>
          </div>
          {isFilterVisible && (
            <div className="filter-option">
              <button onClick={() => handleFilterClick("questionType")}>
                Question Type
              </button>
              <button onClick={() => handleFilterClick("portion")}>
                Portion
              </button>
              <button onClick={() => handleFilterClick("subject")}>
                Subject
              </button>
              <button onClick={() => handleFilterClick("chapter")}>
                Chapter
              </button>
              <button onClick={() => handleFilterClick("topic")}>Topic</button>
              <button onClick={() => handleFilterClick("question")}>
                Question
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="mt-8  tables">
          <table className="w-full table-content table-auto border-collapse">
            <thead>
              <tr>
                <th className="">ID</th>
                <th className="">Name</th>
                {(filterType === "chapter" ||
                  filterType === "topic" ||
                  filterType === "subject") && <th className="">Parent</th>}
                <th className="">Type</th>
                <th>CreatedAt</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="">{item.id}</td>
                  <td className="">{item.name}</td>
                  {(filterType === "chapter" ||
                    filterType === "topic" ||
                    filterType === "subject") && (
                    <td className="">{item.parentName}</td>
                  )}
                  <td className="">{filterType}</td>
                  <td className="">
                    {format(new Date(item.createdAt), "dd/MM/yyyy")}
                  </td>
                  <td className="">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-gradient-to-t from-[#35095E] to-[#6F13C4] p-2 px-6 mr-3 rounded-lg text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id,filterType)}
                      className="bg-[#C5B5CE] text-black p-2 px-6 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;