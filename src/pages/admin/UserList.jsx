import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import {
  fetchAllUsers,
  updateUserSubscription,
  fetchUserTSAccess,
  grantUserTSPackage,
  revokeUserTSPackage,
  grantUserTSBundle,
  revokeUserTSBundle,
} from '@/utils/api';
import toast from 'react-hot-toast';


export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState('all');
  const [trialStatusFilter, setTrialStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingSub, setEditingSub] = useState(false);
  const [subForm, setSubForm] = useState({});
  const [subSaving, setSubSaving] = useState(false);
  const [tsAccess, setTsAccess] = useState(null);
  const [tsLoading, setTsLoading] = useState(false);
  // Tracks which single control is mid-request — 'bundle' or a packageId —
  // so only that one button shows a busy state, not the whole section.
  const [tsActionLoading, setTsActionLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedUser?.id) {
      setTsAccess(null);
      return;
    }
    let cancelled = false;
    setTsLoading(true);
    fetchUserTSAccess(selectedUser.id)
      .then((data) => { if (!cancelled) setTsAccess(data); })
      .catch(() => { if (!cancelled) setTsAccess(null); })
      .finally(() => { if (!cancelled) setTsLoading(false); });
    return () => { cancelled = true; };
  }, [selectedUser?.id]);

  const handleGrantBundle = async () => {
    setTsActionLoading('bundle');
    try {
      await grantUserTSBundle(selectedUser.id);
      setTsAccess((prev) => ({ ...prev, hasBundleAccess: true, bundlePurchasedAt: new Date().toISOString() }));
      toast.success('Overall Test Series access granted');
    } catch {
      toast.error('Failed to grant overall access');
    } finally {
      setTsActionLoading(null);
    }
  };

  const handleRevokeBundle = async () => {
    setTsActionLoading('bundle');
    try {
      await revokeUserTSBundle(selectedUser.id);
      setTsAccess((prev) => ({ ...prev, hasBundleAccess: false, bundlePurchasedAt: null }));
      toast.success('Overall access revoked');
    } catch {
      toast.error('Failed to revoke overall access');
    } finally {
      setTsActionLoading(null);
    }
  };

  const handleGrantPackage = async (pkg) => {
    setTsActionLoading(pkg.id);
    try {
      await grantUserTSPackage(selectedUser.id, pkg.id);
      setTsAccess((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => (p.id === pkg.id ? { ...p, hasAccess: true, purchasedAt: new Date().toISOString() } : p)),
      }));
      toast.success(`Access to "${pkg.title}" granted`);
    } catch {
      toast.error('Failed to grant access');
    } finally {
      setTsActionLoading(null);
    }
  };

  const handleRevokePackage = async (pkg) => {
    setTsActionLoading(pkg.id);
    try {
      await revokeUserTSPackage(selectedUser.id, pkg.id);
      setTsAccess((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => (p.id === pkg.id ? { ...p, hasAccess: false, purchasedAt: null } : p)),
      }));
      toast.success(`Access to "${pkg.title}" revoked`);
    } catch {
      toast.error('Failed to revoke access');
    } finally {
      setTsActionLoading(null);
    }
  };

  const openSubEdit = (user) => {
    setSubForm({
      status: user.status || 'REGISTERED',
      premiumExpiry: user.premiumExpiry ? new Date(user.premiumExpiry).toISOString().slice(0, 10) : '',
      trialStartedAt: user.trialStartedAt ? new Date(user.trialStartedAt).toISOString().slice(0, 10) : '',
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt).toISOString().slice(0, 10) : '',
      hasUsedTrial: user.hasUsedTrial ?? false,
    });
    setEditingSub(true);
  };

  const handleSaveSubscription = async () => {
    setSubSaving(true);
    try {
      const payload = {
        status: subForm.status,
        premiumExpiry: subForm.premiumExpiry || null,
        trialStartedAt: subForm.trialStartedAt || null,
        trialEndsAt: subForm.trialEndsAt || null,
        hasUsedTrial: subForm.hasUsedTrial,
      };
      const res = await updateUserSubscription(selectedUser.id, payload);
      // update local list
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...res.user } : u));
      setSelectedUser(prev => ({ ...prev, ...res.user }));
      setEditingSub(false);
      toast.success('Subscription updated');
    } catch {
      toast.error('Failed to update subscription');
    } finally {
      setSubSaving(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Helper function to determine if user is on active trial
  const isOnActiveTrial = (user) => {
    if (!user.trialStartedAt || !user.trialEndsAt) return false;
    const now = new Date();
    const trialEnd = new Date(user.trialEndsAt);
    return now <= trialEnd;
  };

  // Helper function to get trial status
  const getTrialStatus = (user) => {
    if (!user.trialStartedAt || !user.trialEndsAt) return 'never';
    return isOnActiveTrial(user) ? 'active' : 'expired';
  };

  // Get unique classes for filter
  const uniqueClasses = useMemo(() => {
    const classes = users.map(u => u.className).filter(Boolean);
    return [...new Set(classes)].sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      // Determine subscription status filter match
      let matchesSubscriptionStatus = false;

      if (subscriptionStatusFilter === 'all') {
        matchesSubscriptionStatus = true;
      } else if (subscriptionStatusFilter === 'trial') {
        // Active trial: ONLY users with REGISTERED status who are on active trial
        matchesSubscriptionStatus = user.status === 'REGISTERED' && isOnActiveTrial(user);
      } else if (subscriptionStatusFilter === 'trialed') {
        // Expired trial: users with TRIALED status OR users with expired trial dates
        matchesSubscriptionStatus =
          user.status === 'TRIALED' ||
          (user.trialStartedAt && user.trialEndsAt && !isOnActiveTrial(user) && user.status !== 'PREMIUM' && user.status !== 'SUSPENDED');
      } else if (subscriptionStatusFilter === 'registered') {
        // Registered: REGISTERED status but NOT on active trial
        matchesSubscriptionStatus = user.status === 'REGISTERED' && !isOnActiveTrial(user);
      } else {
        // Other statuses (PREMIUM, SUSPENDED)
        matchesSubscriptionStatus = user.status?.toLowerCase() === subscriptionStatusFilter.toLowerCase();
      }

      const matchesTrialStatus =
        trialStatusFilter === 'all' ||
        getTrialStatus(user) === trialStatusFilter;

      const matchesGender =
        genderFilter === 'all' ||
        user.gender?.toLowerCase() === genderFilter.toLowerCase();

      const matchesClass =
        classFilter === 'all' ||
        user.className === classFilter;

      return matchesSearch && matchesSubscriptionStatus && matchesTrialStatus && matchesGender && matchesClass;
    });
  }, [users, searchTerm, subscriptionStatusFilter, trialStatusFilter, genderFilter, classFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSubscriptionStatusFilter('all');
    setTrialStatusFilter('all');
    setGenderFilter('all');
    setClassFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (user) => {
    // Check status field first
    switch (user.status) {
      case 'PREMIUM':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Premium</span>;
      case 'TRIALED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Trial Expired</span>;
      case 'SUSPENDED':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</span>;
      case 'REGISTERED':
        // For REGISTERED users, check if they're on active trial
        if (isOnActiveTrial(user)) {
          return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Trial</span>;
        }
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Registered</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Registered</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
          </p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Subscription Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subscription Status</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={subscriptionStatusFilter}
                onChange={(e) => {
                  setSubscriptionStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="trial">Active Trial</option>
                <option value="registered">Registered</option>
                <option value="premium">Premium</option>
                <option value="trialed">Trial Expired</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Trial Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Trial Status</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={trialStatusFilter}
                onChange={(e) => {
                  setTrialStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="active">Active Trial</option>
                <option value="expired">Expired Trial</option>
                <option value="never">Never Trialed</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
              <select
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium Expiry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profile ? (
                            <img
                              src={
                                user.profile.startsWith("http")
                                  ? user.profile
                                  : `https://mitoslearning.in${user.profile}`
                              }
                              alt="User Icon"
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed'}</div>
                          <div className="text-sm text-gray-500">{user.email || user.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.trialStartedAt ? (
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {isOnActiveTrial(user) ? (
                              <span className="text-blue-600 font-medium">Active</span>
                            ) : (
                              <span className="text-orange-600 font-medium">Expired</span>
                            )}
                          </div>
                          <div className="text-gray-500">Ends: {formatDate(user.trialEndsAt)}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.premiumExpiry ? formatDate(user.premiumExpiry) : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {user.className || '—'}
                          {user.age && ` • ${user.age}y`}
                        </div>
                        <div className="text-gray-500 capitalize">{user.gender || '—'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="text-blue-600 bg-transparent hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border text-sm flex items-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-white hover:bg-[#6712B7]'
                  }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === pageNum
                      ? 'bg-white text-black shadow-sm border'
                      : 'border border-gray-200 text-white hover:bg-[#6712B7]'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-3 py-1 text-sm text-gray-500">...</span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border text-sm flex items-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-white' : 'text-white hover:bg-[#6712B7]'
                  }`}
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedUser(null); setEditingSub(false); }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => { setSelectedUser(null); setEditingSub(false); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  {selectedUser.profile ? (
                    <img
                      src={
                        selectedUser.profile.startsWith("http")
                          ? selectedUser.profile
                          : `https://mitoslearning.in${selectedUser.profile}`
                      }
                      alt="User Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-blue-100">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || 'Unnamed User'}</h3>
                  <p className="text-gray-600">{selectedUser.email || 'No email'}</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedUser)}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.email || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.phoneNumber || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.age ? `${selectedUser.age} years` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{selectedUser.gender || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Class</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.className || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Control */}
                <div className="md:col-span-2 rounded-xl border-2 border-purple-200 bg-purple-50/40 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                      <span>🔑</span> Subscription Control
                    </h4>
                    {!editingSub ? (
                      <button
                        onClick={() => openSubEdit(selectedUser)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700"
                      >
                        ✏️ Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveSubscription}
                          disabled={subSaving}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {subSaving ? 'Saving…' : '✓ Save'}
                        </button>
                        <button
                          onClick={() => setEditingSub(false)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {!editingSub ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <div>{getStatusBadge(selectedUser)}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Premium Expiry</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(selectedUser.premiumExpiry)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Trial Status</p>
                        <p className="text-sm font-semibold">
                          {selectedUser.trialStartedAt ? (
                            isOnActiveTrial(selectedUser)
                              ? <span className="text-blue-600">Active</span>
                              : <span className="text-orange-500">Expired</span>
                          ) : <span className="text-gray-400">Never</span>}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Trial Starts</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(selectedUser.trialStartedAt)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Trial Ends</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(selectedUser.trialEndsAt)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Has Used Trial</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedUser.hasUsedTrial ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Status selector — always visible */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { value: 'REGISTERED', label: 'Registered', color: 'border-gray-400 text-gray-700 bg-gray-50', active: 'border-gray-600 bg-gray-600 text-white' },
                            { value: 'TRIALED',    label: 'Trial',      color: 'border-blue-400 text-blue-700 bg-blue-50',  active: 'border-blue-600 bg-blue-600 text-white' },
                            { value: 'PREMIUM',    label: 'Premium',    color: 'border-purple-400 text-purple-700 bg-purple-50', active: 'border-purple-600 bg-purple-600 text-white' },
                            { value: 'SUSPENDED',  label: 'Suspended',  color: 'border-red-400 text-red-700 bg-red-50',    active: 'border-red-600 bg-red-600 text-white' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setSubForm(f => ({ ...f, status: opt.value }))}
                              className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${subForm.status === opt.value ? opt.active : opt.color}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PREMIUM: show expiry date only */}
                      {subForm.status === 'PREMIUM' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">Premium Access</p>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Premium Expiry Date</label>
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                              value={subForm.premiumExpiry}
                              onChange={(e) => setSubForm(f => ({ ...f, premiumExpiry: e.target.value }))}
                            />
                          </div>
                        </div>
                      )}

                      {/* TRIALED: show trial start + end dates */}
                      {subForm.status === 'TRIALED' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">Trial Dates</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Trial Start Date</label>
                              <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={subForm.trialStartedAt}
                                onChange={(e) => setSubForm(f => ({ ...f, trialStartedAt: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Trial End Date</label>
                              <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={subForm.trialEndsAt}
                                onChange={(e) => setSubForm(f => ({ ...f, trialEndsAt: e.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUSPENDED: show expiry for reference */}
                      {subForm.status === 'SUSPENDED' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-xs font-bold text-red-700 mb-3 uppercase tracking-wide">Suspension Details</p>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Premium Expiry Date</label>
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                              value={subForm.premiumExpiry}
                              onChange={(e) => setSubForm(f => ({ ...f, premiumExpiry: e.target.value }))}
                            />
                          </div>
                        </div>
                      )}

                      {/* Has Used Trial — always visible */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">Has Used Trial</span>
                        <div className="flex gap-2">
                          {['No', 'Yes'].map((label, i) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setSubForm(f => ({ ...f, hasUsedTrial: i === 1 }))}
                              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                                subForm.hasUsedTrial === (i === 1)
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-600'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Series Access — independent of Premium/trial above;
                    access is purchase-row existence, not a status field. */}
                <div className="md:col-span-2 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 p-4">
                  <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2 mb-4">
                    <span>🎫</span> Test Series Access
                  </h4>

                  {tsLoading ? (
                    <p className="text-sm text-gray-500">Loading…</p>
                  ) : !tsAccess ? (
                    <p className="text-sm text-gray-500">Failed to load access state.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white rounded-lg p-3 border-2 border-indigo-300">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Overall Access (all packages)</p>
                          <p className="text-xs text-gray-500">
                            {tsAccess.hasBundleAccess
                              ? `Granted — covers every package, present and future`
                              : 'Not granted — access is per-package below'}
                          </p>
                        </div>
                        <button
                          onClick={() => (tsAccess.hasBundleAccess ? handleRevokeBundle() : handleGrantBundle())}
                          disabled={tsActionLoading === 'bundle'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all disabled:opacity-50 ${
                            tsAccess.hasBundleAccess
                              ? 'border-red-400 text-red-700 bg-red-50 hover:bg-red-100'
                              : 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {tsActionLoading === 'bundle' ? '…' : tsAccess.hasBundleAccess ? 'Revoke' : 'Grant Overall'}
                        </button>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 max-h-64 overflow-y-auto">
                        {tsAccess.packages.length === 0 ? (
                          <p className="text-sm text-gray-400 p-3">No Test Series packages exist yet.</p>
                        ) : (
                          tsAccess.packages.map((pkg) => {
                            const effectiveAccess = tsAccess.hasBundleAccess || pkg.hasAccess;
                            return (
                              <div key={pkg.id} className="flex items-center justify-between px-3 py-2 gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm text-gray-800 truncate">{pkg.title}</p>
                                  <p className="text-xs text-gray-400">₹{pkg.price}{!pkg.isActive && ' · inactive'}</p>
                                </div>
                                <button
                                  onClick={() => (pkg.hasAccess ? handleRevokePackage(pkg) : handleGrantPackage(pkg))}
                                  disabled={tsActionLoading === pkg.id || (tsAccess.hasBundleAccess && !pkg.hasAccess)}
                                  title={tsAccess.hasBundleAccess && !pkg.hasAccess ? 'Already covered by overall access' : ''}
                                  className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold border-2 transition-all disabled:opacity-40 ${
                                    effectiveAccess
                                      ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
                                      : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
                                  } ${pkg.hasAccess ? 'hover:bg-red-50 hover:border-red-400 hover:text-red-700' : ''}`}
                                >
                                  {tsActionLoading === pkg.id
                                    ? '…'
                                    : effectiveAccess
                                    ? (pkg.hasAccess ? '✓ Revoke' : '✓ Included')
                                    : 'Grant'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{selectedUser.role || 'user'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created At</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => { setSelectedUser(null); setEditingSub(false); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/admin/user/${selectedUser.id}`);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}