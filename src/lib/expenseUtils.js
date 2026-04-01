export const KATEGORIE = {
  jedzenie: { emoji: "🍕", label: "Jedzenie", color: "#F87171" },
  transport: { emoji: "🚗", label: "Transport", color: "#60A5FA" },
  zakupy: { emoji: "🛍️", label: "Zakupy", color: "#F472B6" },
  rozrywka: { emoji: "🎬", label: "Rozrywka", color: "#FBBF24" },
  rachunki: { emoji: "💡", label: "Rachunki", color: "#34D399" },
  zdrowie: { emoji: "💊", label: "Zdrowie", color: "#FB923C" },
  inne: { emoji: "📦", label: "Inne", color: "#A78BFA" },
};

export const MIESIACE = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

export function formatPLN(value) {
  if (value == null || isNaN(value)) return "0,00 zł";
  return value.toFixed(2).replace(".", ",") + " zł";
}

export function formatPLNShort(value) {
  if (value == null || isNaN(value)) return "0 zł";
  if (Number.isInteger(value)) return value + " zł";
  return value.toFixed(2).replace(".", ",") + " zł";
}

export function getMonthYear(date) {
  const d = new Date(date);
  return `${MIESIACE[d.getMonth()]} ${d.getFullYear()}`;
}

export function getMonthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function groupByMonth(expenses) {
  const grouped = {};
  expenses.forEach((e) => {
    const key = getMonthKey(e.data);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });
  return grouped;
}

export function groupByCategory(expenses) {
  const grouped = {};
  expenses.forEach((e) => {
    if (!grouped[e.kategoria]) grouped[e.kategoria] = 0;
    grouped[e.kategoria] += e.kwota;
  });
  return grouped;
}
