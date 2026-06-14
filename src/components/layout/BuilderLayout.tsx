"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { Button } from "@/components/ui/Button";

const steps = [
  { id: 1, label: "Flowers" },
  { id: 2, label: "Arrange" },
  { id: 3, label: "Style" },
  { id: 4, label: "Message" },
  { id: 5, label: "Preview" },
  { id: 6, label: "Send" },
];

function getStepFromPath(pathname: string): number {
  if (pathname.includes("/flowers")) return 1;
  if (pathname.includes("/arrange")) return 2;
  if (pathname.includes("/customize")) return 3;
  if (pathname.includes("/message")) return 4;
  if (pathname.includes("/preview")) return 5;
  if (pathname.includes("/delivery")) return 6;
  return 1;
}

export function BuilderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = getStepFromPath(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-blush-pink/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-dark-green">
              Bloomora
            </span>
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <ProgressSteps steps={steps} currentStep={currentStep} />
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Exit
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
