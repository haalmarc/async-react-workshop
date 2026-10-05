import { useQuery } from "@tanstack/react-query";
import { sessionQuery } from "../shared/queries";
import { ErrorMessage, Loading, SessionContent } from "../shared/ui";
import { FavoriteButton } from "./design";

// 🧠 Om du står fast, finner du fasit i ../solution/data.tsx
// Men prøv å løse oppgavene selv først.
// Ta deg tid til å forstå konseptene og lese dokumentasjon.
// Du får mer ut av fasiten om du har noe å sammenligne med.
//
// ✍️ Oppgave 1: La Suspense håndtere ventingen på sesjonen.
// Bruk useSuspenseQuery og Loading som fallback i stedet for isPending-grenen.
// Hint:
// - Del SessionPage i en ytre SessionPage og en indre SessionPageContent.
// - Du kan kommentere bort error-handling nå, siden du fikser det i neste oppgave.
// ✅ Ferdig når: Med 3 s forsinkelse og tom cache ser du Loading før sesjonssiden vises.
// 📜 https://tanstack.com/query/latest/docs/framework/react/guides/suspense
// 📜 https://react.dev/reference/react/Suspense
// 💡 Refleksjon:
// - Hvor ble det av isPending? Hvem håndterer ventingen nå?
// - Hvorfor dele komponenten i to?
//
// ✍️ Oppgave 2: La en error boundary håndtere feil i sesjonshentingen.
// Hint: Bruk ErrorBoundary fra ../shared/ui og QueryErrorResetBoundary fra @tanstack/react-query.
// ✅ Ferdig når: /tasks/sessions/ukjent viser én feilmelding med en fungerende retry-knapp.
// Retry gjør et nytt API-kall; en ukjent sesjon skal fortsatt feile.
// 📜 https://tanstack.com/query/latest/docs/framework/react/guides/suspense#resetting-error-boundaries
// 💡 Refleksjon:
// - Hva er forskjellen på ErrorBoundary og QueryErrorResetBoundary?
// - Velg «La neste lagring feile» på en gyldig sesjon og trykk på favorittknappen.
//   Hvordan blir sesjonsdetaljene stående når lagringen feiler?
//
// 🧪 Oppgave 3: Velg 3 s, trykk «Tøm cache», og åpne en sesjon.
// Besøk den igjen uten å tømme cache. Når ser du fallback?
// ✅ Ferdig når: Du har sett fallback med kald cache og umiddelbare detaljer med varm cache.
// 💡 Refleksjon:
// - Hva ville vært annerledes med en async Server Component i Next.js?
//
// ✍️ Oppgave 4 (ekstra): Hent to uavhengige datakilder. Sammenlign to useSuspenseQuery
// Åpen ekstraoppgave uten ferdig fasit.
// i samme komponent med useSuspenseQueries. Hvorfor kan det bli en waterfall?
// Hint: Bruk sessionQuery(id) og favoriteQuery(id), og tøm cache mellom forsøkene.
// ✅ Ferdig når: Nettverkspanelet viser overlappende kall med useSuspenseQueries.
// Med 3 s per kall blir samlet venting omtrent 3 s, i stedet for omtrent 6 s sekvensielt.
// 📜 https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQueries
export function SessionPage({ id }: { id: string }) {
  const query = useQuery(sessionQuery(id));
  if (query.isPending) return <Loading label="Henter sesjonsdetaljer …" />;
  if (query.isError)
    return (
      <ErrorMessage error={query.error} onReset={() => void query.refetch()} />
    );
  return (
    <>
      <SessionContent session={query.data} />
      <FavoriteButton id={id} />
    </>
  );
}
