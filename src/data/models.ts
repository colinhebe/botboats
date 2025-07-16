import { Model } from "../types/model";

export const defaultModels: Model[] = [
  {
    id: "llama-2-7b-chat",
    name: "Tinyllama 1.1B",
    modelUrl: "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
    description: "Tinyllama 1.1B Chat v1.0 - GGUF.",
    detailUrl: "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF",
    promptTemplate: "<|system|>{system_message}</s><|user|>{prompt}</s><|assistant|>",
    sizeMB: 1500,
    maxRAMMB: 2048,
  },
];
