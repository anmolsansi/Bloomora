import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-blush-pink/20 bg-cream py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-dark-green">
              Bloomora
            </span>
            <span className="text-sm text-soft-gray">
              Digital bouquets, made personal.
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-soft-gray hover:text-dark-green transition-colors"
            >
              About
            </Link>
            <Link
              href="/examples"
              className="text-sm text-soft-gray hover:text-dark-green transition-colors"
            >
              Examples
            </Link>
            <Link
              href="/create"
              className="text-sm text-soft-gray hover:text-dark-green transition-colors"
            >
              Create
            </Link>
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-soft-gray">
          &copy; {new Date().getFullYear()} Bloomora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
