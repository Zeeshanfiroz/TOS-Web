import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('new'); // 'new' | 'resolved' | ''

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact', {
        params: { status: status || undefined, limit: 50 },
      });
      setMessages(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const markResolved = async (msg) => {
    try {
      await api.put(`/contact/${msg._id}/status`, { status: 'resolved' });
      toast.success('Marked as resolved ✅');
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Contact Messages</h1>

      {/* Status filter */}
      <div className="mt-5 flex gap-2 bg-forest-50 rounded-xl p-1 w-fit">
        {[
          { key: 'new', label: 'New' },
          { key: 'resolved', label: 'Resolved' },
          { key: '', label: 'All' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatus(f.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              status === f.key
                ? 'bg-forest-600 text-white shadow'
                : 'text-forest-700 hover:bg-forest-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl">📭</span>
          <p className="text-gray-400 mt-3">No {status || ''} messages.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {msg.name}{' '}
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm font-normal text-forest-600 hover:underline"
                    >
                      ({msg.email})
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(msg.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                {msg.status === 'new' && (
                  <button
                    onClick={() => markResolved(msg)}
                    className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-forest-600 hover:bg-forest-700 text-white"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}