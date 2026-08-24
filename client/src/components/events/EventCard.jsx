import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function EventCard({ event, index = 0 }) {
  const isPast = new Date(event.date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
    >
      <TiltCard>
        <div className="shine group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 h-full">
          <Link to={`/events/${event._id}`}>
            <div className="h-44 bg-gradient-to-br from-forest-400 to-forest-700 relative overflow-hidden">
              {event.banner?.url ? (
                <img
                  src={event.banner.url}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-60">
                  🌿
                </div>
              )}
              <span
                className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur ${
                  isPast ? 'bg-gray-800/70 text-white' : 'glass text-forest-800'
                }`}
              >
                {isPast ? 'Past Event' : formatDate(event.date)}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
              <span className="inline-block mt-3 text-sm font-semibold text-forest-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                View details →
              </span>
            </div>
          </Link>
        </div>
      </TiltCard>
    </motion.div>
  );
}