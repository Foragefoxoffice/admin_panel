'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function NewsDetailPage({ params }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://mitoslearning.in/api/news/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://mitoslearning.in/api/news/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete news');
      }
      
      router.push('/news');
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
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          Error: {error}
        </div>
        <Link href="/news" className="mt-4 btn">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-gray-500 bg-gray-50 rounded-lg">
          News article not found
        </div>
        <Link href="/admin/news" className="mt-4 btn">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/news" style={{display:"inline-flex"}} className="btn">
          <ArrowLeft size={16} className="mr-1" /> Back to News
        </Link>
      </div>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        {news.image && (
          <div className="h-96 overflow-hidden">
            <img 
              src={`${news.image}`} 
              alt={news.title}
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{news.title}</h1>
              <p className="text-gray-500 text-sm">
                Published on {formatDate(news.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link 
                href={`/admin/news/edit/${params.id}`} 
                className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50"
              >
                <Edit size={20} />
              </Link>
              <button 
                onClick={() => setDeleteConfirmation(true)}
                className="text-red-500 hover:text-red-700 bg-transparent rounded hover:bg-red-50"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          
          <div 
            className="prose max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>

      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this news article? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeleteConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}