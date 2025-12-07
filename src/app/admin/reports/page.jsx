"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  getAllWrongQuestionReports,
  updateWrongQuestionReportStatus,
} from "@/utils/api";
import { TestContext } from "@/contexts/TestContext";
import { useRouter } from "next/navigation";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    questionId: "",
    reason: "",
    dateFrom: "",
    dateTo: "",
  });

  const router = useRouter();
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
    setCurrentPage(1); // Reset to first page when filters change
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
        ReportId: id,
      });
      router.push(`/admin/edit/`);
    },
    [setTestData, router]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      questionId: "",
      reason: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === "pending"
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredReports.length)} of{" "}
              {filteredReports.length} reports
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft className="inline" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === number
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FiChevronRight className="inline" />
              </button>
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
