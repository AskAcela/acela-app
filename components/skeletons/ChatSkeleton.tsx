function UserMessageSkeleton({ width }: { width: string }) {
  return (
    <div className="flex justify-end">
      <div className={`h-10 ${width} rounded-x10 bg-white/5 animate-pulse`} />
    </div>
  );
}

function AssistantMessageSkeleton({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 animate-pulse">
      <div className="flex flex-col gap-2.5">
        {lines.map((w, i) => (
          <div key={i} className={`h-3 rounded bg-white/5 ${w}`} />
        ))}
      </div>
    </div>
  );
}

export default function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      {/* Message list */}
      <div className="flex-1 overflow-hidden px-4 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <UserMessageSkeleton width="w-56" />
          <AssistantMessageSkeleton lines={["w-full", "w-5/6", "w-4/6", "w-3/4"]} />
          <UserMessageSkeleton width="w-36" />
          <AssistantMessageSkeleton lines={["w-full", "w-11/12", "w-2/3"]} />
        </div>
      </div>

      {/* Input skeleton */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="mx-auto w-full max-w-3xl rounded-x10 bg-card border border-white/5 px-4 pt-4 pb-3 animate-pulse">
          <div className="h-5 w-1/3 rounded bg-white/5 mb-6" />
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl bg-white/5" />
            <div className="h-8 w-8 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
