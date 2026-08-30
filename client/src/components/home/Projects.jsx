import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import SectionHeading from './SectionHeading';

const PROJECTS = [
  {
    no: '01',
    title: 'Waste-Sorting Machine',
    category: 'Electronics + Automation',
    summary: 'A smart bin system that sorts waste with sensors and motor control.',
    body: 'An Arduino-based solution that identifies metal, moisture and object movement to direct each type of waste into the right disposal channel. It reduces manual sorting effort and demonstrates practical smart-campus innovation.',
    tags: ['Arduino Uno', 'IR Sensor', 'Moisture Sensor', 'Motor Driver'],
    buildPhoto: null,
  },
  {
    no: '02',
    title: 'Solar Tracker',
    category: 'Renewable Energy',
    summary: 'A solar panel setup that follows sunlight for higher energy capture.',
    body: 'This project uses LDR sensors and servo motors to align the panel with the sun throughout the day. The system is designed to improve energy efficiency and showcase renewable-energy systems in everyday campus applications.',
    tags: ['LDR', 'Servo Motor', 'GSM Module', 'Solar Panel'],
    buildPhoto: null,
  },
  {
    no: '03',
    title: 'Paper Recycling Initiative',
    category: 'Sustainable Practice',
    summary: 'A community-focused recycling prototype demonstrated at public events.',
    body: 'The club created a reusable paper recycling system and showcased it during Makers Fest 2023. The model highlighted how low-cost intervention can turn everyday waste into a practical sustainability lesson.',
    tags: ['Makers Fest', 'Recycling', 'Awareness', 'Prototype'],
    buildPhoto: null,
  },
];

function BuildMotif({ variant }) {
  const flips = ['scale-x-100', '-scale-x-100', 'scale-x-100 -translate-y-1'];
  return (
    <div className="h-44 w-full overflow-hidden rounded-t-2xl border-b border-white/20 bg-gradient-to-br from-forest-500 via-emerald-600 to-teal-700">
      <svg
        viewBox="0 0 300 100"
        className={`h-full w-full ${flips[variant % flips.length]} opacity-90`}
        aria-hidden="true"
      >
        <g stroke="#dff7e6" strokeOpacity="0.88" strokeWidth="1.6" fill="none">
          <polyline points="0,32 70,32 90,50 180,50" />
          <polyline points="300,70 230,70 210,50 150,50" />
          <polyline points="0,82 52,82 70,60 130,60" />
        </g>
        <g stroke="#bfead0" strokeOpacity="0.8" strokeWidth="1.2" fill="none">
          <polyline points="300,25 240,25 220,45 160,45" />
        </g>
        <g fill="#f8fff8" fillOpacity="0.95">
          <circle cx="90" cy="50" r="3.5" />
          <circle cx="210" cy="50" r="3.5" />
          <circle cx="70" cy="60" r="3" />
          <circle cx="180" cy="50" r="3" />
        </g>
      </svg>
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
    >
      <TiltCard>
        <article className="group h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl">
          <div className="relative">
            {project.buildPhoto ? (
              <img
                src={project.buildPhoto}
                alt={`${project.title} project preview`}
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <BuildMotif variant={index} />
            )}
            <span className="absolute left-3 top-3 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              Project #{project.no}
            </span>
            <span className="absolute right-3 top-3 rounded-full border border-forest-200 bg-forest-100 px-3 py-1 text-[11px] font-semibold text-forest-800">
              {project.category}
            </span>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 font-medium text-forest-700">
                ⚙️ Build
              </span>
              <span className="font-medium">Prototype</span>
            </div>

            <h3 className="mt-4 font-display text-xl font-semibold text-gray-900 transition-colors group-hover:text-forest-700">
              {project.title}
            </h3>

            <p className="mt-2 text-sm font-medium text-forest-700">{project.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{project.body}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
      <SectionHeading eyebrow="What we build" title="Ideas turned into action." />
      <div>
        <p className="max-w-md text-[15px] font-medium leading-relaxed text-humus/85">
          Student-built solutions for real sustainability challenges — designed, tested and demonstrated by the people behind them.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.no} project={project} index={index} />
          ))}
        </div>

        <p className="mt-6 text-xs text-humus/60">
          More build stories are on the way from our project teams — come talk to us at a campus drive.
        </p>
      </div>
    </section>
  );
}
