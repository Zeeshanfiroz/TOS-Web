import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import Spinner from '../../components/ui/Spinner';

const emptyForm = { title: '', content: '' };

export default function ManageAnnouncements() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Freeze background scroll while the modal is open
  useLockBodyScroll(showModal);

  // Trap keyboard focus inside the modal; restore focus on close
  const trapRef = useFocusTrap(showModal);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/announcements?limit=100');
      setPosts(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load announcements right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Please enter both the title and content.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/announcements/${editing._id}`, form);
        toast.success('Announcement updated successfully ✅');
      } else {
        await api.post('/announcements', form);
        toast.success('Announcement published successfully 📢');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await api.delete(`/announcements/${post._id}`);
      toast.success('Announcement deleted successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this announcement.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Announcements</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowModal(true);
          }}
          className="btn btn-primary px-5 py-2.5 text-sm"
        >
          ➕ New Post
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{p.title}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(p.createdAt).toLocaleDateString('en-IN')} • by{' '}
                  {p.author?.name || 'Admin'}
                </p>
              </div>
              <div className="shrink-0 flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditing(p);
                    setForm({ title: p.title, content: p.content });
                    setShowModal(true);
                  }}
                  className="text-forest-600 hover:text-forest-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">No announcements yet.</p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Edit announcement' : 'New announcement'}
          className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
            <h2 className="font-display text-xl font-bold text-gray-900">
              {editing ? 'Edit Announcement' : 'New Announcement'}
            </h2>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Club Launch — Registrations Open!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                  placeholder="Write the full announcement..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}