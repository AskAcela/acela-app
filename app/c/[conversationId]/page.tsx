import ChatShell from "@/components/ChatShell";
import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { Suspense } from "react";

export default async function Page({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  return (
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
      <ChatShell initialConversationId={conversationId} />
    </Suspense>
  );
}
