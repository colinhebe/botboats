import React from "react";
import type { ChatMessage } from "../../types/chat";

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] text-base whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900 border border-gray-200"
        } shadow-sm`}
      >
        {message.content}
      </div>
    </div>
  );
};
