import { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { getStats } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BAR_COLORS = {
  'Infrastruktur': 'from-blue-600 to-blue-400',
  'Lingkungan':    'from-emerald-600 to-emerald-400',
  'Kesehatan':     'from-red-500 to-red-400',
  'Pendidikan':    'from-violet-600 to-violet-400',
  'Keamanan':      'from-amber-500 to-amber-400',
  'Administrasi':  'from-cyan-600 to-cyan-400',
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat statistik.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner message="Memuat dashboard..." /></div>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button onClick={fetchStats} className="text-sm font-semibold text-navy-700 hover:underline">Coba lagi</button>
        </div>
      </div>
    );
  }

  const kategoriData = stats?.kategori_breakdown || {};
  const sentimenData = stats?.sentimen_breakdown || {};
  const urgensiData = stats?.urgensi_breakdown || {};
  const maxKategori = Math.max(...Object.values(kategoriData), 1);

  const totalNegatif = sentimenData['Negatif'] || 0;
  const totalPositif = sentimenData['Positif'] || 0;
  const pctNegatif = stats?.total_laporan ? ((totalNegatif / stats.total_laporan) * 100).toFixed(0) : 0;

  const totalUrgen = urgensiData[2] || 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <span className="inline-block bg-gradient-to-r from-navy-100/60 to-teal-100/60 text-navy-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Dashboard Admin
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kondisi Laporan <span className="gradient-text">Hari Ini</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">Data diperbarui berdasarkan laporan warga yang masuk.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <StatCard
            icon={<ClipboardList size={20} className="text-navy-700" />}
            value={stats?.total_laporan?.toLocaleString('id-ID') || '0'}
            label="Total Laporan"
            trend={`↑ terbaru`}
            highlight
          />
          <StatCard
            icon={<AlertTriangle size={20} className="text-red-500" />}
            value={totalUrgen.toLocaleString('id-ID')}
            label="Laporan Urgen"
            trend="⚡ Prioritas"
            trendColor="text-red-500"
          />
          <StatCard
            icon={<TrendingUp size={20} className="text-amber-600" />}
            value={`${pctNegatif}%`}
            label="Sentimen Negatif"
            trend={`${totalNegatif} dari ${stats?.total_laporan || 0}`}
            trendColor="text-amber-600"
          />
          <StatCard
            icon={<Zap size={20} className="text-teal-600" />}
            value="AI"
            label="Model Aktif"
            trend="IndoBERT"
            trendColor="text-teal-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart — Kategori */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-slate-900">Distribusi Kategori</h3>
              <span className="text-xs text-slate-400">Total {stats?.total_laporan || 0}</span>
            </div>
            <div className="space-y-3">
              {Object.entries(kategoriData)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">{cat}</span>
                      <span className="font-bold text-slate-800">{count}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[cat] || 'from-slate-400 to-slate-300'} transition-all duration-1000`}
                        style={{ width: `${(count / maxKategori) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              {Object.keys(kategoriData).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada data</p>
              )}
            </div>
          </div>

          {/* Sentiment + Urgency */}
          <div className="space-y-6">
            {/* Sentimen */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Distribusi Sentimen</h3>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-red-600">{totalNegatif}</p>
                  <p className="text-xs text-red-500 mt-1">😠 Negatif</p>
                </div>
                <div className="flex-1 text-center p-4 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-extrabold text-emerald-600">{totalPositif}</p>
                  <p className="text-xs text-emerald-500 mt-1">😊 Positif</p>
                </div>
              </div>
            </div>

            {/* Urgensi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Tingkat Urgensi</h3>
              <div className="flex gap-3">
                {[
                  { label: 'Tinggi', key: 2, color: 'bg-red-50 text-red-600', emoji: '🔴' },
                  { label: 'Sedang', key: 1, color: 'bg-amber-50 text-amber-700', emoji: '🟡' },
                  { label: 'Rendah', key: 0, color: 'bg-emerald-50 text-emerald-700', emoji: '🟢' },
                ].map(({ label, key, color, emoji }) => (
                  <div key={key} className={`flex-1 text-center p-3 rounded-xl ${color}`}>
                    <p className="text-lg font-extrabold">{urgensiData[key] || 0}</p>
                    <p className="text-[11px] mt-0.5">{emoji} {label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
