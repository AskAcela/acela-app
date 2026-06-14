"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AssistantMarkdown({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
