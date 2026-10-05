import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useNavigation, useSearchParams } from "react-router";
import { sessionsQuery } from "../shared/queries";
import { ErrorMessage, Loading, SessionCard } from "../shared/ui";

export function Schedule() {
  const [params] = useSearchParams();
  const day = params.get("day") === "2" ? "2" : "1";
  const navigate = useNavigate();
  const navigation = useNavigation();
  const query = useQuery({
    ...sessionsQuery(day),
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <div className="day-picker" aria-label="Konferansedag">
        {["1", "2"].map((value) => (
          <button
            key={value}
            aria-pressed={day === value}
            onClick={() => void navigate(`?day=${value}`)}
          >
            Dag {value}
          </button>
        ))}
        <span role="status">
          {query.isFetching || navigation.state !== "idle" ? "Henter program …" : ""}
        </span>
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorMessage error={query.error} onReset={() => void query.refetch()} />
      ) : (
        <div
          className="session-grid"
          aria-busy={query.isFetching}
          style={{ opacity: query.isPlaceholderData ? 0.55 : 1 }}
        >
          {query.data.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
      <Preview />
    </>
  );
}
function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <section className="preview">
      <button onClick={() => setOpen(!open)}> {open ? "Skjul" : "Vis"} praktisk info</button>
      {open && (
        <p className="info-card">
          Begge dagene starter kl. 09. Kaffe og gode diskusjoner er inkludert.
        </p>
      )}
    </section>
  );
}
