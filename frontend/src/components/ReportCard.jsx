import { MapPin } from 'lucide-react';
import CategoryChip from './CategoryChip';

const URGENCY_CONFIG = {
  2: { label: '⚡ Urgen', cls: 'bg-red-50 text-red-600 border border-red-200' },
  1: { label: '🔄 Sedang', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  0: { label: '✅ Rendah', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function ReportCard({ report, onClick }) {
  const urgency = URGENCY_CONFIG[report.skor_urgensi] || URGENCY_CONFIG[0];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm cursor-pointer
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-navy-200/50
        animate-fade-in-up"
    >
      {/* Head */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex flex-col gap-1.5">
          <CategoryChip kategori={report.kategori} />
          <span className="text-xs text-slate-400 font-medium">
            ⏱ {timeAgo(report.tanggal)}
          </span>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${urgency.cls}`}>
          {urgency.label}
        </span>
      </div>

      {/* Text */}
      <p className="text-sm text-slate-700 leading-relaxed mb-3 line-clamp-2">
        &ldquo;{report.teks_asli}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center">
        {report.lokasi && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin size={12} />
            {report.lokasi}
          </span>
        )}
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            report.sentimen === 'Positif'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-800'
          }`}
        >
          {report.sentimen === 'Positif' ? '😊 Positif' : '😠 Negatif'}
        </span>
      </div>

      {/* Confidence */}
      {report.confidence != null && report.confidence > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">AI Confidence</span>
            <span className="font-bold text-navy-700">
              {(report.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-700"
              style={{ width: `${(report.confidence * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
