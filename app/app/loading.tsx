export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-64 mb-2"></div>
          <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-96"></div>
        </div>
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-zinc-100 dark:bg-zinc-900/50 h-32 rounded-xl border border-zinc-200 dark:border-zinc-800"></div>
        ))}
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-900/50 h-96 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-8"></div>
    </div>
  )
}
