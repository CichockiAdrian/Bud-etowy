import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import OrangeHeader from "@/components/shared/OrangeHeader";
import MonthSummary from "@/components/home/MonthSummary";
import QuickStats from "@/components/home/QuickStats";
import TrendChart from "@/components/home/TrendChart";
import ExpenseCard from "@/components/shared/ExpenseCard";
import { MIESIACE } from "@/lib/expenseUtils";
import { useAuth } from "@/lib/AuthContext";

const PULL_THRESHOLD = 70;

export default function Home() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(null);
  const scrollRef = useRef(null);


  const { data: allExpenses = [], isLoading } = useQuery({
    queryKey: ["wydatki", user?.email],
    queryFn: async () => {
      const all = await base44.entities.Wydatek.filter({ user_email: user.email }, "-data", 500);
      return all.filter(e => e.user_email === user.email);
    },
    enabled: !!user?.email,
  });

  const monthExpenses = allExpenses.filter((e) => {
    const d = new Date(e.data);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const recentExpenses = monthExpenses.slice(0, 10);

  const handleTouchStart = (e) => {
    if (scrollRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0 && scrollRef.current?.scrollTop === 0) {
      setPullY(Math.min(delta * 0.4, PULL_THRESHOLD));
    }
  };

  const handleTouchEnd = async () => {
    if (pullY >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullY(0);
      await queryClient.refetchQueries({ queryKey: ["wydatki", user?.email] });
      setRefreshing(false);
    } else {
      setPullY(0);
    }
    touchStartY.current = null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-screen overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-150"
        style={{ height: refreshing ? 48 : pullY > 0 ? pullY : 0 }}
      >
        <div className={`w-6 h-6 border-4 border-orange-200 border-t-primary rounded-full ${refreshing ? "animate-spin" : ""}`}
          style={{ opacity: refreshing ? 1 : pullY / PULL_THRESHOLD }}
        />
      </div>

      <OrangeHeader>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-sm font-semibold">{MIESIACE[month]} {year}</p>
            <h1 className="text-3xl font-black mt-1">Twoje wydatki</h1>
          </div>
          <Link to="/ustawienia" className="select-none mt-1 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </Link>
        </div>
        <div className="mt-4">
          <MonthSummary expenses={monthExpenses} year={year} month={month} />
        </div>
      </OrangeHeader>

      <div className="mt-5 space-y-5">
        <QuickStats expenses={monthExpenses} year={year} month={month} />
        <TrendChart expenses={monthExpenses} year={year} month={month} />

        <div className="px-5">
          <h2 className="text-xl font-bold mb-3">Ostatnie wydatki</h2>
          {recentExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Brak wydatków w tym miesiącu. Dodaj pierwszy wydatek!
            </p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((e) => (
                <ExpenseCard key={e.id} expense={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
