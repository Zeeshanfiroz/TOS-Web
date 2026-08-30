import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchEvents } from '../../features/events/eventsSlice';
import EventCard from '../../components/events/EventCard';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import ErrorState from '../../components/ui/ErrorState';
import SEO from '../../components/common/SEO';

const filters = [
  { key: 'conduct', label: 'Conduct' },
  { key: 'participate', label: 'Participate' },
];

export default function Events() {
  const dispatch = useDispatch();
  const { list, pagination, isLoading, error } = useSelector((s) => s.events);

  const [filter, setFilter] = useState('conduct');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounced search — avoids hammering the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchEvents({ filter, search, page }));
    }, 350);
    return () => clearTimeout(t);
  }, [dispatch, filter, search, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Events"
        description="Upcoming and past sustainability events at VSSUT Burla — plantation drives, e-waste collection, workshops and competitions. RSVP and join us!"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Club Events</h1>
        <p className="text-gray-500 mt-2">
          Plant trees, collect e-waste, spread awareness — pick your cause.
        </p>
      </motion.div>

      {/* Filter + search bar */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 bg-forest-50 rounded-xl p-1 w-fit">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f.key
                  ? 'bg-forest-600 text-white shadow'
                  : 'text-forest-700 hover:bg-forest-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search events..."
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10">
          <SkeletonGrid count={6} />
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchEvents({ filter, search, page }))}
        />
      ) : list.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">🌱</span>
          <p className="mt-4 text-gray-500">No events found. Check back soon!</p>
        </div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((e, i) => (
            <EventCard key={e._id} event={e} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
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