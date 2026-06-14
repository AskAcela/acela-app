"use client";

import { Copy, RotateCw, ThumbsUp } from "lucide-react";
import AssistantMarkdown from "./AssistantMarkdown";

interface AssistantMessageProps {
  text: string;
  streaming?: boolean;
}

export default function AssistantMessage({ text, streaming = false }: AssistantMessageProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-text-2">
      <AssistantMarkdown content={text} />

      {!streaming && (
        <div className="mt-4 flex items-center gap-4 text-text-faint">
          <button type="button" aria-label="Copy" className="hover:text-text-2">
            <Copy className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Regenerate" className="hover:text-text-2">
            <RotateCw className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Like" className="hover:text-text-2">
            <ThumbsUp className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
