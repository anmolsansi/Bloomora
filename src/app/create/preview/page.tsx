"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { FullPreview } from "@/components/builder/FullPreview";

export default function PreviewPage() {
  const router = useRouter();
  const { state } = useBouquet();

  useEffect(() => {
    if (!state.message.recipientName.trim()) {
      router.replace("/create/message");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Preview Your Bouquet
          </h1>
          <p className="text-soft-gray">
            Review your creation before sending
          </p>
        </div>

        <FullPreview />

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/create/message")}
          >
            Back
          </Button>
          <Button onClick={() => router.push("/create/delivery")}>
            Continue to Send
          </Button>
        </div>
      </div>
    </div>
  );
}
