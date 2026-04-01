import React from "react";
import { MIESIACE, formatPLN, getDaysInMonth } from "@/lib/expenseUtils";

export default function MonthSummary({ expenses, year, month }) {
  const now = new Date();
  const dayOfMonth = year === now.getFullYear() && month === now.getMonth()
    ? now.getDate()
    : getDaysInMonth(year, month);
  const totalDays = getDaysInMonth(year, month);
  const total = expenses.reduce((s, e) => s + e.kwota, 0);
  const count = expenses.length;

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
      <p className="text-white/80 text-sm font-semibold">Wydano w tym miesiącu</p>
      <p className="text-5xl font-black text-white mt-1">{formatPLN(total)}</p>
      <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
        <span className="flex items-center gap-1">📅 Dzień {dayOfMonth}/{totalDays}</span>
        <span className="flex items-center gap-1">💰 {count} transakcji</span>
      </div>
    </div>
  );
}
