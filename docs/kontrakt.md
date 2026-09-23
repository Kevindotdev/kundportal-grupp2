# 🤝 Gruppkontrakt: Grupp 2

| Information              | Detaljer                                                                                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projekt**              | Webbshoppen – Kundportalen (Fas 2)                                                                                                                                                                                       |
| **Period**               | 21 september 2026 – 13 oktober 2026 (v. 39 – v. 42)                                                                                                                                                                      |
| **Primär kommunikation** | Gruppens egen kanal i Microsoft Teams                                                                                                                                                                                    |
| **Projektstyrning**      | GitHub Projects                                                                                                                                                                                                          |
| **Motto**                | [Skriv ert gemensamma motto här, t.ex. "Lärande och samarbete framför prestige"]                                                                                                                                         |
| **Referenser**           | [PRD.md](file:///c:/docLocal/Lexicon/FE26/grupparbete/PRD.md), [ADR-mall](file:///c:/docLocal/Lexicon/FE26/grupparbete/docs/ADR-mall.md), [Domänordlista](file:///c:/docLocal/Lexicon/FE26/grupparbete/docs/GLOSSARY.md) |

---

## 🕒 1. Tid, närvaro och engagemang

För att skapa ett tryggt och förutsägbart arbetsklimat har vi kommit överens om följande:

- **Vår spikade standup-tid:** Kl. 08:45.
- **Kärntid:** Vi förväntas vara tillgängliga för samarbete, parprogrammering och snabba frågor i teams-kanal Grupp 2 mellan kl. 09:00 och 12:00. Fokus på eget arbete mellan 13:00 och 16:00.
- **Frånvaro och förhinder:** Om någon blir sjuk eller får förhinder ska detta meddelas i gruppens Teams-kanal så fort som möjigt.
- **Ambitionsnivå i gruppen:**
  - Produkten inte intressant, utan vägen dit
  - Vägen är målet
  - Vad har vi för kod-alternativ för arbetet?
- **Öppna frågor:**
  - Andreas: Snabbhet vs. Kontroll (Hur kan man vibe-koda i en struktur)
  - Hannes: Vad är det för skillnad mellan genAI och agentiskAI (webb-chat vs chatt/agent/harness)
  - Hur precis behöver man vara?
  - Kevin: hur kontrollera hallisarna?
- **Individuella mål:**
  - Andreas: att hänga med och att det är tydligt och förstår vad som händer
  - Kevin: testa på agentiskt flöde (kommer testa både/och chatt+agentiskt)
  - Hannes: gå från chatt till agentiskt flöde
  - Mervin: dela med mig/öva på att tydliggöra flödet

## 🛠 2. Agilt arbetssätt och planering

Vi jobbar strukturerat för att behålla överblicken och undvika stress:

- **Sprintar:** Vi rekommenderar sprintar om **[5]** arbetsdagar (veckobaserade).
- **Sprint Planning:** Varje måndag kl. 08:45 går vi gemensamt igenom backloggen och fördelar veckans uppgifter.
- **Issues / Tickets:** Inget arbete påbörjas utan en tillhörande Issue på GitHub. Varje Issue ska ha en tydlig beskrivning kopplad till [PRD.md](file:///c:/docLocal/Lexicon/FE26/grupparbete/PRD.md) samt en "Definition of Done".
- **Projektbräde:** Vi använder **GitHub Projects** och uppdaterar kolumnerna (_To Do_, _In Progress_, _In Review_, _Done_) i realtid.
- **Roterande Sprint Lead (Scrum Master):** För att dela på ansvaret och ge alla erfarenhet av agilt ledarskap roterar vi rollen som _Sprint Lead_ varje vecka. Sprint Lead öppnar mötena, håller koll på klockan (max 15 min standup) och ser till att GitHub Projects är uppdaterat:
  - **Vecka 39 (Sprint 1 – Uppstart och PRD):** `Mervin`
  - **Vecka 40 (Sprint 2 – MVP-utveckling):** `Andreas`
  - **Vecka 41 (Sprint 3 – Moduler och förfining):** `Hannes`
  - **Vecka 42 (Sprint 4 – Slutleverans och demo):** `Kevin`

---

## 🤖 3. AI-policy och kodkultur

Hur vi använder AI-verktyg på ett sätt som gynnar hela gruppens lärande:

- **Inriktning för AI-användning:**
  - [ ] **Rådgivande:** Som ett bollplank med Matt Pococks skills (grilling)
  - [ ] **Skapa spec:** Som en skribent av våra Spec med Matt Pococks skill (to-spec)
  - [ ] **Skapa tickets:** Som en skribent av våra Tickets med Matt Pococks skill (to-tickets)
  - [ ] **Generativ med full förståelse:** för att generera vertikala slices/seams av våra färdiga issues.
  - [ ] **Code review:** för att generera vertikala slices/seams av våra färdiga issues med Mat Pockocks skill (code-review).

- **Skydd mot "AI-dumping":**
  - Ingen teammedlem får checka in stora AI-genererade kodsjok eller ändra applikationens grundarkitektur utan att först ha förankrat det med gruppen.
  - Den som pushar kod ska kunna förklara sin _avsikt_ i teamet på begäran.
- **Code Reviews:** Innan en Pull Request (PR) mergas till `main` ska minst _en_ annan teammedlem aktivt granska och godkänna koden.
- **Kunskapsdelning (60-minutersregeln):** Om någon kör fast i mer än **[60]** minuter ber man om hjälp i gruppens Teams-kanal eller startar en parprogrammeringssession.

---

## 🌿 4. Git-strategi, säkerhet och miljövariabler

För att undvika trasig kod och läckta lösenord:

- **Branching:** Vi skapar alltid nya feature-branches från `main`.
- **Namnstandard:** `feature/[issue-nr]-[kort-beskrivning]` (t.ex. `feature/12-search-filter`).
- **Pull Request (PR) och merge-flöde (branschstandard):**
  1. **Skapa PR:** När en feature är klar skapar författaren en PR mot `main` och länkar till relaterad issue.
  2. **Code Review och approval:** En annan teammedlem måste granska koden och ge ett formellt **Approve** på GitHub. Ingen mergar sin egen PR utan godkännande.
  3. **Vem som mergar:** Det är valfritt vem som klickar på **Merge pull request** när koden är godkänd, eftersom den som har skrivit koden och den som har godkänt den ansvarar för att koden landar säkert i `main`.
- **Merge i par vid större arkitekturändringar:** Om en PR innehåller större arkitekturskiften, till exempel byte av databas, mergar vi **aldrig ensamma**. Vi öppnar gruppens Teams-kanal och löser konflikten tillsammans via delad skärm.
- **Inga force pushes:** Vi gör aldrig `git push --force` till delade branches.
- **Säkerhet och miljövariabler (`.env.local`):**
  - Vi pushar **aldrig** `.env.local` eller hemliga API-nycklar (t.ex. Clerk, Supabase, Stripe) till GitHub.
  - Den som lägger till en ny miljövariabel ansvarar för att uppdatera `.env.example` i repot och meddela gruppen i vår Teams-kanal.
- **Frekventa commits:** Vi pushar vår kod ofta (minst en gång per arbetsdag) i små, hanterbara PR:ar.

Att lägga till (hur tester körs):

- CI
- ...

---

## 💬 5. Kommunikation och eskaleringsplan (om någon tystnar)

Vi lovar att bemöta varandra professionellt och schysst:

- **Feedback:** Vi ger konstruktiv feedback på koden, aldrig på person.
- **Beslut:** Vi strävar efter konsensus. Vid oenighet röstar vi, och vid dött lopp rådfrågar vi läraren.
- 30–45 min efter utebliven standup Teamet skickar ett personligt DM i Teams för att stämma av läget.

---

## ✍️ Underskrifter och bekräftelse

Genom att skriva under/bekräfta godkänner vi att arbeta enligt detta kontrakt:

- **Medlem 1:** Mervin – 2026-09-21
- **Medlem 2:** Kevin – 2026-09-21
- **Medlem 3:** Andreas – 2026-09-22
- **Medlem 4:** Hannes – 2026-09-22

---

_Detta kontrakt är ett levande dokument och kan revideras vid gruppens sprint-retrospectives om hela teamet är enigt._
