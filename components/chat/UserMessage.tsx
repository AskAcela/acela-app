import { memo } from "react";

interface UserMessageProps {
  text: string;
}

export default memo(function UserMessage({ text }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] md:max-w-[70%] rounded-x10 bg-card px-5 py-3 text-text-1 text-base">
        {text}
      </div>
    </div>
  );
});
