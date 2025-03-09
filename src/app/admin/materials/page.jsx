"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/utils/config";

export default function PDFViewer() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchPDFs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pdf`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch PDFs");
        }

        const data = await response.json();
        setPdfs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, [token]);

  const deletePDF = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this PDF?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/pdf/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete PDF");
      }

      setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf.id !== id));
      alert("PDF deleted successfully");
    } catch (error) {
      alert("Error deleting PDF");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading PDFs...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className=" font-semibold mb-6">📚 PDF List</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="py-3 px-4 border-b bg-[#35095e5c]">#</th>
              <th className="py-3 px-4 border-b bg-[#35095e5c]">PDF Name</th>
              <th className="py-3 px-4 border-b bg-[#35095e5c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.length > 0 ? (
              pdfs.map((pdf, index) => (
                <tr
                  key={pdf.id}
                  className="border-b transition duration-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{pdf.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-3">
                      <a
                        href={`https://mitoslearning.in${pdf.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deletePDF(pdf.id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  No PDFs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
