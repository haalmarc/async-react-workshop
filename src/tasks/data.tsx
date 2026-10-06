import { useQuery } from "@tanstack/react-query";
import { sessionQuery } from "../shared/queries";
import { ErrorMessage, Loading, SessionContent } from "../shared/ui";
import { FavoriteButton } from "./design";

// 🧠 Om du står fast, finner du fasit i ../solution/data.tsx
// Men prøv å løse oppgavene selv først.
// Ta deg tid til å forstå konseptene og lese dokumentasjon.
// Du får mer ut av fasiten om du har noe å sammenligne med.

// ✍️ Oppgave 1: La Suspense håndtere ventingen på sesjonen.
// Bruk useSuspenseQuery og Loading som fallback i stedet for isPending-grenen.
// Hint:
// - Del SessionPage i en ytre SessionPage og en indre SessionPageContent.
// - Du kan kommentere bort error-handling nå, siden du fikser det i neste oppgave.
// ✅ Ferdig når: Med 3 s forsinkelse og tom cache ser du Loading før sesjonssiden vises.
// 📜 https://tanstack.com/query/latest/docs/framework/react/guides/suspense
// 📜 https://react.dev/reference/react/Suspense
//
// 💡 Refleksjon:
// - Hvor ble det av isPending? Hvem håndterer ventingen nå?
// - Hvorfor dele komponenten i to?

// ✍️ Oppgave 2: La en error boundary håndtere feil i sesjonshentingen.
// Hint: Bruk ErrorBoundary fra ../shared/ui og QueryErrorResetBoundary fra @tanstack/react-query.
// ✅ Ferdig når: /tasks/sessions/ukjent viser én feilmelding med en fungerende retry-knapp.
// Retry gjør et nytt API-kall; en ukjent sesjon skal fortsatt feile.
// 📜 https://tanstack.com/query/latest/docs/framework/react/guides/suspense#resetting-error-boundaries
//
// 💡 Refleksjon:
// - Hva er forskjellen på ErrorBoundary og QueryErrorResetBoundary?
// - Velg «La neste lagring feile» på en gyldig sesjon og trykk på favorittknappen.
//   Hvordan blir sesjonsdetaljene stående når lagringen feiler?

// 🧪 Oppgave 3: Velg 3 s, trykk «Tøm cache», og åpne en sesjon.
// Besøk den igjen uten å tømme cache. Når ser du fallback?
// ✅ Ferdig når: Du har sett fallback med kald cache og umiddelbare detaljer med varm cache.
//
// 💡 Refleksjon:
// - Hva ville vært annerledes med en async Server Component i Next.js?

// ✍️ Oppgave 4a (ekstra): Fremprovoser en request waterfall.
// 🧠 Fasit for 4a og 4b: ../solution/data.extra4.tsx
// I SessionPageContent: behold sessionQuery(id), og legg til
// `const unusedQuery = useSuspenseQuery(favoriteQuery(id));` (fra ../shared/queries),
// for å gjøre et ekstra kall.
// Du trenger ikke endre visningen.

// Gå til programlisten, i debug-panelet velg 3 s og trykk «Tøm cache». Åpne deretter en sesjon.
// Se på de to API-kallene i Network-panelet. Innholdet bruker omtrent 6 s på å vises.
// ✅ Ferdig når: Du ser at kallene går etter hverandre, ikke samtidig. Dette kalles en waterfall.
// 📜 https://tanstack.com/query/v5/docs/framework/react/guides/request-waterfalls
//
// 💡 Refleksjon: Hva er realistiske scenarier der en request waterfall kan oppstå?

// ✍️ Oppgave 4b (ekstra): Fiks request waterfall med parallell henting.
// Bytt de to useSuspenseQuery-kallene med useSuspenseQueries.
// Gå tilbake til programlisten, tøm cache og åpne sesjonen igjen med 3 s forsinkelse.
// ✅ Ferdig når: Kallene overlapper i Network-panelet, og innholdet vises etter omtrent 3 s.
//
// 💡 Refleksjon: Hva ville vært annerledes om det andre kallet trengte data fra det første?
// 📜 https://tanstack.com/query/v5/docs/framework/react/reference/functions/useSuspenseQueries
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
