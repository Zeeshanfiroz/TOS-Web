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

          {/* Contact + Social */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-forest-200/80">
              <li>📍 VSSUT, Burla, Sambalpur, Odisha</li>
              <li>
                <a
                  href="mailto:teamofsustainability@vssut.ac.in"
                  className="hover:text-white transition-colors"
                >
                  📧 teamofsustainability@vssut.ac.in
                </a>
              </li>
            </ul>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {[
                {
                  label: 'Instagram',
                  href: 'https://instagram.com/teamofsustainability_vssut',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  href: 'https://github.com/Zeeshanfiroz/TOS-Web',
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  ),
                },
                {
                  label: 'Email',
                  href: 'mailto:teamofsustainability@vssut.ac.in',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                      />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-forest-800/60 hover:bg-forest-600 flex items-center justify-center text-forest-200 hover:text-white transition-all hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
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