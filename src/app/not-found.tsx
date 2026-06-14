import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blush-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🌸</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-dark-green mb-4">
          Page Not Found
        </h1>
        <p className="text-soft-gray mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-sage-green text-cream rounded-full font-medium hover:bg-dark-green transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
