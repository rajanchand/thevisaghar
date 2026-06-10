export default function ContactLoading() {
  return (
    <div className="py-20 lg:py-28">
      <div className="section-container animate-pulse">
        <div className="text-center mb-14">
          <div className="h-6 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4" />
          <div className="h-5 w-80 bg-gray-100 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="rounded-2xl border border-gray-100 p-8">
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-11 bg-gray-100 rounded-xl w-full" />
                </div>
              ))}
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-32 bg-gray-100 rounded-xl w-full" />
              <div className="h-12 bg-gray-200 rounded-xl mt-2" />
            </div>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-40 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
