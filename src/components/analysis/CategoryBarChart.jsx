import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { KATEGORIE, groupByCategory } from "@/lib/expenseUtils";

export default function CategoryBarChart({ expenses }) {
  const byCategory = groupByCategory(expenses);
  const data = Object.entries(byCategory)
    .map(([key, value]) => ({
      name: KATEGORIE[key]?.emoji || "📦",
      label: KATEGORIE[key]?.label || key,
      value: Math.round(value * 100) / 100,
      color: KATEGORIE[key]?.color || "#999",
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-white rounded-xl shadow-lg px-3 py-2 border border-border">
          <p className="text-sm font-bold">{payload[0].payload.label}</p>
          <p className="text-sm text-primary font-semibold">
            {payload[0].value.toFixed(2).replace(".", ",")} zł
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl p-5 mx-5 shadow-sm border border-border/50">
      <h3 className="font-bold text-lg mb-4">Wydatki według kategorii</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Brak danych</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 18 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#999" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
