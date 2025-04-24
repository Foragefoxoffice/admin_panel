'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function BannerListPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://mitoslearning.in/api/banners');
        if (!response.ok) throw new Error('Failed to fetch banners');
        const data = await response.json();

        // Normalize ID to always have `_id`
        const normalized = data.map(banner => ({
          ...banner,
          _id: banner._id || banner.id || null,
        }));

        console.log('Normalized Banners:', normalized);
        setBanners(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No ID provided for deletion');
      setDeleteError('No ID provided for deletion');
      return;
    }

    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`https://mitoslearning.in/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete banner');
      }

      setBanners((prev) => prev.filter(b => b._id !== id));
      setSuccessMessage('Banner deleted successfully!');
      setDeleteError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.message);
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const toggleBannerStatus = async (id) => {
    try {
      const bannerToUpdate = banners.find(b => b._id === id);
      if (!bannerToUpdate) return;
  
      const updatedBanner = {
        ...bannerToUpdate,
        isActive: !bannerToUpdate.isActive
      };
  
      const response = await fetch(`https://mitoslearning.in/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBanner),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update banner status');
      }
  
      setBanners(banners.map(banner => 
        banner._id === id ? updatedBanner : banner
      ));
      
      setSuccessMessage(`Banner marked as ${updatedBanner.isActive ? 'active' : 'inactive'}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Toggle status error:', err);
      setDeleteError(err.message);
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  if (loading) return <div className="text-center py-8">Loading banners...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className=" py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              {successMessage}
            </motion.div>
          )}
          {deleteError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              Error: {deleteError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 md:flex  justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Banner List</h1>
          <Link 
            href="/admin/addbanners"
            className="btn"
          >
            Create New Banner
          </Link>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No banners found. Create your first banner!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div 
                key={banner._id || banner.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  {banner.imageUrl ? (
                    <img 
                      src={`http://localhost:5000${banner.imageUrl}`} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'; // Fallback image
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    <button 
                      onClick={() => toggleBannerStatus(banner._id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-[#35095E] truncate capitalize">{banner.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    Redirects to: <a href={banner.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{banner.redirectUrl}</a>
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-white hover:text-[#35095E] text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}