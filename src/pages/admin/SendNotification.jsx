import React, { useEffect, useState } from "react";
import { sendAdminNotification, fetchAllUsers } from "../../utils/api";

const SendNotification = () => {
    const [users, setUsers] = useState([]);
    const [sendType, setSendType] = useState('all'); // 'all', 'status', 'specific'
    const [subscriptionStatus, setSubscriptionStatus] = useState('ALL');
    const [selectedUsers, setSelectedUsers] = useState([]); // Changed to array for multiple selection
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState({ title: "", message: "" }); // Object for title and message preview
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", text: "" });

    // Load all users when page loads
    useEffect(() => {
        fetchAllUsers()
            .then((data) => setUsers(data))
            .catch(() => console.log("Error fetching users"));
    }, []);

    // Filter users based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers([]);
        } else {
            const filtered = users.filter((user) =>
                user.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    // Handle user selection from search (add to selected users)
    const handleSelectUser = (user) => {
        if (!selectedUsers.includes(user.id)) {
            setSelectedUsers([...selectedUsers, user.id]);
        }
        // Keep search query active for continuous selection
    };

    // Remove a user from selected users
    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
    };

    // Clear all selected users
    const handleClearSelection = () => {
        setSelectedUsers([]);
        setSearchQuery("");
        setShowDropdown(false);
    };

    // Preview message with dummy user
    const updatePreview = () => {
        const fakeUser = {
            name: "Student",
            email: "student@example.com",
            phoneNumber: "+91 9876543210",
        };

        const replacedTitle = title
            .replace(/{{name}}/g, fakeUser.name)
            .replace(/{{email}}/g, fakeUser.email)
            .replace(/{{phone}}/g, fakeUser.phoneNumber);

        const replacedMessage = message
            .replace(/{{name}}/g, fakeUser.name)
            .replace(/{{email}}/g, fakeUser.email)
            .replace(/{{phone}}/g, fakeUser.phoneNumber);

        setPreview({ title: replacedTitle, message: replacedMessage });
    };

    // Handle send
    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            setAlert({ type: "error", text: "Title and Message are required." });
            return;
        }

        if (sendType === 'specific' && selectedUsers.length === 0) {
            setAlert({ type: "error", text: "Please select at least one user." });
            return;
        }

        setLoading(true);

        try {
            // Prepare payload based on send type
            const payload = {
                title,
                message,
            };

            if (sendType === 'all') {
                payload.sendToAll = true;
            } else if (sendType === 'status') {
                payload.subscriptionStatus = subscriptionStatus;
            } else {
                payload.userIds = selectedUsers; // Array of user IDs
            }

            await sendAdminNotification(payload);

            setAlert({ type: "success", text: "Notification sent successfully!" });
            setTitle("");
            setMessage("");
            setPreview({ title: "", message: "" });
            setSelectedUsers([]);
            setSearchQuery("");
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
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
                        <p className="text-xs text-[#51216E] font-medium">
                            💡 Use variables: <code className="bg-white px-2 py-0.5 rounded">{"{{name}}"}</code>{" "}
                            <code className="bg-white px-2 py-0.5 rounded">{"{{email}}"}</code>{" "}
                            <code className="bg-white px-2 py-0.5 rounded">{"{{phone}}"}</code>
                        </p>
                    </div>
                    <input
                        className="w-full px-4 py-3 border-2 border-[#282C35] rounded-lg focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="e.g., Hello {{name}}, New Update!"
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
                {(preview.title || preview.message) && (
                    <div className="bg-purple-50 border-2 border-[#51216E] rounded-lg p-5">
                        <h3 className="font-bold text-[#35095E] mb-3">Preview Output</h3>
                        <div className="bg-white rounded-lg p-4 space-y-3">
                            {preview.title && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Title:</p>
                                    <p className="font-bold text-gray-900 text-lg">{preview.title}</p>
                                </div>
                            )}
                            {preview.message && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Message:</p>
                                    <p className="text-gray-800 whitespace-pre-line leading-relaxed">{preview.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Recipient Selection */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                    <h3 className="font-bold text-[#35095E]">Select Recipients</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* All Users Option */}
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                checked={sendType === 'all'}
                                onChange={() => setSendType('all')}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E] h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#51216E] peer-checked:bg-[#51216E] flex items-center justify-center">
                                        {sendType === 'all' && (
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

                        {/* By Subscription Status Option */}
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                checked={sendType === 'status'}
                                onChange={() => setSendType('status')}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E] h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#51216E] peer-checked:bg-[#51216E] flex items-center justify-center">
                                        {sendType === 'status' && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#35095E]">By Status</p>
                                        <p className="text-xs text-gray-500">Filter by subscription</p>
                                    </div>
                                </div>
                            </div>
                        </label>

                        {/* Specific Users Option */}
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                checked={sendType === 'specific'}
                                onChange={() => setSendType('specific')}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E] h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[#51216E] peer-checked:bg-[#51216E] flex items-center justify-center">
                                        {sendType === 'specific' && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#35095E]">Specific Users</p>
                                        <p className="text-xs text-gray-500">Choose individuals</p>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Subscription Status Dropdown */}
                    {sendType === 'status' && (
                        <div className="mt-4">
                            <label className="block text-sm font-bold text-[#35095E] mb-2">
                                Select Subscription Status
                            </label>
                            <select
                                value={subscriptionStatus}
                                onChange={(e) => setSubscriptionStatus(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#282C35] rounded-lg focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="TRIAL">Trial Users (Active Trial)</option>
                                <option value="REGISTERED">Registered Users</option>
                                <option value="PREMIUM">Premium Users</option>
                                <option value="SUSPENDED">Suspended Users</option>
                                <option value="TRIALED">Trialed Users (Trial Expired)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                {subscriptionStatus === 'ALL' && 'Send to all users regardless of status'}
                                {subscriptionStatus === 'TRIAL' && 'Send to users currently on active trial'}
                                {subscriptionStatus === 'REGISTERED' && 'Send to users with REGISTERED status (default)'}
                                {subscriptionStatus === 'PREMIUM' && 'Send to users with active premium subscription'}
                                {subscriptionStatus === 'SUSPENDED' && 'Send to suspended users'}
                                {subscriptionStatus === 'TRIALED' && 'Send to users whose trial has expired'}
                            </p>
                        </div>
                    )}

                    {/* User Selection - Unified List */}
                    {sendType === 'specific' && (
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div>
                                <label className="block text-sm font-bold text-[#35095E] mb-2">
                                    Search and Select Users
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 pr-10 border-2 border-[#282C35] rounded-lg focus:border-[#51216E] focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white text-[#35095E] font-medium"
                                        placeholder="Search by name or browse all users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Unified User List */}
                            <div className="bg-purple-50 border-2 border-[#51216E] rounded-lg overflow-hidden">
                                {/* Header */}
                                <div className="bg-[#51216E] text-white px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold">
                                            Users {selectedUsers.length > 0 && `(${selectedUsers.length} selected)`}
                                        </p>
                                    </div>
                                    {selectedUsers.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleClearSelection}
                                            className="text-xs text-white hover:text-purple-200 font-medium underline"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* User List */}
                                <div className="max-h-96 overflow-y-auto bg-white">
                                    {(searchQuery.trim() ? filteredUsers : users).length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            {searchQuery.trim()
                                                ? `No users found matching "${searchQuery}"`
                                                : "No users available"}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Show selected users first if there's a search */}
                                            {searchQuery.trim() && selectedUsers.length > 0 && (
                                                <div className="border-b-2 border-purple-200">
                                                    <div className="bg-purple-100 px-4 py-2">
                                                        <p className="text-xs font-bold text-[#35095E]">
                                                            SELECTED USERS
                                                        </p>
                                                    </div>
                                                    {users
                                                        .filter(u => selectedUsers.includes(u.id))
                                                        .map((user) => (
                                                            <div
                                                                key={user.id}
                                                                className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={true}
                                                                    onChange={() => handleRemoveUser(user.id)}
                                                                    className="w-5 h-5 text-[#51216E] border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-200 cursor-pointer"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-[#35095E] text-sm">
                                                                        {user.name || "Unnamed User"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {user.phoneNumber} {user.email && `• ${user.email}`}
                                                                    </p>
                                                                </div>
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                    Selected
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}

                                            {/* Show filtered or all users */}
                                            {searchQuery.trim() && filteredUsers.length > 0 && (
                                                <div className="bg-gray-50 px-4 py-2">
                                                    <p className="text-xs font-bold text-gray-600">
                                                        SEARCH RESULTS
                                                    </p>
                                                </div>
                                            )}
                                            {(searchQuery.trim() ? filteredUsers : users).map((user) => {
                                                const isSelected = selectedUsers.includes(user.id);
                                                return (
                                                    <div
                                                        key={user.id}
                                                        className={`flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 cursor-pointer ${isSelected ? 'bg-purple-50' : ''
                                                            }`}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                handleRemoveUser(user.id);
                                                            } else {
                                                                handleSelectUser(user);
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => { }}
                                                            className="w-5 h-5 text-[#51216E] border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-200 cursor-pointer"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-[#35095E] text-sm">
                                                                {user.name || "Unnamed User"}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {user.phoneNumber} {user.email && `• ${user.email}`}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>

                                {/* Footer with selection count */}
                                {selectedUsers.length > 0 && (
                                    <div className="bg-purple-100 px-4 py-3 border-t-2 border-purple-200">
                                        <p className="text-sm text-[#35095E]">
                                            <span className="font-bold">{selectedUsers.length}</span> user{selectedUsers.length !== 1 ? 's' : ''} selected for notification
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
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
