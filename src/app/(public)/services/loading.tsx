export default function ServicesLoading() {
  return (
    <div className="py-20 lg:py-28">
      <div className="section-container">
        <div className="text-center mb-14 animate-pulse">
          <div className="h-6 w-28 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-80 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-5" />
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
