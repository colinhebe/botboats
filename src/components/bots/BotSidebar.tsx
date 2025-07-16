// src/components/bots/BotSidebar.tsx
import { useAtom, useAtomValue } from "jotai";
import { allBotsAtom, currentBotIdAtom } from "../../atoms/botAtoms";
import { chatMessagesAtom } from "../../atoms/chatAtoms";
import { generateId } from "../../lib/id";
import { Link } from "react-router-dom";

export default function BotSidebar({ onClose }: { onClose?: () => void }) {
  const botMetas = useAtomValue(allBotsAtom);
  const [selectedId, setSelectedId] = useAtom(currentBotIdAtom);
  const [, setChatMessages] = useAtom(chatMessagesAtom);

  return (
    <aside className="w-56 md:w-60 bg-white p-4 overflow-y-auto border-r border-gray-200 h-full">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-bold flex-1">Bots</h2>
        <Link
          to="/models"
          className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
        >
          Manage Models
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden block p-2 -mr-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      
      <ul className="space-y-2">
        {botMetas.map((bot) => (
          <li
            key={bot.id}
            className={`cursor-pointer px-3 py-2 rounded hover:bg-blue-50 transition ${
              selectedId === bot.id
                ? "bg-blue-100 font-semibold text-blue-600"
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
              onClose?.();
            }}
          >
            {bot.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
