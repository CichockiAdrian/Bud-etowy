import React from "react";
import { KATEGORIE, formatPLN } from "@/lib/expenseUtils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function ExpenseCard({ expense }) {
  const cat = KATEGORIE[expense.kategoria] || KATEGORIE.inne;

  return (
    <div className="bg-card rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border/50">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: cat.color + "20" }}
      >
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-foreground truncate">{expense.opis || cat.label}</p>
        <p className="text-sm text-muted-foreground">{cat.label}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-extrabold text-foreground">-{formatPLN(expense.kwota)}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(expense.data), "d MMM", { locale: pl })}
        </p>
      </div>
    </div>
  );
}
