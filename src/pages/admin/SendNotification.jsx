import React, { useEffect, useState } from "react";
import { sendAdminNotification, fetchAllUsers } from "../../utils/api";

const SendNotification = () => {
    const [users, setUsers] = useState([]);
    const [sendToAll, setSendToAll] = useState(true);
    const [selectedUser, setSelectedUser] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", text: "" });

    // Load all users when page loads
    useEffect(() => {
        fetchAllUsers()
            .then((data) => setUsers(data))
            .catch(() => console.log("Error fetching users"));
    }, []);

    // Preview message with dummy user
    const updatePreview = () => {
        const fakeUser = {
            name: "Student",
            email: "student@example.com",
            phoneNumber: "+91 9876543210",
        };

        const replaced = message
            .replace(/{{name}}/g, fakeUser.name)
            .replace(/{{email}}/g, fakeUser.email)
            .replace(/{{phone}}/g, fakeUser.phoneNumber);

        setPreview(replaced);
    };

    // Handle send
    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            setAlert({ type: "error", text: "Title and Message are required." });
            return;
        }

        if (!sendToAll && !selectedUser) {
            setAlert({ type: "error", text: "Please select a user." });
            return;
        }

        setLoading(true);

        try {
            await sendAdminNotification({
                title,
                message,
                sendToAll,
                userId: sendToAll ? null : selectedUser,
            });

            setAlert({ type: "success", text: "Notification sent successfully!" });
            setTitle("");
            setMessage("");
            setPreview("");
            setSelectedUser("");
        } catch (error) {
            setAlert({
                type: "error",
                text:
                    error.response?.data?.message || "Failed to send notification. Try again!",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <h1 className="font-bold mb-6">Send Push Notification</h1>

            {/* Alert */}
            {alert.text && (
                <div
                    className={`p-4 mb-6 rounded-lg ${alert.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                >
                    {alert.text}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Title Input */}
                <div>
                    <label className="block text-sm font-bold text-[#35095E] mb-2">
                        Notification Title
                    </label>
                    <input
                        className="w-full"
                        placeholder="e.g., New Study Material Available!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Message Input */}
                <div>
                    <label className="block text-sm font-bold text-[#35095E] mb-2">
                        Message Content
                    </label>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                        <p className="text-xs text-[#51216E] font-medium">
                            💡 Use variables: <code className="bg-white px-2 py-0.5 rounded">{"{{name}}"}</code>{" "}
                            <code className="bg-white px-2 py-0.5 rounded">{"{{email}}"}</code>{" "}
                            <code className="bg-white px-2 py-0.5 rounded">{"{{phone}}"}</code>
                        </p>
                    </div>
                    <textarea
                        className="w-full p-4 border-2 border-[#282C35] rounded-lg focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                        rows={6}
                        placeholder="Hello {{name}}, we have exciting news for you..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                            {message.length} characters
                        </span>
                        <button
                            type="button"
                            onClick={updatePreview}
                            className="px-4 py-2 bg-[#51216E] hover:bg-[#35095E] text-white rounded-lg font-medium transition-all"
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {/* Preview Output */}
                {preview && (
                    <div className="bg-purple-50 border-2 border-[#51216E] rounded-lg p-5">
                        <h3 className="font-bold text-[#35095E] mb-3">Preview Output</h3>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{preview}</p>
                        </div>
                    </div>
                )}

                {/* Recipient Selection */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <h3 className="font-bold text-[#35095E]">Select Recipients</h3>

                    <div className="flex gap-4">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                checked={sendToAll}
                                onChange={() => setSendToAll(true)}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E]">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#51216E] peer-checked:bg-[#51216E] flex items-center justify-center">
                                        {sendToAll && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#35095E]">All Users</p>
                                        <p className="text-xs text-gray-500">Send to everyone</p>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                checked={!sendToAll}
                                onChange={() => setSendToAll(false)}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E]">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#51216E] peer-checked:bg-[#51216E] flex items-center justify-center">
                                        {!sendToAll && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#35095E]">Specific User</p>
                                        <p className="text-xs text-gray-500">Choose one user</p>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* User Dropdown */}
                    {!sendToAll && (
                        <select
                            className="w-full px-4 py-3 border-2 border-[#282C35] rounded-lg focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white text-[#35095E] font-bold"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Select a user...</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name || "Unnamed User"} — {u.phoneNumber}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Sending..." : "Send Notification"}
                </button>
            </div>
        </div>
    );
};

export default SendNotification;
