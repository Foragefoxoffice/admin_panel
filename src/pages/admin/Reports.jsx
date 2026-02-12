import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  getAllWrongQuestionReports,
  updateWrongQuestionReportStatus,
} from "@/utils/api";
import { TestContext } from "@/contexts/TestContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "@/components/Notification";
import {
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
} from "react-icons/fi";

export default function WrongQuestionReportsPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get('page'));
    return page && page > 0 ? page : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    questionId: "",
    reason: "",
    dateFrom: "",
    dateTo: "",
  });

  const navigate = useNavigate();
  const { setTestData } = useContext(TestContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllWrongQuestionReports();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError("Failed to load reports. Please try again.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  const applyFilters = () => {
    let result = [...reports];

    if (filters.status) {
      result = result.filter((report) => report.status === filters.status);
    }

    if (filters.questionId) {
      result = result.filter((report) =>
        report.questionId.toString().includes(filters.questionId)
      );
    }

    if (filters.reason) {
      result = result.filter((report) =>
        report.reason.toLowerCase().includes(filters.reason.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(
        (report) => new Date(report.createdAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter((report) => new Date(report.createdAt) <= toDate);
    }

    setFilteredReports(result);
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateWrongQuestionReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
      setNotification({
        show: true,
        message: "Report status updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating report status:", error);
      setNotification({
        show: true,
        message: "Failed to update report status",
        type: "error",
      });
    }
  };

  const handleUpdate = useCallback(
    (questionId, id) => {
      setTestData({
        QuestionId: questionId,
        Page: "report",
        returnPage: currentPage,
        ReportId: id,
      });
      navigate(`/admin/edit/`);
    },
    [setTestData, navigate, currentPage]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setSearchParams({ page: '1' });
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      questionId: "",
      reason: "",
      dateFrom: "",
      dateTo: "",
    });
    // Reset to page 1 when filters are reset
    setCurrentPage(1);
    setSearchParams({ page: '1' });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchParams({ page: pageNumber.toString() });
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading reports...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        ⚠️ Wrong Question Reports
      </h1>

      {/* Filter controls */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question ID
                </label>
                <input
                  type="text"
                  name="questionId"
                  value={filters.questionId}
                  onChange={handleFilterChange}
                  placeholder="Search by question ID"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  name="reason"
                  value={filters.reason}
                  onChange={handleFilterChange}
                  placeholder="Search in reasons"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition mr-2"
              >
                <FiX /> Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-gray-600">No reports found matching your filters.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-xl border mb-4">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border">#</th>
                  <th className="px-4 py-3 border">Question ID</th>
                  <th className="px-4 py-3 border">Reason</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border">Created</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentItems.map((report, index) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-2 border">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-2 border font-mono text-blue-600">
                      {report.questionId}
                    </td>
                    <td className="px-4 py-2 border">{report.reason}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex items-center gap-2">
                        <select
                          value={report.status}
                          onChange={(e) =>
                            handleStatusUpdate(report.id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <button
                          onClick={() =>
                            handleUpdate(report.questionId, report.id)
                          }
                          className="text-white p-1 px-2 rounded-sm flex gap-2 hover:text-white transition"
                          title="Edit Question"
                        >
                          <FiEdit2 className="text-lg" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            {/* Left side - Items info and per page selector */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredReports.length)} of{" "}
                {filteredReports.length} reports
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newPerPage = Number(e.target.value);
                    setItemsPerPage(newPerPage);
                    setCurrentPage(1);
                    setSearchParams({ page: '1' });
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Right side - Page navigation */}
            <div className="flex items-center gap-2">
              {/* Previous button */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border flex items-center gap-1 ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FiChevronLeft className="inline" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page numbers with smart display */}
              <div className="flex space-x-1">
                {(() => {
                  const pages = [];
                  const maxPagesToShow = 5;

                  if (totalPages <= maxPagesToShow + 2) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => paginate(i)}
                          className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === i
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else {
                    // Smart pagination with ellipsis
                    // Always show first page
                    pages.push(
                      <button
                        key={1}
                        onClick={() => paginate(1)}
                        className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === 1
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        1
                      </button>
                    );

                    // Show ellipsis or page 2
                    if (currentPage > 3) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      );
                    } else if (totalPages > 1) {
                      pages.push(
                        <button
                          key={2}
                          onClick={() => paginate(2)}
                          className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === 2
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          2
                        </button>
                      );
                    }

                    // Show pages around current page
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = startPage; i <= endPage; i++) {
                      if (i !== 1 && i !== totalPages && i !== 2 && i !== totalPages - 1) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => paginate(i)}
                            className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === i
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {i}
                          </button>
                        );
                      }
                    }

                    // Show ellipsis or second-to-last page
                    if (currentPage < totalPages - 2) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      );
                    } else if (totalPages > 2) {
                      pages.push(
                        <button
                          key={totalPages - 1}
                          onClick={() => paginate(totalPages - 1)}
                          className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === totalPages - 1
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {totalPages - 1}
                        </button>
                      );
                    }

                    // Always show last page
                    if (totalPages > 1) {
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => paginate(totalPages)}
                          className={`px-3 py-1 rounded-md border min-w-[40px] ${currentPage === totalPages
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                  }

                  return pages;
                })()}
              </div>

              {/* Next button */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border flex items-center gap-1 ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="inline" />
              </button>

              {/* Jump to page */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                <label className="text-sm text-gray-600 whitespace-nowrap">Go to:</label>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  placeholder={currentPage.toString()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        paginate(page);
                        e.target.value = '';
                      }
                    }
                  }}
                  className="border border-gray-300 rounded px-2 py-1 w-16 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
