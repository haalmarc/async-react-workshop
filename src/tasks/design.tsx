import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteQuery } from "../shared/queries";
import { saveFavorite } from "../shared/api";
import { ErrorMessage } from "../shared/ui";

// 🧠 Fasit: ../solution/design.tsx
//
// ✍️ Oppgave 1: Bruk useTransition til å håndtere ventingen for FavoriteToggle.
// Bytt onClick-propen til action, og kjør handlingen i startTransition.
// Bruk isPending til å deaktivere knappen og vise «Lagrer …».
// Hint: Action må vente på saveFavorite.
// Feilhåndteringen er ferdig: try/catch setter error-state og viser ErrorMessage.
// Behold den når du gjør toggleFavorite til en Action.
// ✅ Ferdig når: Med 3 s viser knappen venting helt til lagringen er ferdig.
// 📜 https://react.dev/reference/react/useTransition#exposing-action-props-from-components
// 💡 Refleksjon: Hvor kommer pending fra her, og hvor kommer den fra i /base?
//
// ✍️ Oppgave 2: Vis det nye hjertet med én gang med useOptimistic.
// Behold query-cachen som bekreftet data, og vis optimistisk state lokalt.
// Hint: Den optimistiske oppdateringen må skje inne i en Action.
// ✅ Ferdig når: Hjertet endres straks, beholder verdien ved suksess og går tilbake ved feil.
// 📜 https://react.dev/reference/react/useOptimistic
//
// 🧪 Oppgave 3: Test med 3 s og «La neste lagring feile». Sammenlign med /base.
// Sjekk at feilmeldingen vises ved feil og fjernes når du prøver å lagre på nytt.
// ✅ Ferdig når: Du har sett venting, bekreftet lagring, rollback og et vellykket nytt forsøk.
// 💡 Refleksjon:
// - Hvor ligger den optimistiske verdien, og hvem håndterer rollback?
// - Hva skjer hvis to komponenter viser favorittstatus for samme sesjon?
// - Hva håndterer React her, og hva må vi fortsatt håndtere selv?
// - useOptimistic tilbakestiller hjertet ved feil. Hvorfor trenger vi fortsatt error-state og try/catch?
//
// 💡 Ekstra: Her brukes setQueryData til å oppdatere TanStack-cachen etter lagring.
// Hvorfor eller hvorfor ikke burde TanStack Query også håndtert optimistisk oppdatering?
// Sammenlign med ../base/design.tsx.
// Er du enig med kommentar under fasit i src/solution/design.tsx?

export function FavoriteToggle({
  onClick,
  pressed,
  children,
}: {
  onClick: () => Promise<void>;
  pressed: boolean;
  children: ReactNode;
}) {
  return (
    <button
      className="favorite"
      aria-pressed={pressed}
      onClick={() => void onClick()}
    >
      {children}
    </button>
  );
}

export function FavoriteButton({ id }: { id: string }) {
  const query = useQuery(favoriteQuery(id));
  if (query.isPending) return <p role="status">Henter favoritt …</p>;
  if (query.isError)
    return (
      <ErrorMessage error={query.error} onReset={() => void query.refetch()} />
    );
  return <FavoriteControl id={id} favorite={query.data.favorite} />;
}

function FavoriteControl({ id, favorite }: { id: string; favorite: boolean }) {
  const client = useQueryClient();
  const [error, setError] = useState<Error | null>(null);
  async function toggleFavorite() {
    setError(null);
    try {
      const confirmed = await saveFavorite(id, !favorite);
      client.setQueryData(favoriteQuery(id).queryKey, confirmed);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Lagringen feilet"));
    }
  }
  return (
    <div className="favorite-area">
      <FavoriteToggle onClick={toggleFavorite} pressed={favorite}>
        {favorite ? "♥ Favoritt" : "♡ Legg til favoritt"}
      </FavoriteToggle>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
