import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import OrangeHeader from "@/components/shared/OrangeHeader";
import CategoryDonut from "@/components/analysis/CategoryDonut";
import CategoryBarChart from "@/components/analysis/CategoryBarChart";
import TopExpenses from "@/components/analysis/TopExpenses";
import { MIESIACE, formatPLNShort, getMonthKey, groupByMonth } from "@/lib/expenseUtils";
import { useAuth } from "@/lib/AuthContext";

export default function Analiza() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const { user } = useAuth();

  const { data: allExpenses = [], isLoading } = useQuery({
    queryKey: ["wydatki", user?.email],
    queryFn: async () => {
      const all = await base44.entities.Wydatek.filter({ user_email: user.email }, "-data", 500);
      return all.filter(e => e.user_email === user.email);
    },
    enabled: !!user?.email,
  });

  const currentKey = getMonthKey(now);
  const byMonth = groupByMonth(allExpenses);
  const monthExpenses = byMonth[currentKey] || [];
  const total = monthExpenses.reduce((s, e) => s + e.kwota, 0);

  // Average of last 6 months
  const monthKeys = Object.keys(byMonth).sort().reverse().slice(0, 6);
  const avgMonthly = monthKeys.length > 0
    ? monthKeys.reduce((s, k) => s + byMonth[k].reduce((ss, e) => ss + e.kwota, 0), 0) / monthKeys.length
    : 0;

  // Previous month comparison
  const prevDate = new Date(year, month - 1, 1);
  const prevKey = getMonthKey(prevDate);
  const prevExpenses = byMonth[prevKey] || [];
  const prevTotal = prevExpenses.reduce((s, e) => s + e.kwota, 0);
  const pctChange = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

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
        <h1 className="text-3xl font-black">Analiza wydatków</h1>
        <p className="text-white/80 mt-1">{MIESIACE[month]} {year}</p>
      </OrangeHeader>

      <div className="mt-5 space-y-5">
        {/* Two stat cards */}
        <div className="grid grid-cols-2 gap-3 px-5">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
            <p className="text-sm text-muted-foreground">Wydano</p>
            <p className="text-2xl font-extrabold text-primary">{formatPLNShort(Math.round(total))}</p>
            <p className="text-xs text-muted-foreground">ten miesiąc</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
            <p className="text-sm text-muted-foreground">Średnia</p>
            <p className="text-2xl font-extrabold text-foreground">{formatPLNShort(Math.round(avgMonthly))}</p>
            <p className="text-xs text-muted-foreground">na miesiąc</p>
          </div>
        </div>

        {/* Previous month comparison */}
        <div className="mx-5 bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-lg">📉</span>
            </div>
            <div>
              <h3 className="font-bold">Porównanie z poprzednim miesiącem</h3>
              <p className="text-sm text-muted-foreground">{MIESIACE[prevDate.getMonth()]} {prevDate.getFullYear()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Poprzedni miesiąc</p>
              <p className="text-2xl font-extrabold">{formatPLNShort(Math.round(prevTotal))}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Zmiana</p>
              <p className={`text-2xl font-extrabold ${pctChange <= 0 ? "text-green-600" : "text-red-500"}`}>
                {pctChange > 0 ? "+" : ""}{pctChange.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <CategoryDonut expenses={monthExpenses} />
        <CategoryBarChart expenses={monthExpenses} />
        <TopExpenses expenses={monthExpenses} />
      </div>
    </div>
  );
}
