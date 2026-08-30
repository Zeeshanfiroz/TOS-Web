import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import SEO from '../../components/events/common/SEO';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

const legacyProjects = [
  {
    no: '01',
    title: 'Waste-Sorting Machine',
    category: 'Electronics + Automation',
    summary: 'A smart bin system that sorts waste with sensors and motor control.',
    description: 'An Arduino-based solution that identifies metal, moisture and object movement to direct each type of waste into the right disposal channel. It reduces manual sorting effort and demonstrates practical smart-campus innovation.',
    tags: ['Arduino Uno', 'IR Sensor', 'Moisture Sensor', 'Motor Driver'],
    status: 'active',
  },
  {
    no: '02',
    title: 'Solar Tracker',
    category: 'Renewable Energy',
    summary: 'A solar panel setup that follows sunlight for higher energy capture.',
    description: 'This project uses LDR sensors and servo motors to align the panel with the sun throughout the day. The system is designed to improve energy efficiency and showcase renewable-energy systems in everyday campus applications.',
    tags: ['LDR', 'Servo Motor', 'GSM Module', 'Solar Panel'],
    status: 'completed',
  },
  {
    no: '03',
    title: 'Paper Recycling Initiative',
    category: 'Sustainable Practice',
    summary: 'A community-focused recycling prototype demonstrated at public events.',
    description: 'The club created a reusable paper recycling system and showcased it during Makers Fest 2023. The model highlighted how low-cost intervention can turn everyday waste into a practical sustainability lesson.',
    tags: ['Makers Fest', 'Recycling', 'Awareness', 'Prototype'],
    status: 'completed',
  },
];

const BuildMotif = ({ variant = 0 }) => {
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
};

function ProjectCard({ project, index }) {
  const gallery = [project.banner, ...(project.gallery || [])].filter(Boolean);
  const mainImage = gallery[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      className="group h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${project.title} project preview`}
            loading="lazy"
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <BuildMotif variant={index} />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {project.status === 'completed' ? 'Completed' : 'Active'}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-forest-200 bg-forest-100 px-3 py-1 text-[11px] font-semibold text-forest-800">
          {project.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-gray-900 transition-colors group-hover:text-forest-700">
          {project.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-forest-700">{project.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(project.tags || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/projects', { params: { limit: 999 } });
        setProjects(data.data || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load projects right now.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="Projects"
        description="Explore the sustainability projects built by Team of Sustainability at VSSUT Burla."
      />

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-forest-700">What we build</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-gray-900">Ideas turned into action.</h1>
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-forest-700">Featured builds</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-gray-900">Project stories from the club.</h2>
      </div>

      <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {legacyProjects.map((project, index) => (
          <ProjectCard key={project.no} project={project} index={index} />
        ))}
      </div>

      {loading ? (
        <div className="py-12"><Spinner /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : projects.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No additional admin projects yet. Check back soon.</div>
      ) : (
        <div className="mt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-forest-700">Admin updates</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-gray-900">More project work from the team.</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project._id || project.no} project={project} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
