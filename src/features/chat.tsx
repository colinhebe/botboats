import type { ChatMessage } from "../types/chat";
import { sleep } from "../utils/utils";
import type { BotMeta } from "../types/bot";
import { generateLocalReply } from "../utils/llama";

const USE_LOCAL_MODEL = import.meta.env.VITE_USE_LOCAL_MODEL === "true";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateReply(
  currentBot: BotMeta,
  messages: ChatMessage[],
  onStreamingText?: (text: string) => void
): Promise<ChatMessage> {
  if (USE_LOCAL_MODEL) {
    return generateLocalReply(messages, onStreamingText);
  }

  if (currentBot?.id === "mock") {
    const last = messages[messages.length - 1];
    await sleep(500);
    return {
      id: Date.now().toString() + "-bot",
      role: "assistant",
      content: `(Mock reply) You said: ${last.content}`,
      createdAt: Date.now(),
    };
  }

  if (currentBot?.id === "chatgpt") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: currentBot.model || "gpt-3.5-turbo",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "(No reply)";
    await sleep(500);
    return {
      id: Date.now().toString() + "-bot",
      role: "assistant",
      content,
      createdAt: Date.now(),
    };
  }

  throw new Error("Unsupported bot type");
}
