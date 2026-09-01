import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import Spinner from '../../components/ui/Spinner';
import ImageUploadDropzone from '../../components/ui/ImageUploadDropzone';

const emptyForm = {
  title: '',
  summary: '',
  description: '',
  category: '',
  tags: '',
  status: 'active',
  featured: false,
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [banner, setBanner] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useLockBodyScroll(showModal);
  const trapRef = useFocusTrap(showModal);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects', { params: { limit: 100 } });
      setProjects(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load projects right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      summary: project.summary,
      description: project.description,
      category: project.category,
      tags: (project.tags || []).join(', '),
      status: project.status || 'active',
      featured: Boolean(project.featured),
    });
    setBanner(null);
    setGalleryFiles([]);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.description.trim() || !form.category.trim()) {
      toast.error('Please complete the title, summary, description, and category fields.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('summary', form.summary);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('status', form.status || 'active');
      fd.append('featured', form.featured ? 'true' : 'false');
      fd.append('tags', form.tags || '');

      if (banner) fd.append('image', banner);
      if (galleryFiles.length) {
        galleryFiles.forEach((file) => fd.append('images', file));
      }

      if (editing) {
        await api.put(`/projects/${editing._id}`, fd);
        toast.success('Project updated successfully ✅');
      } else {
        await api.post('/projects', fd);
        toast.success('Project created successfully 🛠️');
      }

      setShowModal(false);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving the project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/projects/${project._id}`);
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete this project.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Manage Projects</h1>
        <button onClick={openCreate} className="btn btn-primary px-5 py-2.5 text-sm">
          ➕ New Project
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-forest-50 text-left text-forest-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Project</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-forest-50/40">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900 line-clamp-1">{project.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{project.summary}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{project.category}</td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {project.status === 'completed' ? 'Completed' : 'Active'}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(project)}
                        className="text-forest-600 hover:text-forest-800 font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                      No projects yet — create your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Edit project' : 'New project'}
          className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7">
            <h2 className="font-display text-xl font-bold text-gray-900">
              {editing ? 'Edit Project' : 'New Project'}
            </h2>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Solar Tracker"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Smart solar setup for campus energy projects"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                  placeholder="Describe the project, problem solved, and build details"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                    placeholder="Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder="Arduino, Sensors, Solar"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <label className="text-sm font-medium text-gray-700">Featured project</label>
              </div>

              <div>
                <ImageUploadDropzone
                  label={editing ? 'Banner Image (leave empty to keep current)' : 'Banner Image'}
                  value={banner}
                  onChange={(file) => setBanner(file || null)}
                  helperText={banner ? `Selected: ${banner.name}` : 'Use a clean cover image with good contrast'}
                />
              </div>

              <div>
                <ImageUploadDropzone
                  label="Additional Gallery Images (optional)"
                  value={galleryFiles}
                  onChange={(files) => setGalleryFiles(files || [])}
                  multiple
                  helperText={galleryFiles.length ? `${galleryFiles.length} image(s) selected` : 'Optional project photos'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
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
