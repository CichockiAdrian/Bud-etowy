import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDaysInMonth } from "@/lib/expenseUtils";

export default function TrendChart({ expenses, year, month }) {
  const days = getDaysInMonth(year, month);
  const dailySums = {};
  expenses.forEach((e) => {
    const day = new Date(e.data).getDate();
    dailySums[day] = (dailySums[day] || 0) + e.kwota;
  });

  let cumulative = 0;
  const data = [];
  for (let d = 1; d <= days; d++) {
    cumulative += dailySums[d] || 0;
    data.push({ day: d, total: Math.round(cumulative * 100) / 100 });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      return (
        <div className="bg-white rounded-xl shadow-lg px-3 py-2 border border-border">
          <p className="text-sm font-bold">Dzień {payload[0].payload.day}</p>
          <p className="text-sm text-primary font-semibold">
            Łącznie: {payload[0].value.toFixed(2).replace(".", ",")} zł
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl p-5 mx-5 shadow-sm border border-border/50">
      <h3 className="font-bold text-lg mb-4">Trend wydatków</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#999" }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#999" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}zł`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(30, 90%, 52%)"
            strokeWidth={3}
            dot={{ r: 3, fill: "hsl(30, 90%, 52%)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Skumulowane wydatki w ciągu miesiąca
      </p>
    </div>
  );
}
