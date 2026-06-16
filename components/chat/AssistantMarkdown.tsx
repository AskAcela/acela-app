"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default memo(function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className={`
      prose prose-invert max-w-none text-sm leading-relaxed

      prose-p:text-text-2 prose-p:my-2 prose-p:leading-relaxed

      prose-headings:text-text-1 prose-headings:font-semibold
      prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
      prose-headings:mt-4 prose-headings:mb-1

      prose-strong:text-text-1 prose-strong:font-semibold

      prose-em:text-text-2

      prose-code:text-primary prose-code:bg-white/[0.06]
      prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
      prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none

      prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/8
      prose-pre:rounded-xl prose-pre:text-xs prose-pre:text-text-2

      prose-ol:text-text-2 prose-ol:my-2 prose-ol:pl-5
      prose-ul:text-text-2 prose-ul:my-2 prose-ul:pl-5
      prose-li:my-0.5 prose-li:leading-relaxed

      prose-blockquote:border-l-primary/40 prose-blockquote:text-text-2
      prose-blockquote:not-italic prose-blockquote:my-2

      prose-hr:border-white/10 prose-hr:my-4

      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
    `}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
