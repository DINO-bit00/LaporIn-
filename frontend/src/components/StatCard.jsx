export default function StatCard({ icon, value, label, trend, trendColor = 'text-emerald-500', highlight = false }) {
  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        highlight
          ? 'bg-gradient-to-br from-navy-50 to-teal-50 border-navy-200/50'
          : 'bg-white border-slate-200 hover:border-navy-200'
      }`}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg bg-slate-100">
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
      {trend && (
        <p className={`text-xs font-bold mt-2 ${trendColor}`}>{trend}</p>
      )}
    </div>
  );
}
