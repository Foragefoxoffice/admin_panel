import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Layout, Smartphone, Globe, CheckCircle, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/config';

const PlatformCard = ({ icon: Icon, label, value, selected, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(value)}
        className={`
      cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
      ${selected ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white hover:border-gray-200 text-gray-500'}
    `}
    >
        <Icon size={24} />
        <span className="text-sm font-medium">{label}</span>
    </motion.div>
);

const UserTargetCard = ({ label, value, checked, onChange }) => (
    <div
        onClick={() => onChange(value)}
        className={`
      cursor-pointer p-3 rounded-lg border transition-all duration-200 select-none
      ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}
    `}
    >
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={`text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
        </div>
    </div>
);

export default function CreateBannerPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultSection = searchParams.get('section') || 'HOME';
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        redirectUrl: '',
        isActive: true,
        platform: 'MOBILE_APP',
        targetUsers: ['ALL'],
        priority: 0,
        section: defaultSection,
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm({ ...form, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleTargetToggle = (value) => {
        setForm(prev => {
            if (value === 'ALL') {
                return { ...prev, targetUsers: ['ALL'] };
            }
            const without = prev.targetUsers.filter(v => v !== 'ALL' && v !== value);
            const added = prev.targetUsers.includes(value) ? without : [...without, value];
            return { ...prev, targetUsers: added.length === 0 ? ['ALL'] : added };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.title.trim()) { setLoading(false); return alert('Please enter title'); }
        if (!form.image) { setLoading(false); return alert('Please upload banner image'); }

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'targetUsers') {
                    formData.append('targetUsers', JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const res = await fetch(`${API_BASE_URL}/banners`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to create banner');

            setShowSuccess(true);
            setTimeout(() => navigate('/admin/banners'), 2000);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Banner</h1>
                        <p className="text-gray-500 mt-1">Design and publish high-converting banners</p>
                    </div>
                    <button onClick={() => navigate('/admin/banners')} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Banner Asset</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`
                    border-2 border-dashed rounded-xl p-8 transition-colors duration-200 text-center
                    ${preview ? 'border-gray-200 bg-gray-50' : 'border-blue-100 bg-blue-50/50 hover:bg-blue-50'}
                  `}>
                                        {preview ? (
                                            <div className="flex flex-col items-center">
                                                <img src={preview} alt="Preview" className="h-32 rounded-lg shadow-sm object-cover mb-3" />
                                                <span className="text-xs text-gray-500">Click to change</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <Upload size={20} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">Click or Drag to Upload</span>
                                                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Banner Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Summer Sale 2024"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Redirect URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                        value={form.redirectUrl}
                                        onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Platform Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Display Platform</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <PlatformCard
                                        icon={Layout}
                                        label="Desktop"
                                        value="WEB_DESKTOP"
                                        selected={form.platform === 'WEB_DESKTOP'}
                                        onClick={(v) => setForm({ ...form, platform: v })}
                                    />
                                    <PlatformCard
                                        icon={Globe}
                                        label="Mobile Web"
                                        value="WEB_MOBILE"
                                        selected={form.platform === 'WEB_MOBILE'}
                                        onClick={(v) => setForm({ ...form, platform: v })}
                                    />
                                    <PlatformCard
                                        icon={Smartphone}
                                        label="Native App"
                                        value="MOBILE_APP"
                                        selected={form.platform === 'MOBILE_APP'}
                                        onClick={(v) => setForm({ ...form, platform: v })}
                                    />
                                </div>
                            </div>

                            {/* Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Banner Section</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'HOME', label: 'Home Screen' },
                                        { value: 'TEST_SERIES', label: 'Test Series' },
                                        { value: 'UPSELL', label: 'Upsell Screen' },
                                    ].map(opt => (
                                        <div
                                            key={opt.value}
                                            onClick={() => setForm({ ...form, section: opt.value })}
                                            className={`cursor-pointer p-3 rounded-xl border-2 text-center text-sm transition-all duration-200 ${form.section === opt.value ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                                        >
                                            {opt.label}
                                        </div>
                                    ))}
                                </div>
                                {form.section === 'UPSELL' && (
                                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                        Upsell banners show at the top of the upgrade screen. Select the user segment below to target specific audiences.
                                    </p>
                                )}
                            </div>

                            {/* Target Users */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">
                                    Target Audience
                                    <span className="ml-2 text-xs font-normal text-gray-400">(select multiple)</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { value: 'ALL', label: 'All' },
                                        { value: 'REGISTERED', label: 'Registered' },
                                        { value: 'TRIALED', label: 'Trialed' },
                                        { value: 'ACTIVE_TRIAL', label: 'Active Trial' },
                                        { value: 'TRIAL_EXPIRED', label: 'Trial Expired' },
                                        { value: 'PREMIUM', label: 'Premium' },
                                        { value: 'SUSPENDED', label: 'Suspended' },
                                    ].map(type => (
                                        <UserTargetCard
                                            key={type.value}
                                            label={type.label}
                                            value={type.value}
                                            checked={form.targetUsers.includes(type.value)}
                                            onChange={handleTargetToggle}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Priority Order</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                        value={form.priority}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Status</label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${form.isActive ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${form.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                            {form.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Publish Banner'}
                                    {!loading && <ArrowRight size={20} />}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Right Column - Live Preview */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>

                            <div className="border-[10px] border-gray-800 rounded-[2.5rem] bg-gray-900 overflow-hidden shadow-2xl relative aspect-[9/18] max-h-[600px] w-full max-w-sm mx-auto">
                                {/* Phone Status Bar Mock */}
                                <div className="h-6 bg-black w-full flex justify-between px-6 items-center">
                                    <div className="w-12 h-3 bg-gray-800 rounded-full" />
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 bg-gray-700 rounded-full" />
                                        <div className="w-3 h-3 bg-gray-700 rounded-full" />
                                    </div>
                                </div>

                                {/* App Content */}
                                <div className="bg-gray-50 h-full w-full overflow-y-auto relative no-scrollbar">
                                    {/* Mock App Header */}
                                    <div className="bg-white p-4 flex justify-between items-center shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-100" />
                                        <div className="w-24 h-4 rounded bg-gray-100" />
                                        <div className="w-6 h-6 rounded bg-gray-100" />
                                    </div>

                                    {/* The Banner Itself */}
                                    <div className="p-4">
                                        <motion.div
                                            layout
                                            className="w-full relative rounded-xl overflow-hidden shadow-lg bg-white group cursor-pointer"
                                        >
                                            {!preview ? (
                                                <div className="aspect-[2/1] bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                                    <span className="text-xs font-medium">No Image</span>
                                                </div>
                                            ) : (
                                                <motion.img
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    src={preview}
                                                    className="w-full object-cover"
                                                />
                                            )}

                                            {/* Overlay info if needed, usually banners are just images but we can show metadata */}
                                            {form.platform === 'WEB_DESKTOP' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-medium px-3 py-1 rounded-full border border-white/50">Desktop Mode</span>
                                                </div>
                                            )}
                                        </motion.div>

                                        <div className="mt-6 space-y-3">
                                            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                                            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                                            <div className="h-20 bg-gray-200 rounded-lg animate-pulse delay-75" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-6 text-gray-400 text-sm">
                                Previewing for <span className="text-gray-600 font-medium">{form.platform.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-600" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Banner Created!</h2>
                            <p className="text-gray-500 mb-8">Your banner has been successfully published and is now live.</p>
                            <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium">
                                Redirecting...
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
