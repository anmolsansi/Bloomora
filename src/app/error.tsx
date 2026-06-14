"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-deep-rose/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🌺</span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-dark-green mb-4">
          Something Went Wrong
        </h1>
        <p className="text-soft-gray mb-8">
          We couldn&apos;t load this page. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
