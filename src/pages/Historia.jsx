import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronRight } from "lucide-react";
import OrangeHeader from "@/components/shared/OrangeHeader";
import { MIESIACE, formatPLN, formatPLNShort, groupByMonth, getMonthKey } from "@/lib/expenseUtils";
import { useAuth } from "@/lib/AuthContext";

export default function Historia() {
  const { user } = useAuth();

  const { data: allExpenses = [], isLoading } = useQuery({
    queryKey: ["wydatki", user?.email],
    queryFn: async () => {
      const all = await base44.entities.Wydatek.filter({ user_email: user.email }, "-data", 500);
      return all.filter(e => e.user_email === user.email);
    },
    enabled: !!user?.email,
  });

  const byMonth = groupByMonth(allExpenses);
  const sortedKeys = Object.keys(byMonth).sort().reverse();

  // Monthly totals for chart
  const monthlyData = sortedKeys.slice(0, 6).reverse().map((key) => {
    const [y, m] = key.split("-").map(Number);
    const total = byMonth[key].reduce((s, e) => s + e.kwota, 0);
    return {
      key,
      label: MIESIACE[m - 1]?.toLowerCase() || key,
      total: Math.round(total * 100) / 100,
    };
  });

  const avg = monthlyData.length > 0
    ? monthlyData.reduce((s, d) => s + d.total, 0) / monthlyData.length
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <OrangeHeader>
        <h1 className="text-3xl font-black">Historia</h1>
        <p className="text-white/80 mt-1">Twoje miesięczne wydatki</p>
      </OrangeHeader>

      <div className="mt-5 space-y-5">
        {/* Monthly comparison chart */}
        <div className="bg-card rounded-2xl p-5 mx-5 shadow-sm border border-border/50">
          <h3 className="font-bold text-lg mb-4">Porównanie miesięczne</h3>
          {monthlyData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Brak danych</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#999" }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#999" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}zł`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(v) => [`${v.toFixed(2).replace(".", ",")} zł`, "Suma"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {monthlyData.map((d, i) => (
                      <Cell key={i} fill={d.total <= avg ? "hsl(30, 90%, 52%)" : "#F87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Poniżej średniej</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span>Powyżej średniej</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Average card */}
        <div className="mx-5 bg-accent rounded-2xl p-5 shadow-sm border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Średnie wydatki miesięczne</p>
            <p className="text-3xl font-extrabold text-primary">{formatPLNShort(Math.round(avg))}</p>
          </div>
          <span className="text-3xl">📊</span>
        </div>

        {/* Monthly list */}
        <div className="px-5 space-y-4">
          {sortedKeys.map((key) => {
            const [y, m] = key.split("-").map(Number);
            const expenses = byMonth[key];
            const total = expenses.reduce((s, e) => s + e.kwota, 0);
            const count = expenses.length;

            const prevKey = getMonthKey(new Date(y, m - 2, 1));
            const prevTotal = byMonth[prevKey]?.reduce((s, e) => s + e.kwota, 0) || 0;
            const vsAvg = avg > 0 ? ((total - avg) / avg) * 100 : 0;
            const vsPrev = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

            return (
              <Link
                key={key}
                to={`/historia/${key}`}
                className="block bg-card rounded-2xl p-5 shadow-sm border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{MIESIACE[m - 1]} {y}</h3>
                    <p className="text-sm text-muted-foreground">{count} transakcji</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="bg-accent rounded-xl p-4 mb-3">
                  <p className="text-sm text-muted-foreground">Całkowite wydatki</p>
                  <p className="text-3xl font-extrabold">{formatPLN(total)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`rounded-xl p-3 ${vsAvg <= 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      📉 vs średnia
                    </p>
                    <p className={`font-bold ${vsAvg <= 0 ? "text-green-600" : "text-red-500"}`}>
                      {vsAvg > 0 ? "+" : ""}{vsAvg.toFixed(0)}%
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${vsPrev <= 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      📉 vs poprzedni
                    </p>
                    <p className={`font-bold ${vsPrev <= 0 ? "text-green-600" : "text-red-500"}`}>
                      {vsPrev > 0 ? "+" : ""}{vsPrev.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          {sortedKeys.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Brak danych historycznych
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
