import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, AlertTriangle, TrendingUp, Zap, Search, Download, ChevronLeft, ChevronRight, Trash2, Edit3, X, ArrowUpDown, MessageSquare, Inbox, Loader, CheckCircle2, XCircle } from 'lucide-react';
import { getLaporan, getStats, getTrend, getKeywords, updateLaporan, deleteLaporan } from '../services/api';
import { getToken } from '../services/auth';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_OPTIONS = ['Baru', 'Diproses', 'Selesai', 'Ditolak'];
const STATUS_COLORS = {
  'Baru':      'bg-blue-50 text-blue-700 border-blue-200',
  'Diproses':  'bg-amber-50 text-amber-700 border-amber-200',
  'Selesai':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Ditolak':   'bg-red-50 text-red-700 border-red-200',
};
const URGENSI_LABELS = { 2: '🔴 Tinggi', 1: '🟡 Sedang', 0: '🟢 Rendah' };
const CATEGORIES = ['all', 'Infrastruktur', 'Lingkungan', 'Kesehatan', 'Pendidikan', 'Keamanan', 'Administrasi'];

export default function AdminPage() {
  // Data state
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [trend, setTrend] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Filter state
  const [filters, setFilters] = useState({ kategori: 'all', sentimen: 'all', status: 'all', urgensi: 'all', search: '' });
  const [sortBy, setSortBy] = useState('tanggal');
  const [order, setOrder] = useState('desc');

  // UI state
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editCatatan, setEditCatatan] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch stats + trend + keywords (once)
  useEffect(() => {
    (async () => {
      try {
        const [s, t, k] = await Promise.all([getStats(), getTrend(), getKeywords()]);
        setStats(s);
        setTrend(t);
        setKeywords(k);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch reports (on filter/sort/page change)
  const fetchReports = useCallback(async () => {
    setTableLoading(true);
    try {
      const data = await getLaporan({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        order,
      });
      setReports(data.data || []);
      if (data.pagination) setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, sortBy, order]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // Handlers
  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('desc'); }
  };

  const openDetail = (report) => {
    setSelectedReport(report);
    setEditStatus(report.status || 'Baru');
    setEditCatatan(report.catatan_admin || '');
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;
    setSaving(true);
    try {
      await updateLaporan(selectedReport.id, { status: editStatus, catatan_admin: editCatatan }, getToken());
      setSelectedReport(null);
      fetchReports();
      // Refresh stats
      const s = await getStats();
      setStats(s);
    } catch (err) {
      alert('Gagal update: ' + (err.response?.data?.error || err.message));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus laporan ini?')) return;
    try {
      await deleteLaporan(id, getToken());
      setSelectedReport(null);
      fetchReports();
      const s = await getStats();
      setStats(s);
    } catch (err) {
      alert('Gagal hapus: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    window.open(`${baseUrl}/laporan/export`, '_blank');
  };

  const maxTrend = Math.max(...trend.map(t => t.count), 1);
  const totalUrgen = stats?.urgensi_breakdown?.[2] || 0;
  const rawSentimen = stats?.sentimen_breakdown || {};
  const totalNegatif = (rawSentimen['Negatif'] || 0) + (rawSentimen['negatif'] || 0);
  const pctNegatif = stats?.total_laporan ? ((totalNegatif / stats.total_laporan) * 100).toFixed(0) : 0;
  const statusData = stats?.status_breakdown || {};

  if (loading) return <div className="pt-24"><LoadingSpinner message="Memuat admin panel..." /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <span className="inline-block bg-gradient-to-r from-navy-100/60 to-teal-100/60 text-navy-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Admin Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kelola <span className="gradient-text">Laporan</span>
          </h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <StatCard icon={<ClipboardList size={20} className="text-navy-700" />} value={stats?.total_laporan?.toLocaleString('id-ID') || '0'} label="Total Laporan" trend="↑ terbaru" highlight onClick={() => { setFilters(f => ({ ...f, urgensi: 'all' })); setPagination(p => ({ ...p, page: 1 })); }} />
          <StatCard icon={<AlertTriangle size={20} className="text-red-500" />} value={totalUrgen} label="Urgen" trend="⚡ Tingkat Urgensi Tinggi" trendColor="text-red-500" onClick={() => { setFilters(f => ({ ...f, urgensi: f.urgensi === '2' ? 'all' : '2' })); setPagination(p => ({ ...p, page: 1 })); }} active={filters.urgensi === '2'} />
          <StatCard icon={<TrendingUp size={20} className="text-amber-600" />} value={`${pctNegatif}%`} label="Negatif" trend={`${totalNegatif} dari ${stats?.total_laporan || 0}`} trendColor="text-amber-600" />
          <StatCard icon={<Zap size={20} className="text-teal-600" />} value="AI" label="LSTM" trend="Aktif" trendColor="text-teal-600" />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Status Penanganan</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Baru', key: 'Baru', icon: <Inbox size={16} />, color: 'bg-blue-50 text-blue-600 border-blue-100', iconBg: 'bg-blue-100' },
              { label: 'Diproses', key: 'Diproses', icon: <Loader size={16} />, color: 'bg-amber-50 text-amber-600 border-amber-100', iconBg: 'bg-amber-100' },
              { label: 'Selesai', key: 'Selesai', icon: <CheckCircle2 size={16} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', iconBg: 'bg-emerald-100' },
              { label: 'Ditolak', key: 'Ditolak', icon: <XCircle size={16} />, color: 'bg-red-50 text-red-600 border-red-100', iconBg: 'bg-red-100' },
            ].map(({ label, key, icon, color, iconBg }) => (
              <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border transition-transform hover:-translate-y-0.5 ${color}`}>
                <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
                <div>
                  <p className="text-lg font-black leading-tight">{statusData[key] || 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend + Keywords Row */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in-up">
            <h3 className="text-sm font-bold text-slate-900 mb-4">📈 Trend 7 Hari Terakhir</h3>
            <div className="flex items-end gap-2 h-32">
              {trend.map((t) => (
                <div key={t.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-700">{t.count}</span>
                  <div className="w-full rounded-t-lg gradient-bg transition-all duration-500"
                    style={{ height: `${Math.max((t.count / maxTrend) * 100, 4)}%`, minHeight: '4px' }} />
                  <span className="text-[9px] text-slate-400 font-medium">{t.label}</span>
                </div>
              ))}
              {trend.length === 0 && <p className="text-xs text-slate-400 w-full text-center">Belum ada data</p>}
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in-up">
            <h3 className="text-sm font-bold text-slate-900 mb-3">🔑 Kata Kunci Populer</h3>
            <div className="flex flex-wrap gap-1.5">
              {keywords.slice(0, 12).map((kw, i) => (
                <span key={kw.word} className={`text-[11px] font-medium px-2 py-0.5 rounded-full border
                  ${i < 3 ? 'bg-navy-50 text-navy-700 border-navy-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {kw.word} <span className="opacity-60">({kw.count})</span>
                </span>
              ))}
              {keywords.length === 0 && <p className="text-xs text-slate-400">Belum ada data</p>}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-fade-in-up">
          {/* Table Header — Search + Filters + Export */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={filters.search}
                onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={filters.kategori} onChange={(e) => { setFilters(f => ({ ...f, kategori: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className="text-xs border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? '📂 Semua Kategori' : c}</option>)}
              </select>
              <select value={filters.status} onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className="text-xs border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                <option value="all">📋 Semua Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filters.urgensi} onChange={(e) => { setFilters(f => ({ ...f, urgensi: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className={`text-xs border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${filters.urgensi !== 'all' ? 'border-red-300 bg-red-50 text-red-700 font-bold' : 'border-slate-200'}`}>
                <option value="all">🎯 Semua Urgensi</option>
                <option value="2">🔴 Tinggi</option>
                <option value="1">🟡 Sedang</option>
                <option value="0">🟢 Rendah</option>
              </select>
              <button onClick={handleExport} className="flex items-center gap-1 text-xs font-bold text-navy-700 bg-navy-50 hover:bg-navy-100 px-3 py-2 rounded-lg transition-colors">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'teks_asli', label: 'Laporan' },
                    { key: 'kategori', label: 'Kategori' },
                    { key: 'sentimen', label: 'Sentimen' },
                    { key: 'skor_urgensi', label: 'Urgensi' },
                    { key: 'status', label: 'Status' },
                    { key: 'tanggal', label: 'Tanggal' },
                  ].map(col => (
                    <th key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 cursor-pointer hover:text-navy-700 transition-colors select-none">
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && <ArrowUpDown size={10} className="text-teal-500" />}
                      </span>
                    </th>
                  ))}
                  <th className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr><td colSpan={8} className="text-center py-8"><LoadingSpinner message="Memuat..." /></td></tr>
                ) : reports.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-sm text-slate-400">📭 Tidak ada laporan ditemukan</td></tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openDetail(r)}>
                      <td className="px-3 py-2.5 text-xs font-mono text-slate-400">#{r.id}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-700 max-w-[200px] truncate">{r.teks_asli}</td>
                      <td className="px-3 py-2.5"><span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{r.kategori || '-'}</span></td>
                      <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.sentimen === 'Positif' || r.sentimen === 'positif' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.sentimen || '-'}</span></td>
                      <td className="px-3 py-2.5 text-[11px]">{URGENSI_LABELS[r.skor_urgensi] || '⚪'}</td>
                      <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status] || STATUS_COLORS['Baru']}`}>{r.status || 'Baru'}</span></td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-400">{new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openDetail(r)} className="text-slate-400 hover:text-navy-700 transition-colors mr-1"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(r.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Menampilkan {reports.length} dari {pagination.total} laporan
            </span>
            <div className="flex items-center gap-2">
              <button disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-bold text-slate-600">
                {pagination.page} / {pagination.totalPages || 1}
              </span>
              <button disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-sm font-extrabold text-slate-900">Detail Laporan #{selectedReport.id}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Teks */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teks Laporan</label>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl">{selectedReport.teks_asli}</p>
              </div>

              {/* AI Result Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Kategori</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">{selectedReport.kategori || '-'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sentimen</p>
                  <p className="text-xs font-bold mt-1">{selectedReport.sentimen === 'Positif' || selectedReport.sentimen === 'positif' ? '😊 Positif' : '😠 Negatif'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Urgensi</p>
                  <p className="text-xs font-bold mt-1">{URGENSI_LABELS[selectedReport.skor_urgensi] || '⚪'}</p>
                </div>
              </div>

              {/* Confidence */}
              {selectedReport.confidence > 0 && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">AI Confidence</span>
                    <span className="font-bold text-navy-700">{(selectedReport.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full gradient-bg rounded-full" style={{ width: `${(selectedReport.confidence * 100).toFixed(1)}%` }} />
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {selectedReport.lokasi && <div><span className="text-slate-400">📍 Lokasi:</span> <span className="font-medium">{selectedReport.lokasi}</span></div>}
                {selectedReport.nama && <div><span className="text-slate-400">👤 Pelapor:</span> <span className="font-medium">{selectedReport.nama}</span></div>}
                <div><span className="text-slate-400">📅 Tanggal:</span> <span className="font-medium">{new Date(selectedReport.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              </div>

              <hr className="border-slate-100" />

              {/* Admin Actions */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => setEditStatus(s)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all duration-200
                        ${editStatus === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-slate-300' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MessageSquare size={12} /> Catatan Admin
                </label>
                <textarea
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  rows={3}
                  placeholder="Tambahkan catatan untuk laporan ini..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={handleUpdate} disabled={saving}
                  className="flex-1 gradient-bg text-white font-bold py-2.5 rounded-xl text-sm
                    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Simpan Perubahan'}
                </button>
                <button onClick={() => handleDelete(selectedReport.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
