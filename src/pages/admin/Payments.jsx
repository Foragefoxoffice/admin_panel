import React, { useEffect, useState } from "react";
import { fetchAllPayments } from "../../utils/api";
import { FiEye, FiX, FiCheckCircle, FiAlertCircle, FiCreditCard, FiCalendar, FiUser } from "react-icons/fi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
            <FiCheckCircle size={12} /> Success
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
            <FiAlertCircle size={12} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-100">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
        <p className="text-gray-500 text-sm">View and manage latest transactions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Subscription Plan</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <FiUser size={14} />
                        </div>
                        <span className="font-medium text-gray-900">{p.user?.email || "Unknown User"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                        {p.subscriptionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(p.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelected(p)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <FiCreditCard /> Transaction Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Transaction ID</div>
                <div className="font-mono text-sm font-medium text-gray-800 break-all ml-4">
                  {selected.transactionId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">User Email</label>
                  <p className="font-medium text-gray-900 truncate">{selected.user?.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Plan</label>
                  <p className="font-medium text-purple-600">{selected.subscriptionType}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 my-2 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Original Amount</span>
                  <span className="text-gray-700">₹{selected.originalAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">Discount</span>
                  <span className="text-green-600 font-medium">- ₹{selected.discountAmount || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Applied Coupon</span>
                  <span className="text-gray-700 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {selected.coupon?.code || "NONE"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                  <span className="font-bold text-gray-800">Total Paid</span>
                  <span className="font-bold text-xl text-gray-900">₹{selected.amount}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                {getStatusBadge(selected.paymentStatus)}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-colors text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
