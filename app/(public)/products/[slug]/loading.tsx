export default function ProductDetailLoading() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-pulse">
      <div className="h-4 w-64 bg-gray-100 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-lg bg-gray-100" />
            ))}
          </div>
          <div className="flex-1 aspect-square rounded-lg bg-gray-100" />
        </div>

        <div>
          <div className="h-8 w-3/4 bg-gray-100 rounded mb-4" />
          <div className="h-8 w-32 bg-gray-100 rounded mb-3" />
          <div className="h-4 w-full bg-gray-100 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-100 rounded mb-6" />
          <div className="h-12 w-40 bg-gray-100 rounded mb-6" />
          <div className="h-12 w-full bg-gray-100 rounded mb-3" />
          <div className="h-12 w-full bg-gray-100 rounded" />
        </div>
      </div>
    </main>
  );
}
