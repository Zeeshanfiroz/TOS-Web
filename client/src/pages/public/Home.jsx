import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { fetchEvents } from '../../features/events/eventsSlice';
import { fetchAnnouncements as fetchAnns } from '../../features/announcements/announcementsSlice';
import { fetchGallery as fetchGal } from '../../features/gallery/gallerySlice';
import EventCard from '../../components/events/EventCard';
import Spinner from '../../components/ui/Spinner';
import MagneticButton from '../../components/ui/MagneticButton';
import Marquee from '../../components/ui/Marquee';

/* ---------- Animated counter ---------- */
function Counter({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- Floating leaf decoration ---------- */
function FloatingLeaves() {
  const leaves = [
    { left: '8%', delay: 0, size: 28 },
    { left: '22%', delay: 1.5, size: 20 },
    { left: '45%', delay: 0.7, size: 24 },
    { left: '68%', delay: 2, size: 18 },
    { left: '85%', delay: 1, size: 30 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((l, i) => (
        <motion.span
          key={i}
          className="absolute text-forest-300/40"
          style={{ left: l.left, fontSize: l.size }}
          initial={{ y: -60, rotate: 0 }}
          animate={{ y: ['0vh', '110vh'], rotate: 360 }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: l.delay,
            ease: 'linear',
          }}
        >
          🍃
        </motion.span>
      ))}
    </div>
  );
}

const stats = [
  { target: 500, suffix: '+', label: 'Active Members' },
  { target: 1200, suffix: '+', label: 'Trees Planted' },
  { target: 45, suffix: '+', label: 'Events Conducted' },
  { target: 850, suffix: 'kg', label: 'Waste Recycled' },
];

export default function Home() {
  const dispatch = useDispatch();
  const events = useSelector((s) => s.events.list);
  const eventsLoading = useSelector((s) => s.events.isLoading);
  const announcements = useSelector((s) => s.announcements.list);
  const galleryImages = useSelector((s) => s.gallery.images);

  useEffect(() => {
    dispatch(fetchEvents({ filter: 'upcoming', page: 1 }));
    dispatch(fetchAnns({ page: 1 }));
    dispatch(fetchGal({ page: 1 }));
  }, [dispatch]);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-b from-forest-50 via-white to-white overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-forest-300/40 rounded-full blur-3xl animate-blob" />
        <div
          className="absolute top-32 -right-32 w-[26rem] h-[26rem] bg-emerald-300/40 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '-7s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '-3s' }}
        />
        <FloatingLeaves />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-block px-4 py-1.5 rounded-full glass border border-forest-200 text-forest-700 text-sm font-semibold mb-6 shadow-sm"
            >
              🌱 Official Sustainability Club of VSSUT, Burla
            </motion.span>

            {/* Word-stagger headline */}
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              {['Small', 'Actions,'].map((w, i) => (
                <motion.span
                  key={w}
                  className="inline-block mr-3"
                  initial={{ opacity: 0, y: 40, rotate: 4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              ))}
              <br />
              {['Big', 'Impact.'].map((w, i) => (
                <motion.span
                  key={w}
                  className={`inline-block mr-3 ${i === 1 ? 'text-gradient' : ''}`}
                  initial={{ opacity: 0, y: 40, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.55 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed"
            >
              We are <strong>Team of Sustainability</strong> — working towards the
              UN Sustainable Development Goals through IoT projects, plantation
              drives, workshops and awareness campaigns. Together, we learn,
              create and drive change.
            </motion.p>

            {/* Magnetic CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton>
                <Link
                  to="/signup"
                  className="shine inline-block px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-300/60 transition-all"
                >
                  Join the Club →
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/events"
                  className="inline-block px-8 py-3.5 rounded-xl glass border border-forest-200 text-forest-700 font-semibold hover:bg-forest-50 transition-colors"
                >
                  Explore Events
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-forest-500"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <span className="animate-bounce-soft text-xl">↓</span>
          </motion.div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <Marquee
        items={[
          { icon: '🌱', label: 'Plantation Drives' },
          { icon: '🤖', label: 'IoT Projects' },
          { icon: '♻️', label: 'Waste Management' },
          { icon: '☀️', label: 'Solar Innovation' },
          { icon: '🔬', label: 'Research' },
          { icon: '🎨', label: 'Design & Content' },
          { icon: '📢', label: 'Awareness Campaigns' },
          { icon: '🏆', label: 'Competitions' },
        ]}
      />

      {/* ================= STATS ================= */}
      <section className="bg-forest-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-forest-400">
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <p className="text-sm text-forest-100/80 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="text-gray-500 mt-2">Be part of something green 🌿</p>
            </div>
            <Link to="/events" className="text-forest-600 font-medium hover:underline whitespace-nowrap">
              View all →
            </Link>
          </div>

          {eventsLoading ? (
            <Spinner />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= ANNOUNCEMENTS PREVIEW ================= */}
      <section className="py-20 bg-forest-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="section-title">Latest Announcements</h2>
            <Link to="/announcements" className="text-forest-600 font-medium hover:underline whitespace-nowrap">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.slice(0, 3).map((a, i) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-forest-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-semibold text-forest-600 uppercase tracking-wide">
                  {new Date(a.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h3 className="font-display font-semibold text-lg mt-2 line-clamp-2">{a.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{a.content}</p>
                <Link
                  to={`/announcements/${a._id}`}
                  className="inline-block mt-4 text-sm font-medium text-forest-600 hover:underline"
                >
                  Read more →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY PREVIEW ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="section-title">Moments That Matter</h2>
            <Link to="/gallery" className="text-forest-600 font-medium hover:underline whitespace-nowrap">
              Full gallery →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 8).map((img, i) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                className={`rounded-2xl overflow-hidden ${
                  i === 0 || i === 5 ? 'row-span-2 h-full' : ''
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'Club moment'}
                  loading="lazy"
                  className="w-full h-full min-h-36 object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-r from-forest-700 to-forest-500 px-8 py-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 text-[10rem] select-none pointer-events-none">
              🌍
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white relative">
              Ready to make an impact?
            </h2>
            <p className="text-forest-100 mt-3 max-w-xl mx-auto relative">
              Join Team of Sustainability and be part of a community working on
              IoT projects, awareness drives and research for a greener future.
            </p>
            <Link
              to="/signup"
              className="inline-block mt-8 px-8 py-3.5 rounded-xl bg-white text-forest-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform relative"
            >
              Join TOS Today 🌱
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}