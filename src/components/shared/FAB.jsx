import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

export default function FAB() {
  const location = useLocation();
  if (location.pathname === "/nowy-wydatek") return null;

  return (
    <Link
      to="/nowy-wydatek"
      className="select-none fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
      style={{ maxWidth: "calc(min(32rem, 100%) - 1rem)", right: "max(1rem, calc((100% - 32rem) / 2 + 1rem))" }}
    >
      <Plus className="w-7 h-7" strokeWidth={3} />
    </Link>
  );
}
