import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Smartphone, Loader2, Filter, Image } from 'lucide-react';
import { API_BASE_URL } from '@/utils/config';

export default function TestSeriesBannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/banners?section=TEST_SERIES`);
            const data = await res.json();
            setBanners(data.map(b => ({ ...b, _id: b.id })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, current) => {
        setBanners(prev => prev.map(b => b._id === id ? { ...b, isActive: !current } : b));
        try {
            const formData = new FormData();
            formData.append('isActive', (!current).toString());
            await fetch(`${API_BASE_URL}/banners/${id}`, {
                method: 'PUT',
                body: formData,
            });
        } catch {
            setBanners(prev => prev.map(b => b._id === id ? { ...b, isActive: current } : b));
        }
    };

    const deleteBanner = async (id) => {
        if (!confirm('Delete this banner?')) return;
        setBanners(prev => prev.filter(b => b._id !== id));
        try {
            await fetch(`${API_BASE_URL}/banners/${id}`, { method: 'DELETE' });
            setSuccessMessage('Banner deleted');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setDeleteError('Failed to delete banner');
            setTimeout(() => setDeleteError(null), 3000);
            fetchBanners();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <AnimatePresence>
                    {successMessage && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                            {successMessage}
                        </motion.div>
                    )}
                    {deleteError && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                            {deleteError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Test Series Banners</h1>
                        <p className="text-gray-500 mt-1">Banners displayed on the Test Series screen in the app</p>
                    </div>
                    <Link
                        to="/admin/addbanners?section=TEST_SERIES"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 w-fit"
                    >
                        <Plus size={20} />
                        Add Banner
                    </Link>
                </div>

                {/* Info pill */}
                <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-medium w-fit">
                    <Smartphone size={16} />
                    These banners appear only on the Test Series page in the mobile app
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                            <Image className="text-purple-300" size={36} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No banners yet</h3>
                        <p className="text-gray-500 mb-6">Add a banner to display on the Test Series screen.</p>
                        <Link to="/admin/addbanners?section=TEST_SERIES"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2">
                            <Plus size={18} /> Add First Banner
                        </Link>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {banners.map(banner => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={banner._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col"
                                >
                                    <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
                                        <img
                                            src={`${API_BASE_URL.replace('/api', '')}${banner.imageUrl}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt={banner.title}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${banner.isActive ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                                                <Smartphone size={12} /> Mobile App
                                            </span>
                                            <span className="text-xs text-gray-400">Pr: {banner.priority}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{banner.title}</h3>
                                        <p className="text-xs text-gray-500 truncate mb-4">{banner.redirectUrl || '—'}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={banner.isActive}
                                                    onChange={() => toggleStatus(banner._id, banner.isActive)}
                                                    className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
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
            </div>
        </div>
    );
}
