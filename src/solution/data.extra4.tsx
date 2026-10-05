import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { favoriteQuery, sessionQuery } from "../shared/queries";
import { SessionContent } from "../shared/ui";
import { FavoriteButton } from "./design";

// Fasit for oppgave 4a og 4b. Prøv én variant om gangen:
// I ./data.tsx, importer ønsket komponent fra denne filen og bruk den
// i stedet for <SessionPageContent id={id} />. Behold Suspense og feilgrensene.
// Gå til /solution, velg 3 s og tøm cache før du åpner en sesjon.

// 4a: Første hook suspenderer før neste hook nås.
// Med tom cache starter favorittkallet først når sesjonskallet er ferdig: ca. 6 s.
export function WaterfallSessionPageContent({ id }: { id: string }) {
  const session = useSuspenseQuery(sessionQuery(id));
  useSuspenseQuery(favoriteQuery(id));

  return (
    <>
      <SessionContent session={session.data} />
      <FavoriteButton id={id} />
    </>
  );
}

// 4b: Begge kall starter før komponenten suspenderer: ca. 3 s.
export function ParallelSessionPageContent({ id }: { id: string }) {
  const [session] = useSuspenseQueries({
    // Disse funksjonene returnerer query-konfigurasjon med queryKey og queryFn,
    // ikke API-data. Derfor brukes de direkte i queries-lista.
    queries: [sessionQuery(id), favoriteQuery(id)],
  });

  return (
    <>
      <SessionContent session={session.data} />
      <FavoriteButton id={id} />
    </>
  );
}
