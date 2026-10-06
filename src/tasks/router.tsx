import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { sessionsQuery } from "../shared/queries";
import { SessionGrid } from "../shared/SessionGrid";
import { ErrorMessage } from "../shared/ui";

// 🧠 Om du står fast, finner du fasit i ../solution/router.tsx
// Men prøv å løse oppgavene selv først.
// Ta deg tid til å forstå konseptene og lese dokumentasjon.
// Du får mer ut av fasiten om du har noe å sammenligne med.

// ✍️ Oppgave 1: Bruk useTransition for å holde rede på pending for skifte av dag.
// Hint:
// - For ventestatus (som disabled), bytt ut pendingDay med isPending fra useTransition.
// ✅ Ferdig når: Ved 3 s og kald cache vises pending og gammelt program til nytt er klart.
// 📜 https://react.dev/reference/react/useTransition
//
// 💡 Refleksjon: Hva er forskjellen på å wrappe hele changeDay-funksjonen i startTransition versus bare deler?

// ✍️ Oppgave 2: Bruk useOptimistic(day) for å markere valgt dag umiddelbart.
// Oppdater den bare inne i Action. Prøv kald cache og 3 s forsinkelse.
// ✅ Ferdig når: Valgt dag markeres straks, mens URL og program skifter etter lasting.
//
// 💡 Refleksjon: Hva oppdateres straks, og hva venter? Er en transition en animasjon?

// ✍️ Oppgave 3: Animer overgangen ved åpning av sesjon.
// Hint:
// - Bruk viewTransition på SessionGrid-komponenten.
// ✅ Ferdig når: Navigasjon til sesjon og tilbake har en synlig overgang i støttet nettleser.
// 📜 https://reactrouter.com/how-to/view-transitions
//
// 💡 Refleksjon:
// - Hvordan skjer animasjonen, selv uten å definere noe CSS?

// ✍️ Oppgave 4: Legg til overgang for "Praktisk info"-boksen ved bruk av Reacts ViewTransition.
// Hint:
// - Wrap ViewTransition rundt Preview-komponenten.
// - Legg setOpen i startTransition.
// ✅ Ferdig når: Info-boksen animeres inn og ut uten at URL-en endres.
// 📜 https://react.dev/reference/react/ViewTransition
//
// 💡 Refleksjon:
// - Hva er forskjellen på å bruke Reacts ViewTransition versus routerens viewTransition? Hvilken bør du bruke?
// - Hvorfor trenger du startTransition for å få til animasjonen?
// - Hvordan kan du ta hensyn til prefers-reduced-motion når du bruker ViewTransition?

// ✍️ Oppgave 5 (ekstra): Legg til søk i programmet med useDeferredValue.
// Åpen ekstraoppgave uten ferdig fasit.
// Hint:
// - Utvid getSessions og API-et med søk; ta søket med i queryKey. Vis når verdiene er ulike.
// - La input bruke søkeverdien direkte og en Suspense-basert liste bruke den utsatte verdien.
// ✅ Ferdig når: Med 3 s skriver du uten venting; gamle treff vises dempet til nye er klare.
// Listen må til slutt vise treff for den siste teksten, uten fallback-flimmer ved hvert tegn.
// 📜 https://react.dev/reference/react/useDeferredValue
//
// 💡 Refleksjon:
// - Hva er forskjellen på å useTransition og useDeferredValue? Er det noen sammenheng?

export function Schedule() {
  const [params] = useSearchParams();
  const day = params.get("day") === "2" ? "2" : "1";
  const navigate = useNavigate();
  const client = useQueryClient();
  const [pendingDay, setPendingDay] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function changeDay(value: string) {
    setPendingDay(value);
    setError(null);
    try {
      await client.query({ ...sessionsQuery(value), staleTime: "static" });
      await navigate(`?day=${value}`);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Navigasjonen feilet"));
    } finally {
      setPendingDay(null);
    }
  }
  return (
    <>
      <div className="day-picker" aria-label="Konferansedag">
        {["1", "2"].map((value) => (
          <button
            key={value}
            aria-pressed={(pendingDay ?? day) === value}
            disabled={pendingDay !== null}
            onClick={() => void changeDay(value)}
          >
            Dag {value}
          </button>
        ))}
        <span role="status">{pendingDay ? "Henter program …" : ""}</span>
      </div>
      {error && <ErrorMessage error={error} />}
      <div aria-busy={pendingDay !== null} style={{ opacity: pendingDay ? 0.55 : 1 }}>
        <SessionGrid day={day} viewTransition={false} />
      </div>
      <Preview />
    </>
  );
}
function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <section className="preview">
      <button onClick={() => setOpen(!open)}>{open ? "Skjul" : "Vis"} praktisk info</button>
      {open && (
        <p className="info-card">
          Begge dagene starter kl. 09. Kaffe og gode diskusjoner er inkludert.
        </p>
      )}
    </section>
  );
}
