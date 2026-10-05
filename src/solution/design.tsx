import { useOptimistic, useState, useTransition, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteQuery } from "../shared/queries";
import { saveFavorite } from "../shared/api";
import { ErrorMessage } from "../shared/ui";

export function FavoriteToggle({
  action,
  pressed,
  children,
}: {
  action: () => Promise<void>;
  pressed: boolean;
  children: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <button
        className="favorite"
        aria-pressed={pressed}
        disabled={isPending}
        onClick={() => startTransition(action)}
      >
        {children}
      </button>
      <span role="status">{isPending ? "Lagrer …" : ""}</span>
    </>
  );
}
export function FavoriteButton({ id }: { id: string }) {
  const query = useQuery(favoriteQuery(id));
  if (query.isPending) return <p role="status">Henter favoritt …</p>;
  if (query.isError)
    return <ErrorMessage error={query.error} onReset={() => void query.refetch()} />;
  return <FavoriteControl id={id} favorite={query.data.favorite} />;
}
function FavoriteControl({ id, favorite }: { id: string; favorite: boolean }) {
  const client = useQueryClient();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(favorite);
  const [error, setError] = useState<Error | null>(null);
  async function toggleAction() {
    setError(null);
    setOptimisticFavorite(!favorite);
    try {
      const confirmed = await saveFavorite(id, !favorite);
      // TanStack-cachen er den bekreftede sannheten. Optimisme er lokal i React.
      client.setQueryData(favoriteQuery(id).queryKey, confirmed);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Lagringen feilet"));
    }
  }
  return (
    <div className="favorite-area">
      <FavoriteToggle action={toggleAction} pressed={optimisticFavorite}>
        {optimisticFavorite ? "♥ Favoritt" : "♡ Legg til favoritt"}
      </FavoriteToggle>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}

/*

Er dette en god løsning?

I en ekte app ville jeg valgt mønsteret som passer datalaget, heller enn å bytte ut TanStack-mutasjoner bare for å bruke React-hooks.

Når TanStack Query allerede eier serverdata, er `useMutation` et naturlig standardvalg:

- Mutasjonen håndterer pending og feil.
- Cacheoppdatering eller invalidering holder andre visninger oppdatert.
- Cache-optimisme passer når flere komponenter skal se samme midlertidige verdi.

`useOptimistic` passer godt når optimisme er lokal presentasjon i en komponent. En action-prop kan kapsle inn venting og optimisme, uavhengig av om handlingen bruker TanStack eller vanlig `fetch`.

Direkte PUT er også helt rimelig for en enkel interaksjon. Men `useTransition` erstatter ikke cachehåndtering eller feilhåndtering.

Designsporet starter med direkte PUT og ferdig feilhåndtering; dere legger til venting og lokal optimisme. Fasiten i `src/solution/design.tsx` viser React-mønsteret. Referansen i `src/base/design.tsx` bruker TanStack-mutasjon og optimistisk query-cache. Ekstra refleksjon i oppgaven handler om når de ulike mønstrene passer, ikke om at fasiten alltid er det beste valget i en ekte app.

*/
