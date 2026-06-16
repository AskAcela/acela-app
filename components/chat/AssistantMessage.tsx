"use client";

import { memo, useState } from "react";
import { Copy, Check } from "lucide-react";
import AssistantMarkdown from "./AssistantMarkdown";

interface AssistantMessageProps {
  text: string;
  streaming?: boolean;
}

export default memo(function AssistantMessage({ text, streaming = false }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-text-2">
      <AssistantMarkdown content={text} />

      {!streaming && (
        <div className="mt-4 flex items-center gap-4 text-text-faint">
          <button
            type="button"
            aria-label="Copy response"
            onClick={handleCopy}
            className="hover:text-text-2 transition-colors"
          >
            {copied
              ? <Check className="h-4 w-4 text-primary" strokeWidth={1.75} />
              : <Copy className="h-4 w-4" strokeWidth={1.75} />
            }
          </button>
        </div>
      )}
    </div>
  );
});
