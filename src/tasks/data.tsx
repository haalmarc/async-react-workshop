import { useQuery } from '@tanstack/react-query';
import { sessionQuery } from '../shared/queries';
import { ErrorMessage, Loading, SessionContent } from '../shared/ui';

// ✍️ Oppgave 1: Bytt useQuery med useSuspenseQuery. Fjern isPending-grenen.
// Legg Suspense med Loading-fallback rundt komponenten som leser data.
// Hint: Del denne filen i en ytre SessionDetails og en indre DetailsContent.
// ✅ Ferdig når: Kald cache viser fallback, deretter detaljer uten en lokal isPending-gren.
// 📜 https://tanstack.com/query/latest/docs/framework/react/guides/suspense
// 📜 https://react.dev/reference/react/Suspense
//
// ✍️ Oppgave 2: Flytt feilvisningen til ErrorBoundary + QueryErrorResetBoundary.
// Se src/solution/data.tsx når du trenger hjelp med retry-kontrakten.
// ✅ Ferdig når: /tasks/sessions/ukjent viser feil i grensen, med en fungerende retry-knapp.
// Retry gjør et nytt API-kall; en ukjent sesjon skal fortsatt feile.
// 📜 https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary
//
// 🧪 Oppgave 3: Velg 3 s, trykk «Tøm cache», og åpne en sesjon.
// Besøk den igjen uten å tømme cache. Når ser du fallback?
// ✅ Ferdig når: Du har sett fallback med kald cache og umiddelbare detaljer med varm cache.
// 💡 Refleksjon: Hvem eier loading nå? Forsvant tilstanden, eller flyttet den seg?
// 💡 Refleksjon: Hva ville vært annerledes med en async Server Component i Next.js?
//
// ✍️ Oppgave 4 (ekstra): Hent to uavhengige datakilder. Sammenlign to useSuspenseQuery
// Åpen ekstraoppgave uten ferdig fasit.
// i samme komponent med useSuspenseQueries. Hvorfor kan det bli en waterfall?
// Hint: Bruk sessionQuery(id) og favoriteQuery(id), og tøm cache mellom forsøkene.
// ✅ Ferdig når: Nettverkspanelet viser overlappende kall med useSuspenseQueries.
// Med 3 s per kall blir samlet venting omtrent 3 s, i stedet for omtrent 6 s sekvensielt.
// 📜 https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQueries
export function SessionDetails({ id }: { id: string }) {
  const query = useQuery(sessionQuery(id));
  if (query.isPending) return <Loading label="Henter sesjonsdetaljer …" />;
  if (query.isError) return <ErrorMessage error={query.error} retry={() => void query.refetch()} />;
  return <SessionContent session={query.data} />;
}
