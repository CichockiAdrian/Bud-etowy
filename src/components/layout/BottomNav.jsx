import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "Dom", emoji: "🏠" },
  { path: "/analiza", label: "Analiza", emoji: "📊" },
  { path: "/historia", label: "Historia", emoji: "📅" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = tab.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`select-none flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className={`text-xs font-semibold ${isActive ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
