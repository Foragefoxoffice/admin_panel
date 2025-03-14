"use client"; // Ensure this component is rendered on the client side

import React, { useState } from "react";

const DeleteConfirmationPopup = ({ onConfirm, onCancel }) => {
  const [passkey, setPasskey] = useState("");

  const handleConfirm = () => {
    if (passkey === "DELETE_THIS_TYPE") { // Replace with your actual passkey
      onConfirm();
    } else {
      alert("Incorrect passkey!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg text-center text-[#6712B7] font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4 text-center">Please enter the passkey to confirm deletion</p>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter passkey"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black p-2 px-6 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white p-2 px-6 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;