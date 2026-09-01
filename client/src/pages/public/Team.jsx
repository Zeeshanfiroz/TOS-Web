import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/events/common/SEO';
import api from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

function MemberCard({ member, index }) {
  const avatarUrl =
    member.photoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=E7F5EC&color=1F3B2D&size=200&bold=true`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
    >
      <img
        src={avatarUrl}
        alt={member.name}
        loading="lazy"
        className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-forest-100"
      />
      <h3 className="font-display font-semibold mt-4">{member.name}</h3>
      <p className="text-sm text-forest-600 font-medium mt-1">{member.position}</p>
      {member.bio && <p className="mt-2 text-sm text-gray-600">{member.bio}</p>}
    </motion.div>
  );
}

export default function Team() {
  const [teamGroups, setTeamGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsSlowLoading(false);
      return undefined;
    }

    const timer = setTimeout(() => setIsSlowLoading(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/team?limit=100');
        const grouped = data.data.reduce((acc, member) => {
          const groupName = member.group || 'Core Team';
          if (!acc[groupName]) acc[groupName] = [];
          acc[groupName].push(member);
          return acc;
        }, {});

        setTeamGroups(
          Object.entries(grouped)
            .map(([groupName, members]) => ({
              role: groupName,
              members: [...members].sort((a, b) => (a.order || 0) - (b.order || 0)),
            }))
            .sort((a, b) => a.role.localeCompare(b.role))
        );
      } catch {
        setTeamGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const hasMembers = useMemo(() => teamGroups.some((group) => group.members.length > 0), [teamGroups]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <SEO
          title="Our Team"
          description="Meet the team behind Team of Sustainability — faculty advisors, coordinators and student leaders driving sustainability at VSSUT, Burla."
        />
        <h1 className="section-title">Meet the Team</h1>
        <p className="text-gray-500 mt-2">
          The people driving change at Team of Sustainability, VSSUT Burla.
        </p>
      </motion.div>

      {loading ? (
        <div className="mt-12">
          <Spinner />
          {isSlowLoading && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Waking up the server — this can take up to a minute on first load.
            </p>
          )}
        </div>
      ) : hasMembers ? (
        teamGroups.map((group) => (
          <section key={group.role} className="mt-14">
            <h2 className="font-display text-xl font-semibold text-forest-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 rounded-full bg-forest-500" />
              {group.role}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {group.members.map((member, index) => (
                <MemberCard key={member._id || member.name} member={member} index={index} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
          Team profiles will appear here once the admin adds them.
        </div>
      )}

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
    </div>
  );
}
