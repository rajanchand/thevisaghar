"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center section-container">
        <div className="text-8xl font-bold text-navy/10 mb-4">500</div>
        <h1 className="text-3xl font-bold text-navy mb-4">Something Went Wrong</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
