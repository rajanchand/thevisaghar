export default function BookLoading() {
  return (
    <div className="py-20 lg:py-28">
      <div className="section-container max-w-2xl mx-auto animate-pulse">
        <div className="text-center mb-10">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-10 w-72 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-80 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="rounded-2xl border border-gray-100 p-8">
          <div className="flex gap-2 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-2 flex-1 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-11 bg-gray-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl mt-8" />
        </div>
      </div>
    </div>
  );
}
