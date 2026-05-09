export default function SkeletonLoader() {
  return (
    <div className="w-full h-full p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"></div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        <div className="space-y-2">
          <div className="w-32 h-4 rounded bg-slate-300 dark:bg-slate-700"></div>
          <div className="w-24 h-3 rounded bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 rounded bg-slate-300 dark:bg-slate-700"></div>
        <div className="w-5/6 h-4 rounded bg-slate-300 dark:bg-slate-700"></div>
        <div className="w-4/6 h-4 rounded bg-slate-300 dark:bg-slate-700"></div>
      </div>
    </div>
  );
}
