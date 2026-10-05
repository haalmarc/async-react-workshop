import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuestion } from "../shared/api";
import { questionsQuery } from "../shared/queries";
import { ErrorMessage, Loading } from "../shared/ui";

export function Questions() {
  const [text, setText] = useState("");
  const client = useQueryClient();
  const query = useQuery(questionsQuery());
  const mutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: async () => {
      setText("");
      await client.invalidateQueries(questionsQuery());
    },
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(text);
  }
  return (
    <section className="questions">
      <h2>Spørsmål til konferansen</h2>
      <p>Ekstraoppgave: skjema og servervalidering.</p>
      <form onSubmit={submit}>
        <label htmlFor="question">Spørsmålet ditt</label>
        <textarea
          id="question"
          name="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={500}
          required
        />
        <button disabled={mutation.isPending}>
          {mutation.isPending ? "Sender …" : "Send spørsmål"}
        </button>
        {mutation.isError && <ErrorMessage error={mutation.error} />}
        {mutation.isSuccess && <p role="status">Spørsmålet er sendt.</p>}
      </form>
      {query.isPending ? (
        <Loading label="Henter spørsmål …" />
      ) : query.isError ? (
        <ErrorMessage error={query.error} onReset={() => void query.refetch()} />
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
