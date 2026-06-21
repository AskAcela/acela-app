import type { Metadata } from "next";
import ChatShell from "@/components/ChatShell";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
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
          <div className="flex h-full bg-base overflow-hidden">
            <div className="hidden md:flex h-full shrink-0 w-[92px] bg-base border-r border-white/5 animate-pulse" />
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center justify-between px-4 py-4 md:px-6">
                <div className="h-6 w-6 rounded bg-white/5 animate-pulse md:hidden" />
                <div className="h-8 w-32 rounded-b-x10 bg-white/5 animate-pulse mx-auto md:mx-0" />
                <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse md:hidden" />
              </div>
              <ChatSkeleton />
            </div>
          </div>
        }
      >
        <ChatShell />
      </Suspense>
    </>
  );
}
