import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { KATEGORIE, groupByCategory } from "@/lib/expenseUtils";

export default function CategoryDonut({ expenses }) {
  const byCategory = groupByCategory(expenses);
  const data = Object.entries(byCategory)
    .map(([key, value]) => ({
      name: KATEGORIE[key]?.label || key,
      value: Math.round(value * 100) / 100,
      color: KATEGORIE[key]?.color || "#999",
      emoji: KATEGORIE[key]?.emoji || "📦",
    }))
    .sort((a, b) => b.value - a.value);

  const categoryCount = data.length;

  return (
    <div className="bg-card rounded-2xl p-5 mx-5 shadow-sm border border-border/50">
      <h3 className="font-bold text-lg mb-4">Rozkład kategorii</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Brak danych</p>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black">{categoryCount}</span>
            <span className="text-xs text-muted-foreground">kategorii</span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span>{d.emoji} {d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
