"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export interface EmailFormData {
  recipientEmail: string;
  senderEmail: string;
  deliveryNote: string;
}

interface EmailFormProps {
  onSend: (data: EmailFormData) => void;
  isSending: boolean;
}

export function EmailForm({ onSend, isSending }: EmailFormProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!recipientEmail) {
      newErrors.recipientEmail = "Recipient email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid email";
    }

    if (senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      newErrors.senderEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSend({ recipientEmail, senderEmail, deliveryNote });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Recipient Email"
        type="email"
        placeholder="who@example.com"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        error={errors.recipientEmail}
      />

      <Input
        label="Your Email (Optional)"
        type="email"
        placeholder="you@example.com"
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        error={errors.senderEmail}
      />

      <Textarea
        label="Delivery Note (Optional)"
        placeholder="Add a personal note to the email..."
        value={deliveryNote}
        onChange={(e) => setDeliveryNote(e.target.value)}
        maxLength={200}
      />

      <Button type="submit" disabled={isSending} className="w-full">
        {isSending ? "Sending..." : "Send Bouquet"}
      </Button>
    </form>
  );
}
