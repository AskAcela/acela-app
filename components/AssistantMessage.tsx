"use client";

import { Copy, RotateCw, ThumbsUp } from "lucide-react";
import { ReactNode } from "react";

interface AssistantMessageProps {
  children: ReactNode;
}

export default function AssistantMessage({ children }: AssistantMessageProps) {
  return (
    <div className="text-text-2 text-base leading-relaxed">
      <div className="space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p]:m-0">
        {children}
      </div>

      <div className="flex items-center gap-4 mt-4 text-text-faint">
        <button type="button" aria-label="Copy" className="hover:text-text-2 transition-colors">
          <Copy className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button type="button" aria-label="Regenerate" className="hover:text-text-2 transition-colors">
          <RotateCw className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button type="button" aria-label="Like" className="hover:text-text-2 transition-colors">
          <ThumbsUp className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
