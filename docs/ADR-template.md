# 🏛️ Architecture Decision Record (ADR) Mall

> **Vad är en ADR?**  
> En ADR (Architecture Decision Record) är ett kortfattat dokument som fångar ett viktigt arkitektur- eller teknikbeslut, kontexten kring beslutet och dess konsekvenser. Spara era beslut i mappen `docs/` med namn som `ADR-001-val-av-databas.md`.

> ⚖️ **Tumregel: När ska vi skriva en ADR i detta projekt?**
>
> - **Skriv INTE en ADR för allt!** Ni ska **endast skriva 1 (max 2) ADR:er för hela projektet**.
> - **Var?** Skriv den uteslutande för era **valbara fördjupningsmoduler** eller ert största tekniska vägval (t.ex. _Val av state-hantering för varukorg_, _Val av Auth-tjänst_, eller _Val av molndatabas_).
> - **När behövs INTE en ADR?** Skriv aldrig en ADR för UI-styling, vanliga React-komponenter, sidlayouter eller buggfixar.

---

# ADR-[NUMMER]: [Kort titel på beslutet, t.ex. Val av State Management för Varukorg]

- **Status:** [ Föreslagen | Beslutad | Ersatt | Förkastad ]
- **Datum:** 2026-XX-XX
- **Deltagare:** [Namn på teammedlemmar som deltog i beslutet]
- **Relaterad Issue/Ticket:** #[Issue-nummer på GitHub]

---

## 1. Kontext & Problemställning

_Vilken utmaning eller vilket behov står vi inför? Vilka krav och begränsningar styr oss?_

_Exempel: Vi behöver hantera kundens varukorg i webbshoppen. Korgen ska kunna uppdateras från flera olika komponenter (produktsida, navbar-ikon, kassa) och användarens varor ska helst inte försvinna vid en sidomladdning. Vi måste bestämma hur vi hanterar detta tillstånd i Next.js App Router._

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

_Vilket alternativ valde vi och varför?_

_Exempel: Vi beslutar att använda **Alternativ B: Zustand med persist-middleware**. Detta ger oss ett flexibelt, globalt state som fungerar smidigt i våra Client Components, samtidigt som vi undviker boilerplate och får persistent varukorg "out of the box"._

---

## 4. Konsekvenser

### Positiva konsekvenser

- Teamet får en standardiserad metod för globalt state som kan återanvändas för eventuella andra funktioner (t.ex. notifikationer/toast).
- Kunden får en modern köpupplevelse där korgen sparas mellan sessioner.
- Enkelt att testa och mocka.

### Negativa konsekvenser / Risker

- Vi måste säkerställa att vi hanterar Hydration i Next.js så att vi inte renderar korgens innehåll innan klienten mountat (för att undvika hydration warnings).
- Alla i gruppen måste förstå hur Zustands `useStore`-hook fungerar så att inte enbart en person kan arbeta med varukorgen.

---

## 5. Hur vi verifierar beslutet

_Hur vet vi att beslutet var lyckat?_

- [ ] Varor kan läggas till och tas bort från både produktsida och kassa.
- [ ] Antalet varor i navbar-badgen uppdateras omedelbart utan sidomladdning.
- [ ] Varukorgens innehåll finns kvar efter att sidan laddats om (`F5`).
- [ ] Inga Hydration-varningar syns i webbläsarkonsolen.
