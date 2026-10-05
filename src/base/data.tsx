import { useQuery } from "@tanstack/react-query";
import { sessionQuery } from "../shared/queries";
import { ErrorMessage, Loading, SessionContent } from "../shared/ui";

export function SessionDetails({ id }: { id: string }) {
  const query = useQuery(sessionQuery(id));
  if (query.isPending) return <Loading label="Henter sesjonsdetaljer …" />;
  if (query.isError)
    return <ErrorMessage error={query.error} onReset={() => void query.refetch()} />;
  return <SessionContent session={query.data} />;
}
