# Async React: hva skjer mens vi venter?

Du klikker på neste dag eller lagrer en favoritt. Serveren bruker tre sekunder. Hva skal appen vise i mellomtiden — og hvem skal koordinere det?

Her prøver dere React 18- og 19-funksjoner som Suspense, transitions, Actions og optimistiske oppdateringer. Dere endrer en fungerende konferanseapp og sammenligner med eksplisitt async-håndtering i TanStack Query. Målet er å forstå hva React overtar, og hva dere fortsatt må løse selv.

## Oppsett før workshopen

Du bør kjenne React-hooks og TanStack Query med `isPending`, `isError` og `data`.

Installer:

- **Node.js 22.22 eller nyere**, gjerne Node 24 LTS.
- **pnpm 10:** `npm install --global pnpm@10`.
- En editor og en oppdatert nettleser. Chrome eller Edge anbefales for animasjonsoppgavene.

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

Navigasjonen øverst bytter variant på samme side. Hovedoppgavenes fasit ligger i filen med samme navn under `src/solution/`. Felles UI og API-funksjoner ligger i `src/shared/`.

### Velg spor

| Spor       | Oppgavefil                         | Innhold                                                              |
| ---------- | ---------------------------------- | -------------------------------------------------------------------- |
| **Data**   | [data.tsx](src/tasks/data.tsx)     | Suspense, feilgrenser og kald/varm cache i sesjonsdetaljene          |
| **Router** | [router.tsx](src/tasks/router.tsx) | Transitions, optimistisk dagvalg og to View Transition-integrasjoner |
| **Design** | [design.tsx](src/tasks/design.tsx) | Action-prop, pending, optimistiske favoritter og rollback            |

Routersporet har ferdig Suspense-støtte i programlisten, så det krever ikke at datasporet er løst først. Stegene innenfor hvert spor bygger på hverandre.

**Ekstra:** [Spørsmålsskjema med `useActionState`](src/tasks/questions.tsx) har fasit. Parallelle spørringer og søk med `useDeferredValue` er åpne ekstraoppgaver uten ferdig fasit.

Oppgavene bruker **✍️ kodeendring**, **🧪 utprøving**, **💡 refleksjon**, **📜 dokumentasjon** og **✅ ferdig når**.

## Simulatoren

Panelet nederst lar dere velge **0/1/3 s forsinkelse**, **la neste lagring feile**, **tømme cache** eller **nullstille data**. Engangsfeilen fremprovoserer feil ved favoritter og spørsmål. For å fremprovosere lesefeil, åpne `/tasks/sessions/ukjent`.

Variantene deler API og serverdata, men har hver sin query-cache. Bruk «Tøm cache» hvis data er gamle eller ventingen uteblir. Nullstilling av data og omstart av serveren fjerner favoritter og spørsmål. Vent til pågående lagring er ferdig før dere nullstiller.

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

Inspirert av Aurora Scharffs [Event Hub](https://github.com/aurorascharff/next16-event-hub) og [Designing the in-between states with Async React](https://www.youtube.com/watch?v=QljQDwAwA2Y). Denne workshopen bruker TanStack Query og React Router (til forskjell fra Next.js).

[MIT-lisens](LICENSE). Bruk og tilpass gjerne! Hvis du holder workshopen eller gjør nyttige justeringer, blir jeg glad for å høre om det — opprett gjerne en issue.
