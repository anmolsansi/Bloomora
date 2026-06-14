"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-blush-pink/10 to-cream py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-dark-green mb-6 leading-tight"
          >
            Send Flowers That
            <span className="text-deep-rose block mt-2">Live Online</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-soft-gray mb-8 max-w-xl"
          >
            Create a beautiful digital bouquet, add a heartfelt message, and
            send it instantly to someone special.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/create">
              <Button size="lg" className="text-lg px-10">
                Create Your Bouquet
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="secondary" size="lg" className="text-lg px-10">
                Explore Examples
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative flowers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute top-10 left-10 hidden lg:block"
        >
          <Image src="/flowers/rose.svg" alt="" width={80} height={80} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute top-20 right-10 hidden lg:block"
        >
          <Image src="/flowers/peony.svg" alt="" width={64} height={64} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-10 left-20 hidden lg:block"
        >
          <Image src="/flowers/tulip.svg" alt="" width={56} height={56} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-20 right-20 hidden lg:block"
        >
          <Image src="/flowers/lily.svg" alt="" width={72} height={72} />
        </motion.div>
      </div>
    </section>
  );
}
