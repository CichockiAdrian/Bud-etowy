import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, LogOut, Moon, Sun } from "lucide-react";
import { base44 } from "@/api/base44Client";
import OrangeHeader from "@/components/shared/OrangeHeader";
import { Button } from "@/components/ui/button";

export default function Ustawienia() {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    // Delete all user expenses before logging out
    const { base44 } = await import("@/api/base44Client");
    const expenses = await base44.entities.Wydatek.filter({ user_email: (await base44.auth.me()).email });
    await Promise.all(expenses.map((e) => base44.entities.Wydatek.delete(e.id)));
    await base44.auth.logout("/");
  };

  return (
    <div className="max-w-lg mx-auto">
      <OrangeHeader className="pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white select-none">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Ustawienia</h1>
        </div>
      </OrangeHeader>

      <div className="px-5 py-6 space-y-4">
        <button
          onClick={toggleTheme}
          className="select-none w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:bg-accent transition"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
          </div>
          <span className="font-semibold">{isDark ? "Tryb jasny" : "Tryb ciemny"}</span>
        </button>

        <button
          onClick={() => base44.auth.logout("/")}
          className="select-none w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:bg-accent transition"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="font-semibold">Wyloguj się</span>
        </button>

        <div className="bg-card border border-red-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-bold text-red-700">Usuń konto</p>
              <p className="text-xs text-muted-foreground">Ta operacja jest nieodwracalna</p>
            </div>
          </div>

          {confirmDelete && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
              Czy na pewno chcesz usunąć konto? Wszystkie dane zostaną trwale usunięte.
            </p>
          )}

          <Button
            onClick={handleDeleteAccount}
            disabled={deleting}
            variant="destructive"
            className="select-none w-full rounded-xl"
          >
            {deleting ? "Usuwanie..." : confirmDelete ? "Tak, usuń moje konto" : "Usuń konto"}
          </Button>

          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="select-none w-full text-sm text-muted-foreground text-center"
            >
              Anuluj
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
