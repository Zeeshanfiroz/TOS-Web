import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const milestones = [
  { year: '2023', text: 'Exhibited our paper recycling project at Makers Fest 2023' },
  { year: '2024', text: 'Won multiple competitions & participated in Robosumo at NIT Rourkela Innovision 2024' },
  { year: '2024', text: 'Rakshabandhan-inspired awareness drive at Kirba school' },
  { year: '2024', text: 'Sustainability quizzes & trash-to-treasure events at SAMAVESH' },
  { year: '2025', text: 'Sambalpuri Jewelry & Accessories workshop with Sambalpuri Hub — empowering 72 underprivileged women' },
  { year: '2025', text: 'Pitched our idea at IIT Bhubaneswar on World Standards Day' },
  { year: '2025', text: 'VIRTOSWA 2K25 orientation — welcoming the next generation of changemakers' },
];

const domains = [
  {
    icon: '🤖',
    title: 'Technical',
    text: 'IoT-based embedded systems, sensors and robotics to monitor, collect data and solve real-life sustainability problems.',
  },
  {
    icon: '🎨',
    title: 'Design & Content',
    text: 'Posters, infographics, videos and social media — plus compelling narratives around sustainability goals and impact.',
  },
  {
    icon: '📋',
    title: 'Event Management',
    text: 'Eco-conscious events with minimal waste, awareness campaigns, workshops and clean-up drives.',
  },
  {
    icon: '🔬',
    title: 'Research & Development',
    text: 'Researching and developing new sustainable methods, plus bootcamps and research programmes.',
  },
];

const projects = [
  {
    icon: '☀️',
    name: 'Solar Tracker',
    text: 'LDR sensors sense the sun\u2019s direction, an Arduino Uno processes the data and servo motors rotate the solar panel to maximise energy capture — with a GSM module for monitoring.',
  },
  {
    icon: '♻️',
    name: 'Waste Segregation Bin',
    text: 'Automatically classifies different types of waste and directs them to their respective bins — making waste sorting effortless.',
  },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Mission / Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-3xl p-8 md:p-10 text-white"
        >
          <span className="text-3xl">🎯</span>
          <h2 className="font-display text-2xl font-bold mt-4">Our Vision</h2>
          <p className="mt-3 text-forest-50/90 leading-relaxed">
            To ignite a global culture of conscious living by pioneering
            innovative, inclusive and impactful solutions that harmonize human
            progress with the planet&rsquo;s well-being — where sustainability is
            not a choice but a shared responsibility.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-forest-50 rounded-3xl p-8 md:p-10 border border-forest-100"
        >
          <span className="text-3xl">🌍</span>
          <h2 className="font-display text-2xl font-bold mt-4 text-forest-900">Who We Are</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            We are the official sustainability club of <strong>VSSUT, Burla</strong> —
            a group of passionate individuals working towards the UN Sustainable
            Development Goals. From hands-on technical projects to awareness
            drives and industry visits, we make sustainability a way of life.
          </p>
        </motion.div>
      </div>

      {/* Domains */}
      <div className="mt-20">
        <h2 className="section-title text-center">Our Domains</h2>
        <p className="text-center text-gray-500 mt-2">
          Whatever your skill, there&rsquo;s a place for you here.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl">{v.icon}</span>
              <h3 className="font-display font-semibold text-lg mt-4">{v.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technical Projects */}
      <div className="mt-20">
        <h2 className="section-title text-center">Our Technical Projects</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-gradient-to-br from-forest-50 to-white rounded-2xl border border-forest-100 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl">{p.icon}</span>
              <h3 className="font-display font-semibold text-xl mt-4">{p.name}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Milestones timeline */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="section-title text-center">Events & Achievements</h2>
        <div className="mt-10 space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-forest-200">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 pb-8 last:pb-0"
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-forest-600 text-white flex items-center justify-center text-xs font-bold z-10">
                {m.year}
              </span>
              <p className="pt-2 text-gray-700">{m.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <Link
          to="/team"
          className="inline-block px-8 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-lg shadow-forest-200 transition-all hover:-translate-y-0.5"
        >
          Meet Our Team →
        </Link>
      </div>
    </div>
  );
}