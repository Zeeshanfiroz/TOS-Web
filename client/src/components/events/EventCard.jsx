import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';

// const formatDate = (d) =>
//   new Date(d).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   });

export default function EventCard({ event, index = 0 }) {
  const statusLabel = event.eventType === 'participated' ? 'Participated' : 'Organised';
  const isUpcoming = new Date(event.date) > new Date();

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
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-forest-400 via-forest-600 to-emerald-700">
              {event.banner?.url ? (
                <img
                  src={event.banner.url}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest-50">
                  <img src="/Logo.png" alt="Team of Sustainability" className="h-24 w-24 object-contain opacity-80" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                {statusLabel}
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-forest-100 px-3 py-1 text-[11px] font-semibold text-forest-800 border border-forest-200">
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 font-medium text-forest-700">
                  📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="font-medium">{event.location || 'Campus'}</span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-forest-700 transition-colors">
                {event.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{event.location ? 'Venue' : 'Details'}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 transition-transform group-hover:translate-x-1">
                  View details →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </TiltCard>
    </motion.div>
  );
}