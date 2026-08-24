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
              The official sustainability club of VSSUT, Burla — working towards
              the UN Sustainable Development Goals through hands-on projects,
              awareness drives and research. Small actions, big impact.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/events', 'Events'],
                ['/gallery', 'Gallery'],
                ['/announcements', 'Announcements'],
                ['/team', 'Our Team'],
                ['/contact', 'Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-forest-200/80 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-forest-200/80">
              <li>📍 VSSUT, Burla, Sambalpur, Odisha</li>
              <li>📧 teamofsustainability@vssut.ac.in</li>
              <li>📷 @teamofsustainability on Instagram</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-10 pt-6 text-center text-xs text-forest-300/60">
          © {new Date().getFullYear()} Team of Sustainability — VSSUT, Burla. Made with 💚 by students.
        </div>
      </div>
    </footer>
  );
}