import { Link } from 'react-router-dom';

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M5.2 8.2H2.8V21h2.4V8.2ZM4 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM21.2 13.7c0-3.85-2.05-5.64-4.78-5.64-2.2 0-3.18 1.22-3.73 2.08V8.2h-2.4V21h2.4v-6.33c0-1.67.32-3.29 2.39-3.29 2.04 0 2.07 1.92 2.07 3.4V21h2.4l.01-7.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
            <ul className="space-y-3 text-sm text-forest-200/80">
              <li>
                <a
                  href="mailto:teamofsustainabilityvssut@gmail.com"
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-forest-200 transition-colors group-hover:bg-white group-hover:text-forest-800">
                    <SocialIcon type="mail" />
                  </span>
                  <span className="break-all">teamofsustainabilityvssut@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/teamofsustainability_vssut/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-forest-200 transition-colors group-hover:bg-white group-hover:text-forest-800">
                    <SocialIcon type="instagram" />
                  </span>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/team-of-sustainability-vssut-burla-501251298?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-forest-200 transition-colors group-hover:bg-white group-hover:text-forest-800">
                    <SocialIcon type="linkedin" />
                  </span>
                  <span>LinkedIn</span>
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