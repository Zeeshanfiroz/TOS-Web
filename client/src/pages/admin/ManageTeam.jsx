import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';
import ImageUploadDropzone from '../../components/ui/ImageUploadDropzone';

const initialForm = {
  name: '',
  position: '',
  group: 'Core Team',
  bio: '',
  order: 0,
};

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/team?limit=100');
      setMembers(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setPhoto(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.position.trim()) {
      toast.error('Name and position are required');
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('position', form.position.trim());
      fd.append('group', form.group.trim() || 'Core Team');
      fd.append('bio', form.bio.trim());
      fd.append('order', String(form.order || 0));
      if (photo) fd.append('image', photo);

      if (editingId) {
        await api.put(`/team/${editingId}`, fd);
        toast.success('Team member updated');
      } else {
        await api.post('/team', fd);
        toast.success('Team member added');
      }

      resetForm();
      await loadMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || '',
      position: member.position || '',
      group: member.group || 'Core Team',
      bio: member.bio || '',
      order: member.order || 0,
    });
    setPhoto(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the team?`)) return;

    try {
      await api.delete(`/team/${member._id}`);
      toast.success('Team member removed');
      setMembers((prev) => prev.filter((item) => item._id !== member._id));
      if (editingId === member._id) resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete team member');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Team</h1>

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-2xl border border-forest-100 p-6 shadow-sm space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
              placeholder="Club Coordinator"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <input
              name="group"
              value={form.group}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
              placeholder="Core Team"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
            placeholder="Brief description about the member"
          />
        </div>

        <div>
          <ImageUploadDropzone
            label="Photo"
            value={photo}
            onChange={(file) => setPhoto(file || null)}
            helperText={photo ? `Selected: ${photo.name}` : 'Recommended size: square crop, high quality'}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="mt-6"><Spinner /></div>
      ) : (
        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <img
                  src={member.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=E7F5EC&color=1F3B2D&size=200&bold=true`}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-forest-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-forest-700">{member.position}</p>
                  <p className="text-xs text-gray-500 mt-1">{member.group}</p>
                </div>
              </div>
              {member.bio && <p className="text-sm text-gray-600 mt-3">{member.bio}</p>}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="flex-1 px-3 py-2 rounded-lg bg-forest-50 text-forest-700 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 text-center py-10 text-gray-500">
              No team members yet. Add the first team profile above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
