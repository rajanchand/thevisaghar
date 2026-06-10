export default function BlogLoading() {
  return (
    <div className="py-20 lg:py-28">
      <div className="section-container">
        <div className="text-center mb-14 animate-pulse">
          <div className="h-6 w-28 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-10 w-80 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-72 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="h-48 bg-gray-200 w-full" />
              <div className="p-5">
                <div className="h-4 w-20 bg-gray-200 rounded-full mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-2 w-full" />
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
