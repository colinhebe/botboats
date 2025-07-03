import { LoggerWithoutDebug, Wllama } from "@wllama/wllama";
import type { SamplingConfig } from "@wllama/wllama";
import wllamaSingle from "@wllama/wllama/esm/single-thread/wllama.wasm?url";
import wllamaMulti from "@wllama/wllama/esm/multi-thread/wllama.wasm?url";
import type { ChatMessage } from "../types/chat";

let wllama: Wllama | null = null;

const stopTokens: number[] = [];
export const WLLAMA_CONFIG_PATHS = {
  "single-thread/wllama.wasm": wllamaSingle,
  "multi-thread/wllama.wasm": wllamaMulti,
};

const PROMPT_TEMPLATE =
  "<|system|>{system_message}</s><|user|>{prompt}</s><|assistant|>";

export async function loadLocalModel() {
  if (wllama) return;
  wllama = new Wllama(WLLAMA_CONFIG_PATHS, { logger: LoggerWithoutDebug });

  const base = window.location.origin;
  await wllama.loadModelFromUrl(
    // [`${base}/models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf`],
    [
      "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
    ],
    {
      n_ctx: 1024, // Ideally 2048, but 1024 works for lower-end devices
      n_threads: 1, // navigator.hardwareConcurrency || 2
    }
  );
  stopTokens.push(await wllama.lookupToken("\n")); // Add newline as a stop token
}

export const defaultSamplingConfig: SamplingConfig = {
  //   Sampling strategy
  mirostat: 0, // Disable mirostat sampling
  temp: 0.7, // Balanced creativity and coherence
  top_p: 0.9, // Nucleus sampling
  top_k: 40, // Limit to top-k tokens
  typical_p: 0.95, // Typical decoding (optional, works well with top_p)
  // Repetition penalty
  penalty_last_n: 64, // Check last 64 tokens for repetition
  penalty_repeat: 1.2, // Penalize repeated tokens
  // Optional frequency & presence penalties (if supported by backend)
  penalty_freq: 0.0,
  penalty_present: 0.0,
  // Safety fallback (can help prevent verbose endings)
  min_p: 0.05, // Avoid very low-probability tokens
  // Logit bias and grammar are left undefined (not needed for general chat)
  logit_bias: [],
};

export async function generateLocalReply(
  history: ChatMessage[],
  onStreamingText?: (text: string) => void
): Promise<ChatMessage> {
  if (!wllama) throw new Error("Wllama model not loaded");
  //   const prompt = history.slice(1); // Skip the first message (system prompt)
  //   const stream = await wllama.createChatCompletion(prompt, {
  //     nPredict: 200,
  //     sampling: defaultSamplingConfig,
  //     stopTokens: stopTokens,
  //     stream: false,
  //   });
  const stream = await wllama.createCompletion(
    updateFormatForModel(history, PROMPT_TEMPLATE),
    {
      nPredict: 128,
      sampling: defaultSamplingConfig,
      //   stopTokens: stopTokens,
      stream: true,
    }
  );
  let fullText = "";

  for await (const chunk of stream) {
    let text = chunk.currentText;
    // Remove leading/trailing whitespace and newlines
    text = text.replace(/^[\s\n]+/, "").replace(/[\s\n]+$/, "");
    fullText = text;
    onStreamingText?.(text);
  }

  //   console.debug("LLAMA reply:", fullText);
  return {
    id: Date.now().toString() + "-bot",
    role: "assistant",
    content: fullText,
    createdAt: Date.now(),
  };
}

// Convert ChatMessage[] to the prompt format required by Llama models
// @param history Chat history
// @param template Template string, containing {system_message} and {prompt}
export function updateFormatForModel(
  history: ChatMessage[],
  template: string
): string {
  let system = "You are a helpful assistant.";
  const messages = [...history];
  // If the first message is system, use it; otherwise, use the default
  if (messages.length && messages[0].role === "system") {
    system = messages[0].content;
    messages.shift();
  }
  let prompt = "";
  for (const msg of messages) {
    if (msg.role === "user") {
      prompt += `<|user|>\n${msg.content}</s>\n`;
    } else if (msg.role === "assistant") {
      prompt += `<|assistant|>\n${msg.content}</s>\n`;
    }
  }
  // Combine system and prompt
  return template
    .replace("{system_message}", system)
    .replace("{prompt}", prompt.trim());
}
