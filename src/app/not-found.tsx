import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-center section-container">
        <div className="text-8xl font-bold text-navy/10 mb-4">404</div>
        <h1 className="text-3xl font-bold text-navy mb-4">Page Not Found</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for doesn&apos;t exist or has been moved. Let us help you find your way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-gold hover:bg-gold-dark text-navy font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
