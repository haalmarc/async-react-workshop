import { Suspense } from "react";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { sessionsQuery } from "./queries";
import { ErrorBoundary, Loading, SessionCard } from "./ui";

// Ferdig datastøtte for routersporet. Datasporet endrer sesjonsdetaljene i stedet.
export function SessionGrid({
  day,
  viewTransition = false,
}: {
  day: string;
  viewTransition?: boolean;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset}>
          <Suspense fallback={<Loading />}>
            <GridContent day={day} viewTransition={viewTransition} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
function GridContent({ day, viewTransition }: { day: string; viewTransition: boolean }) {
  const { data } = useSuspenseQuery(sessionsQuery(day));
  return (
    <div className="session-grid">
      {data.map((session) => (
        <SessionCard key={session.id} session={session} viewTransition={viewTransition} />
      ))}
    </div>
  );
}
