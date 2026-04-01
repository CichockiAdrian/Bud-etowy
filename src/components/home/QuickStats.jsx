import React from "react";
import { formatPLNShort, getDaysInMonth } from "@/lib/expenseUtils";

export default function QuickStats({ expenses, year, month }) {
  const total = expenses.reduce((s, e) => s + e.kwota, 0);
  const now = new Date();
  const dayOfMonth = year === now.getFullYear() && month === now.getMonth()
    ? now.getDate()
    : getDaysInMonth(year, month);
  const avgDaily = dayOfMonth > 0 ? Math.round(total / dayOfMonth) : 0;
  const maxExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.kwota)) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 px-5 -mt-2">
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-2">
          <span className="text-lg">📈</span>
        </div>
        <p className="text-sm text-muted-foreground">Średnio dziennie</p>
        <p className="text-2xl font-extrabold text-primary">{formatPLNShort(avgDaily)}</p>
      </div>
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-2">
          <span className="text-lg">📊</span>
        </div>
        <p className="text-sm text-muted-foreground">Największy wydatek</p>
        <p className="text-2xl font-extrabold text-foreground">{formatPLNShort(maxExpense)}</p>
      </div>
    </div>
  );
}
