# Workshop i Async React

I denne workshopen lærer du om **Async React**. Async React er en samlebetegnelse på funksjoner i React som gjør rammeverket bedre i stand til å forstå, koordinere og vise asynkront arbeid – for eksempel datahenting, navigasjon, skjema-innsending og andre operasjoner som tar tid.

Async React erstatter det å manuelt sette loading og error-tilstander. Du bruker heller funksjoner som useOptimistic og Action-mønsteret, Suspense og use(), samt useOptimistic.

Målet for workshopen er å forstå hva Async React er og hvordan du bruker det. Etter workshopen har du forhåpentligvis en følelse av hvordan disse funksjonene og mønstrene føles å bruke versus tradisjonell, eksplisitt setting av tilstander for asynkront arbeid.

## Komme i gang

Workshopen er delt inn i tre deler:

- tasks: oppgaver, hvor du starter fra TanStack Query og React Router med "tradisjonell" kode, og så har oppgaver å skrive deg mot bruk av async React-kode.
- base: likt som start, så du har noe å sammenligne mot
- solution: "fasit". Dit du vil jobbe deg mot.

**Tasks** er igjen delt i tre, tilsvarende hvordan du kan dele opp områder for Async React: data, design og router.

Du kan velge hvor du vil begynne.

## Oppsett før workshopen

Installer:

- **Node.js 22.22 eller nyere**, gjerne Node 24 LTS.
- **pnpm 10:** `npm install --global pnpm@10`.

Kjør i workshopmappen:

```sh
pnpm install
pnpm dev
```

Åpne **http://127.0.0.1:5173**. Kommandoen starter frontend og en lokal Node-server; ingen databaseoppsett eller API-nøkler trengs. Stopp med Ctrl+C.

For format on save i VS Code/Cursor: installer prosjektets anbefalte [Oxc-utvidelse](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode). Prosjektinnstillingene bruker samme formatterer og regler som `pnpm format`.

## Slik jobber dere

1. **Jobb i par.** Prøv `/base` med tre sekunders forsinkelse i simulatorpanelet.
2. Åpne `/tasks` og velg et spor fra tabellen under. Sporene kan startes uavhengig av hverandre.
3. Følg oppgavekommentarene i filen, ett steg av gangen. Prøv resultatet og diskuter det før dere fortsetter.
4. Bruk fasiten ved behov, og gå gjerne videre til flere spor. Dere trenger ikke rekke alt.

| Adresse     | Innhold                                   | Kode            |
| ----------- | ----------------------------------------- | --------------- |
| `/base`     | Referanse med eksplisitt async-håndtering | `src/base/`     |
| `/tasks`    | Fungerende startkode dere endrer          | `src/tasks/`    |
| `/solution` | Fasit                                     | `src/solution/` |

Navigasjonen øverst bytter mellom base, tasks og solution på samme side. Hovedoppgavenes fasit ligger i filen med samme navn under `src/solution/`. Felles UI og API-funksjoner ligger i `src/shared/`.

### Velg spor

| Spor       | Oppgavefil                         | Innhold                                                    |
| ---------- | ---------------------------------- | ---------------------------------------------------------- |
| **Data**   | [data.tsx](src/tasks/data.tsx)     | Suspense, error boundaries og cache                        |
| **Router** | [router.tsx](src/tasks/router.tsx) | Transitions, optimistisk oppdatering og View Transition    |
| **Design** | [design.tsx](src/tasks/design.tsx) | Action-prop, pending, optimistiske oppdatering og rollback |

Routersporet har ferdig Suspense-støtte i programlisten, så det krever ikke at datasporet er løst først. Stegene innenfor hvert spor bygger på hverandre.

Oppgavene-typene er merket med emoji **✍️ kodeendring**, **🧪 utprøving**, **💡 refleksjon**, **📜 dokumentasjon** og **✅ ferdig når**.

## Debuggings-panel

Til hjelp vises et debuggings-panel hvor du kan velge **0/1/3 s forsinkelse**, **la neste lagring feile**, **tømme cache** eller **nullstille data**. Engangsfeilen fremprovoserer feil ved favoritter og spørsmål. For å fremprovosere lesefeil, åpne `/tasks/sessions/ukjent`.

base, tasks og solutin deler API og serverdata, men har hver sin query-cache. Bruk «Tøm cache» hvis data er gamle eller ventingen uteblir. Nullstilling av data og omstart av serveren fjerner favoritter og spørsmål. Vent til pågående lagring er ferdig før dere nullstiller.

## Kommandoer

```sh
pnpm check         # TypeScript
pnpm format        # formater filer
pnpm format:check  # sjekk formatering
pnpm build         # produksjonsbygg
pnpm test          # API-tester
```

For nettlesertester: stopp `pnpm dev`, kjør `pnpm exec playwright install chromium`, deretter `pnpm test:e2e`. Testene starter appen selv. GitHub Actions kjører sjekkene ved push og PR.

**Problemer?** Appen trenger ledige porter 5173 og 3001. Manglende animasjon kan skyldes nettleserstøtte eller innstillingen for redusert bevegelse.

## Inspirasjon og lisens

Workshop-fasiten er av Aurora Scharffs [Event Hub](https://github.com/aurorascharff/next16-event-hub) og [Designing the in-between states with Async React](https://www.youtube.com/watch?v=QljQDwAwA2Y). Denne workshopen bruker TanStack Query og React Router (til forskjell fra Next.js fra videoen).

[MIT-lisens](LICENSE). Bruk og tilpass gjerne! Hvis du holder workshopen eller gjør nyttige justeringer, blir jeg glad for å høre om det — opprett gjerne en issue.
