import React, { useEffect, useState } from "react";
import { sendAdminNotification, fetchAllUsers } from "../../utils/api";

const SendNotification = () => {
    const [users, setUsers] = useState([]);
    const [sendType, setSendType] = useState('all'); // 'all', 'status', 'date', 'specific'
    const [subscriptionStatus, setSubscriptionStatus] = useState('ALL');
    const [dateFilter, setDateFilter] = useState({ field: 'trialEndsAt', condition: 'in_next', days: 3 });
    const [selectedUsers, setSelectedUsers] = useState([]); // Changed to array for multiple selection
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [preview, setPreview] = useState({ title: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", text: "" });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

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

    // Compute users matching the date filter
    const getDateFilteredUserIds = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const { field, condition, days } = dateFilter;
        return users
            .filter(u => {
                const raw = u[field];
                if (!raw) return false;
                const d = new Date(raw);
                d.setHours(0, 0, 0, 0);
                const diffDays = Math.round((d - now) / 86400000); // positive = future
                if (condition === 'in_next') return diffDays >= 0 && diffDays <= days;
                if (condition === 'expired_within') return diffDays < 0 && diffDays >= -days;
                if (condition === 'today') return diffDays === 0;
                return false;
            })
            .map(u => u.id);
    };

    const dateFilteredCount = sendType === 'date' ? getDateFilteredUserIds().length : 0;

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

        if (sendType === 'date') {
            const ids = getDateFilteredUserIds();
            if (ids.length === 0) {
                setAlert({ type: "error", text: "No users match the selected date filter." });
                return;
            }
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
            } else if (sendType === 'date') {
                payload.userIds = getDateFilteredUserIds();
            } else {
                payload.userIds = selectedUsers;
            }

            await sendAdminNotification(payload, imageFile);

            setAlert({ type: "success", text: "Notification sent successfully!" });
            setTitle("");
            setMessage("");
            setImageFile(null);
            setImagePreview(null);
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

                {/* Image Attachment */}
                <div>
                    <label className="block text-sm font-bold text-[#35095E] mb-2">
                        Image Attachment <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    {!imagePreview ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors">
                            <div className="flex flex-col items-center gap-1 text-purple-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs text-gray-400">PNG, JPG, WEBP — max 5 MB</span>
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    ) : (
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="preview" className="h-40 rounded-xl object-cover border-2 border-purple-200" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                            >
                                ✕
                            </button>
                            <p className="text-xs text-gray-500 mt-1">{imageFile?.name}</p>
                        </div>
                    )}
                </div>

                {/* Preview Output */}
                {(preview.title || preview.message) && (
                    <div className="bg-purple-50 border-2 border-[#51216E] rounded-lg p-5">
                        <h3 className="font-bold text-[#35095E] mb-3">Preview Output</h3>
                        <div className="bg-white rounded-lg p-4 space-y-3">
                            {imagePreview && (
                                <img src={imagePreview} alt="notification" className="w-full max-h-48 object-cover rounded-lg" />
                            )}
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                        {/* By Date Option */}
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                checked={sendType === 'date'}
                                onChange={() => setSendType('date')}
                                className="peer sr-only"
                            />
                            <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-[#51216E] peer-checked:bg-purple-50 transition-all hover:border-[#51216E] h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                        {sendType === 'date' && <div className="w-2 h-2 bg-[#51216E] rounded-full"></div>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#35095E]">By Date</p>
                                        <p className="text-xs text-gray-500">Trial / Premium dates</p>
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

                    {/* Date-based filter */}
                    {sendType === 'date' && (
                        <div className="mt-4 space-y-4">
                            {/* Quick preset chips */}
                            <div>
                                <label className="block text-sm font-bold text-[#35095E] mb-2">Quick Presets</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: '🔔 Trial ending in 1 day',   field: 'trialEndsAt',    condition: 'in_next',        days: 1 },
                                        { label: '🔔 Trial ending in 3 days',   field: 'trialEndsAt',    condition: 'in_next',        days: 3 },
                                        { label: '📅 Trial starts today',        field: 'trialStartedAt', condition: 'today',          days: 0 },
                                        { label: '⏰ Premium expiring in 7 days', field: 'premiumExpiry',  condition: 'in_next',        days: 7 },
                                        { label: '⏰ Premium expiring in 3 days', field: 'premiumExpiry',  condition: 'in_next',        days: 3 },
                                        { label: '💔 Trial expired today',        field: 'trialEndsAt',    condition: 'expired_within', days: 1 },
                                        { label: '💔 Premium expired today',      field: 'premiumExpiry',  condition: 'expired_within', days: 1 },
                                    ].map((p) => {
                                        const active = dateFilter.field === p.field && dateFilter.condition === p.condition && dateFilter.days === p.days;
                                        return (
                                            <button
                                                key={p.label}
                                                type="button"
                                                onClick={() => setDateFilter({ field: p.field, condition: p.condition, days: p.days })}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${active ? 'bg-[#51216E] border-[#51216E] text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-[#51216E]'}`}
                                            >
                                                {p.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom filter */}
                            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-3">
                                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Custom Filter</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Field */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date Field</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            value={dateFilter.field}
                                            onChange={e => setDateFilter(f => ({ ...f, field: e.target.value }))}
                                        >
                                            <option value="trialStartedAt">Trial Start Date</option>
                                            <option value="trialEndsAt">Trial End Date</option>
                                            <option value="premiumExpiry">Premium Expiry Date</option>
                                        </select>
                                    </div>
                                    {/* Condition */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Condition</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            value={dateFilter.condition}
                                            onChange={e => setDateFilter(f => ({ ...f, condition: e.target.value }))}
                                        >
                                            {dateFilter.field === 'trialStartedAt' ? (
                                                <>
                                                    <option value="in_next">Starts in next N days</option>
                                                    <option value="expired_within">Started within last N days</option>
                                                    <option value="today">Is today</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="in_next">Expires in next N days</option>
                                                    <option value="expired_within">Expired within last N days</option>
                                                    <option value="today">Is today</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    {/* Days */}
                                    {dateFilter.condition !== 'today' && (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Days (N)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={365}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                value={dateFilter.days}
                                                onChange={e => setDateFilter(f => ({ ...f, days: Math.max(1, Number(e.target.value)) }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Matching users count */}
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${dateFilteredCount > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                                <span className="text-2xl font-bold" style={{ color: dateFilteredCount > 0 ? '#059669' : '#dc2626' }}>
                                    {dateFilteredCount}
                                </span>
                                <div>
                                    <p className={`text-sm font-semibold ${dateFilteredCount > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {dateFilteredCount > 0 ? `user${dateFilteredCount !== 1 ? 's' : ''} match this filter` : 'No users match this filter'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {dateFilter.condition === 'in_next' && (
                                            dateFilter.field === 'trialStartedAt'
                                                ? `Trial starting in the next ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                                : dateFilter.field === 'premiumExpiry'
                                                    ? `Premium expiring in the next ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                                    : `Trial expiring in the next ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                        )}
                                        {dateFilter.condition === 'expired_within' && (
                                            dateFilter.field === 'trialStartedAt'
                                                ? `Trial started within the last ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                                : dateFilter.field === 'premiumExpiry'
                                                    ? `Premium expired within the last ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                                    : `Trial expired within the last ${dateFilter.days} day${dateFilter.days !== 1 ? 's' : ''}`
                                        )}
                                        {dateFilter.condition === 'today' && `${dateFilter.field === 'trialStartedAt' ? 'Trial started' : dateFilter.field === 'trialEndsAt' ? 'Trial ends' : 'Premium expires'} today`}
                                    </p>
                                </div>
                            </div>
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
