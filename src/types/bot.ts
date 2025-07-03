export interface BotMeta {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  model?: string;
  source?: string;
  avatarUrl?: string;
}
