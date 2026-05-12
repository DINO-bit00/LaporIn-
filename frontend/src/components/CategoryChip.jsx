const KATEGORI_MAP = {
  'Infrastruktur': { emoji: '🏗️', bg: 'bg-blue-50',  text: 'text-blue-800' },
  'Lingkungan':    { emoji: '🌿', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  'Kesehatan':     { emoji: '🏥', bg: 'bg-red-50',    text: 'text-red-800' },
  'Pendidikan':    { emoji: '📚', bg: 'bg-violet-50', text: 'text-violet-800' },
  'Keamanan':      { emoji: '🔒', bg: 'bg-amber-50',  text: 'text-amber-800' },
  'Administrasi':  { emoji: '📋', bg: 'bg-cyan-50',   text: 'text-cyan-800' },
};

export default function CategoryChip({ kategori, active = false, onClick, showEmoji = true }) {
  const config = KATEGORI_MAP[kategori] || { emoji: '📄', bg: 'bg-slate-50', text: 'text-slate-700' };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
          active
            ? 'gradient-bg text-white shadow-md'
            : `${config.bg} ${config.text} border border-slate-200 hover:border-navy-300 hover:shadow-sm`
        }`}
      >
        {showEmoji && `${config.emoji} `}{kategori}
      </button>
    );
  }

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${config.bg} ${config.text}`}>
      {showEmoji && `${config.emoji} `}{kategori}
    </span>
  );
}

export { KATEGORI_MAP };
