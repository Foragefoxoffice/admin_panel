"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  getAllWrongQuestionReports,
  updateWrongQuestionReportStatus,
} from "@/utils/api";
import { TestContext } from "@/contexts/TestContext";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import { FiEdit2 } from "react-icons/fi";

export default function WrongQuestionReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const router = useRouter();
  const { setTestData } = useContext(TestContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllWrongQuestionReports();
        setReports(data);
      } catch (err) {
        setError("Failed to load reports. Please try again.");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
    (questionId) => {
      setTestData({ QuestionId: questionId });
      router.push(`/admin/edit/`);
    },
    [setTestData, router]
  );

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading reports...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        ⚠️ Wrong Question Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
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
              {reports.map((report, index) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
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
                        onClick={() => handleUpdate(report.questionId)}
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
