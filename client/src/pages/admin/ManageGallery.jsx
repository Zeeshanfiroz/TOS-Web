import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [eventRef, setEventRef] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [gal, evs] = await Promise.all([
        api.get('/gallery?limit=100'),
        api.get('/events', { params: { filter: 'all', limit: 100 } }),
      ]);
      setImages(gal.data.data);
      setEvents(evs.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load gallery items right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      if (caption.trim()) fd.append('caption', caption.trim());
      if (eventRef) fd.append('eventRef', eventRef);

      const { data } = await api.post('/gallery', fd);
      toast.success(
        `Uploaded ${data.data.length} image(s)${data.failed?.length ? `, ${data.failed.length} failed` : ''} 📤`
      );
      setFiles([]);
      setCaption('');
      setEventRef('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${img._id}`);
      toast.success('Image deleted successfully');
      setImages((prev) => prev.filter((i) => i._id !== img._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this image.');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Gallery</h1>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="mt-6 bg-white rounded-2xl border border-forest-100 p-6 shadow-sm space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (up to 10)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-forest-50 file:text-forest-700 file:text-sm file:font-semibold cursor-pointer"
            />
            {files.length > 0 && (
              <p className="text-xs text-forest-600 mt-1">{files.length} file(s) selected</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link to Event (optional)
            </label>
            <select
              value={eventRef}
              onChange={(e) => setEventRef(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
            >
              <option value="">No event</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
            placeholder="Plantation drive 2026"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : '📤 Upload Images'}
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <Spinner />
      ) : images.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No images yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative rounded-xl overflow-hidden border border-gray-100"
            >
              <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-32 object-cover" />
              <button
                onClick={() => handleDelete(img)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete image"
              >
                ✕
              </button>
              {img.eventRef?.title && (
                <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                  {img.eventRef.title}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}