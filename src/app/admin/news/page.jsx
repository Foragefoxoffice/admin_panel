'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Edit, ArrowRight } from 'lucide-react';

export default function NewsListPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://mitoslearning.in/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        const normalized = data.map(news => ({
            ...news,
            _id: news._id || news.id || null,
          }));
  
        setNewsList(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
        console.error('No ID provided for deletion');
        setDeleteError('No ID provided for deletion');
        return;
      }
  
    try {
      const response = await fetch(`https://mitoslearning.in/api/news/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news');
      }
      
      setNewsList(newsList.filter(news => news._id !== id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting news:', err);
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News Articles</h1>
        <Link href="/admin/addnews" className="btn">
          Create New Article
        </Link>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No news articles found.</p>
          <Link href="/admin/addnews" className="btn mt-4 inline-block">
            Create Your First Article
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <motion.div 
              key={news._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {news.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`${news.image}`} 
                    alt={news.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl text-[#35095E] font-bold line-clamp-2">{news.title}</h2>
                  <div className="flex space-x-2">
                    <Link href={`/admin/news/edit/${news._id}`} className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => setDeleteConfirmation(news._id)}
                      className="text-red-500 bg-transparent hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3">
                  Published on {formatDate(news.createdAt)}
                </p>
                <div 
                  className="text-xl prose prose-sm max-w-none mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: news.content.substring(0, 100) + '...' }}
                />
                <Link 
                  href={`/admin/news/${news._id}`} 
                  className="inline-flex items-center btn"
                >
                  Read more <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              {/* Delete confirmation modal */}
              {deleteConfirmation === news._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                    <p className="mb-6">Are you sure you want to delete this news article? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => setDeleteConfirmation(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleDelete(news._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}