export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-serif text-dark-green mb-4">Bloomora</h1>
      <p className="text-xl text-soft-gray mb-8">
        Digital bouquets, made personal.
      </p>
      <button className="px-8 py-3 bg-sage-green text-cream rounded-full font-medium hover:bg-dark-green transition-colors">
        Create Your Bouquet
      </button>
    </main>
  );
}
