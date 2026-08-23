import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchMyRsvps } from '../../features/events/eventsSlice';
import { selectUser } from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { myRsvps, isLoading } = useSelector((s) => s.events);

  useEffect(() => {
    dispatch(fetchMyRsvps());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-2">Here's your club activity at a glance.</p>
      </motion.div>

      {/* Profile summary */}
      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-2xl p-6 text-white">
          <span className="text-3xl">🌿</span>
          <p className="font-display text-3xl font-bold mt-3">{myRsvps.length}</p>
          <p className="text-sm text-forest-100/80">Events RSVP'd</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <span className="text-3xl">📅</span>
          <p className="font-display font-semibold mt-3">Joined</p>
          <p className="text-sm text-gray-500">{formatDate(user?.joinedAt || new Date())}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <span className="text-3xl">🎖️</span>
          <p className="font-display font-semibold mt-3 capitalize">Role</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>
      </div>

      {/* My RSVPs */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-forest-900 mb-5">
          My Upcoming Events
        </h2>

        {isLoading ? (
          <Spinner />
        ) : myRsvps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-forest-200 p-10 text-center">
            <span className="text-4xl">🌱</span>
            <p className="text-gray-500 mt-3">You haven't RSVP'd to any events yet.</p>
            <Link
              to="/events"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700"
            >
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myRsvps.map((e) => (
              <Link
                key={e._id}
                to={`/events/${e._id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    new Date(e.date) > new Date()
                      ? 'bg-forest-100 text-forest-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {new Date(e.date) > new Date() ? formatDate(e.date) : 'Completed'}
                </span>
                <h3 className="font-display font-semibold mt-3 line-clamp-1">{e.title}</h3>
                <p className="text-sm text-gray-500 mt-1">📍 {e.location}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}