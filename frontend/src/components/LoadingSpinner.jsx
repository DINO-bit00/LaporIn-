export default function LoadingSpinner({ message = 'Memuat...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-[3px] border-slate-200`} />
        <div className={`${sizeClasses[size]} rounded-full border-[3px] border-transparent border-t-teal-500 animate-spin absolute inset-0`} />
      </div>
      {message && (
        <p className="text-sm text-slate-500 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
}
