"use client";

import { useBouquet } from "@/lib/store";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const occasions = [
  "Birthday",
  "Thank You",
  "Anniversary",
  "Mother's Day",
  "Friendship Day",
  "Congratulations",
  "Thinking of You",
  "Apology",
  "Just Because",
];

export function MessageForm() {
  const { state, dispatch } = useBouquet();

  const updateMessage = (updates: Partial<typeof state.message>) => {
    dispatch({ type: "SET_MESSAGE", message: { ...state.message, ...updates } });
  };

  return (
    <div className="space-y-4">
      <Input
        label="Recipient Name"
        placeholder="Who is this for?"
        value={state.message.recipientName}
        onChange={(e) => updateMessage({ recipientName: e.target.value })}
        maxLength={50}
      />

      <Textarea
        label="Your Message"
        placeholder="Write something heartfelt..."
        value={state.message.message}
        onChange={(e) => updateMessage({ message: e.target.value })}
        maxLength={500}
        characterCount={state.message.message.length}
        maxCharacters={500}
      />

      <Input
        label="Your Name"
        placeholder="Who is this from?"
        value={state.message.senderName}
        onChange={(e) => updateMessage({ senderName: e.target.value })}
        maxLength={50}
      />

      <div>
        <label className="block text-sm font-medium text-dark-green mb-1.5">
          Occasion (Optional)
        </label>
        <select
          value={state.message.occasion}
          onChange={(e) => updateMessage({ occasion: e.target.value })}
          className="flex h-11 w-full rounded-xl border border-blush-pink/30 bg-white px-4 py-2 text-base text-dark-green focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-colors"
        >
          <option value="">Select an occasion</option>
          {occasions.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
