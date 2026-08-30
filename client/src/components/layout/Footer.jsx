import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌱</span>
              <span className="font-display font-bold text-xl text-white">
                Team of <span className="text-forest-400">Sustainability</span>
              </span>
            </div>
            <p className="text-sm text-forest-200/80 leading-relaxed">
              The official sustainability club of VSSUT, Burla — building practical solutions, awareness and community action for a more resilient future. Small steps, meaningful impact.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/events', 'Events'],
                ['/announcements', 'Announcements'],
                ['/team', 'Our Team'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-forest-200/80 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-forest-200/80">
              <li>
                <a
                  href="mailto:teamofsustainabilityvssut@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  📧 teamofsustainabilityvssut@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/teamofsustainability_vssut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  📸 Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/team-of-sustainability-vssut-burla-501251298?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  💼 LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-forest-300/60">
          <span>
            © {new Date().getFullYear()} Team of Sustainability — VSSUT, Burla. Built with care by students.
          </span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}