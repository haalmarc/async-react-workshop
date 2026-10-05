import { QueryClient, queryOptions } from '@tanstack/react-query';
import { getFavorite, getSession, getSessions, getQuestions, type Variant } from './api';

// Egen cache per variant: et besøk i fasiten skal ikke varme opp oppgavevarianten.
export const clients: Record<Variant, QueryClient> = {
  base: createClient(),
  tasks: createClient(),
  solution: createClient(),
};
function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
}
export const sessionsQuery = (day: string) =>
  queryOptions({ queryKey: ['sessions', day], queryFn: () => getSessions(day) });
export const sessionQuery = (id: string) =>
  queryOptions({ queryKey: ['session', id], queryFn: () => getSession(id) });
export const favoriteQuery = (id: string) =>
  queryOptions({ queryKey: ['favorite', id], queryFn: () => getFavorite(id) });
export const questionsQuery = () =>
  queryOptions({ queryKey: ['questions'], queryFn: getQuestions });
