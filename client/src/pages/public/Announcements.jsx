import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAnnouncements } from '../../features/announcements/announcementsSlice';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import ErrorState from '../../components/ui/ErrorState';
import SEO from '../../components/events/common/SEO';

export default function Announcements() {
  const dispatch = useDispatch();
  const { list, pagination, isLoading, error } = useSelector((s) => s.announcements);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAnnouncements({ page }));
  }, [dispatch, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Announcements"
        description="Latest news, updates and stories from Team of Sustainability — VSSUT Burla's official sustainability club."
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title">Announcements & Blog</h1>
        <p className="text-gray-500 mt-2">News, updates and stories from the club.</p>
      </motion.div>

      {isLoading && page === 1 ? (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} hasImage={false} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            setPage(1);
            dispatch(fetchAnnouncements({ page: 1 }));
          }}
        />
      ) : list.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">📢</span>
          <p className="mt-4 text-gray-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-6 max-w-3xl">
          {list.map((a, i) => (
            <motion.article
              key={a._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="bg-white rounded-2xl border border-forest-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="w-9 h-9 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
                  {(a.author?.name || 'A')[0]}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{a.author?.name || 'Club Team'}</p>
                  <p>
                    {new Date(a.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <Link to={`/announcements/${a._id}`}>
                <h2 className="font-display font-semibold text-xl mt-4 hover:text-forest-700 transition-colors">
                  {a.title}
                </h2>
              </Link>
              <p className="text-gray-600 mt-2 line-clamp-3">{a.content}</p>
              <Link
                to={`/announcements/${a._id}`}
                className="inline-block mt-4 text-sm font-medium text-forest-600 hover:underline"
              >
                Read full post →
              </Link>
            </motion.article>
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
              className={`w-10 h-10 rounded-lg text-sm font-semibold ${
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