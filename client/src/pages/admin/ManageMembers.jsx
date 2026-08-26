import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/ui/Spinner';

export default function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users', { params: { search, page, limit: 20 } });
        setMembers(data.data);
        setPagination(data.pagination);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load members');
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [search, page]);

  const toggleRole = async (member) => {
    const newRole = member.role === 'admin' ? 'member' : 'admin';
    if (
      !window.confirm(
        `Change ${member.name}'s role from "${member.role}" to "${newRole}"?`
      )
    )
      return;
    try {
      await api.put(`/users/${member._id}/role`, { role: newRole });
      toast.success(`${member.name} is now ${newRole === 'admin' ? 'an admin 👑' : 'a member'}`);
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, role: newRole } : m))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Role change failed');
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the club? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${member._id}`);
      toast.success('Member removed');
      setMembers((prev) => prev.filter((m) => m._id !== member._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Members</h1>

      <div className="mt-5 relative max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-forest-50 text-left text-forest-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-forest-50/40">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {new Date(m.joinedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        m.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-forest-100 text-forest-700'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleRole(m)}
                      className="text-forest-600 hover:text-forest-800 font-medium mr-4"
                    >
                      {m.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                p === pagination.page
                  ? 'bg-forest-600 text-white'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}