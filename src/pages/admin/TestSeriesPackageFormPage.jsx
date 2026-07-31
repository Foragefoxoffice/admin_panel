import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";
import {
  ArrowLeft, Save, Smartphone, Package, Plus, X,
  Type, FileText, Tag, Star, Image, Trash2, Upload,
} from "lucide-react";

export default function TestSeriesPackageFormPage() {
  const { packageId } = useParams();
  const isEdit = Boolean(packageId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [price, setPrice] = useState(0);
  const [mrp, setMrp] = useState("");
  const [physicalPrice, setPhysicalPrice] = useState("");
  const [physicalMrp, setPhysicalMrp] = useState("");
  const [paymentSubtitle, setPaymentSubtitle] = useState("");
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [bannerImages, setBannerImages] = useState([]); // current saved URLs
  const [bannerFiles, setBannerFiles] = useState([]);   // new files to upload
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!isEdit) return;
    const fetchPackage = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/test-series/packages/${packageId}`, { headers });
        setTitle(data.title);
        setDescription(data.description || "");
        setIsActive(data.isActive);
        setPrice(data.price ?? 0);
        setMrp(data.mrp ?? "");
        setPhysicalPrice(data.physicalPrice ?? "");
        setPhysicalMrp(data.physicalMrp ?? "");
        setPaymentSubtitle(data.paymentSubtitle || "");
        setFeatures(Array.isArray(data.features) ? data.features : []);
        const rawBanners = data.bannerImages || (data.bannerImage ? [data.bannerImage] : []);
        setBannerImages(rawBanners.map(b => (typeof b === 'string' ? { imageUrl: b, redirectUrl: "" } : b)));
      } catch { toast.error("Failed to load package"); }
      finally { setFetching(false); }
    };
    fetchPackage();
  }, [packageId]);

  const handleAddFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    setFeatures((prev) => [...prev, trimmed]);
    setNewFeature("");
  };

  const handleRemoveFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBannerSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    if (isEdit) {
      // Immediate upload for existing packages
      handleBannerUpload(packageId, files);
    } else {
      // Store for upload after creation for new packages
      setBannerFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setBannerPreviews(prev => [...prev, ...newPreviews]);
    }
    // Reset input so same file can be chose again
    e.target.value = '';
  };

  const handleBannerUpload = async (pkgId, filesToUpload = bannerFiles) => {
    if (filesToUpload.length === 0) return;
    setBannerUploading(true);
    try {
      const form = new FormData();
      filesToUpload.forEach(file => {
        form.append("banners", file);
      });
      const { data } = await axios.post(
        `${API_BASE_URL}/test-series/packages/${pkgId}/banner`,
        form,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      const uploaded = data.bannerImages.map(b => (typeof b === 'string' ? { imageUrl: b, redirectUrl: "" } : b));
      setBannerImages(uploaded);
      if (isEdit) {
        toast.success("Banner(s) uploaded");
      } else {
        setBannerFiles([]);
        setBannerPreviews([]);
      }
    } catch (err) { 
      console.error("Banner upload error:", err);
      toast.error("Failed to upload banners"); 
    }
    finally { setBannerUploading(false); }
  };

  const handleBannerDelete = async (bannerUrl) => {
    if (!packageId) return;
    const urlToDelete = typeof bannerUrl === 'string' ? bannerUrl : bannerUrl?.imageUrl;
    if (!urlToDelete) {
      console.warn("handleBannerDelete: No valid banner URL found", bannerUrl);
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/test-series/packages/${packageId}/banner`, { 
        headers,
        data: { bannerUrl: urlToDelete }
      });
      setBannerImages(prev => prev.filter(b => (typeof b === 'string' ? b : b.imageUrl) !== urlToDelete));
      toast.success("Banner removed");
    } catch (err) { 
      console.error("Banner remove error:", err);
      toast.error("Failed to remove banner"); 
    }
  };

  const handleRemovePreview = (index) => {
    const preview = bannerPreviews[index];
    URL.revokeObjectURL(preview.url);
    setBannerPreviews(prev => prev.filter((_, i) => i !== index));
    setBannerFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    const payload = {
      title, description, isActive,
      price: Number(price) || 0,
      mrp: mrp !== "" ? Number(mrp) : null,
      physicalPrice: physicalPrice !== "" ? Number(physicalPrice) : null,
      physicalMrp: physicalMrp !== "" ? Number(physicalMrp) : null,
      paymentSubtitle: paymentSubtitle.trim() || null,
      features: features.length > 0 ? features : null,
      bannerImages: bannerImages, // Include banner images with their redirect URLs
    };
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/test-series/packages/${packageId}`, payload, { headers });
        toast.success("Package updated");
      } else {
        const { data: newPkg } = await axios.post(`${API_BASE_URL}/test-series/packages`, payload, { headers });
        if (bannerFiles.length > 0) await handleBannerUpload(newPkg.id, bannerFiles);
        toast.success("Package created");
      }
      navigate("/admin/test-series");
    } catch { toast.error("Failed to save package"); }
    finally { setLoading(false); }
  };

  const discount = mrp && price && Number(mrp) > Number(price)
    ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100) : null;
  const physicalDiscount = physicalMrp && physicalPrice && Number(physicalMrp) > Number(physicalPrice)
    ? Math.round(((Number(physicalMrp) - Number(physicalPrice)) / Number(physicalMrp)) * 100) : null;

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-1">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="mb-5">
        <button
          onClick={() => navigate("/admin/test-series")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Packages
        </button>
        <h1 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Package" : "New Package"}</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {isEdit ? "Update the package details below" : "Fill in the details to create a new package"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Basic Info ────────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <Type size={14} className="text-purple-700" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Basic Info</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Package Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NEET 2026 Full Test Series"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this test series…"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Page Subtitle</label>
              <input
                type="text"
                value={paymentSubtitle}
                onChange={(e) => setPaymentSubtitle(e.target.value)}
                placeholder="e.g. Full NEET mock test series with detailed analysis"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <p className="text-xs text-gray-400 mt-1">Shown below the package title on the payment screen</p>
            </div>

            {/* Status toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-semibold text-gray-700">Package Status</p>
                <p className="text-xs text-gray-400 mt-0.5">{isActive ? "Visible to students" : "Hidden from students"}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-inner" />
              </label>
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                <Tag size={14} className="text-green-700" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Pricing</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Online Test */}
              <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-3 uppercase tracking-wide">
                  <Smartphone size={12} /> Online Test Series
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Selling Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input type="number" min="0" value={price}
                        onChange={(e) => setPrice(e.target.value)} placeholder="0"
                        className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Set 0 for free access</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">MRP (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input type="number" min="0" value={mrp}
                        onChange={(e) => setMrp(e.target.value)} placeholder="Optional"
                        className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Shown as strikethrough</p>
                  </div>
                </div>
                {discount !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-lg">{discount}% OFF</span>
                    <span className="text-xs text-gray-500">Save ₹{Number(mrp) - Number(price)}</span>
                  </div>
                )}
              </div>

              {/* Physical */}
              <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-700 mb-1 uppercase tracking-wide">
                  <Package size={12} /> Physical Print
                </div>
                <p className="text-xs text-orange-400 mb-3">Includes Online Test · leave blank to disable</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Selling Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input type="number" min="0" value={physicalPrice}
                        onChange={(e) => setPhysicalPrice(e.target.value)} placeholder="Leave blank to hide"
                        className="w-full border border-orange-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">MRP (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                      <input type="number" min="0" value={physicalMrp}
                        onChange={(e) => setPhysicalMrp(e.target.value)} placeholder="Optional"
                        className="w-full border border-orange-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
                    </div>
                  </div>
                </div>
                {physicalDiscount !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-lg">{physicalDiscount}% OFF</span>
                    <span className="text-xs text-gray-500">Save ₹{Number(physicalMrp) - Number(physicalPrice)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Features ───────────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star size={14} className="text-amber-600" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">What's Included</h2>
            </div>

            <div className="space-y-2 mb-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  <span className="flex-1 text-sm text-gray-700">{feature}</span>
                  <button type="button" onClick={() => handleRemoveFeature(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-lg hover:bg-red-50">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-xs text-gray-400 italic py-2 px-1">No features added. Default list will be used in the app.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text" value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddFeature(); } }}
                placeholder="e.g. Full 180-question NEET pattern mock tests"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <button type="button" onClick={handleAddFeature}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-200 transition">
                <Plus size={14} /> Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Press Enter or click Add. These replace the default feature list on the payment screen.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Image size={14} className="text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Package Banners</h2>
            </div>
            <p className="text-xs text-gray-400">Shown in the app. Recommended: 16:9 ratio, max 5MB each. You can add multiple banners.</p>

            {/* Current Saved Banners */}
            {bannerImages.length > 0 && (
              <div className="space-y-3">
                {bannerImages.map((b, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-2xl group">
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img
                        src={`${API_BASE_URL.replace('/api', '')}${b.imageUrl}`}
                        alt={`Banner ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleBannerDelete(b)}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Redirect URL / App Screen</label>
                       <input 
                         type="text"
                         value={b.redirectUrl || ""}
                         onChange={(e) => {
                           const updated = [...bannerImages];
                           updated[idx] = { ...updated[idx], redirectUrl: e.target.value };
                           setBannerImages(updated);
                         }}
                         placeholder="e.g. https://google.com or Subscription"
                         className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                       />
                       <p className="text-[10px] text-gray-400">Enter a website URL or an app screen name.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Previews (New uploads) */}
            {bannerPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {bannerPreviews.map((p, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-amber-200 bg-amber-50 aspect-video group">
                    <img
                      src={p.url}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">New — Save to upload</span>
                  </div>
                ))}
              </div>
            )}

            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-100 rounded-xl p-6 cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all group">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                {bannerUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                ) : (
                  <Plus size={20} className="text-gray-400 group-hover:text-purple-600" />
                )}
              </div>
              <span className="text-sm text-gray-500 font-medium group-hover:text-purple-700">
                {bannerUploading ? "Uploading..." : "Click to upload banner"}
              </span>
              <input 
                type="file" 
                accept="image/*" 
                multiple={!isEdit} 
                className="hidden" 
                onChange={handleBannerSelect} 
                disabled={bannerUploading}
              />
            </label>
          </div>

          {/* ── Submit ─────────────────────────────────────────── */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/admin/test-series")}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-60 hover:from-purple-800 hover:to-purple-700 shadow-md shadow-purple-200 transition-all">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save size={16} />
              )}
              {isEdit ? "Save Changes" : "Create Package"}
            </button>
          </div>
      </form>
    </div>
  );
}
