import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchEventById, toggleRsvp } from '../../features/events/eventsSlice';
import { selectUser } from '../../features/auth/authSlice';
import api from '../../api/axios';
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
  const [queryBusy, setQueryBusy] = useState(false);

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
  const canRsvp = normalizedEventType === 'organized' && isUpcoming;
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
            <motion.img
              key={galleryImages[photoIndex]?.url}
              src={galleryImages[photoIndex]?.url}
              alt={`${event.title} photo ${photoIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 h-full w-full object-contain"
            />
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

          {/* ── PROMINENT registration CTA (upcoming events with links) — right
              under the title so visitors see it first, before anything else ── */}
          {isUpcoming && (event.registrationLink || event.ruleBookUrl) && (
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-forest-600 to-emerald-600 p-1 shadow-lg shadow-forest-200">
              <div className="rounded-[14px] bg-white/95 backdrop-blur px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-display font-bold text-forest-800 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest-600"></span>
                    </span>
                    Registrations open!
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {event.fee ? `Entry: ${event.fee} · ` : ''}Secure your spot for {event.title}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-bold hover:bg-forest-700 shadow-md transition-all hover:-translate-y-0.5"
                    >
                      🔗 Register Now
                    </a>
                  )}
                  {event.ruleBookUrl && (
                    <a
                      href={event.ruleBookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-xl bg-white border-2 border-forest-600 text-forest-700 text-sm font-bold hover:bg-forest-50 transition-all hover:-translate-y-0.5"
                    >
                      📖 Rule Book
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* ── Optional event details (shown only when the admin filled them) ── */}
          {(event.fee || event.registrationLink || event.ruleBookUrl || (event.externalLinks?.length > 0)) && (
            <div className="mt-6 rounded-2xl bg-forest-50 border border-forest-100 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest-600 mb-3">Event Details</p>

              {event.fee && (
                <p className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <span className="text-base">🎟️</span>
                  <span><span className="font-semibold">Entry Fee:</span> {event.fee}</span>
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 shadow-md shadow-forest-200 transition-colors"
                  >
                    🔗 Register Now
                  </a>
                )}
                {event.ruleBookUrl && (
                  <a
                    href={event.ruleBookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-forest-200 text-forest-700 text-sm font-semibold hover:bg-forest-50 transition-colors"
                  >
                    📖 Rule Book
                  </a>
                )}
                {event.externalLinks?.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-forest-200 text-forest-700 text-sm font-semibold hover:bg-forest-50 transition-colors"
                  >
                    🔗 {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Ask a question ── */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="font-semibold text-gray-900">Have a question? 💬</p>
            {user ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const question = e.target.elements.question.value.trim();
                  if (!question) return;
                  setQueryBusy(true);
                  try {
                    await api.post(`/events/${id}/queries`, { question });
                    toast.success('Question sent! Our team will reply soon. 🌱');
                    e.target.reset();
                    dispatch(fetchEventById(id)); // refresh Q&A list
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Could not send your question.');
                  } finally {
                    setQueryBusy(false);
                  }
                }}
                className="mt-3"
              >
                <textarea
                  name="question"
                  rows={3}
                  maxLength={500}
                  placeholder={`Ask anything about ${event.title}...`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none text-sm"
                />
                <button
                  type="submit"
                  disabled={queryBusy}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-semibold hover:bg-forest-700 disabled:opacity-60"
                >
                  {queryBusy ? 'Sending...' : 'Send Question'}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                <Link to="/login" state={{ from: `/events/${id}` }} className="text-forest-600 font-semibold hover:underline">
                  Log in
                </Link>{' '}
                to ask the team a question about this event.
              </p>
            )}
          </div>

          {/* ── Q&A list (answered questions show the official reply) ── */}
          {event.queries?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Questions & Answers ({event.queries.length})
              </p>
              <div className="space-y-4">
                {event.queries.map((q) => (
                  <div key={q._id} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Q. {q.question}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">— {q.user?.name || 'Member'}</p>
                    {q.answer ? (
                      <div className="mt-3 pl-4 border-l-2 border-forest-300">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-forest-700">A. </span>
                          {q.answer}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">— Team of Sustainability</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-amber-600">Awaiting reply from the team…</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interested */}
          {canRsvp && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {rsvped ? "You're interested! 🎉" : 'Will you join us?'}
                </p>
                <p className="text-sm text-gray-500">
                  {rsvped
                    ? 'We will keep you informed and connected with the event updates.'
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