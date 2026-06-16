"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-blush-pink/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-dark-green">
            Bloomora
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-soft-gray hover:text-dark-green transition-colors hidden sm:block">
            About
          </Link>
          <Link href="/create">
            <Button size="sm">Create Bouquet</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
