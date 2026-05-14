# 💰 Bud-etowy

Aplikacja mobilna do śledzenia i analizy wydatków osobistych. Zbudowana w JavaScript z Tailwind CSS — prosta, szybka i intuicyjna.

## ✨ Funkcje

- 📊 **Dashboard wydatków** — podgląd miesięcznych wydatków w czasie rzeczywistym
- 📈 **Trend wydatków** — wykres skumulowanych kosztów w ciągu miesiąca
- 🗂️ **Kategorie** — jedzenie, transport, zakupy, rozrywka, rachunki, zdrowie i inne
- 📉 **Analiza** — porównanie z poprzednim miesiącem i rozkład kategorii
- 📅 **Historia** — miesięczne zestawienia z procentową zmianą względem średniej
- ➕ **Dodawanie wydatków** — z opcją skanowania paragonu (aparat lub plik)
- 🌙 **Dark mode** — przełącznik trybu ciemnego

## 📱 Screenshoty

### Strona główna — Twoje wydatki
> Miesięczne podsumowanie z łączną kwotą, średnią dzienną i największym wydatkiem. Wykres pokazuje skumulowane koszty dzień po dniu.

<img src="Zrzut ekranu 2026-03-30 o 21.08.13.png" width="300" alt="Strona główna — Twoje wydatki" />

---

### Lista ostatnich transakcji
> Widok ostatnich wydatków z nazwą, kategorią, kwotą i datą. Każda transakcja ma przypisaną ikonę kategorii.

<img src="Zrzut ekranu 2026-03-30 o 21.08.24.png" width="300" alt="Lista ostatnich transakcji" />

---

### Analiza wydatków — podsumowanie
> Porównanie wydatków z poprzednim miesiącem (tu: -76.1%) oraz rozkład na 5 kategorii w formie wykresu donut.

<img src="Zrzut ekranu 2026-03-30 o 21.08.34.png" width="300" alt="Analiza wydatków" />

---

### Analiza wydatków — wykresy kategoriami
> Słupkowy wykres wydatków według kategorii oraz ranking najwyższych pozycji (Zakupy, Rachunki, Transport).

<img src="Zrzut ekranu 2026-03-30 o 21.08.42.png" width="300" alt="Wykres kategorii" />

---

### Historia miesięczna
> Zestawienie wszystkich miesięcy z całkowitymi wydatkami i procentową zmianą względem średniej i poprzedniego miesiąca.

<img src="Zrzut ekranu 2026-03-30 o 21.08.50.png" width="300" alt="Historia miesięczna" />

---

### Dodawanie nowego wydatku
> Formularz dodawania wydatku: kwota, kategoria (wybierana ikonkami), opis, data oraz opcjonalne skanowanie paragonu aparatem lub z pliku.

<img src="Zrzut ekranu 2026-03-30 o 21.09.08.png" width="300" alt="Dodawanie nowego wydatku" />

## 🛠️ Tech stack

- **JavaScript** (96.6%)
- **CSS / Tailwind CSS** (2.8%)
- **Vite** — bundler
- **React** — UI

## 🚀 Uruchomienie

```bash
npm install
npm run dev
```

## 📁 Struktura

```
src/
  components/   # Komponenty UI (Card i inne)
  ...
index.html
vite.config.js
tailwind.config.js
```

---

Made by [@CichockiAdrian](https://github.com/CichockiAdrian)
