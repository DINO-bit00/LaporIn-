import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="10" fill="url(#fLogo)" />
                  <path d="M10 12h16v10a2 2 0 01-2 2h-5l-4 4v-4h-3a2 2 0 01-2-2V12z" fill="white" opacity="0.9" />
                  <circle cx="14" cy="17" r="1.5" fill="url(#fLogo)" />
                  <circle cx="18" cy="17" r="1.5" fill="url(#fLogo)" />
                  <circle cx="22" cy="17" r="1.5" fill="url(#fLogo)" />
                  <defs>
                    <linearGradient id="fLogo" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1a3a6e" /><stop offset="1" stopColor="#00b4d8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white">
                Lapor<span className="text-teal-400">In</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Platform pengaduan layanan publik berbasis AI untuk Indonesia yang lebih baik.
              Suara warga, aksi nyata.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm hover:text-teal-400 transition-colors">Beranda</Link>
                <Link to="/lapor" className="text-sm hover:text-teal-400 transition-colors">Buat Laporan</Link>
                <Link to="/feed" className="text-sm hover:text-teal-400 transition-colors">Feed Laporan</Link>
                <Link to="/dashboard" className="text-sm hover:text-teal-400 transition-colors">Dashboard</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Admin</h4>
              <div className="flex flex-col gap-2">
                <Link to="/admin" className="text-sm hover:text-teal-400 transition-colors">Admin Panel</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            © 2026 LaporIn · CC26-PSU225 · Coding Camp powered by DBS Foundation · Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
