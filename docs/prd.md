# 📋 Product Requirements Document (PRD): Webbshoppen – Kunddelen (Fas 2)

| Metadata                | Beskrivning                                                                                                                                                                                                                              |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Projekt**             | Webbshoppen – Kundportal (Fas 2)                                                                                                                                                                                                         |
| **Beställare**          | Nordic Retail Group (Fiktiv uppdragsgivare)                                                                                                                                                                                              |
| **Utvecklingsteam**     | Konsultteamet / Projektgruppen                                                                                                                                                                                                           |
| **Projekttid**          | 21 september 2026 – 13 oktober 2026                                                                                                                                                                                                      |
| **Slutleverans & Demo** | Tisdag 13 oktober 2026                                                                                                                                                                                                                   |
| **Teknisk Stack**       | Next.js (App Router), React, TypeScript/JavaScript, CSS/Tailwind                                                                                                                                                                         |
| **Stöddokument**        | [ADR-mall](file:///c:/docLocal/Lexicon/FE26/grupparbete/docs/ADR-mall.md) \| [Domänordlista](file:///c:/docLocal/Lexicon/FE26/grupparbete/docs/GLOSSARY.md) \| [Gruppkontrakt](file:///c:/docLocal/Lexicon/FE26/grupparbete/kontrakt.md) |

---

## 1. Vision & Bakgrund

Nordic Retail Group har framgångsrikt lanserat sitt interna administrativa gränssnitt (Fas 1). Nu behöver verksamheten ta nästa avgörande steg: **att öppna butiken för konsumenterna**.

Målet med Fas 2 är att förvandla produktkatalogen till en modern, inbjudande och högpresterande e-handelsbutik. Kunderna ska snabbt kunna hitta produkter, navigera i sortimentet, granska detaljer och förbereda sina beställningar. Lösningen ska byggas ovanpå teamets befintliga grund från Fas 1 med fokus på god användarupplevelse (UX), modern Next.js-arkitektur och stabil kodkvalitet.

---

## 2. Personas (Målgrupp)

För att säkerställa att design- och funktionsbeslut möter verkliga användarbehov utgår vi från två primära personas:

### 📱 Mobil-shopparen "Maya" (24 år)

- **Beteende:** Surfar ofta på språng via mobilen. Vill ha snabba laddtider och tydliga bilder.
- **Behov:** Enkel sökfunktion, ren layout utan krångliga menyer och smidig navigering mellan produktöversikt och detaljer.
- **Pain point:** Tröga sidor med layout shifts eller små knappar som är svåra att trycka på.

### 🔍 Pris- & Kvalitetsmedvetne "Peter" (42 år)

- **Beteende:** Handlar från dator/laptop, jämför specifikationer och vill filtrera fram exakt rätt vara.
- **Behov:** Exakt kategorifiltrering, fungerande paginering/sortering och länkar som går att dela/bokmärka (`searchParams`).
- **Pain point:** Sökfilter som nollställs vid sidomladdning eller otydlig lager- och prisinformation.

---

## 3. Grundläggande Funktionskrav (MVP - Scope)

Följande funktioner utgör basleveransen och måste vara implementerade och fungerande:

### 🛍️ FR-1: Produktkatalog (Översiktssida)

- Systemet ska visa alla tillgängliga produkter i ett responsivt rutnät (grid).
- Varje produktkort ska visa minst: bild, produktnamn, pris och kategori.
- Klick på ett produktkort ska leda direkt till produktens detaljsida.

### 🔍 FR-2: Dynamisk Detaljsida (`/products/[id]`)

- Systemet ska använda dynamiska rutter i Next.js App Router för att hämta och rendera information för en specifik vara.
- Sidan ska visa utförlig information: titel, högupplöst bild, beskrivning, pris, kategori och lagerstatus/köpknapp.
- Felhantering: Om en produkt inte finns ska en användarvänlig 404/not-found-vy visas.

### ⚡ FR-3: Sök & Filtrering via URL State (`searchParams`)

- Användaren ska kunna söka på produktnamn samt filtrera på kategorier.
- Tillståndet för sök och filter **måste lagras i URL:en** med hjälp av `searchParams` (så att filtrerade sökningar kan bokmärkas och delas).
- Data ska hämtas/filtreras sömlöst på servern baserat på aktuella parametrar.

### 📄 FR-4: Paginering

- Om katalogen innehåller fler varor än vad som ryms på en sida ska paginering finnas.
- Pagineringen ska styras via URL (`?page=X`) och möjliggöra bläddring framåt, bakåt och direktval av sida.

### 🛒 FR-5: Varukorg (Översiktsvy)

- En dedikerad vy/sida för varukorgen som visar hur en sammanställning av ordervärde, produkter, antal och totalbelopp ser ut.
- _Basnivå:_ En statisk vy med exempelprodukter som demonstrerar kassan och layouten.  
  _(Tips: Full dynamisk/persistent varukorg kan väljas som fördjupningsmodul)._

### 🛡️ Icke-funktionella krav (NFR)

- **Prestanda & Bildoptimering:** Använd Next.js inbyggda `<Image />`-komponent för optimerade bildstorlekar.
- **Tillgänglighet & SEO:** Semantisk HTML (`<header>`, `<main>`, `<article>`, `<nav>`), tydliga rubriknivåer (`h1`-`h3`) samt unika metadata-titlar per sida.
- **Dokumentation:** Repot ska ha en professionell och välstrukturerad `README.md` med installationsanvisningar, beskrivning av arkitektur och skärmdumpar.

---

## 4. Fas 2b: Fördjupningsmoduler (Kundens Önskelista)

För att särskilja ert erbjudande och skapa extra affärsvärde har kunden listat ett antal prioriterade fördjupningsområden. Varje team väljer fritt moduler utifrån sin kompetensprofil, sina ambitioner och intressen.

> 💡 **Riktlinje för teamet:**  
> Prioritera alltid **kvalitet och förståelse framför kvantitet**. En väl genomarbetad modul som alla i teamet förstår och kan förklara under redovisningen slår tre halvfärdiga moduler.

| Modul                         | Svårighetsgrad  | Inriktning & Rekommendation                                                                                                                                                                                             |
| :---------------------------- | :-------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📦 Persistent Varukorg**    | 🟢 Lätt / Medel | Spara varukorgens innehåll mellan sidladdningar och sessioner.<br>_(Rekommenderat: **Zustand med persist-middleware** eller Cookies. Mycket tacksamt då det sker helt i kodbasen utan externa API-konton)._             |
| **🎨 Designsystem & UI**      | 🟢 Lätt / Medel | Bygg ett enhetligt, tillgängligt och proffsigt gränssnitt.<br>_(Rekommenderat: **Shadcn/ui + Tailwind CSS**. Undvik att bygga all CSS från scratch för att spara tid)._                                                 |
| **📨 Transaktionell E-post**  | 🟢 Lätt / Medel | Fungerande kontaktformulär eller orderbekräftelse via Next.js Server Actions.<br>_(Rekommenderat: **Resend**. Extremt smidigt i Next.js och kräver inga krångliga SMTP-inställningar)._                                 |
| **🔐 Autentisering**          |    🟡 Medel     | Kundinloggning och skyddade rutter (_Mina sidor_, orderhistorik, favoriter).<br>_(Rekommenderat: **NextAuth**, **Kinde**, **BetterAuth** eller **Clerk** för snabbast och säkrast integration med Next.js App Router)._ |
| **💳 Betallösning**           |    🟡 Medel     | Simulera ett riktigt köpflöde i testläge.<br>_(Rekommenderat: **Stripe Hosted Checkout**. Kunden omdirigeras till Stripes säkra sida och tillbaka, vilket minimerar komplexitet)._                                      |
| **☁️ Databasmigration**       |    🟡 Medel     | Ersätt Fas 1:s JSON-server med en riktig molndatabas och ett modernt ORM.<br>_(Rekommenderat: **Supabase** eller **Neon PostgreSQL** kopplat med **Prisma** eller **Drizzle**)._                                        |
| **🌍 Cloud Deployment**       |    🟡 Medel     | Publik driftsättning i produktionsmiljö.<br>_(Rekommenderat: **Vercel**. **Obs:** Kräver att er datakälla finns online och inte på `localhost:3001`!)_                                                                  |
| **〽️ Prestandaoptimering**    |  🔴 Avancerad   | Avancerad strömning, skelettladdare och optimistiska gränssnittsuppdateringar.<br>_(Rekommenderat: **Suspense-boundaries**, `useOptimistic` och Server Actions)._                                                       |
| **⚙️ Automatiserad Testning** |  🔴 Avancerad   | E2E-testning av affärskritiska flöden (sök vara → öppna detaljsida → lägg i korg).<br>_(Rekommenderat: **Playwright**)._                                                                                                |

---

## 5. Teamets Arbetsdel & Specifikation

### 5.1 Vald Kodbas från Fas 1 & Repouppsättning

🚀 **Gemensamt repo från start:**  
För att alla i gruppen ska ha samma förutsättningar och behörigheter ska ni **inte** fortsätta koda direkt i en enskild persons gamla Fas 1-repo.

[x] Kevin skapat ett **helt nytt gemensamt GitHub-repo** för gruppen (`kundportal-grupp2`).
[x] Bjudit in samtliga gruppmedlemmar som **Collaborators** med fulla skrivrättigheter.
[x] Kopierat över den valda koden från Fas 1 och pusha som er första commit (`Initial commit from Phase 1`).
[x] Lägg in detta dokument (`PRD.md`), `kontrakt.md` och `docs/` i repot.

- **Vald Fas 1-kodbas:** Bygger på kod skriven av `Kevin/Andreas: https://github.com/sandrauddman/agileProjectGrupp2`
- **Nytt gemensamt GitHub-repo:** `https://github.com/Kevindotdev/kundportal-grupp2`
- **städnings- eller refaktoreringsbehov i basen innan start:**
  [x] Lägga in linterregler (eslinst)
  [x] Lägga in formateringsregler (prettier)
  [x] Lägga till gemensamma skills
  [x] Lägga till en AGENTS.md
  [x] Radera GroupRetrospective.md osv.

---

### 5.2 Datamodell & API-kontrakt

- Finns i: /app/types.ts

### 5.3 Teamets User Stories & Acceptanskriterier

_Formulera minst 3–5 konkreta User Stories för ert MVP och era valda funktioner. Använd Gherkin-format (Given/When/Then) för acceptanskriterierna._

#### User Story 1: Söka efter produkter från startsidan

- **Som kund** som har en viss produkt i åtanke
- **vill jag** kunna söka efter produktnamn från startsidan och få relevanta förslag medan jag skriver
- **så att** jag snabbt kan hitta produkten eller se alla matchande produkter.

**Acceptanskriterier (Given / When / Then):**

- **Given** att kunden befinner sig på startsidan
- **When** kunden skriver minst två tecken i sökfältet
- **Then** visas högst fem produkter vars produktnamn innehåller sökfrasen. Matchningen ska ignorera skillnaden mellan stora och små bokstäver. Varje träff visar produktbild, produktnamn och pris.

- **Given** att relevanta produkter visas i dropdownen
- **When** kunden väljer en träff
- **Then** öppnas den produktens produktsida.

- **Given** att kunden har skrivit en sökfras
- **When** kunden trycker på Enter utan att ha markerat en träff, eller väljer sökknappen
- **Then** kommer kunden till en separat söksida med produkterna som matchar sökfrasen. Sökfrasen sparas i URL:en så att sökningen kan delas och återskapas.

- **Given** att kunden navigerar bland dropdownens träffar med tangentbordet
- **When** kunden använder piltangenterna för att markera en träff och trycker på Enter
- **Then** öppnas den markerade produktens produktsida.
- **And** Escape stänger dropdownen.

- **Given** att inga produkter matchar efter minst två tecken
- **When** dropdownen uppdateras
- **Then** visas meddelandet "Inga produkter hittades". Kunden kan fortfarande skicka sökningen till söksidan.

- **Given** att söksidan inte hittar några produkter
- **When** sidan visar sökresultatet
- **Then** visas ett tydligt meddelande med sökfrasen och en uppmaning att prova ett annat produktnamn.

- **Given** att fler produkter matchar sökningen än vad som ryms på en resultatsida
- **When** kunden bläddrar bland resultaten
- **Then** kan kunden gå vidare mellan resultatsidorna, och sökfrasen bevaras i URL:en.

#### User Story 2: [Filtrera produkter]

- **Som en** _kund som vill hitta produkter som passar mina behov_
- **vill jag** _filtrera katalogen på kategori, pris och lagerstatus_
- **så att** _jag snabbt hittar relevanta produkter._

**Acceptanskriterier (Given / When / Then):**

- **Given** att jag söker i produktkatalogen **When** jag väljer en eller flera kategorier, anger ett prisintervall eller väljer endast produkter i lager **Then** visas produkter som matchar alla filter, med produkter från valfri vald kategori; prisgränserna är inkluderande.
- **And** sökning och filter sparas i URL:en; sidbyte behåller dem och ändrade filter börjar från sida ett.
- **And** ogiltiga priser ger ett tydligt fel med värdena kvar; om inga produkter matchar visas ett meddelande och jag kan rensa filtren utan att förlora sökningen.


#### User Story 3: Köpa produkter

## Beskrivning
**Som en** kund i webbshoppen  
**vill jag** kunna slutföra ett köp av varorna i min varukorg med hjälp av Stripe som betalningsalternativ  
**så att** jag tryggt kan betala och få produkterna levererade hem till mig.

---

## Förutsättningar (Preconditions)
- Kunden har lagt till minst en produkt i sin varukorg.
- Kunden befinner sig i kassan.
- Betalningsalternativet Stripe är tillgängligt i checkoutsflödet.

---

## Acceptanskriterier (Gherkin / BDD)

```gherkin
Funktionalitet: Slutföra köp i webbshop via Stripe
  Som kund
  Vill jag kunna betala för varorna i min varukorg via Stripe
  För att slutföra min beställning säkert och enkelt

  Bakgrund:
    Givet att jag har lagt till "Trådlösa hörlurar" i min varukorg
    Och jag navigerar till kassan

  Scenario: Genomföra ett lyckat köp med giltiga uppgifter
    När jag fyller i mina leveransuppgifter med giltig adress
    Och jag väljer "Stripe Checkout" som betalningsalternativ
    Och jag genomför betalningen i Stripes säkra betalningsflöde med giltiga kortuppgifter
    Och jag klickar på "Slutför köp"
    Så ska betalningen godkännas
    Och jag ska omdirigeras tillbaka till webbshoppen på en orderbekräftelsesida
    Och ett bekräftelsemejl ska skickas till min e-postadress
    Och min varukorg ska tömmas

  Scenario: Försök till köp med saknade leveransuppgifter
    När jag lämnar fältet "Gatuadress" tomt
    Och jag klickar på "Slutför köp"
    Så ska köpet inte genomföras
    Och jag ska se felmeddelandet "Vänligen ange en leveransadress"
    Och jag ska stanna kvar i kassan

  Scenario: Nekad betalning via Stripe
    När jag fyller i mina leveransuppgifter med giltig adress
    Och jag väljer "Stripe Checkout" som betalningsalternativ
    Och jag försöker genomföra en betalning med kortuppgifter som inte godkänns av Stripe
    Och jag avslutar betalningsflödet
    Så ska jag se felmeddelandet "Betalningen nekades. Kontrollera dina uppgifter eller prova ett annat kort."
    Och beställningen ska inte slutföras
    Och varukorgen ska fortfarande innehålla mina varor

  Scenario: Försök att gå till kassan med tom varukorg
    Givet att min varukorg är tom
    När jag navigerar till kassan
    Så ska jag omdirigeras till varukorgssidan
    Och se meddelandet "Din varukorg är tom"

  Scenario: Stripe som betalningsalternativ visas i kassan
    Givet att jag är i kassan med minst en produkt i varukorgen
    När jag granskar betalningsalternativen
    Så ska "Stripe Checkout" visas som ett tillgängligt betalningsalternativ
    Och det ska tydligt framgå att betalningen sker via Stripes säkra checkout-flöde
```

---

## Definition of Done (DoD)
- [ ] Gherkin-scenarier automatiserade som acceptanstester (t.ex. Cucumber, SpecFlow, Playwright).
- [ ] Formulärvalidering för obligatoriska leveransfält är implementerad på både klient- och serversida.
- [ ] Betalningsgateway-integration är testad mot sandbox/testmiljö.
- [ ] Orderbekräftelsemejl triggas och skickas korrekt.
- [ ] Varukorgen nollställs i session/databas efter genomfört köp.


#### User Story 4: [Hantera varukorgen]

- **Som en** _kund som vill förbereda ett köp_
- **vill jag** _kunna lägga till och hantera produkter i en persistent varukorg_
- **så att** _jag kan se vilka produkter jag valt och vad de kostar sammanlagt._

**Acceptanskriterier (Given / When / Then):**

- **Given** att jag ser en produkt i katalogen eller på dess detaljsida
- **When** jag lägger till produkten i varukorgen
- **Then** visas den där med namn, styckpris, antal och delsumma; en produkt som läggs till igen ökar antalet på samma rad.
- **And** jag kan ändra antalet eller ta bort produkten, och totalsumman uppdateras.
- **And** varukorgen sparas mellan sidladdningar och sessioner; produkter utan lager kan inte läggas till eller överstiga lagersaldot.
- **And** en tom varukorg visar ett tydligt meddelande och en väg tillbaka till produkterna.

---

### 5.4 Valda Fördjupningsmoduler & Arkitekturbeslut (ADR)

#### Arkitekturval

- **Stateful: Persistent Varukorg (Zustand)**.
- **Ikoner: Lucide Icons**
- **Validering: Zod**
- **CSS-ramverk: Tailwind**

**AI-guardrails baserat på ovan val av moduler:**

- **Shadcn/Tailwind linter**
- **Styleguide (AirBnB)**

> Det är **extra viktigt och naturligt att koppla er ADR till era valbara fördjupningsmoduler** (t.ex. _Varför valde vi Zustand framför Context för varukorgen?_ eller _Varför valde vi Supabase framför JSON-server?_). Använd mallen i `docs/ADR-mall.md`.

1. **Modul 1:** `Varukorg med Zustand`
   - **ADR-dokument:** Länk till `docs/ADR-001-Zustand.md`
   - **Kort motivering:** `Gruppen har inte jobbat med Zustand tidigare så vi ville testa. Zustand var en rekommendation.`
2. **Modul 2:** `Tailwind`
   - **ADR-dokument:** Länk till `docs/ADR-002-Tailwind.md`
   - **Kort motivering:** `En lättare överblick; gruppen är bekväm med den.`

---

### 5.5 Teamets Definition of Done (DoD)

- [ ] Koden löser den specificerade User Storyn och uppfyller acceptanskriterierna.
- [ ] Koden är testad lokalt och bygger utan fel (`npm run build`).
- [ ] Inga TypeScript- eller lint-fel i terminalen.
- [ ] Pull Request är skapad och granskad (Code Review) av minst en annan teammedlem.
- [ ] Mergad till `main`-branchen.
- [ ] Relaterad issue är stängd i GitHub Projects.

---

## 6. Process, Tidslinje & Rekommenderade Milstolpar

Grupperna förväntas arbeta enligt agila principer med sprintar, backlog i GitHub Projects och dagliga korta avstämningar enligt ert [Gruppkontrakt](file:///c:/docLocal/Lexicon/FE26/grupparbete/kontrakt.md).

### 🗓️ Hållpunkter i projektet

| Period                       | Huvudfokus                             | Mål & Leverans                                                                                                                                                                                                                                               |
| :--------------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vecka 39 (21/9 – 25/9)**   | **Uppstart, Kontrakt & Specifikation** | • Gruppkontrakt signerat.<br>• Val av Fas 1-kodbas fastställt.<br>• PRD-sektionerna ovan ifyllda.<br>• **Senast fredag 25/9:** Kanban-board / GitHub Projects uppsatt med brutna tickets redo för sprintstart nästa vecka.                                   |
| **Vecka 40 (28/9 – 2/10)**   | **Sprint: MVP-Utveckling**             | • Kodning startar i full skala!<br>• Implementering av rutnät, detaljsida, sök/filter och paginering.<br>• **Mål slutet av v.40 (~2/10):** Feature Freeze för grundläggande MVP-krav.                                                                        |
| **Vecka 41 (5/10 – 9/10)**   | **Sprint: Fördjupning & Förfining**    | • Implementering av era valda fördjupningsmoduler.<br>• Refaktorering av kodbasen, styling och UI-puts.<br>• Skriva färdigt ADR-dokumentation i `docs/`.                                                                                                     |
| **Vecka 42 (12/10 – 13/10)** | **Slutleverans & Redovisning**         | • **Måndag 12/10:** Total Code Freeze, finslipning av `README.md`, förberedelse och testkörning av presentationen.<br>• **Tisdag 13/10:** Slutredovisningar enligt [redovisningsinstruktionen](file:///c:/docLocal/Lexicon/FE26/grupparbete/redovisning.md). |

---

## 7. Leverabler & Slutredovisning

Vid projektets avslutning ska varje grupp leverera:

1. **GitHub-repo:** Innehållande ren kod, versionshistorik via PRs, ifylld `PRD.md`, era `docs/ADR-xxx.md` samt en informativ `README.md`.
2. **Fungerande applikation:** Redo att demonstreras live under redovisningen.
3. **Muntlig presentation:** 15–20 minuter uppdelad i tre delar: _Förberedelse_, _Utförande_ och _Resultat & Reflektion_ enligt instruktionerna i [redovisning.md](file:///c:/docLocal/Lexicon/FE26/grupparbete/redovisning.md).
