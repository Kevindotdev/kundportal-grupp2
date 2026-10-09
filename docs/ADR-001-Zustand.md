# ADR-[001]: [Val av State-hantering för Varukorg (Cookies och Server Actions)]

- **Status:** Beslutad
- **Datum:** 2026-10-01
- **Deltagare:** Mervin B, Kevin, Hannes L, Andreas W
- **Relaterad Issue/Ticket:** #TBD

---

## 1. Kontext & Problemställning

För att uppfylla PRD (FR-5) skapar vi en kodbas-intern global state för kundvagnen med stöd för Next.js App Router. Lösningen kommer att göra kundvagnen tillgänglig i navbaren, på produktsidor och i kassan. För att behålla data mellan sessioner och undvika hydration mismatches vid server-/klientrendering, använder vi en kombination av en state-hanterare (t.ex. Zustand) och synkroniserad lagring via localStorage eller cookies.

---

## 2. Övervägda Alternativ

### Alternativ A: [t.ex. React Context API med LocalStorage]

- **Fördelar:** Inbyggt i React, inga externa beroenden, enkelt att komma igång med.
- **Nackdelar:** Kan orsaka onödiga omrenderingar vid frekventa uppdateringar, kräver manuell hantering av SSR/hydration mismatch vid synk mot LocalStorage.

### Alternativ B: [t.ex. Zustand med persist-middleware]

- **Fördelar:** Lättviktigt (under 2kB), mycket snabbt, friktionsfri selector-modell som minimerar omrenderingar, inbyggt stöd för att persistera till LocalStorage eller Cookies.
- **Nackdelar:** Ett extra npm-paket att underhålla och lära sig.

### Alternativ C: [t.ex. Server State med Cookies och Server Actions]

- **Fördelar:** Fungerar sömlöst med Server Components och kräver minimal JavaScript på klienten.
- **Nackdelar:** Mer komplext att implementera för snabba UI-uppdateringar utan fördröjning om inte optimistiska uppdateringar används.

---

## 3. Beslut

Vi beslutar att använda **Alternativ B: Zustand med persist-middleware.

Lösningen erbjuder en flexibel och global tillståndshantering för våra Client Components. Genom att minimera mängden standardkod (boilerplate) får vi en beständig kundvagnsfunktion direkt vid installationen.

---

## 4. Konsekvenser

### Positiva konsekvenser

- Minimalt med Boilerplate-kod: Till skillnad från äldre lösningar för persistens (som Redux Persist) krävs bara några få rader kod för att lägga till persistens i en Zustand-store – det räcker med att omsluta din store med `persist`.
- Automatisk återställning av tillstånd (rehydrering): När applikationen startar hämtar middleware-komponenten automatiskt den sparade datan till din store (återställning) – sömlöst och i bakgrunden.
- Flexibla lagringsmotorer: Stöder både synkron lagring (t.ex. localStorage) och asynkron lagring (t.ex. AsyncStorage eller IndexedDB).
- Versionshantering och tillståndsmigrering: Funktionen inkluderar inbyggt stöd för versionshantering och migrering, vilket gör att du på ett säkert sätt kan uppdatera eller transformera din lagrade datastruktur om appens dataschema förändras över tid.
- Bättre användarupplevelse: Det förhindrar dataförlust vid omladdning av sidor eller omstart av appar, och bevarar användarinställningar, utkast och autentiseringsstatus.

### Negativa konsekvenser / Risker

- Vi måste säkerställa att vi hanterar Hydration i Next.js så att vi inte renderar korgens innehåll innan klienten mountat (för att undvika hydration warnings).
- Avsaknad av versionshantering och migrering av tillstånd: Om du ändrar formen eller strukturen på din tillståndsdata (till exempel genom att byta namn på en egenskap eller ändra en datatyp) utan att definiera en lämplig migreringsstrategi, kommer användare med gammal data sparad i localStorage eller sessionStorage att drabbas av trasiga gränssnitt eller körningsfel vid uppgradering.innehåll innan klienten mountat (för att undvika hydration warnings).
- Alla i gruppen måste förstå hur Zustands `useStore`-hook fungerar så att inte enbart en person kan arbeta med varukorgen.

---

## 5. Hur vi verifierar beslutet

_Hur vet vi att beslutet var lyckat?_

- [ ] Varor kan läggas till och tas bort från både produktsida och kassa.
- [ ] Antalet varor i navbar-badgen uppdateras omedelbart utan sidomladdning.
- [ ] Varukorgens innehåll finns kvar efter att sidan laddats om (`F5`).
- [ ] Inga Hydration-varningar syns i webbläsarkonsolen.
