import ChatShell from "@/components/ChatShell";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-dvh w-screen bg-base flex items-center justify-center text-text-2">Loading...</div>}>
      <ChatShell />
    </Suspense>
  );
}
