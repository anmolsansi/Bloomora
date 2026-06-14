"use client";

import { BouquetProvider } from "@/lib/store";
import { BuilderLayout } from "@/components/layout/BuilderLayout";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BouquetProvider>
      <BuilderLayout>{children}</BuilderLayout>
    </BouquetProvider>
  );
}
