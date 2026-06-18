"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { MessageForm } from "@/components/builder/MessageForm";
import { MessageCardPreview } from "@/components/builder/MessageCardPreview";
import { Button } from "@/components/ui/Button";

export default function MessagePage() {
  const router = useRouter();
  const { state } = useBouquet();

  useEffect(() => {
    if (state.selectedFlowers.length === 0) {
      router.replace("/create/flowers");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canProceed =
    state.message.recipientName.trim() &&
    state.message.message.trim();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Write Your Message
          </h1>
          <p className="text-soft-gray">
            Add a heartfelt note to your bouquet
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <MessageForm />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-sm font-medium text-dark-green mb-3">
              Card Preview
            </h3>
            <MessageCardPreview />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/create/customize")}
          >
            Back
          </Button>
          <Button onClick={() => router.push("/create/preview")} disabled={!canProceed}>
            Continue to Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
