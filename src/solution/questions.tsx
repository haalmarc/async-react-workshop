import { useActionState, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '../shared/api';
import { questionsQuery } from '../shared/queries';
import { ErrorMessage, Loading } from '../shared/ui';

type Result = { error: string | null; success: boolean };
const initialState: Result = { error: null, success: false };
export function Questions() {
  const client = useQueryClient();
  const query = useQuery(questionsQuery());
  const [text, setText] = useState('');
  const [result, submitAction, isPending] = useActionState(
    async (_previous: Result, data: FormData): Promise<Result> => {
      try {
        await createQuestion(String(data.get('text') ?? ''));
        await client.invalidateQueries(questionsQuery());
        setText('');
        return { error: null, success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : 'Innsendingen feilet',
          success: false,
        };
      }
    },
    initialState,
  );
  // Kontrollert felt beholder teksten ved håndtert feil; vi tømmer kun ved suksess.
  return (
    <section className="questions">
      <h2>Spørsmål til konferansen</h2>
      <p>Ekstraoppgave: skjema og servervalidering.</p>
      <form action={submitAction}>
        <label htmlFor="question">Spørsmålet ditt</label>
        <textarea
          id="question"
          name="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={500}
          required
        />
        <button disabled={isPending}>{isPending ? 'Sender …' : 'Send spørsmål'}</button>
        {result.error && (
          <p className="error" role="alert">
            {result.error}
          </p>
        )}
        {result.success && <p role="status">Spørsmålet er sendt.</p>}
      </form>
      {query.isPending ? (
        <Loading label="Henter spørsmål …" />
      ) : query.isError ? (
        <ErrorMessage error={query.error} retry={() => void query.refetch()} />
      ) : (
        <ul>
          {query.data.map((question) => (
            <li key={question.id}>{question.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
