import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Save, Loader2, Globe, Smartphone, Monitor } from 'lucide-react';
import { getNeetPlanById, updateNeetPlan, upsertNeetPlanPrice } from '../../utils/api';
import toast from 'react-hot-toast';

export default function EditNeetPlanPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activeTab, setActiveTab] = useState('WEB');

    const [planData, setPlanData] = useState({
        code: '',
        title: '',
        expiresAt: ''
    });

    const [prices, setPrices] = useState({
        WEB: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' },
        ANDROID: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' },
        IOS: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' }
    });

    useEffect(() => {
        fetchPlanData();
    }, [id]);

    const fetchPlanData = async () => {
        try {
            setFetching(true);
            const plan = await getNeetPlanById(id);

            // Set plan data
            setPlanData({
                code: plan.code,
                title: plan.title,
                expiresAt: new Date(plan.expiresAt).toISOString().split('T')[0]
            });

            // Set prices data
            const pricesData = {
                WEB: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' },
                ANDROID: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' },
                IOS: { id: null, price: '', originalPrice: '', discountedPrice: '', offerPercent: '', productId: '' }
            };

            plan.prices.forEach(price => {
                pricesData[price.platform] = {
                    id: price.id,
                    price: price.price.toString(),
                    originalPrice: price.originalPrice ? price.originalPrice.toString() : '',
                    discountedPrice: price.discountedPrice ? price.discountedPrice.toString() : '',
                    offerPercent: price.offerPercent ? price.offerPercent.toString() : '',
                    productId: price.productId || ''
                };
            });

            setPrices(pricesData);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch plan data');
            navigate('/admin/neet-plans');
        } finally {
            setFetching(false);
        }
    };

    const handlePlanChange = (field, value) => {
        setPlanData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriceChange = (platform, field, value) => {
        setPrices(prev => ({
            ...prev,
            [platform]: { ...prev[platform], [field]: value }
        }));
    };

    const validateForm = () => {
        if (!planData.code.trim()) {
            toast.error('Plan code is required');
            return false;
        }
        if (!planData.title.trim()) {
            toast.error('Plan title is required');
            return false;
        }
        if (!planData.expiresAt) {
            toast.error('Expiry date is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Step 1: Update the plan details
            await updateNeetPlan(id, {
                code: planData.code.toUpperCase(),
                title: planData.title,
                expiresAt: planData.expiresAt
            });

            // Step 2: Update prices for each platform
            const pricePromises = [];
            Object.entries(prices).forEach(([platform, data]) => {
                if (data.price && parseFloat(data.price) > 0) {
                    pricePromises.push(
                        upsertNeetPlanPrice({
                            planId: Number(id),
                            platform,
                            price: parseFloat(data.price),
                            originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
                            discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : null,
                            offerPercent: data.offerPercent ? parseInt(data.offerPercent) : null,
                            productId: data.productId || null
                        })
                    );
                }
            });

            await Promise.all(pricePromises);

            toast.success('NEET plan updated successfully!');
            navigate('/admin/neet-plans');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to update plan');
        } finally {
            setLoading(false);
        }
    };

    const platforms = [
        { id: 'WEB', name: 'Web', icon: Globe },
        { id: 'ANDROID', name: 'Android', icon: Smartphone },
        { id: 'IOS', name: 'iOS', icon: Monitor }
    ];

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
                    <p className="text-gray-600">Loading plan data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/neet-plans')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit NEET Plan</h1>
                        <p className="text-gray-500 mt-1">Update plan details and platform pricing</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Plan Details Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Plan Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Plan Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plan Code *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., NEET_2026"
                                    value={planData.code}
                                    onChange={(e) => handlePlanChange('code', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Unique identifier (will be uppercase)</p>
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        value={planData.expiresAt}
                                        onChange={(e) => handlePlanChange('expiresAt', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">When this plan expires</p>
                            </div>

                            {/* Plan Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plan Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., NEET 2026 Full Access"
                                    value={planData.title}
                                    onChange={(e) => handlePlanChange('title', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Display name for users</p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Pricing Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <DollarSign size={24} />
                                Platform Pricing
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Update prices for different platforms</p>
                        </div>

                        {/* Platform Tabs */}
                        <div className="flex border-b border-gray-100">
                            {platforms.map(({ id, name, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setActiveTab(id)}
                                    className={`flex-1 px-6 py-4 font-medium transition-all flex items-center justify-center gap-2 ${activeTab === id
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {name}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {platforms.map(({ id }) => (
                                <div
                                    key={id}
                                    className={activeTab === id ? 'block' : 'hidden'}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Final Price (You Pay) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Final Price (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 1119"
                                                value={prices[id].price}
                                                onChange={(e) => handlePriceChange(id, 'price', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                min="0"
                                                step="0.01"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">What the user actually pays</p>
                                        </div>

                                        {/* MRP (Original Price) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                MRP (₹)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 2499"
                                                value={prices[id].originalPrice}
                                                onChange={(e) => handlePriceChange(id, 'originalPrice', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                min="0"
                                                step="0.01"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Crossed out price</p>
                                        </div>

                                        {/* Discounted Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Discounted Price (₹)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 1399"
                                                value={prices[id].discountedPrice}
                                                onChange={(e) => handlePriceChange(id, 'discountedPrice', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                min="0"
                                                step="0.01"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Price before additional offer</p>
                                        </div>

                                        {/* Offer Percentage */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Offer (%)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 20"
                                                value={prices[id].offerPercent}
                                                onChange={(e) => handlePriceChange(id, 'offerPercent', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                min="0"
                                                max="100"
                                                step="1"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">e.g., 20 for 20% OFF</p>
                                        </div>

                                        {/* Product ID */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={id === 'ANDROID' ? 'Play Store SKU' : id === 'IOS' ? 'App Store SKU' : 'N/A'}
                                                value={prices[id].productId}
                                                onChange={(e) => handlePriceChange(id, 'productId', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {id === 'WEB' ? 'Not required for web' : 'Store product identifier'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/neet-plans')}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Plan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
