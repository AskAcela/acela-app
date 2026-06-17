import type { Metadata } from "next";
import ChatShell from "@/components/ChatShell";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Acela – Your AI Expert on Celo",
  alternates: { canonical: "https://askacela.xyz" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Acela",
  url: "https://askacela.xyz",
  description:
    "Acela is an AI assistant that knows everything about the Celo blockchain. Ask questions, explore ideas, and pitch your startup.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="h-dvh w-screen bg-base flex items-center justify-center text-text-2">
            Loading...
          </div>
        }
      >
        <ChatShell />
      </Suspense>
    </>
  );
}
