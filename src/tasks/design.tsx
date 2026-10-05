import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteQuery } from "../shared/queries";
import { saveFavorite } from "../shared/api";
import { ErrorMessage } from "../shared/ui";

// 🧠 Om du står fast, finner du fasit i ../solution/design.tsx
// Men prøv å løse oppgavene selv først.
// Ta deg tid til å forstå konseptene og lese dokumentasjon.
// Du får mer ut av fasiten om du har noe å sammenligne med.
//
// ✍️ Oppgave 1: Lag en ActionButton i denne filen som tar action: () => Promise<void>.
// Den bruker useTransition, starter action i startTransition og viser isPending.
// Bruk knappen her. Behold foreløpig TanStack-mutasjonen (mutateAsync).
// ✅ Ferdig når: Knappen viser «Lagrer …» og er deaktivert til hele Action er ferdig.
// 📜 https://react.dev/reference/react/useTransition#exposing-action-props-from-components
//
// ✍️ Oppgave 2: Bruk useOptimistic(query.data.favorite) for umiddelbar feedback.
// Fjern onMutate/onError-rollback og useMutation. I Action: sett optimistisk verdi,
// await saveFavorite, og skriv bekreftet resultat til query-cachen i startTransition.
// Etter await trenger React fortsatt en ny startTransition rundt state-oppdateringen.
// Catch feilen og vis den; en fullført Action slipper den optimistiske tilstanden.
// ✅ Ferdig når: Hjertet endres straks og beholder verdien etter bekreftet lagring.
// Ved feil går det tilbake og viser feilmelding, uten cachebasert onMutate-rollback.
// 📜 https://react.dev/reference/react/useOptimistic
// 📜 https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition
//
// 🧪 Oppgave 3: Sett 3 s. Lagre først med suksess. Velg så «La neste lagring feile».
// Hva vises rett etter klikket, under venting og etter svaret i begge tilfeller?
// ✅ Ferdig når: Du har sett bekreftelse ved suksess og rollback med feilmelding ved feil.
// 💡 Refleksjon: Hva er optimistisk state, og hva er den bekreftede sannheten?
// Sammenlign med /base. Er rollback enklere å forstå i koden? For brukeren?
//
// 🧪 Oppgave 4 (ekstra): Prøv raske gjentatte klikk. Vi deaktiverer knappen under lagring.
// Hva må endres hvis produktet krever flere samtidige handlinger?
// En transition er ikke automatisk en kø for nettverksforespørsler.
// ✅ Ferdig når: Du har sett at nye klikk blokkeres under lagring, og kan forklare hvorfor.
export function FavoriteButton({ id }: { id: string }) {
  const client = useQueryClient();
  const query = useQuery(favoriteQuery(id));
  const mutation = useMutation({
    mutationFn: (favorite: boolean) => saveFavorite(id, favorite),
    onMutate: async (favorite) => {
      await client.cancelQueries(favoriteQuery(id));
      const previous = client.getQueryData(favoriteQuery(id).queryKey);
      client.setQueryData(favoriteQuery(id).queryKey, { favorite });
      return { previous };
    },
    onError: (_error, _favorite, context) => {
      if (context?.previous) client.setQueryData(favoriteQuery(id).queryKey, context.previous);
    },
    onSuccess: (data) => client.setQueryData(favoriteQuery(id).queryKey, data),
  });
  if (query.isPending) return <p role="status">Henter favoritt …</p>;
  if (query.isError)
    return <ErrorMessage error={query.error} onReset={() => void query.refetch()} />;
  return (
    <div className="favorite-area">
      <button
        className="favorite"
        aria-pressed={query.data.favorite}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(!query.data.favorite)}
      >
        {query.data.favorite ? "♥ Favoritt" : "♡ Legg til favoritt"}
      </button>
      <span role="status">{mutation.isPending ? "Lagrer …" : ""}</span>
      {mutation.isError && <ErrorMessage error={mutation.error} />}
    </div>
  );
}
