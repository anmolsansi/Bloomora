"use client";

import { useBouquet } from "@/lib/store";
import { BouquetCanvas } from "@/components/builder/BouquetCanvas";
import { MessageCardPreview } from "@/components/builder/MessageCardPreview";

export function FullPreview() {
  const { state } = useBouquet();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <BouquetCanvas />
      </div>
      <div>
        <MessageCardPreview />

        <div className="mt-6 p-4 bg-white rounded-xl border border-blush-pink/20">
          <h4 className="font-medium text-dark-green mb-2">Details</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-soft-gray">To:</dt>
              <dd className="text-dark-green">
                {state.message.recipientName || "Not specified"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-soft-gray">From:</dt>
              <dd className="text-dark-green">
                {state.message.senderName || "Not specified"}
              </dd>
            </div>
            {state.message.occasion && (
              <div className="flex justify-between">
                <dt className="text-soft-gray">Occasion:</dt>
                <dd className="text-dark-green">{state.message.occasion}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
