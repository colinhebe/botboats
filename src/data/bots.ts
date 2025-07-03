// src/data/bots.ts
import type { BotMeta } from "../types/bot";

export const defaultBots: BotMeta[] = [
  {
    id: "mock",
    name: "Mock Bot",
    description: "A mock assistant.",
    systemPrompt: "You are a mock assistant that provides simple replies.",
    model: "none",
    source: "Mock",
    avatarUrl: "/avatars/default.png",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "A helpful and friendly assistant.",
    systemPrompt: "You are a helpful assistant.",
    model: "gpt-3.5-turbo",
    source: "OpenAI",
    avatarUrl: "/avatars/default.png",
  },
  {
    id: "writer",
    name: "Creative Writer",
    description: "Helps you write engaging content with style.",
    systemPrompt:
      "You are a creative writing assistant who specializes in stories and expressive language.",
    model: "gpt-4",
    source: "Custom",
    avatarUrl: "/avatars/writer.png",
  },
  {
    id: "devbuddy",
    name: "Dev Buddy",
    description: "Helps you solve coding problems and debug issues.",
    systemPrompt:
      "You are a concise, efficient developer assistant who provides helpful code snippets and explanations.",
    model: "gpt-3.5-turbo",
    source: "OpenAI",
    avatarUrl: "/avatars/dev.png",
  },
];
