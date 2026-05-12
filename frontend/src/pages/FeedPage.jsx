import { useState, useEffect } from 'react';
import { getLaporan } from '../services/api';
import ReportCard from '../components/ReportCard';
import CategoryChip from '../components/CategoryChip';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Semua', 'Infrastruktur', 'Lingkungan', 'Kesehatan', 'Pendidikan', 'Keamanan', 'Administrasi'];

export default function FeedPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    fetchReports();
  }, [activeFilter]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLaporan({
        kategori: activeFilter === 'Semua' ? 'all' : activeFilter,
      });
      setReports(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat laporan. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <span className="inline-block bg-gradient-to-r from-navy-100/60 to-teal-100/60 text-navy-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Feed Publik
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Laporan <span className="gradient-text">Terbaru</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Laporan warga yang baru masuk dan sedang dalam proses penanganan.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              kategori={cat}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
              showEmoji={cat !== 'Semua'}
            />
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Memuat laporan..." />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm mb-4">⚠️ {error}</p>
            <button
              onClick={fetchReports}
              className="text-sm font-semibold text-navy-700 hover:underline"
            >
              Coba lagi
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-sm text-slate-500">Belum ada laporan{activeFilter !== 'Semua' ? ` di kategori ${activeFilter}` : ''}.</p>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* Report count */}
        {!loading && reports.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-8">
            Menampilkan {reports.length} laporan
          </p>
        )}
      </div>
    </div>
  );
}
