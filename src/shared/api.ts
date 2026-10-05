export type Variant = 'base' | 'tasks' | 'solution';
export type Session = {
  id: string;
  day: string;
  time: string;
  title: string;
  speaker: string;
  track: string;
  color: string;
  description: string;
};
export type Favorite = { favorite: boolean };
export type Question = { id: number; text: string };
export type Simulator = { delayMs: number; failNextSave: boolean };

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? 'Forespørselen feilet');
  return data as T;
}

export const getSessions = (day: string) => api<Session[]>(`/sessions?day=${day}`);
export const getSession = (id: string) => api<Session>(`/sessions/${id}`);
export const getFavorite = (id: string) => api<Favorite>(`/sessions/${id}/favorite`);
export const saveFavorite = (id: string, favorite: boolean) =>
  api<Favorite>(`/sessions/${id}/favorite`, { method: 'PUT', body: JSON.stringify({ favorite }) });
export const getQuestions = () => api<Question[]>('/questions');
export const createQuestion = (text: string) =>
  api<Question>('/questions', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
