import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight, FileText, Bot, Zap, BarChart3 } from 'lucide-react';
import StatCard from '../components/StatCard';
import { getStats } from '../services/api';

// ===== Counter Animation Hook =====
function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || !target) return;
    let raf;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

// ===== Intersection Observer Hook =====
function useInView(options) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

const STEPS = [
  { icon: <FileText size={28} />, title: 'Tulis Laporan', desc: 'Ceritakan masalah yang kamu temukan. Gunakan bahasa sehari-hari — AI kami paham bahasa informal Indonesia.' },
  { icon: <Bot size={28} />,      title: 'Analisis AI Otomatis', desc: 'Model LSTM kami mengklasifikasikan kategori dan menganalisis sentimen dalam milidetik — tanpa input manual.' },
  { icon: <Zap size={28} />,      title: 'Deteksi Urgensi', desc: 'Sistem mendeteksi kata kritis ("darurat", "tolong", "bahaya") untuk memprioritaskan laporan paling mendesak.' },
  { icon: <BarChart3 size={28} />, title: 'Dashboard & Tindak Lanjut', desc: 'Laporan masuk ke dashboard admin dengan visualisasi real-time, memudahkan pihak terkait merespons.' },
];

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [statsRef, statsVisible] = useInView({ threshold: 0.3 });

  const totalCount = useCountUp(stats?.total_laporan || 0, 1500, statsVisible);

  useEffect(() => {
    getStats()
      .then((data) => setStats(data))
      .catch(() => setStats({ total_laporan: 0, kategori_breakdown: {}, sentimen_breakdown: {} }));
  }, []);

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-emerald-50/30">
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-300/25 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 -right-24 w-80 h-80 bg-navy-400/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-3s' }} />
          <div className="absolute bottom-40 left-1/4 w-60 h-60 bg-emerald-300/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-navy-100/60 to-teal-100/60 border border-teal-300/40 text-navy-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse-dot" />
                AI-Powered Civic Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Suara Warga,<br />
                <span className="gradient-text">Aksi Nyata.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Laporkan masalah layanan publik di sekitarmu. AI kami menganalisis, mengklasifikasi, dan memprioritaskan laporan secara otomatis — tanpa ribet, tanpa birokrasi manual.
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link
                  to="/lapor"
                  className="gradient-bg text-white px-7 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  id="hero-btn-lapor"
                >
                  <Send size={16} />
                  Buat Laporan Sekarang
                </Link>
                <a
                  href="#cara-kerja"
                  className="bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-full font-semibold text-sm hover:border-navy-300 hover:text-navy-700 hover:bg-navy-50 transition-all duration-200"
                  id="hero-btn-carakerja"
                >
                  Lihat Cara Kerja
                </a>
              </div>

              {/* Hero stats */}
              <div ref={statsRef} className="inline-flex items-center gap-6 glass-card rounded-2xl px-6 py-4 shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-center">
                  <span className="text-2xl font-extrabold gradient-text block">
                    {statsVisible ? totalCount.toLocaleString('id-ID') : '0'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Laporan Masuk</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <span className="text-2xl font-extrabold gradient-text block">6</span>
                  <span className="text-[11px] text-slate-400 font-medium">Kategori</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <span className="text-2xl font-extrabold gradient-text block">AI</span>
                  <span className="text-[11px] text-slate-400 font-medium">Powered</span>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-shrink-0 animate-float">
              <div className="w-64 sm:w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-slate-50 rounded-[2rem] overflow-hidden min-h-[320px]">
                  <div className="w-16 h-5 bg-slate-800 rounded-b-xl mx-auto" />
                  <div className="p-3 space-y-3">
                    {/* Mini report card */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 mb-1.5">🔴 Urgen</span>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-2">
                        &quot;Jalan berlubang di Jl. Sudirman sudah 3 bulan tidak diperbaiki...&quot;
                      </p>
                      <div className="flex gap-1.5">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-800">🏗️ Infrastruktur</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800">😠 Negatif</span>
                      </div>
                    </div>
                    {/* Mini AI result */}
                    <div className="gradient-bg rounded-xl p-3">
                      <p className="text-[9px] font-bold text-white/60 mb-2 tracking-wide">✨ ANALISIS AI</p>
                      <div className="space-y-1">
                        {[
                          ['Kategori', 'Infrastruktur', 'text-white'],
                          ['Sentimen', 'Negatif', 'text-red-300'],
                          ['Confidence', '94%', 'text-emerald-300'],
                          ['Urgensi', 'Tinggi', 'text-amber-300'],
                        ].map(([label, value, color]) => (
                          <div key={label} className="flex justify-between text-[9px] text-white/80">
                            <span>{label}</span>
                            <strong className={color}>{value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA KERJA ===== */}
      <section id="cara-kerja" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-gradient-to-r from-navy-100/60 to-teal-100/60 text-navy-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Teknologi AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cara Kerja <span className="gradient-text">LaporIn</span>
            </h2>
            <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto">
              Dari laporan teks mentah menjadi insight yang dapat ditindaklanjuti — dalam hitungan detik.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-navy-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              >
                <span className="text-xs font-extrabold tracking-wider gradient-text">
                  0{i + 1}
                </span>
                <div className="mt-3 mb-4 text-navy-700">{step.icon}</div>
                <h3 className="text-sm font-bold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="gradient-bg rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
                Ada masalah di sekitarmu?
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-8 max-w-lg mx-auto">
                Jangan diam saja. Laporkan sekarang dan biarkan AI membantu memprioritaskan laporanmu.
              </p>
              <Link
                to="/lapor"
                className="inline-flex items-center gap-2 bg-white text-navy-800 px-7 py-3.5 rounded-full font-bold text-sm hover:bg-slate-100 transition-all duration-200 shadow-lg"
              >
                Buat Laporan <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
