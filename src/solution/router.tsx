import { startTransition, useOptimistic, useState, useTransition, ViewTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { sessionsQuery } from "../shared/queries";
import { SessionGrid } from "../shared/SessionGrid";
import { ErrorMessage } from "../shared/ui";

export function Schedule() {
  const [params] = useSearchParams();
  const day = params.get("day") === "2" ? "2" : "1";
  const navigate = useNavigate();
  const client = useQueryClient();
  const [isPending, startNavigation] = useTransition();
  const [optimisticDay, setOptimisticDay] = useOptimistic(day);
  const [error, setError] = useState<Error | null>(null);
  function changeDay(value: string) {
    startNavigation(async () => {
      setOptimisticDay(value);
      setError(null);
      try {
        // Datalaget laster først, så URL og nytt innhold kan bli klare sammen.
        await client.query({ ...sessionsQuery(value), staleTime: "static" });
        await navigate(`?day=${value}`);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Navigasjonen feilet"));
      }
    });
  }
  return (
    <>
      <div className="day-picker" aria-label="Konferansedag">
        {["1", "2"].map((value) => (
          <button
            key={value}
            aria-pressed={optimisticDay === value}
            disabled={isPending}
            onClick={() => changeDay(value)}
          >
            Dag {value}
          </button>
        ))}
        <span role="status">{isPending ? "Henter program …" : ""}</span>
      </div>
      {error && <ErrorMessage error={error} />}
      <div aria-busy={isPending} style={{ opacity: isPending ? 0.55 : 1 }}>
        <SessionGrid day={day} viewTransition />
      </div>
      <Preview />
    </>
  );
}
function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <section className="preview">
      <button onClick={() => startTransition(() => setOpen(!open))}>
        {open ? "Skjul" : "Vis"} praktisk info
      </button>
      {open && (
        <ViewTransition>
          <p className="info-card">
            Begge dagene starter kl. 09. Kaffe og gode diskusjoner er inkludert.
          </p>
        </ViewTransition>
      )}
    </section>
  );
}
