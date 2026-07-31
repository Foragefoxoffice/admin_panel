import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Globe, Smartphone, Monitor, Filter, AlertCircle, Check, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/utils/config';

const SEGMENT_LABELS = {
    ALL: 'All Users',
    REGISTERED: 'Registered',
    PREMIUM: 'Premium',
    TRIALED: 'Trialed',
    ACTIVE_TRIAL: 'Active Trial',
    TRIAL_EXPIRED: 'Trial Expired',
    SUSPENDED: 'Suspended',
};

const SEGMENT_COLORS = {
    ALL: 'bg-gray-100 text-gray-600',
    REGISTERED: 'bg-blue-100 text-blue-700',
    PREMIUM: 'bg-yellow-100 text-yellow-700',
    TRIALED: 'bg-purple-100 text-purple-700',
    ACTIVE_TRIAL: 'bg-green-100 text-green-700',
    TRIAL_EXPIRED: 'bg-red-100 text-red-700',
    SUSPENDED: 'bg-orange-100 text-orange-700',
};

export default function BannerListPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [sectionTab, setSectionTab] = useState('HOME');

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/banners`);
            const data = await res.json();
            setBanners(data.map(b => ({ ...b, _id: b.id })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, current) => {
        // Optimistic update
        setBanners(prev => prev.map(b => b._id === id ? { ...b, isActive: !current } : b));

        try {
            const formData = new FormData();
            formData.append('isActive', (!current).toString());
            await fetch(`${API_BASE_URL}/banners/${id}`, {
                method: 'PUT',
                body: formData,
            });
        } catch {
            // Revert on failure
            setBanners(prev => prev.map(b => b._id === id ? { ...b, isActive: current } : b));
        }
    };

    const changeSection = async (id, currentSection, newSection) => {
        setBanners(prev => prev.map(b => b._id === id ? { ...b, section: newSection } : b));
        try {
            const formData = new FormData();
            formData.append('section', newSection);
            const res = await fetch(`${API_BASE_URL}/banners/${id}`, { method: 'PUT', body: formData });
            if (!res.ok) throw new Error('Failed');
        } catch {
            setBanners(prev => prev.map(b => b._id === id ? { ...b, section: currentSection } : b));
        }
    };

    const deleteBanner = async (id) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        setBanners(prev => prev.filter(b => b._id !== id));
        await fetch(`${API_BASE_URL}/banners/${id}`, { method: 'DELETE' });
    };

    const filteredBanners = banners.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'ALL' || b.platform === filter;
        const matchesSection = b.section === sectionTab;
        return matchesSearch && matchesFilter && matchesSection;
    });

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'WEB_DESKTOP': return <Monitor size={14} />;
            case 'WEB_MOBILE': return <Globe size={14} />;
            case 'MOBILE_APP': return <Smartphone size={14} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Banner Campaigns</h1>
                        <p className="text-gray-500 mt-1">Manage, track, and optimize your promotional banners</p>
                    </div>
                    <Link
                        to={`/admin/addbanners?section=${sectionTab}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Create Banner
                    </Link>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 border-b border-gray-200 pb-0">
                    {[
                        { key: 'HOME', label: 'Home Screen' },
                        { key: 'TEST_SERIES', label: 'Test Series' },
                        { key: 'UPSELL', label: 'Upsell Screen' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setSectionTab(key)}
                            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${sectionTab === key
                                ? 'border-blue-600 text-blue-600 bg-blue-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {label}
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {banners.filter(b => b.section === key).length}
                            </span>
                        </button>
                    ))}
                </div>

                {sectionTab === 'UPSELL' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                        These banners appear at the top of the upgrade/upsell screen. Each banner targets a specific user segment (e.g. Trial Expired, Registered). Upload different banners per segment for personalized messaging.
                    </div>
                )}

                {/* Controls Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search banners..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                        {['ALL', 'WEB_DESKTOP', 'WEB_MOBILE', 'MOBILE_APP'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {f === 'ALL' ? 'All' : f.split('_')[1] || f}
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
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredBanners.map(banner => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={banner._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
                                >
                                    {/* Image Area */}
                                    <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
                                        <img
                                            src={`${API_BASE_URL.replace('/api', '')}${banner.imageUrl}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt={banner.title}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${banner.isActive ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'
                                                }`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                {getPlatformIcon(banner.platform)}
                                                {banner.platform?.replace('WEB_', '')}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <select
                                                    value={banner.section || 'HOME'}
                                                    onChange={(e) => changeSection(banner._id, banner.section, e.target.value)}
                                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-0 cursor-pointer outline-none ${
                                                        banner.section === 'TEST_SERIES' ? 'bg-purple-100 text-purple-700'
                                                        : banner.section === 'UPSELL' ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <option value="HOME">Home</option>
                                                    <option value="TEST_SERIES">Test Series</option>
                                                    <option value="UPSELL">Upsell</option>
                                                </select>
                                                <span className="text-xs text-gray-400">Pr: {banner.priority}</span>
                                            </div>
                                        </div>
                                        {(() => {
                                            const targets = Array.isArray(banner.targetUsers)
                                                ? banner.targetUsers
                                                : (() => { try { return JSON.parse(banner.targetUsers || '["ALL"]'); } catch { return ['ALL']; } })();
                                            return targets.map(t => (
                                                <span
                                                    key={t}
                                                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-1 mb-1 ${SEGMENT_COLORS[t] || 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {SEGMENT_LABELS[t] || t}
                                                </span>
                                            ));
                                        })()}

                                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{banner.title}</h3>
                                        <p className="text-xs text-gray-500 truncate mb-4">{banner.redirectUrl}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={banner.isActive}
                                                    onChange={() => toggleStatus(banner._id, banner.isActive)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>

                                            <button
                                                onClick={() => deleteBanner(banner._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

                {!loading && filteredBanners.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Filter className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No banners found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
