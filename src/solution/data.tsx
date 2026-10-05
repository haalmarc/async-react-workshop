import { Suspense } from "react";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { sessionQuery } from "../shared/queries";
import { ErrorBoundary, Loading, SessionContent } from "../shared/ui";

export function SessionDetails({ id }: { id: string }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary key={id} onReset={reset}>
          <Suspense fallback={<Loading label="Henter sesjonsdetaljer …" />}>
            <DetailsContent id={id} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
function DetailsContent({ id }: { id: string }) {
  const { data } = useSuspenseQuery(sessionQuery(id));
  return <SessionContent session={data} />;
}
