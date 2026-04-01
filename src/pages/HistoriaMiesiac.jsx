import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import OrangeHeader from "@/components/shared/OrangeHeader";
import MonthSummary from "@/components/home/MonthSummary";
import QuickStats from "@/components/home/QuickStats";
import TrendChart from "@/components/home/TrendChart";
import ExpenseCard from "@/components/shared/ExpenseCard";
import { MIESIACE } from "@/lib/expenseUtils";
import { useAuth } from "@/lib/AuthContext";

export default function HistoriaMiesiac() {
  const { monthKey } = useParams();
  const navigate = useNavigate();
  const [yearStr, monthStr] = (monthKey || "").split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;

  const { user } = useAuth();

  const { data: allExpenses = [], isLoading } = useQuery({
    queryKey: ["wydatki", user?.email],
    queryFn: async () => {
      const all = await base44.entities.Wydatek.filter({ user_email: user.email }, "-data", 500);
      return all.filter(e => e.user_email === user.email);
    },
    enabled: !!user?.email,
  });

  const monthExpenses = allExpenses
    .filter((e) => {
      const d = new Date(e.data);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

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
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/historia")} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <p className="text-white/80 text-sm font-semibold">{MIESIACE[month]} {year}</p>
            <h1 className="text-2xl font-black">Wydatki</h1>
          </div>
        </div>
        <MonthSummary expenses={monthExpenses} year={year} month={month} />
      </OrangeHeader>

      <div className="mt-5 space-y-5">
        <QuickStats expenses={monthExpenses} year={year} month={month} />
        <TrendChart expenses={monthExpenses} year={year} month={month} />

        <div className="px-5">
          <h2 className="text-xl font-bold mb-3">Wydatki</h2>
          {monthExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Brak wydatków</p>
          ) : (
            <div className="space-y-3">
              {monthExpenses.map((e) => (
                <ExpenseCard key={e.id} expense={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
