'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateBannerPage() {
  const [form, setForm] = useState({
    title: '',
    redirectUrl: '',
    isActive: true,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!form.title.trim()) {
      alert('Please enter a banner title');
      return;
    }
    
    if (!form.redirectUrl.trim()) {
      alert('Please enter a redirect URL');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('redirectUrl', form.redirectUrl);
      formData.append('isActive', form.isActive);
      if (form.image) formData.append('image', form.image);

      const res = await fetch('https://mitoslearning.in/api/banners', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create banner');
      }

      const data = await res.json();
      
      // Reset form on success
      setForm({
        title: '',
        redirectUrl: '',
        isActive: true,
        image: null,
      });
      setPreview(null);
      
      // Show success popup
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);

    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Banner</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter banner title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.redirectUrl}
              onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Banner
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
            {preview && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-40 rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full btn"
          >
            Create Banner
          </button>
        </form>
        
        {/* Success Popup */}
        <AnimatePresence>
          {showSuccessPopup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              Banner created successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}