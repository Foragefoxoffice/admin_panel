import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Calendar, DollarSign, Filter, Loader2, Globe, Smartphone, Monitor, ToggleLeft, ToggleRight } from 'lucide-react';
import { getNeetPlans, toggleNeetPlan, deleteNeetPlan, toggleNeetPlanPrice } from '../../utils/api';
import toast from 'react-hot-toast';

export default function NeetPlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('ALL');
    const [expandedPlan, setExpandedPlan] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const data = await getNeetPlans();
            setPlans(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch NEET plans');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePlan = async (id, currentStatus) => {
        // Optimistic update
        setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));

        try {
            await toggleNeetPlan(id);
            toast.success('Plan status updated');
        } catch (err) {
            // Revert on failure
            setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: currentStatus } : p));
            toast.error('Failed to update plan status');
        }
    };

    const handleDeletePlan = async (id) => {
        if (!confirm('Are you sure you want to delete this plan? This will disable it.')) return;

        try {
            await deleteNeetPlan(id);
            setPlans(prev => prev.filter(p => p.id !== id));
            toast.success('Plan deleted successfully');
        } catch (err) {
            toast.error('Failed to delete plan');
        }
    };

    const handleTogglePrice = async (priceId, currentStatus) => {
        try {
            await toggleNeetPlanPrice(priceId);
            // Refresh plans to get updated price status
            fetchPlans();
            toast.success('Price status updated');
        } catch (err) {
            toast.error('Failed to update price status');
        }
    };

    const filteredPlans = plans.filter(p => {
        const matchesSearch = p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.title.toLowerCase().includes(search.toLowerCase());

        if (platformFilter === 'ALL') return matchesSearch;

        // Filter by platform - check if plan has active price for this platform
        const hasActivePriceForPlatform = p.prices?.some(
            price => price.platform === platformFilter && price.isActive
        );
        return matchesSearch && hasActivePriceForPlatform;
    });

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'WEB': return <Globe size={14} />;
            case 'ANDROID': return <Smartphone size={14} />;
            case 'IOS': return <Monitor size={14} />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">NEET Plans</h1>
                        <p className="text-gray-500 mt-1">Manage year-based NEET subscription plans</p>
                    </div>
                    <Link
                        to="/admin/neet-plans/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 w-fit"
                    >
                        <Plus size={20} />
                        Create Plan
                    </Link>
                </div>

                {/* Controls Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by code or title..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                        {['ALL', 'WEB', 'ANDROID', 'IOS'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setPlatformFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${platformFilter === f
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredPlans.map(plan => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={plan.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-2xl font-bold">{plan.code}</h3>
                                                <p className="text-blue-100 text-sm mt-1">{plan.title}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.isActive
                                                ? 'bg-green-500/90 text-white'
                                                : 'bg-gray-500/90 text-white'
                                                }`}>
                                                {plan.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-100 text-sm">
                                            <Calendar size={16} />
                                            <span>Expires: {formatDate(plan.expiresAt)}</span>
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="p-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Platform Pricing
                                        </h4>

                                        {plan.prices && plan.prices.length > 0 ? (
                                            <div className="space-y-2">
                                                {plan.prices.map(price => (
                                                    <div
                                                        key={price.id}
                                                        className={`flex items-center justify-between p-3 rounded-lg border ${price.isActive
                                                            ? 'bg-blue-50 border-blue-200'
                                                            : 'bg-gray-50 border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {getPlatformIcon(price.platform)}
                                                            <span className="font-medium text-sm">{price.platform}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-blue-600">
                                                                ₹{price.price.toLocaleString()}
                                                            </span>
                                                            <button
                                                                onClick={() => handleTogglePrice(price.id, price.isActive)}
                                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                                title={price.isActive ? 'Disable' : 'Enable'}
                                                            >
                                                                {price.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm text-center py-4">No pricing configured</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={plan.isActive}
                                                onChange={() => handleTogglePlan(plan.id, plan.isActive)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                {plan.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </label>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/neet-plans/edit/${plan.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit plan"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeletePlan(plan.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete plan"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredPlans.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Filter className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No plans found</h3>
                        <p className="text-gray-500">Try adjusting your filters or create a new plan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
