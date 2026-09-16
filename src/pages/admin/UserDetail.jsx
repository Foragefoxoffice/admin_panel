import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, fetchSalesConversations } from '@/utils/api';

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesConversation, setSalesConversation] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadUser();
  }, [id]);

  useEffect(() => {
    const loadSalesConversation = async () => {
      try {
        const data = await fetchSalesConversations({ userId: id, pageSize: 1 });
        setSalesConversation(data.conversations?.[0] || null);
      } catch (err) {
        console.error('Failed to check WhatsApp sales conversation:', err);
      }
    };

    if (id) loadSalesConversation();
  }, [id]);

  if (loading) return <div className="flex flex-col items-center gap-4">
    <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-gray-500">Loading users...</p>
  </div>
    ;
  if (!user) return <div className="text-center py-10 text-red-400">User not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded  text-sm hover:bg-[#6712B7]"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="flex flex-col items-center text-center col-span-1">
          {user.profile ? (
            <img
              src={user.profile}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-white mb-4">
              {user.name?.[0]}
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <span
            className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full ${user.role === 'admin'
                ? 'bg-yellow-200 text-yellow-800'
                : 'bg-green-100 text-green-700'
              }`}
          >
            {user.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>

        {/* Profile Details */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="Email" value={user.email} />
          <Detail label="Phone Number" value={user.phoneNumber || '—'} />
          <Detail label="Gender" value={user.gender || '—'} />
          <Detail label="Age" value={user.age || '—'} />
          <Detail label="Role" value={user.role} />
          <Detail
            label="Created At"
            value={new Date(user.createdAt).toLocaleString()}
          />
        </div>
      </div>

      {salesConversation && (
        <button
          type="button"
          onClick={() => navigate(`/admin/sales-agent/conversations/${salesConversation.id}`)}
          className="mt-6 w-full text-left bg-white shadow rounded-xl p-4 flex items-center justify-between hover:bg-purple-50"
        >
          <div>
            <p className="font-semibold text-[#35095E]">WhatsApp Sales Conversation</p>
            <p className="text-sm text-gray-500">
              Stage: {salesConversation.lead?.stage || '—'} · {salesConversation.lastMessagePreview || 'No messages yet'}
            </p>
          </div>
          <span className="text-[#51216E]">View →</span>
        </button>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

