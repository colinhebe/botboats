import React, { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { MessageItem } from "./MessageItem";
import { chatMessagesAtom } from "../../atoms/chatAtoms";

export const MessageList: React.FC = () => {
  const messages = useAtomValue(chatMessagesAtom);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {messages.map((msg, idx) => (
        <MessageItem key={idx} message={msg} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
};
