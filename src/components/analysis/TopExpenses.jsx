import React from "react";
import { KATEGORIE, groupByCategory, formatPLNShort } from "@/lib/expenseUtils";

const rankColors = ["bg-red-100 text-red-600", "bg-orange-100 text-orange-600", "bg-cyan-100 text-cyan-600"];

export default function TopExpenses({ expenses }) {
  const byCategory = groupByCategory(expenses);
  const sorted = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxVal = sorted[0]?.[1] || 1;

  return (
    <div className="bg-card rounded-2xl p-5 mx-5 shadow-sm border border-border/50">
      <h3 className="font-bold text-lg mb-4">Najwyższe wydatki</h3>
      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Brak danych</p>
      ) : (
        <div className="space-y-4">
          {sorted.map(([key, total], i) => {
            const cat = KATEGORIE[key] || KATEGORIE.inne;
            const pct = (total / maxVal) * 100;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${rankColors[i] || "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span className="font-semibold">{cat.label}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
                <span className="font-bold text-foreground">{formatPLNShort(Math.round(total))}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
