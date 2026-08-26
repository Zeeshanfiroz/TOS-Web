import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

// Real team details from the club's official deck.
// Add/adjust members and photos here as the team changes.
const teams = [
  {
    role: 'Guiding Hands',
    members: [
      {
        name: 'Dr. Trupti Ranjan Mahapatra',
        position: 'Technical Society Vice President',
        img: '',
      },
      {
        name: 'Dr. Sasmita Behera',
        position: 'Faculty Advisor',
        img: '',
      },
    ],
  },
  {
    role: 'Office Bearers',
    members: [
      {
        name: 'SK shahnawaz ali ',
        position: 'Club Coordinator • ME',
        img: '',
      },
      {
        name: 'Dipali achariya ',
        position: 'Club Coordinator • PE',
        img: '',
      },
      {
        name: 'Zeeshan Firoz ',
        position: 'CS Lead • ME',
        img: '',
      },
      {
        name: 'MD Zeeshan Rashid ',
        position: 'Electronics Lead • PE',
        img: '',
      },
      {
        name: 'sandeep ',
        position: 'Assistant Coordinator • ETC',
        img: '',
      },
      {
        name: 'prajana ',
        position: 'Assistant Coordinator • BME',
        img: '',
      },
    ],
  },
];

function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
    >
      <img
        src={member.img}
        alt={member.name}
        loading="lazy"
        className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-forest-100"
      />
      <h3 className="font-display font-semibold mt-4">{member.name}</h3>
      <p className="text-sm text-forest-600 font-medium mt-1">{member.position}</p>
    </motion.div>
  );
}

export default function Team() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <SEO
          title="Our Team"
          description="Meet the team behind Team of Sustainability — faculty advisors, coordinators and student leaders driving sustainability at VSSUT, Burla."
        />
        <h1 className="section-title">Meet The Team</h1>
        <p className="text-gray-500 mt-2">
          The people driving change at Team of Sustainability, VSSUT Burla.
        </p>
      </motion.div>

      {teams.map((group) => (
        <section key={group.role} className="mt-14">
          <h2 className="font-display text-xl font-semibold text-forest-800 mb-6 flex items-center gap-3">
            <span className="w-8 h-1 rounded-full bg-forest-500" />
            {group.role}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {group.members.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </section>
      ))}

      {/* Join the team CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-forest-700 to-forest-500 rounded-3xl p-10 text-center text-white"
      >
        <h2 className="font-display text-2xl font-bold">Want your name here?</h2>
        <p className="text-forest-100 mt-2 max-w-xl mx-auto">
          Whether you're into IoT projects, design, event management or research —
          there's a domain for you. Join the club and become part of the team!
        </p>
        <a
          href="/signup"
          className="inline-block mt-6 px-8 py-3 rounded-xl bg-white text-forest-800 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          Join Us 🌱
        </a>
      </motion.div>

      <p className="text-center text-xs text-gray-500 mt-12">
        * Placeholder photos — replace with real team photos in src/pages/public/Team.jsx
      </p>
    </div>
  );
}
