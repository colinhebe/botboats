import { atom } from "jotai";
import type { BotMeta } from "../types/bot";
import { defaultBots } from "../data/bots";

export const currentBotIdAtom = atom<string | null>(null);

export const allBotsAtom = atom<BotMeta[]>([...defaultBots]);

export const botMetaAtom = atom((get) => {
  const allBots = get(allBotsAtom);
  const currentBotId = get(currentBotIdAtom);
  return allBots.find((bot) => bot.id === currentBotId) || null;
});

export const favoriteBotIdsAtom = atom<Set<string>>(new Set<string>());
