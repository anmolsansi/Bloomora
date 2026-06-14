const steps = [
  {
    number: "1",
    title: "Choose Your Flowers",
    description: "Select from 25 beautiful flowers to create your perfect bouquet.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Add Your Heart",
    description: "Write a personal message and customize the bouquet style.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Send Instantly",
    description: "Share via email or a private link. It's that simple.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-green mb-4">
            How It Works
          </h2>
          <p className="text-lg text-soft-gray max-w-2xl mx-auto">
            Three simple steps to send a beautiful digital bouquet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-blush-pink/20 flex items-center justify-center text-deep-rose mb-4">
                {step.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-sage-green text-cream flex items-center justify-center text-sm font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-serif font-semibold text-dark-green mb-2">
                {step.title}
              </h3>
              <p className="text-soft-gray">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
