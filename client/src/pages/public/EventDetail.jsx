import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchEventById, toggleRsvp } from '../../features/events/eventsSlice';
import { selectUser } from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import SEO from '../../components/events/common/SEO';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const normalizeEventType = (value) => {
  const raw = String(value || 'organized').toLowerCase();
  if (raw === 'participated' || raw === 'participate') return 'participated';
  if (raw === 'conducted' || raw === 'conduct' || raw === 'organized' || raw === 'organised') return 'organized';
  return 'organized';
};

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { current: event, isLoading, error } = useSelector((s) => s.events);
  const [rsvpBusy, setRsvpBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const [photoIndex, setPhotoIndex] = useState(0);

  const galleryImages = [
    ...(event?.banner?.url ? [{ url: event.banner.url, caption: event.title }] : []),
    ...(event?.gallery || []).map((photo) => ({ url: photo.url, caption: event?.title || 'Event photo' })),
  ];

  useEffect(() => {
    setPhotoIndex(0);
  }, [event?._id]);

  useEffect(() => {
    if (galleryImages.length < 2) return undefined;

    const rotationTimer = window.setInterval(() => {
      setPhotoIndex((index) => (index + 1) % galleryImages.length);
    }, 4000);

    return () => window.clearInterval(rotationTimer);
  }, [galleryImages.length]);

  const normalizedEventType = normalizeEventType(event?.eventType);
  const eventStatus = normalizedEventType === 'participated' ? 'Participated' : 'Organised';
  const isUpcoming = event?.date ? new Date(event.date) > new Date() : false;
  const eventTimelineLabel = isUpcoming ? 'Upcoming' : 'Past Event';
  const canRsvp = normalizedEventType === 'organized';
  const rsvped = event?.rsvps?.some((r) => r.user?._id === user?._id || r.user === user?._id);

  const handleRsvp = async () => {
    if (!user) {
      toast.info('Please log in to mark your interest in this event.');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (rsvped) {
      toast.info('You already marked interest for this event and it cannot be cancelled.');
      return;
    }

    setRsvpBusy(true);
    const result = await dispatch(toggleRsvp(id));
    setRsvpBusy(false);
    if (toggleRsvp.fulfilled.match(result)) {
      const message = result.payload?.message || 'Marked as interested! 🌱';
      toast.success(message);
      dispatch(fetchEventById(id));
    } else {
      toast.error(result.payload || 'Could not update your interest status.');
    }
  };

  // Error → friendly state with retry (was previously an infinite spinner!)
  if (error && !event) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchEventById(id))}
        />
      </div>
    );
  }

  if (isLoading || !event) return <Spinner fullPage />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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
        <div className="relative h-[clamp(18rem,65vh,42rem)] w-full overflow-hidden bg-forest-50">
          {galleryImages[0]?.url ? (
            <>
              <motion.img
                key={galleryImages[photoIndex]?.url}
                src={galleryImages[photoIndex]?.url}
                alt={`${event.title} photo ${photoIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 h-full w-full object-cover"
              />
            </>
          ) : (
            <div className="flex h-full min-h-64 w-full items-center justify-center bg-forest-50 md:min-h-96">
              <img src="/Logo.png" alt="Team of Sustainability" className="h-40 w-40 object-contain opacity-80 md:h-52 md:w-52" />
            </div>
          )}
          <span className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-800 shadow-sm backdrop-blur-sm">
            {eventTimelineLabel}
          </span>
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm" aria-label={`${galleryImages.length} event photos`}>
              {galleryImages.map((photo, index) => (
                <span
                  key={photo.url}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${index === photoIndex ? 'bg-forest-600' : 'bg-forest-200'}`}
                />
              ))}
              <span className="ml-1 text-[11px] font-semibold text-forest-800">
                {photoIndex + 1} / {galleryImages.length}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10 md:pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-forest-100 text-forest-700">
              {eventStatus}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              {eventTimelineLabel}
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

          {/* Interested */}
          {canRsvp && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {rsvped ? "You're interested! 🎉" : 'Will you join us?'}
                </p>
                <p className="text-sm text-gray-500">
                  {rsvped
                    ? 'This interest is locked in and can no longer be cancelled.'
                    : 'Mark yourself interested so we know who wants to join.'}
                </p>
              </div>
              <button
                onClick={handleRsvp}
                disabled={rsvpBusy || rsvped}
                className={`px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60 ${
                  rsvped
                    ? 'bg-forest-100 text-forest-700 border border-forest-200 cursor-default'
                    : 'bg-forest-600 text-white hover:bg-forest-700 shadow-lg shadow-forest-200'
                }`}
              >
                {rsvpBusy ? 'Please wait...' : rsvped ? 'Interested ✓' : 'Interested 🌱'}
              </button>
            </div>
          )}

        </div>
      </motion.div>

    </div>
  );
}