# 📖 Domänordlista (Glossary)

En referensguide för professionella termer inom produktutveckling, e-handel och modern webbarkitektur (Next.js/React). Använd dessa termer i era diskussioner, i era issues/tickets och under er slutredovisning.

---

## 🎯 1. Produktledning & Agilt arbete

| Term                                    | Beskrivning                                                                                                                                                                          |
| :-------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PRD (Product Requirements Document)** | Ett produktspecifikationsdokument som beskriver produktens syfte, målgrupp, funktionskrav och begränsningar innan utvecklingen börjar.                                               |
| **MVP (Minimum Viable Product)**        | Den minsta versionen av en produkt som innehåller tillräckligt med funktioner för att leverera värde till kunden och validera konceptet.                                             |
| **User Story**                          | Ett krav formulerat ur slutanvändarens perspektiv enligt mallen: _"Som [användarroll] vill jag [göra något] så att [uppnå ett värde/syfte]"_.                                        |
| **Acceptance Criteria (AC)**            | Tydliga villkor som måste vara uppfyllda för att en User Story ska räknas som godkänd. Formuleras ofta med Gherkin-syntax: _Given / When / Then_.                                    |
| **DoD (Definition of Done)**            | Teamets gemensamma checklista för vad som krävs innan en ticket/issue får flyttas till "Done" (t.ex. koden fungerar, testad, code review godkänd, mergad till main).                 |
| **Spike**                               | En tidsbegränsad undersökning eller prototyp för att reda ut en teknisk osäkerhet (t.ex. testa om Stripe eller Clerk fungerar smidigt i Next.js) innan man bygger själva funktionen. |
| **Feature Freeze**                      | En tidpunkt i projektet då inga nya funktioner får påbörjas, utan allt fokus läggs på buggfixar, refaktorering, styling och förberedelse inför release.                              |
| **ADR (Architecture Decision Record)**  | Ett kortfattat dokument som fångar ett viktigt arkitekturbeslut, dess kontext och konsekvenser.                                                                                      |

---

## 🛒 2. E-handelsdomänen

| Term                         | Beskrivning                                                                                                                                 |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| **SKU (Stock Keeping Unit)** | Unikt artikelnummer/identifierare för en specifik vara eller variant i ett lager/katalog.                                                   |
| **Slug**                     | Den läsbara delen av en webbadress som identifierar en resurs, t.ex. `/products/nike-air-max-90` där `nike-air-max-90` är varans slug.      |
| **Line Item**                | En specifik rad i en varukorg eller order, bestående av produkt-ID, vald variant, antal (quantity) och styckpris.                           |
| **Cart Persistence**         | Förmågan att bevara varukorgens innehåll mellan sidvisningar, omstarter eller inloggningar (via t.ex. LocalStorage, Cookies eller databas). |
| **Checkout Session**         | Den tillfälliga session eller process där kunden går från varukorg till betalning och bekräftad order.                                      |
| **Subtotal vs Total**        | _Subtotal_ är summan av produkterna före frakt, skatt eller rabatter. _Total_ är det slutgiltiga belopp kunden betalar.                     |
| **Inventory / Stock Status** | Lagersaldo, t.ex. _I lager_, _Fåtal kvar_ eller _Slutsåld_. Påverkar om köpknappar ska vara aktiva eller inaktiva.                          |

---

## ⚛️ 3. Next.js & Modern Webbutveckling

| Term                                   | Beskrivning                                                                                                                                                                                |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RSC (React Server Components)**      | Komponenter som renderas enbart på servern. De har direkt tillgång till databas/backend utan att skicka JavaScript till klienten, vilket ger snabbare laddtider och bättre SEO.            |
| **Client Components (`'use client'`)** | Komponenter som körs i webbläsaren för att hantera interaktivitet, eventlyssnare (`onClick`) och React-hooks (`useState`, `useEffect`).                                                    |
| **`searchParams` (URL State)**         | Query-parametrar i URL:en (t.ex. `?category=skor&sort=price_asc&page=2`). Perfekt för sök, filter och paginering eftersom tillståndet kan bokmärkas, delas och hanteras direkt på servern. |
| **Hydration**                          | Processen där React i webbläsaren "kopplar upp sig" mot den statiska HTML som genererats på servern och gör den interaktiv.                                                                |
| **Hydration Mismatch**                 | Ett vanligt fel i SSR när serverns HTML skiljer sig från vad klienten renderar vid första uppstart (t.ex. om man läser `localStorage` direkt i renderingen).                               |
| **Streaming & Suspense**               | Teknik för att bryta ner sidans HTML i mindre delar och strömma dem till webbläsaren så fort de är klara. Tillåter laddnings-skelett medan långsamma API-anrop körs.                       |
| **Optimistic UI (`useOptimistic`)**    | Mönster där användargränssnittet uppdateras omedelbart (som om serveranropet redan lyckats), och rullas tillbaka endast om servern svarar med ett fel.                                     |
| **Server Actions**                     | Asynkrona funktioner som körs på servern och kan anropas direkt från formulär eller klientkomponenter utan att man behöver bygga manuella API-endpoints.                                   |
| **Middleware**                         | Kod som körs före en request slutförs, perfekt för att skydda rutter (autentisering) eller omdirigera användare.                                                                           |
| **ORM (Object-Relational Mapping)**    | Verktyg (t.ex. Prisma, Drizzle) som låter utvecklare interagera med en databas med TypeScript/JavaScript-objekt istället för råa SQL-frågor.                                               |
