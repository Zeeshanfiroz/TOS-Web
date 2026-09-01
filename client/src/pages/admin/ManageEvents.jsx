import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import Spinner from '../../components/ui/Spinner';
import ImageUploadDropzone from '../../components/ui/ImageUploadDropzone';

const emptyForm = { title: '', description: '', date: '', location: '', eventType: 'organized' };

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // event being edited
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // Freeze background scroll while the create/edit modal is open
  useLockBodyScroll(showModal);

  // Trap keyboard focus inside the modal; restore focus on close
  const trapRef = useFocusTrap(showModal);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events', { params: { filter: 'all', limit: 100, includeRsvps: true } });
      setEvents(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load events right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 10),
      location: event.location,
      eventType: event.eventType || 'organized',
    });
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error('Please enter the title, date, and location.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('date', form.date);
      fd.append('location', form.location);
      fd.append('eventType', form.eventType || 'organized');
      if (banner) fd.append('image', banner);
      if (galleryFiles.length) {
        galleryFiles.forEach((file) => fd.append('images', file));
      }

      if (editing) {
        await api.put(`/events/${editing._id}`, fd);
        toast.success('Event updated successfully ✅');
      } else {
        await api.post('/events', fd);
        toast.success('Event created successfully 🌱');
      }
      setShowModal(false);
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/events/${event._id}`);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this event.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Manage Events</h1>
        <button
          onClick={openCreate}
          className="btn btn-primary px-5 py-2.5 text-sm"
        >
          ➕ New Event
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-forest-50 text-left text-forest-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Event</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">RSVPs</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev._id} className="hover:bg-forest-50/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 line-clamp-1">{ev.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{ev.location}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {new Date(ev.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 hidden md:table-cell">
                    <div className="max-w-xs">
                      <div className="font-medium text-forest-700">{ev.rsvps?.length || 0}</div>
                      {ev.rsvps?.length ? (
                        <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                          {ev.rsvps.map((r) => r.user?.name || 'Unknown').join(', ')}
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 mt-1">No interested members</div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(ev)}
                      className="text-forest-600 hover:text-forest-800 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    No events yet — create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Edit event' : 'New event'}
          className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7">
            <h2 className="font-display text-xl font-bold text-gray-900">
              {editing ? 'Edit Event' : 'New Event'}
            </h2>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Tree Plantation Drive"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                  placeholder="What's this event about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  >
                    <option value="organized">Organised</option>
                    <option value="participated">Participated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Main Campus Lawn"
                />
              </div>
              <div>
                <ImageUploadDropzone
                  label={editing ? 'Banner Image (leave empty to keep current)' : 'Banner Image'}
                  value={banner}
                  onChange={(file) => setBanner(file || null)}
                  helperText={banner ? `Selected: ${banner.name}` : 'Landscape image works best for event banners'}
                />
              </div>
              <div>
                <ImageUploadDropzone
                  label="Extra Event Photos (optional)"
                  value={galleryFiles}
                  onChange={(files) => setGalleryFiles(files || [])}
                  multiple
                  helperText={galleryFiles.length ? `${galleryFiles.length} image(s) selected` : 'Optional gallery for the event'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
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