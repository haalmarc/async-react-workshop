import { useQuery } from "@tanstack/react-query";
import { sessionQuery } from "../shared/queries";
import { ErrorMessage, Loading, SessionContent } from "../shared/ui";
import { FavoriteButton } from "./design";

export function SessionPage({ id }: { id: string }) {
  const query = useQuery(sessionQuery(id));
  if (query.isPending) return <Loading label="Henter sesjonsdetaljer …" />;
  if (query.isError)
    return <ErrorMessage error={query.error} onReset={() => void query.refetch()} />;
  return (
    <>
      <SessionContent session={query.data} />
      <FavoriteButton id={id} />
    </>
  );
}
