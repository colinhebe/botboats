import React from "react";
import BotSidebar from "../bots/BotSidebar";
import ChatWindow from "../chats/ChatWindow";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen lg:w-screen bg-gray-50">
      <div className="w-64 border-r border-gray-200">
        <BotSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
};
