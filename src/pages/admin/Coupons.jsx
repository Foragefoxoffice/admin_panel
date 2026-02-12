import React, { useEffect, useState } from "react";
import { createCoupon, fetchCoupons, updateCoupon, toggleCoupon, deleteCoupon } from "../../utils/api";
import { FiPlus, FiTrash2, FiX, FiCalendar, FiPercent, FiDollarSign, FiEdit2, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    maxUsage: "",
    maxPerUser: "",
    expiresAt: "",
  });

  const loadCoupons = async () => {
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Failed to load coupons", error);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxUsage: coupon.maxUsage || "",
      maxPerUser: coupon.maxPerUser || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      loadCoupons();
    } catch (error) {
      console.error("Failed to delete coupon", error);
      alert("Failed to delete coupon");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleCoupon(id);
      loadCoupons();
    } catch (error) {
      console.error("Failed to toggle coupon", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.code || !form.value) {
      alert("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
        maxPerUser: form.maxPerUser ? Number(form.maxPerUser) : null,
      };

      if (editingId) {
        await updateCoupon(editingId, payload);
        alert("Coupon updated successfully");
      } else {
        await createCoupon(payload);
        alert("Coupon created successfully");
      }

      setShowModal(false);
      setForm({
        code: "",
        type: "percentage",
        value: "",
        maxUsage: "",
        maxPerUser: "",
        expiresAt: "",
      });
      setEditingId(null);
      loadCoupons();
    } catch (error) {
      console.error(error);
      alert(editingId ? "Failed to update coupon" : "Failed to create coupon");
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      code: "",
      type: "percentage",
      value: "",
      maxUsage: "",
      maxPerUser: "",
      expiresAt: "",
    });
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coupon Management</h2>
          <p className="text-gray-500 text-sm">Create and manage discount codes for your users.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-all transform hover:scale-105 font-medium"
        >
          <FiPlus size={20} /> Add New Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 text-center">Usage</th>
                <th className="px-6 py-4 text-center">Max Usage</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-100 font-mono">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <div className="flex items-center gap-2">
                        {c.type === "percentage" ? (
                          <FiPercent className="text-blue-500" />
                        ) : (
                          <FiDollarSign className="text-green-500" />
                        )}
                        {c.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {c.usedCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {c.maxUsage || "∞"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {c.expiresAt ? (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {c.expiresAt.split("T")[0]}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(c.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${c.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        title="Click to toggle status"
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Coupon"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Coupon"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    No coupons found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {editingId ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  placeholder="e.g. SUMMER2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all uppercase placeholder:normal-case"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage (Total)</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={form.maxUsage}
                    onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Per User</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={form.maxPerUser}
                    onChange={(e) => setForm({ ...form, maxPerUser: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Saving..." : (editingId ? "Update Coupon" : "Create Coupon")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
