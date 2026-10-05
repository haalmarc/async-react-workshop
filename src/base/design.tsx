import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteQuery } from "../shared/queries";
import { saveFavorite } from "../shared/api";
import { ErrorMessage } from "../shared/ui";

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
