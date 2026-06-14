import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bloomora - Digital Bouquets, Made Personal",
    template: "%s | Bloomora",
  },
  description:
    "Create and send personalized digital bouquets with heartfelt messages through email or private shareable links.",
  keywords: [
    "digital bouquet",
    "online flowers",
    "send flowers",
    "digital gift",
    "flower bouquet",
    "personalized gift",
    "email flowers",
  ],
  authors: [{ name: "Bloomora" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Bloomora",
    title: "Bloomora - Digital Bouquets, Made Personal",
    description:
      "Create and send personalized digital bouquets with heartfelt messages through email or private shareable links.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloomora - Digital Bouquets, Made Personal",
    description:
      "Create and send personalized digital bouquets with heartfelt messages through email or private shareable links.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-dark-green font-sans">
        {children}
      </body>
    </html>
  );
}
