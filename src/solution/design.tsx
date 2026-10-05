import { startTransition, useOptimistic, useState, useTransition, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteQuery } from "../shared/queries";
import { saveFavorite } from "../shared/api";
import { ErrorMessage } from "../shared/ui";

export function ActionButton({
  action,
  pressed,
  children,
}: {
  action: () => Promise<void>;
  pressed: boolean;
  children: ReactNode;
}) {
  const [isPending, startAction] = useTransition();
  return (
    <>
      <button
        className="favorite"
        aria-pressed={pressed}
        disabled={isPending}
        onClick={() => startAction(action)}
      >
        {children}
      </button>
      <span role="status">{isPending ? "Lagrer …" : ""}</span>
    </>
  );
}
export function FavoriteButton({ id }: { id: string }) {
  const query = useQuery(favoriteQuery(id));
  if (query.isPending) return <p role="status">Henter favoritt …</p>;
  if (query.isError)
    return <ErrorMessage error={query.error} onReset={() => void query.refetch()} />;
  return <FavoriteControl id={id} favorite={query.data.favorite} />;
}
function FavoriteControl({ id, favorite }: { id: string; favorite: boolean }) {
  const client = useQueryClient();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(favorite);
  const [error, setError] = useState<Error | null>(null);
  async function toggleAction() {
    setError(null);
    setOptimisticFavorite(!favorite);
    try {
      const confirmed = await saveFavorite(id, !favorite);
      // TanStack-cachen er den bekreftede sannheten. Optimisme er lokal i React.
      startTransition(() => {
        client.setQueryData(favoriteQuery(id).queryKey, confirmed);
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Lagringen feilet"));
    }
  }
  return (
    <div className="favorite-area">
      <ActionButton action={toggleAction} pressed={optimisticFavorite}>
        {optimisticFavorite ? "♥ Favoritt" : "♡ Legg til favoritt"}
      </ActionButton>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
