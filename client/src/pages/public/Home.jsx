import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import api from '../../api/axios';
import { fetchEvents } from '../../features/events/eventsSlice';
import EventCard from '../../components/events/EventCard';
import Spinner from '../../components/ui/Spinner';
import MagneticButton from '../../components/ui/MagneticButton';
import Marquee from '../../components/ui/Marquee';
import SEO from '../../components/events/common/SEO';

/* ---------- Animated counter (respects prefers-reduced-motion) ---------- */
function Counter({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion → show the final number instantly, no counting
    if (reduceMotion) {
      setValue(target);
      return;
    }
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
  }, [inView, target, reduceMotion]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- Floating leaf decoration (skipped for reduced motion) ---------- */
function FloatingLeaves() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

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

const fallbackStats = [
  { target: 0, suffix: '+', label: 'Active Members' },
  { target: 10, suffix: '+', label: 'Events Organised' },
  { target: 10, suffix: '+', label: 'Projects Completed' },
  { target: 15, suffix: '+', label: 'Workshops & Seminars' },
];



const highlights = [
  {
    icon: '☀️',
    title: 'Solar Tracker',
    text: 'Smart solar systems that follow sunlight to improve energy capture and showcase sustainable engineering.',
  },
  {
    icon: '♻️',
    title: 'Waste Sorting',
    text: 'Sensor-driven solutions that make responsible disposal simpler, smarter and relatable for campus life.',
  },
  {
    icon: '🎨',
    title: 'Awareness & Design',
    text: 'Creative campaigns and storytelling that turn sustainability into a movement people care about.',
  },
];



const process = [
  'Explore your interests in technology, design, research or outreach',
  'Join hands-on sessions, team projects and live campus initiatives',
  'Build, present and contribute to meaningful sustainability work',
  'Create lasting impact through action and community engagement',
];

export default function Home() {
  const dispatch = useDispatch();
  const events = useSelector((s) => s.events.list);
  const eventsLoading = useSelector((s) => s.events.isLoading);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [stats, setStats] = useState(fallbackStats);

  // Sticky mobile CTA appears after scrolling past the hero (item #10)
  useEffect(() => {
    const onScroll = () => setShowStickyCTA(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          api.get('/users?limit=1'),
          api.get('/events?filter=organized&limit=1'),
        ]);

        const activeMembers = Number(usersRes.data?.pagination?.total || 0);
        const eventsOrganised = Number(eventsRes.data?.pagination?.total || 10);

        if (!isMounted) return;

        setStats([
          { target: activeMembers, suffix: '+', label: 'Active Members' },
          { target: Math.max(eventsOrganised, 10), suffix: '+', label: 'Events Organised' },
          { target: 10, suffix: '+', label: 'Projects Completed' },
          { target: 15, suffix: '+', label: 'Workshops & Seminars' },
        ]);
      } catch {
        if (isMounted) setStats(fallbackStats);
      }
    };

    loadStats();
    dispatch(fetchEvents({ filter: 'upcoming', page: 1 }));

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div>
      <SEO
        title="Home"
        description="Team of Sustainability — the official sustainability club of VSSUT, Burla. Join us for plantation drives, IoT projects, workshops and awareness drives for the UN SDGs."
      />
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
              We are <strong>Team of Sustainability</strong> — a student-led community building a greener campus through research, technology, outreach and action. From IoT projects to plantation drives, we turn ideas into measurable impact.
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
                  Become a Member →
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

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-forest-700">What we build</span>
              <h2 className="section-title mt-2">Ideas that solve real problems.</h2>
            </div>
            <Link to="/projects" className="text-forest-600 font-medium hover:underline">
              Explore all projects →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-100 to-emerald-50 text-3xl">
                  {item.icon}
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-forest-700">How it works</span>
            <h2 className="section-title mt-3">Join and grow with the club.</h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="absolute -top-3 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                <p className="mt-6 text-base leading-relaxed text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= UPCOMING EVENTS ================= */}
      <section className="py-20 bg-forest-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="text-gray-500 mt-2">Join the next step toward a greener campus 🌿</p>
            </div>
            <Link to="/events" className="text-forest-600 font-medium hover:underline whitespace-nowrap">
              View all events →
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

      {/* ================= CTA BANNER ================= */}
      <section className="pb-20 pt-2">
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
              Ready to build a greener future?
            </h2>
            <p className="text-forest-100 mt-3 max-w-xl mx-auto relative">
              Join Team of Sustainability and contribute to hands-on projects, community drives and research that create real environmental impact.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 relative">
              <Link
                to="/signup"
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-forest-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                Join the club today 🌱
              </Link>
              <Link
                to="/about"
                className="inline-block px-8 py-3.5 rounded-xl border border-white/30 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Learn more
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky mobile CTA (item #10) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 glass border-t border-forest-200 shadow-[0_-8px_30px_-12px_rgba(21,128,61,0.35)]"
          >
            <Link
              to="/signup"
              className="block w-full text-center py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg transition-colors"
            >
              Join the club — it’s free 🌱
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}