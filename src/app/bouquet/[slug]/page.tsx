"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RecipientBouquet } from "@/components/recipient/RecipientBouquet";
import { RecipientMessageCard } from "@/components/recipient/RecipientMessageCard";
import { Button } from "@/components/ui/Button";

interface BouquetData {
  id: string;
  slug: string;
  recipientName: string;
  senderName: string;
  message: string;
  occasion: string | null;
  selectedFlowers: { flowerId: string; count: number; color: string }[];
  arrangementData: {
    style: string;
    positions: {
      flowerId: string;
      x: number;
      y: number;
      scale: number;
      rotation: number;
      layer: number;
    }[];
    greeneryStyle: string;
    bouquetShape: string;
    fullness: number;
  };
  styleData: {
    wrapper: string;
    ribbon: string;
    background: string;
    cardStyle: string;
  };
  createdAt: string;
}

export default function RecipientPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [bouquet, setBouquet] = useState<BouquetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const canShare = useMemo(
    () => typeof navigator !== "undefined" && "share" in navigator,
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchBouquet() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/bouquets/${slug}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Bouquet not found");
        }

        const data = await response.json();

        if (!cancelled) {
          setBouquet(data);
          setTimeout(() => setRevealed(true), 300);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof DOMException && err.name === "AbortError"
              ? "Request timed out. Please try again."
              : err instanceof Error
                ? err.message
                : "Failed to load bouquet"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBouquet();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blush-pink/30 border-t-deep-rose rounded-full animate-spin mx-auto mb-4" />
          <p className="text-soft-gray font-serif text-lg">
            A bouquet is being unwrapped...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bouquet) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-blush-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-deep-rose"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-dark-green mb-2">
            Bouquet Not Found
          </h1>
          <p className="text-soft-gray mb-6">
            This bouquet may have expired or the link is invalid.
          </p>
          <Link href="/">
            <Button>Create Your Own Bouquet</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-dark-green"
          >
            Bloomora
          </Link>
        </div>

        {/* Gift reveal message */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            revealed
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-lg text-soft-gray font-serif">
            A bouquet was made for you
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mt-2">
            Dear {bouquet.recipientName}
          </h1>
        </div>

        {/* Bouquet and message */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <div
            className={`transition-all duration-700 delay-300 ${
              revealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <RecipientBouquet bouquet={bouquet} />
          </div>

          <div
            className={`transition-all duration-700 delay-500 ${
              revealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <RecipientMessageCard bouquet={bouquet} />
          </div>
        </div>

        {/* Actions */}
        <div
          className={`text-center transition-all duration-700 delay-700 ${
            revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              variant="secondary"
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            {canShare && (
              <Button
                onClick={() => {
                  navigator.share({
                    title: "A bouquet for you!",
                    text: `Dear ${bouquet.recipientName}, a bouquet was made for you!`,
                    url: window.location.href,
                  });
                }}
                variant="secondary"
              >
                Share
              </Button>
            )}
            <Link href="/create">
              <Button>Create Your Own Bouquet</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
