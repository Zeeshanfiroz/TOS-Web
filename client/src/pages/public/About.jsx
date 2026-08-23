import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const milestones = [
  { year: '2024', text: 'Club founded by a group of 12 passionate students' },
  { year: '2025', text: 'First 500-tree plantation drive completed on campus' },
  { year: '2025', text: 'Partnership with college administration for recycling bins' },
  { year: '2026', text: 'Launched digital platform — you are here! 🌱' },
];

const values = [
  {
    icon: '🌳',
    title: 'Plant & Protect',
    text: 'We plant native trees and protect existing green cover across campus.',
  },
  {
    icon: '♻️',
    title: 'Reduce & Recycle',
    text: 'E-waste drives, plastic-free campaigns and proper waste segregation.',
  },
  {
    icon: '📣',
    title: 'Educate & Inspire',
    text: 'Workshops and campaigns that turn awareness into everyday action.',
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
          <h2 className="font-display text-2xl font-bold mt-4">Our Mission</h2>
          <p className="mt-3 text-forest-50/90 leading-relaxed">
            To make sustainability a way of life on our campus — through hands-on
            environmental action, student-led initiatives and community
            participation that creates measurable impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-forest-50 rounded-3xl p-8 md:p-10 border border-forest-100"
        >
          <span className="text-3xl">🔭</span>
          <h2 className="font-display text-2xl font-bold mt-4 text-forest-900">Our Vision</h2>
          <p className="mt-3 text-gray-600 leading-relaxed">
            A zero-waste, carbon-conscious campus where every student understands
            their environmental footprint — and has the tools and community
            support to shrink it.
          </p>
        </motion.div>
      </div>

      {/* Values */}
      <div className="mt-20">
        <h2 className="section-title text-center">What We Stand For</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
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

      {/* Milestones timeline */}
      <div className="mt-20 max-w-2xl mx-auto">
        <h2 className="section-title text-center">Our Journey</h2>
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