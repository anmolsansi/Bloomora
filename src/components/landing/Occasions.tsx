import Link from "next/link";
import { Button } from "@/components/ui/Button";

const occasions = [
  { name: "Birthday", emoji: "🎂", color: "bg-blush-pink/20" },
  { name: "Thank You", emoji: "💐", color: "bg-sage-green/20" },
  { name: "Anniversary", emoji: "💕", color: "bg-deep-rose/20" },
  { name: "Mother's Day", emoji: "👩", color: "bg-blush-pink/20" },
  { name: "Friendship", emoji: "🤝", color: "bg-sage-green/20" },
  { name: "Congratulations", emoji: "🎉", color: "bg-warm-brown/20" },
  { name: "Thinking of You", emoji: "💭", color: "bg-blush-pink/20" },
  { name: "Apology", emoji: "🙏", color: "bg-sage-green/20" },
];

export function Occasions() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-4">
            Perfect for Every Occasion
          </h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Whether it&apos;s a celebration or a simple gesture, a digital bouquet
            says it all.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {occasions.map((occasion) => (
            <div
              key={occasion.name}
              className={`${occasion.color} rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="text-3xl mb-2 block">{occasion.emoji}</span>
              <span className="text-sm font-medium text-dark-green">
                {occasion.name}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/create">
            <Button size="lg" className="text-lg px-10">
              Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
