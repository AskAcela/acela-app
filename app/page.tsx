import HomePage from "@/components/HomePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-base flex items-center justify-center text-text-2">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
