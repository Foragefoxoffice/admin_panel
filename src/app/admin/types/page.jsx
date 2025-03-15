"use client";
import React, { useState, useEffect,useRef  } from "react";
import dynamic from "next/dynamic";
import { HiMenuAlt3 } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { format } from "date-fns";
import { API_BASE_URL } from "@/utils/config";
import useAuth from "@/contexts/useAuth";
import DeleteConfirmationPopup from "@/components/DeleteConfirmationModal";

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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteFilterType, setDeleteFilterType] = useState(null);

  // Ref for the filter-option box
  const filterOptionRef = useRef(null);

  useAuth();

  // Handle clicks outside the filter-option box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterOptionRef.current &&
        !filterOptionRef.current.contains(event.target)
      ) {
        setIsFilterVisible(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleHamburgerClick = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleFilterClick = (filter) => {
    setFilterType(filter);
    setIsFilterVisible(false); // Hide the filter-option box after selecting a filter
  };


  const fetchParentData = async (type) => {
    const endpoint = `https://mitoslearning.in/api/${type}/`;
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
        const response = await fetch(`https://mitoslearning.in/api/${endpoints[filterType]}`);
        if (!response.ok) throw new Error(`Failed to fetch ${filterType}`);
        const data = await response.json();

        if (["chapter", "topic", "subject"].includes(filterType)) {
          const parentEndpoint =
            filterType === "chapter" ? "subjects" :
            filterType === "topic" ? "chapters" :
            "portions";

          const parentResponse = await fetch(`https://mitoslearning.in/api/${parentEndpoint}`);
          if (!parentResponse.ok) throw new Error(`Failed to fetch parent data`);
          const parentData = await parentResponse.json();

          console.log("Item Data:", data);
          console.log("Parent Data:", parentData);

          const dataWithParents = data.map((item) => {
            let parent;
            if (filterType === "chapter") {
              parent = parentData.find((p) => p.id === item.subjectId);
            } else if (filterType === "topic") {
              parent = parentData.find((p) => p.id === item.chapterId);
            } else if (filterType === "subject") {
              parent = parentData.find((p) => p.id === item.portion.id);
            }

            return { ...item, parentName: parent ? parent.name : "Unknown" };
          });

          setData(dataWithParents);
          setFilteredData(dataWithParents);
        } else {
          setData(data);
          setFilteredData(data);
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
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleTypeChange = async (selected) => {
    setSelectedType(selected);
    setParentId(null);
    setParentOptions([]);
    if (selected?.value === "chapter") await fetchParentData("subjects");
    else if (selected?.value === "topic") await fetchParentData("chapters");
    else if (selected?.value === "subject") await fetchParentData("portions");
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
        endpoint = "https://mitoslearning.in/api/question-types/";
        payload = { name };
        break;
      case "subject":
        endpoint = "https://mitoslearning.in/api/subjects/";
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      case "portion":
        endpoint = "https://mitoslearning.in/api/portions/";
        payload = { name };
        break;
      case "chapter":
        endpoint = "https://mitoslearning.in/api/chapters/";
        payload = { name, parentId: parseInt(parentId.value, 10) };
        break;
      case "topic":
        endpoint = "https://mitoslearning.in/api/topics/";
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
      
      // Refetch parent data after successful upload
      if (selectedType?.value === "chapter") await fetchParentData("subjects");
      else if (selectedType?.value === "topic") await fetchParentData("chapters");
      else if (selectedType?.value === "subject") await fetchParentData("portions");
      
      // Refetch the main data
      fetchData();
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
        endpoint = `https://mitoslearning.in/api/question-types/${editingItem.id}`;
        payload = { name };
        break;
      case "portion":
        endpoint = `https://mitoslearning.in/api/portions/${editingItem.id}`;
        payload = { name };
        break;
      case "subject":
        endpoint = `https://mitoslearning.in/api/subjects/${editingItem.id}`;
        payload = { name, portionId: parseInt(parentId.value, 10) };
        break;
      case "chapter":
        endpoint = `https://mitoslearning.in/api/chapters/${editingItem.id}`;
        payload = { name, subjectId: parseInt(parentId.value, 10) };
        break;
      case "topic":
        endpoint = `https://mitoslearning.in/api/topics/${editingItem.id}`;
        payload = { name, chapterId: parseInt(parentId.value, 10) };
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
      setEditingItem(null);
      setName("");
      
      // Refetch parent data after successful update
      if (selectedType?.value === "chapter") await fetchParentData("subjects");
      else if (selectedType?.value === "topic") await fetchParentData("chapters");
      else if (selectedType?.value === "subject") await fetchParentData("portions");
      
      // Refetch the main data
      fetchData();
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

  const handleDelete = (id, filterType) => {
    setItemToDelete(id);
    setDeleteFilterType(filterType);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    const type = {
      questionType: "question-types",
      subject: "subjects",
      portion: "portions",
      chapter: "chapters",
      topic: "topics",
    };

    const endpointType = type[deleteFilterType];
    if (!endpointType) {
      setMessage(`Invalid item type for deletion: ${deleteFilterType}`);
      return;
    }

    try {
      const endpoint = `${API_BASE_URL}/${endpointType}/${itemToDelete}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete ${deleteFilterType}`);

      setMessage("Item deleted successfully!");
      fetchData();
    } catch (error) {
      setMessage(`Error deleting item: ${error.message}`);
    } finally {
      setShowDeletePopup(false);
      setItemToDelete(null);
      setDeleteFilterType(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
    setDeleteFilterType(null);
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
    <div className="flex flex-col justify-center">
      <h1 className="font-bold mb-6">Create Types</h1>
      <form
        onSubmit={editingItem ? handleUpdate : handleSubmit}
        className="type_form space-y-4 bg-[#35095E]/15 rounded-lg p-6"
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
          className={`${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-t from-[#35095E] to-[#6F13C4] py-4 m-0 rounded-lg text-white"
          }`}
        >
          {loading ? "Uploading..." : editingItem ? "Update" : "Upload"}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>

      <div className="table content">
        <div className="mt-8 flex justify-end gap-8 relative">
          <div className="w-auto relative">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 py-3 px-10 border border-gray-300 rounded-lg focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <BiSearch className="text-gray-500 w-5 h-5" />
            </div>
          </div>
          <div className="flex">
            <button onClick={handleHamburgerClick} className="p-2 rounded-lg">
              <HiMenuAlt3 size={30} />
            </button>
          </div>
          {isFilterVisible && (
            <div
              ref={filterOptionRef}
              className="filter-option absolute top-16 right-0  rounded-lg shadow-lg p-4 z-10"
            >
              <button
                onClick={() => handleFilterClick("questionType")}
                className="block w-full text-left "
              >
                Question Type
              </button>
              <button
                onClick={() => handleFilterClick("portion")}
                className="block w-full text-left "
              >
                Portion
              </button>
              <button
                onClick={() => handleFilterClick("subject")}
                className="block w-full text-left "
              >
                Subject
              </button>
              <button
                onClick={() => handleFilterClick("chapter")}
                className="block w-full text-left "
              >
                Chapter
              </button>
              <button
                onClick={() => handleFilterClick("topic")}
                className="block w-full text-left "
              >
                Topic
              </button>
            </div>
          )}
        </div>


        <div className="mt-8 tables">
          <table className="w-full table-content table-auto border-collapse">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {(filterType === "chapter" ||
                  filterType === "topic" ||
                  filterType === "subject") && <th>Parent</th>}
                <th>Type</th>
                <th>CreatedAt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  {(filterType === "chapter" ||
                    filterType === "topic" ||
                    filterType === "subject") && (
                    <td>{item.parentName}</td>
                  )}
                  <td>{filterType}</td>
                  <td>
                    {format(new Date(item.createdAt), "dd/MM/yyyy")}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-gradient-to-t from-[#35095E] to-[#6F13C4] p-2 px-6 mr-3 rounded-lg text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, filterType)}
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

      {showDeletePopup && (
        <DeleteConfirmationPopup
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default UploadPage;