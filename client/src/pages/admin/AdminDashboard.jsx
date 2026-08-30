import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const cards = [
  { key: 'members', label: 'Total Members', icon: '👥', color: 'from-blue-500 to-blue-700' },
  { key: 'events', label: 'Events', icon: '📅', color: 'from-forest-500 to-forest-700' },
  { key: 'announcements', label: 'Announcements', icon: '📢', color: 'from-amber-500 to-amber-600' },
  { key: 'messages', label: 'New Messages', icon: '✉️', color: 'from-purple-500 to-purple-700' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, events, anns, msgs] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/events?limit=1'),
          api.get('/announcements?limit=1'),
          api.get('/contact?status=new&limit=1'),
        ]);
        setStats({
          members: users.data.pagination.total,
          events: events.data.pagination.total,
          announcements: anns.data.pagination.total,
          messages: msgs.data.pagination.total,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Club Overview</h1>
      <p className="text-sm text-gray-500 mt-1">Everything happening across the platform.</p>

      <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link
            key={c.key}
            to={
              c.key === 'members'
                ? '/admin/members'
                : c.key === 'events'
                  ? '/admin/events'
                  : c.key === 'announcements'
                    ? '/admin/announcements'
                    : '/admin/messages'
            }
            className={`rounded-2xl p-6 bg-gradient-to-br ${c.color} text-white shadow-md hover:-translate-y-0.5 transition-transform`}
          >
            <span className="text-2xl">{c.icon}</span>
            <p className="font-display text-3xl font-bold mt-3">{stats?.[c.key] ?? '—'}</p>
            <p className="text-sm opacity-80">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/admin/events"
            className="bg-white border border-forest-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <span className="text-xl">➕</span>
            <p className="font-medium mt-2">Create an Event</p>
            <p className="text-xs text-gray-500 mt-1">Add a new club event with banner & interested members</p>
          </Link>
          <Link
            to="/admin/announcements"
            className="bg-white border border-forest-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <span className="text-xl">📝</span>
            <p className="font-medium mt-2">Post Announcement</p>
            <p className="text-xs text-gray-500 mt-1">Share news with all members</p>
          </Link>
        </div>
      </div>
    </div>
  );
}