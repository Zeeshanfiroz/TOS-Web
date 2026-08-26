import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAnnouncementById } from '../../features/announcements/announcementsSlice';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: post, isLoading, error } = useSelector((s) => s.announcements);

  useEffect(() => {
    dispatch(fetchAnnouncementById(id));
  }, [dispatch, id]);

  // Error → friendly state with retry (was previously an infinite spinner!)
  if (error && !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchAnnouncementById(id))}
        />
      </div>
    );
  }

  if (isLoading || !post) return <Spinner fullPage />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/announcements" className="text-forest-600 font-medium hover:underline text-sm">
        ← Back to announcements
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-white rounded-3xl border border-forest-100 p-6 md:p-10 shadow-sm"
      >
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="w-10 h-10 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
            {(post.author?.name || 'A')[0]}
          </span>
          <div>
            <p className="font-medium text-gray-800">{post.author?.name || 'Club Team'}</p>
            <p>
              {new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-6">{post.title}</h1>
        <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </motion.article>
    </div>
  );
}