import { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle, CheckCircle, Zap, TrendingUp, Clock, Inbox, Loader, CheckCircle2, XCircle } from 'lucide-react';
import { getStats, getLaporan } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryChip from '../components/CategoryChip';

const BAR_COLORS = {
  'Infrastruktur': 'from-blue-600 to-blue-400',
  'Lingkungan':    'from-emerald-600 to-emerald-400',
  'Kesehatan':     'from-red-500 to-red-400',
  'Pendidikan':    'from-violet-600 to-violet-400',
  'Keamanan':      'from-amber-500 to-amber-400',
  'Administrasi':  'from-cyan-600 to-cyan-400',
};

// Helper: capitalize first letter
const capitalize = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        getStats(),
        getLaporan({ limit: 5 }) // Ambil 5 terbaru untuk timeline
      ]);
      setStats(statsData);
      setRecentReports(reportsData.data || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat statistik.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner message="Memuat dashboard publik..." /></div>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button onClick={fetchData} className="text-sm font-semibold text-navy-700 hover:underline">Coba lagi</button>
        </div>
      </div>
    );
  }

  // Normalize stats (merge lowercase and Title Case keys due to old data in DB)
  const rawKategori = stats?.kategori_breakdown || {};
  const kategoriData = {};
  Object.entries(rawKategori).forEach(([cat, count]) => {
    const capCat = capitalize(cat);
    kategoriData[capCat] = (kategoriData[capCat] || 0) + count;
  });

  const rawSentimen = stats?.sentimen_breakdown || {};
  const totalNegatif = (rawSentimen['Negatif'] || 0) + (rawSentimen['negatif'] || 0);
  const totalPositif = (rawSentimen['Positif'] || 0) + (rawSentimen['positif'] || 0);

  const urgensiData = stats?.urgensi_breakdown || {};
  const totalUrgen = urgensiData[2] || 0;

  const maxKategori = Math.max(...Object.values(kategoriData), 1);
  const totalLaporan = stats?.total_laporan || 0;
  const pctNegatif = totalLaporan ? ((totalNegatif / totalLaporan) * 100).toFixed(0) : 0;
  const pctPositif = totalLaporan ? ((totalPositif / totalLaporan) * 100).toFixed(0) : 0;

  const statusData = stats?.status_breakdown || {};

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-block bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow-sm border border-blue-200">
            Dashboard Publik
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Transparansi Laporan <span className="gradient-text">Warga</span>
          </h1>
          <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">
            Pantau secara real-time distribusi masalah dan kinerja penanganan yang dikumpulkan langsung dari aspirasi masyarakat.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard
            icon={<ClipboardList size={20} className="text-navy-700" />}
            value={totalLaporan.toLocaleString('id-ID')}
            label="Total Aspirasi Masuk"
            trend="Transparan"
            highlight
          />
          <StatCard
            icon={<AlertTriangle size={20} className="text-red-500" />}
            value={totalUrgen.toLocaleString('id-ID')}
            label="Laporan Prioritas"
            trend="Tingkat Urgensi Tinggi"
            trendColor="text-red-500"
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-amber-600" />}
            value={`${pctNegatif}%`}
            label="Sentimen Negatif"
            trend={`${totalNegatif} Komplain`}
            trendColor="text-amber-600"
          />
          <StatCard
            icon={<Zap size={20} className="text-teal-600" />}
            value="Aktif"
            label="Analisis AI"
            trend="LSTM"
            trendColor="text-teal-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart — Kategori */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-extrabold text-slate-900">Distribusi Kategori Masalah</h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Total {totalLaporan}</span>
            </div>
            <div className="space-y-4">
              {Object.entries(kategoriData)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat} className="group">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 group-hover:text-navy-700 transition-colors">{cat}</span>
                      <span className="font-bold text-slate-900">{count} laporan</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[cat] || 'from-slate-400 to-slate-300'} transition-all duration-1000 ease-out`}
                        style={{ width: `${(count / maxKategori) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              {Object.keys(kategoriData).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada data kategori</p>
              )}
            </div>
          </div>

          {/* Sentiment Donut & Urgency */}
          <div className="space-y-6">
            {/* Sentimen */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm font-extrabold text-slate-900 mb-6">Analisis Sentimen Masyarakat</h3>
              
              <div className="flex items-center justify-center gap-8">
                {/* CSS Donut Chart */}
                <div className="relative w-32 h-32 rounded-full shadow-inner flex items-center justify-center"
                     style={{
                       background: `conic-gradient(#ef4444 ${pctNegatif}%, #10b981 ${pctNegatif}% 100%)`
                     }}>
                  <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                    <span className="text-2xl font-black text-slate-800">{pctNegatif}%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Negatif</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
                      <span className="text-xs font-bold text-red-700">Komplain</span>
                    </div>
                    <span className="text-sm font-black text-red-600">{totalNegatif}</span>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
                      <span className="text-xs font-bold text-emerald-700">Apresiasi/Netral</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600">{totalPositif}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgensi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Tingkat Urgensi Masalah</h3>
              <div className="flex gap-3">
                {[
                  { label: 'Tinggi', key: 2, color: 'bg-red-50 text-red-600 border border-red-100', emoji: '🔴' },
                  { label: 'Sedang', key: 1, color: 'bg-amber-50 text-amber-700 border border-amber-100', emoji: '🟡' },
                  { label: 'Rendah', key: 0, color: 'bg-emerald-50 text-emerald-700 border border-emerald-100', emoji: '🟢' },
                ].map(({ label, key, color, emoji }) => (
                  <div key={key} className={`flex-1 text-center p-3 rounded-xl transition-transform hover:-translate-y-1 ${color}`}>
                    <p className="text-xl font-black">{urgensiData[key] || 0}</p>
                    <p className="text-[10px] font-bold mt-1 uppercase tracking-wider">{emoji} {label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Penanganan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 animate-fade-in-up hover:shadow-md transition-shadow" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4">Status Penanganan Laporan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Baru', key: 'Baru', icon: <Inbox size={18} />, color: 'bg-blue-50 text-blue-600 border-blue-100', iconBg: 'bg-blue-100' },
              { label: 'Diproses', key: 'Diproses', icon: <Loader size={18} />, color: 'bg-amber-50 text-amber-600 border-amber-100', iconBg: 'bg-amber-100' },
              { label: 'Selesai', key: 'Selesai', icon: <CheckCircle2 size={18} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', iconBg: 'bg-emerald-100' },
              { label: 'Ditolak', key: 'Ditolak', icon: <XCircle size={18} />, color: 'bg-red-50 text-red-600 border-red-100', iconBg: 'bg-red-100' },
            ].map(({ label, key, icon, color, iconBg }) => (
              <div key={key} className={`text-center p-4 rounded-xl border transition-transform hover:-translate-y-1 ${color}`}>
                <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-2`}>{icon}</div>
                <p className="text-2xl font-black">{statusData[key] || 0}</p>
                <p className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Terbaru (Timeline) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-teal-600" /> Live Feed Laporan
            </h3>
            <a href="/feed" className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline">
              Lihat Semua Laporan →
            </a>
          </div>

          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada laporan masuk</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="hidden sm:block">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm
                      ${report.sentimen === 'Positif' || report.sentimen === 'positif' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {report.sentimen === 'Positif' || report.sentimen === 'positif' ? '😊' : '😠'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-1.5">
                      <CategoryChip kategori={capitalize(report.kategori)} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border
                        ${report.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          report.status === 'Diproses' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {report.status || 'Baru'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-auto">
                        {new Date(report.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">"{report.teks_asli}"</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
