import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Send } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/lapor', label: 'Lapor' },
    { to: '/feed', label: 'Laporan' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-lg backdrop-blur-xl'
          : 'bg-white/80 backdrop-blur-md'
      } border-b border-slate-200/80`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo-link">
            <div className="w-9 h-9 flex-shrink-0">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="10" fill="url(#navLogoGrad)" />
                <path d="M10 12h16v10a2 2 0 01-2 2h-5l-4 4v-4h-3a2 2 0 01-2-2V12z" fill="white" opacity="0.9" />
                <circle cx="14" cy="17" r="1.5" fill="url(#navLogoGrad)" />
                <circle cx="18" cy="17" r="1.5" fill="url(#navLogoGrad)" />
                <circle cx="22" cy="17" r="1.5" fill="url(#navLogoGrad)" />
                <defs>
                  <linearGradient id="navLogoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1a3a6e" />
                    <stop offset="1" stopColor="#00b4d8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-navy-800 group-hover:text-navy-700 transition-colors">
              Lapor<span className="gradient-text">In</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-navy-800 bg-navy-100'
                    : 'text-slate-500 hover:text-navy-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/lapor"
              className="gradient-bg text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              id="btn-nav-lapor"
            >
              <Send size={14} />
              <span className="hidden sm:inline">Lapor</span>
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              id="hamburger-btn"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out bg-white border-t border-slate-200 ${
          menuOpen ? 'max-h-80' : 'max-h-0'
        }`}
        id="nav-drawer"
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-6 py-3.5 text-sm font-medium border-b border-slate-100 transition-colors ${
              isActive(link.to)
                ? 'text-navy-800 bg-navy-50 font-semibold'
                : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
