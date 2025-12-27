export default function ChampignonsLoading() {
  return (
    <div className="grid gap-6">
      <div className="h-8 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="h-20 w-full animate-pulse rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-32 animate-pulse rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}

