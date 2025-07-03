// src/components/bots/BotSidebar.tsx
import { useAtom, useAtomValue } from "jotai";
import { allBotsAtom, currentBotIdAtom } from "../../atoms/botAtoms";
import { chatMessagesAtom } from "../../atoms/chatAtoms";
import { generateId } from "../../lib/id";

export default function BotSidebar() {
  const botMetas = useAtomValue(allBotsAtom);
  const [selectedId, setSelectedId] = useAtom(currentBotIdAtom);
  const [, setChatMessages] = useAtom(chatMessagesAtom);

  return (
    <aside className="w-60 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-4">Bots</h2>
      <ul className="space-y-2">
        {botMetas.map((bot) => (
          <li
            key={bot.id}
            className={`cursor-pointer px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 ${
              selectedId === bot.id
                ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                : ""
            }`}
            onClick={() => {
              setSelectedId(bot.id);
              setChatMessages([
                {
                  id: generateId(),
                  role: "system",
                  content: bot.systemPrompt,
                  createdAt: Date.now(),
                },
              ]);
            }}
          >
            {bot.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
