import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchEventById, toggleRsvp } from '../../features/events/eventsSlice';
import { selectUser } from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';
import SEO from '../../components/common/SEO';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { current: event, isLoading } = useSelector((s) => s.events);
  const [rsvpBusy, setRsvpBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const isPast = event && new Date(event.date) < new Date();
  const rsvped = event?.rsvps?.some((r) => r.user?._id === user?._id || r.user === user?._id);

  const handleRsvp = async () => {
    if (!user) {
      toast.info('Please login to RSVP');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    setRsvpBusy(true);
    const result = await dispatch(toggleRsvp(id));
    setRsvpBusy(false);
    if (toggleRsvp.fulfilled.match(result)) {
      toast.success(result.payload.rsvped ? 'RSVP confirmed! 🌱' : 'RSVP cancelled');
      dispatch(fetchEventById(id)); // refresh attendee list
    } else {
      toast.error(result.payload || 'RSVP failed');
    }
  };

  if (isLoading || !event) return <Spinner fullPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title={event.title}
        description={`${event.title} — ${formatDate(event.date)} at ${event.location}. ${event.description?.slice(0, 100) || ''}`}
      />
      <Link to="/events" className="text-forest-600 font-medium hover:underline text-sm">
        ← Back to events
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
      >
        {/* Banner */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-forest-400 to-forest-700 relative">
          {event.banner?.url ? (
            <img src={event.banner.url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-60">🌿</div>
          )}
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isPast ? 'bg-gray-100 text-gray-600' : 'bg-forest-100 text-forest-700'
              }`}
            >
              {isPast ? 'Past Event' : 'Upcoming'}
            </span>
            <span className="text-sm text-gray-500">
              {event.rsvps?.length || 0} going
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            {event.title}
          </h1>

          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <p className="flex items-center gap-2 text-gray-700">
              📅 <span>{formatDate(event.date)}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              📍 <span>{event.location}</span>
            </p>
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>

          {/* RSVP */}
          {!isPast && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {rsvped ? "You're going! 🎉" : 'Will you join us?'}
                </p>
                <p className="text-sm text-gray-500">
                  {rsvped
                    ? 'We will send you a reminder before the event.'
                    : 'RSVP so we can plan resources accordingly.'}
                </p>
              </div>
              <button
                onClick={handleRsvp}
                disabled={rsvpBusy}
                className={`px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60 ${
                  rsvped
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-forest-600 text-white hover:bg-forest-700 shadow-lg shadow-forest-200'
                }`}
              >
                {rsvpBusy ? 'Please wait...' : rsvped ? 'Cancel RSVP' : 'RSVP Now 🌱'}
              </button>
            </div>
          )}

          {/* Attendees */}
          {event.rsvps?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-semibold text-gray-900 mb-3">
                Attendees ({event.rsvps.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.rsvps.map((r) => (
                  <span
                    key={r.user?._id || r.user}
                    className="text-sm bg-forest-50 text-forest-700 px-3 py-1.5 rounded-full"
                  >
                    {r.user?.name || 'Member'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}