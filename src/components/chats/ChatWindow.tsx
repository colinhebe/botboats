import { useAtom, useAtomValue } from "jotai";
import { chatMessagesAtom } from "../../atoms/chatAtoms";
import type { ChatMessage } from "../../types/chat";
import ChatInput from "./ChatInput";
import { generateReply } from "../../features/chat";
import { botMetaAtom } from "../../atoms/botAtoms";

export default function ChatWindow() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const currentBot = useAtomValue(botMetaAtom);

  const handleSend = async (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);

    try {
      const reply = await generateReply(
        currentBot!!,
        newMessages,
        (streamingText: string) => {
          setMessages((prev) => {
            let lastMsg = prev[prev.length - 1];
            if (!lastMsg || lastMsg.role !== "assistant") {
              lastMsg = {
                id: Date.now().toString() + "-bot",
                role: "assistant",
                content: "",
                createdAt: Date.now(),
              };
              prev.push(lastMsg);
            }

            lastMsg.content = streamingText; // Append new text to last message
            return [...prev];
          });
        }
      );
      const lastMsg = newMessages[newMessages.length - 1];
      if (lastMsg.role !== "assistant") {
        setMessages((prev) => [...prev, reply]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: Date.now().toString() + "-err",
        role: "assistant",
        content: "(Error): " + (err as Error).message,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-2 rounded ${
              msg.role === "user"
                ? "self-end bg-blue-100"
                : "self-start bg-gray-200"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
