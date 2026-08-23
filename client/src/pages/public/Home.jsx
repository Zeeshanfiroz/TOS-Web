import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { fetchEvents } from '../../features/events/eventsSlice';
import { fetchAnnouncements as fetchAnns } from '../../features/announcements/announcementsSlice';
import { fetchGallery as fetchGal } from '../../features/gallery/gallerySlice';
import EventCard from '../../components/events/EventCard';
import Spinner from '../../components/ui/Spinner';

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
      <section className="relative bg-gradient-to-b from-forest-50 via-white to-white">
        <FloatingLeaves />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-forest-100 text-forest-700 text-sm font-semibold mb-6">
              🌱 Student-led • Campus-wide • Planet-first
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Growing a <span className="text-forest-600">Greener</span> Campus,
              <br />
              Together.
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Join our sustainability club — tree plantation drives, e-waste
              collection, recycling programs and awareness campaigns that make a
              real difference right here on campus.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-all hover:-translate-y-0.5"
              >
                Join the Club →
              </Link>
              <Link
                to="/events"
                className="px-8 py-3.5 rounded-xl bg-white border border-forest-200 text-forest-700 font-semibold hover:bg-forest-50 transition-colors"
              >
                Explore Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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
              Become a member today and join hundreds of students driving real
              environmental change on campus.
            </p>
            <Link
              to="/signup"
              className="inline-block mt-8 px-8 py-3.5 rounded-xl bg-white text-forest-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform relative"
            >
              Join GreenSoul Today 🌱
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}