import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: "A Bouquet For You | Bloomora",
    description: "Someone special made you a digital bouquet. Open it to see your personalized flowers and message.",
    openGraph: {
      title: "A Bouquet For You | Bloomora",
      description: "Someone special made you a digital bouquet. Open it to see your personalized flowers and message.",
      type: "website",
      siteName: "Bloomora",
    },
    twitter: {
      card: "summary_large_image",
      title: "A Bouquet For You | Bloomora",
      description: "Someone special made you a digital bouquet. Open it to see your personalized flowers and message.",
    },
  };
}

export default function RecipientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
