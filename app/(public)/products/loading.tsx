export default function ProductsLoading() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
      <div className="h-9 w-56 bg-gray-100 rounded mb-3" />
      <div className="h-4 w-96 max-w-full bg-gray-100 rounded mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-50 rounded-lg" />
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="h-14 bg-gray-50 rounded-lg mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
