import { motion } from 'framer-motion';

// Placeholder team data — replace names/photos with your real team.
const teams = [
  {
    role: 'Core Committee',
    members: [
      { name: 'Aarav Sharma', position: 'President', img: 'https://i.pravatar.cc/300?img=12' },
      { name: 'Priya Verma', position: 'Vice President', img: 'https://i.pravatar.cc/300?img=47' },
      { name: 'Rohan Gupta', position: 'General Secretary', img: 'https://i.pravatar.cc/300?img=33' },
    ],
  },
  {
    role: 'Leads',
    members: [
      { name: 'Sneha Patel', position: 'Events Lead', img: 'https://i.pravatar.cc/300?img=44' },
      { name: 'Arjun Mehta', position: 'Outreach Lead', img: 'https://i.pravatar.cc/300?img=59' },
      { name: 'Ishita Rao', position: 'Design Lead', img: 'https://i.pravatar.cc/300?img=26' },
      { name: 'Kabir Singh', position: 'Tech Lead', img: 'https://i.pravatar.cc/300?img=68' },
    ],
  },
  {
    role: 'Volunteers',
    members: [
      { name: 'Ananya Iyer', position: 'Volunteer', img: 'https://i.pravatar.cc/300?img=31' },
      { name: 'Dev Malhotra', position: 'Volunteer', img: 'https://i.pravatar.cc/300?img=53' },
      { name: 'Meera Nair', position: 'Volunteer', img: 'https://i.pravatar.cc/300?img=45' },
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
        <h1 className="section-title">Meet The Team</h1>
        <p className="text-gray-500 mt-2">The people driving change behind the scenes.</p>
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

      <p className="text-center text-xs text-gray-400 mt-12">
        * Placeholder photos — update with real team photos in src/pages/public/Team.jsx
      </p>
    </div>
  );
}