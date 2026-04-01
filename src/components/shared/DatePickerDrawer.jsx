import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { format, getDaysInMonth, setDate, setMonth, setYear, getYear, getMonth, getDate } from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec",
  "Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"
];

export default function DatePickerDrawer({ value, onChange, open, onOpenChange }) {
  const parsed = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(getYear(parsed));
  const [viewMonth, setViewMonth] = useState(getMonth(parsed));

  const selectedDay = value ? getDate(new Date(value)) : null;
  const selectedMonth = value ? getMonth(new Date(value)) : null;
  const selectedYear = value ? getYear(new Date(value)) : null;

  const daysInMonth = getDaysInMonth(new Date(viewYear, viewMonth, 1));
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  // Make Monday first
  const offset = (firstDayOfWeek + 6) % 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    onChange(format(d, "yyyy-MM-dd"));
    onOpenChange(false);
  };

  const isSelected = (day) =>
    day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  };

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-w-lg mx-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <DrawerHeader>
          <DrawerTitle>Wybierz datę</DrawerTitle>
        </DrawerHeader>

        <div className="px-5 pb-6 select-none">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg">{MONTHS[viewMonth]} {viewYear}</span>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Pn","Wt","Śr","Cz","Pt","So","Nd"].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() => selectDay(day)}
                    className={`w-10 h-10 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                      isSelected(day)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : isToday(day)
                        ? "border-2 border-primary text-primary"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
