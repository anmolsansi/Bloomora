"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBouquet } from "@/lib/store";
import { EmailForm, type EmailFormData } from "@/components/builder/EmailForm";
import { ShareLink } from "@/components/builder/ShareLink";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DeliveryPage() {
  const router = useRouter();
  const { state } = useBouquet();

  useEffect(() => {
    if (!state.message.recipientName.trim()) {
      router.replace("/create/message");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "link" | null>(
    null
  );
  const [bouquetSlug, setBouquetSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleCreateBouquet = async (emailData?: EmailFormData) => {
    setIsCreating(true);
    setEmailError(null);
    try {
      const response = await fetch("/api/bouquets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedFlowers: state.selectedFlowers,
          arrangementData: state.arrangement,
          styleData: state.style,
          recipientName: state.message.recipientName,
          senderName: state.message.senderName,
          message: state.message.message,
          occasion: state.message.occasion,
          recipientEmail: emailData?.recipientEmail,
          senderEmail: emailData?.senderEmail,
          deliveryNote: emailData?.deliveryNote,
          deliveryMethod,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create bouquet");
      }

      setBouquetSlug(data.slug);

      if (deliveryMethod === "email" && emailData?.recipientEmail) {
        const emailResponse = await fetch(
          `/api/bouquets/${data.slug}/send-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: emailData.recipientEmail,
              senderEmail: emailData.senderEmail,
              deliveryNote: emailData.deliveryNote,
            }),
          }
        );

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          setEmailError(
            emailResult.error || "Bouquet created but email failed to send"
          );
        } else {
          setEmailSent(true);
        }
      }
    } catch (error) {
      setEmailError(
        error instanceof Error ? error.message : "Failed to create bouquet"
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (bouquetSlug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-sage-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-sage-green"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-serif font-bold text-dark-green mb-4">
            Your Bouquet is Ready!
          </h1>

          {emailSent && (
            <p className="text-sage-green font-medium mb-4">
              Email sent successfully!
            </p>
          )}

          {emailError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">{emailError}</p>
              <p className="text-red-500 text-xs mt-1">
                You can still share the link below.
              </p>
            </div>
          )}

          <p className="text-soft-gray mb-8">
            Share it with someone special
          </p>

          <ShareLink slug={bouquetSlug} />

          <div className="mt-8">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-2">
            Send Your Bouquet
          </h1>
          <p className="text-soft-gray">
            Choose how you&apos;d like to deliver your bouquet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${
              deliveryMethod === "email"
                ? "ring-2 ring-sage-green"
                : "hover:border-blush-pink/40"
            }`}
            onClick={() => setDeliveryMethod("email")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-sage-green/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-sage-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-dark-green">Send by Email</h3>
              <p className="text-sm text-soft-gray text-center mt-1">
                We&apos;ll send a beautiful email with your bouquet
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              deliveryMethod === "link"
                ? "ring-2 ring-sage-green"
                : "hover:border-blush-pink/40"
            }`}
            onClick={() => setDeliveryMethod("link")}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-12 h-12 bg-sage-green/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-sage-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.06a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-dark-green">Copy Link</h3>
              <p className="text-sm text-soft-gray text-center mt-1">
                Get a private link to share anywhere
              </p>
            </CardContent>
          </Card>
        </div>

        {deliveryMethod === "email" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Send via Email</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailForm
                onSend={handleCreateBouquet}
                isSending={isCreating}
              />
            </CardContent>
          </Card>
        )}

        {deliveryMethod === "link" && (
          <div className="text-center">
            <Button
              onClick={() => handleCreateBouquet()}
              disabled={isCreating}
              size="lg"
            >
              {isCreating ? "Creating..." : "Generate Link"}
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/create/preview")}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
