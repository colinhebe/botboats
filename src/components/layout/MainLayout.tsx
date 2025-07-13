// MainLayout.tsx
import React, { useEffect, useState } from "react";
import BotSidebar from "../bots/BotSidebar";
import ChatWindow from "../chats/ChatWindow";

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);


  // Keyboard handling for mobile devices
  useEffect(() => {
    const input = document.querySelector("input");
    if (!input) return;

    input.addEventListener("blur", () => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    });

    const onFocus = () => {
      setTimeout(() => {
        input.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100);
    };

    input.addEventListener("focus", onFocus);
    return () => input.removeEventListener("focus", onFocus);
  }, []);

  return (
    <div
      style={{ height: "calc(var(--vh) * 100)" }}
      className="flex h-full w-screen  bg-gray-50"
    >
      <div className="md:block hidden w-64 border-r border-gray-200">
        <BotSidebar />
      </div>
      <div
        className="md:hidden block fixed top-0 left-0 z-20 w-56 h-full bg-white shadow-lg transition-transform duration-200"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <BotSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 md:hidden backdrop-blur bg-white/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
          <button className="mr-2" onClick={() => setSidebarOpen(true)}>
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="font-bold text-lg">Chat</div>
        </div>
        <ChatWindow />
      </div>
    </div>
  );
};
