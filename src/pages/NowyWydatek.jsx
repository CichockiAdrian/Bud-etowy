import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Camera, Loader2, Sparkles, CalendarDays } from "lucide-react";
import OrangeHeader from "@/components/shared/OrangeHeader";
import { KATEGORIE } from "@/lib/expenseUtils";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import DatePickerDrawer from "@/components/shared/DatePickerDrawer";

const categories = Object.entries(KATEGORIE);

export default function NowyWydatek() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [kwota, setKwota] = useState("");
  const [kategoria, setKategoria] = useState("jedzenie");
  const [opis, setOpis] = useState("");
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [dateDrawerOpen, setDateDrawerOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: (expense) => base44.entities.Wydatek.create(expense),
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: ["wydatki", user?.email] });
      const previous = queryClient.getQueryData(["wydatki", user?.email]);
      const optimistic = { ...newExpense, id: `optimistic-${Date.now()}` };
      queryClient.setQueryData(["wydatki", user?.email], (old = []) => [optimistic, ...old]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["wydatki", user?.email], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wydatki", user?.email] });
      navigate("/");
    },
  });

  const handleFileUpload = async (file) => {
    if (!file) return;
    setScanning(true);
    setScanError(false);
    setReceiptPreview(null);
    setReceiptFile(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setReceiptPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setReceiptFile(file_url);

    // Use AI to extract data from receipt
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Przeanalizuj ten paragon/fakturę i wyodrębnij dane. 
      Zwróć JSON z polami:
      - kwota: liczba (całkowita kwota do zapłaty w PLN, sama liczba bez "zł")
      - opis: string (krótki opis np. nazwa sklepu + co kupiono, max 50 znaków)
      - data: string w formacie YYYY-MM-DD (data paragonu, jeśli brak to dzisiejsza: ${format(new Date(), "yyyy-MM-dd")})
      - kategoria: jedna z wartości: jedzenie, transport, zakupy, rozrywka, rachunki, zdrowie, inne
      
      Zasady kategorii:
      - jedzenie: sklepy spożywcze, restauracje, kawiarnie, fast food
      - transport: paliwo, bilety komunikacji, parking, taksówki
      - zakupy: ubrania, elektronika, kosmetyki, sklepy ogólne
      - rozrywka: kino, gry, sport, hobby
      - rachunki: prąd, gaz, internet, telefon, czynsz
      - zdrowie: apteka, lekarz, suplementy
      - inne: pozostałe
      
      Jeśli zdjęcie jest nieczytelne lub to nie jest paragon/faktura, zwróć null dla wszystkich pól.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          kwota: { type: "number" },
          opis: { type: "string" },
          data: { type: "string" },
          kategoria: { type: "string" },
        },
      },
    });

    const anyFieldRead = result.kwota || result.opis || result.data || result.kategoria;

    if (!anyFieldRead) {
      setScanError(true);
      setReceiptPreview(null);
      setReceiptFile(null);
    } else {
      if (result.kwota) setKwota(String(result.kwota).replace(".", ","));
      if (result.opis) setOpis(result.opis);
      if (result.data) setData(result.data);
      if (result.kategoria && KATEGORIE[result.kategoria]) setKategoria(result.kategoria);
    }

    setScanning(false);
  };

  const handleSubmit = () => {
    const amount = parseFloat(kwota.replace(",", "."));
    if (!amount || amount <= 0) return;

    const expense = {
      kwota: amount,
      kategoria,
      opis: opis.trim() || undefined,
      data,
      user_email: user.email,
    };
    if (receiptFile) expense.plik_paragonu = receiptFile;
    createMutation.mutate(expense);
  };

  return (
    <div>
      <OrangeHeader className="pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black">Nowy wydatek</h1>
        </div>
      </OrangeHeader>

      <div className="px-5 py-6 space-y-6">
        {/* Receipt scan */}
        <div>
          <h3 className="font-bold mb-3">Zeskanuj paragon (opcjonalnie)</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={scanning}
              className="select-none bg-card border-2 border-dashed border-primary/40 rounded-2xl p-5 flex flex-col items-center gap-2 text-primary hover:bg-orange-50 transition disabled:opacity-50"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-semibold">Wybierz plik</span>
            </button>
            <button
              onClick={() => cameraRef.current?.click()}
              disabled={scanning}
              className="select-none bg-card border-2 border-dashed border-primary/40 rounded-2xl p-5 flex flex-col items-center gap-2 text-primary hover:bg-orange-50 transition disabled:opacity-50"
            >
              <Camera className="w-6 h-6" />
              <span className="text-sm font-semibold">Zrób zdjęcie</span>
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />

          {/* State feedback */}
          {scanning && (
            <div className="mt-3 bg-orange-50 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Analizuję paragon...</p>
                <p className="text-xs text-muted-foreground">AI wypełni pola automatycznie</p>
              </div>
            </div>
          )}

          {receiptPreview && !scanning && !scanError && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-3">
              <img src={receiptPreview} alt="Paragon" className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">Paragon odczytany!</p>
                </div>
                <p className="text-xs text-green-600">Pola zostały automatycznie wypełnione</p>
              </div>
            </div>
          )}

          {scanError && !scanning && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">😕</span>
                <p className="text-sm font-bold text-red-700">Nie udało się odczytać paragonu</p>
              </div>
              <p className="text-xs text-red-600 mb-3">
                Zdjęcie jest nieczytelne lub zbyt rozmyte. Spróbuj ponownie — zadbaj o dobre oświetlenie i ostrość.
              </p>
              <button
                onClick={() => { setScanError(false); fileRef.current?.click(); }}
                className="text-xs font-semibold text-red-700 underline underline-offset-2"
              >
                Prześlij ponownie
              </button>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <h3 className="font-bold mb-3">Kwota</h3>
          <div className="flex items-center bg-card border border-border rounded-2xl px-4">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={kwota}
              onChange={(e) => setKwota(e.target.value)}
              className="border-0 text-right text-2xl font-bold bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <span className="text-lg text-muted-foreground font-semibold ml-2">zł</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="font-bold mb-3">Kategoria</h3>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setKategoria(key)}
                className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition-all ${
                  kategoria === key
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-card border border-border/50 hover:bg-accent"
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-semibold">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-bold mb-3">Opis</h3>
          <Input
            placeholder="np. Zakupy w Biedronce"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="rounded-2xl h-12 bg-card"
          />
        </div>

        {/* Date */}
        <div>
          <h3 className="font-bold mb-3">Data</h3>
          <button
            onClick={() => setDateDrawerOpen(true)}
            className="select-none w-full bg-card border border-border rounded-2xl h-12 px-4 flex items-center justify-between hover:bg-accent transition"
          >
            <span className="font-semibold">
              {data ? format(parseISO(data), "d MMMM yyyy", { locale: pl }) : "Wybierz datę"}
            </span>
            <CalendarDays className="w-5 h-5 text-muted-foreground" />
          </button>
          <DatePickerDrawer
            value={data}
            onChange={setData}
            open={dateDrawerOpen}
            onOpenChange={setDateDrawerOpen}
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending || !kwota || scanning}
          className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90"
        >
          {createMutation.isPending ? "Zapisywanie..." : "Dodaj wydatek 💰"}
        </Button>
      </div>
    </div>
  );
}
