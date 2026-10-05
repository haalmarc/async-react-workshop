import { Component, type ReactNode } from "react";
import { Link } from "react-router";
import type { Session } from "./api";

export function Loading({ label = "Henter sesjoner …" }: { label?: string }) {
  return (
    <div className="loading" role="status">
      <div className="skeleton" />
      <div className="skeleton short" />
      <p>{label}</p>
    </div>
  );
}
export function ErrorMessage({ error, onReset }: { error: Error; onReset?: () => void }) {
  return (
    <div className="error" role="alert">
      <p>{error.message}</p>
      {onReset && <button onClick={onReset}>Prøv igjen</button>}
    </div>
  );
}
export class ErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <ErrorMessage
        error={this.state.error}
        onReset={() => {
          this.props.onReset();
          this.setState({ error: null });
        }}
      />
    ) : (
      this.props.children
    );
  }
}
export function SessionCard({
  session,
  viewTransition = false,
}: {
  session: Session;
  viewTransition?: boolean;
}) {
  return (
    <Link
      className={`session-card ${session.color}`}
      to={`sessions/${session.id}`}
      viewTransition={viewTransition}
    >
      <span className="card-top">
        <span>{session.track}</span>
        <span>{session.time}</span>
      </span>
      <h3>{session.title}</h3>
      <span className="speaker">
        {session.speaker} <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
export function SessionContent({ session }: { session: Session }) {
  return (
    <article className="session-detail">
      <span className="eyebrow">
        Dag {session.day} · {session.time} · {session.track}
      </span>
      <h2>{session.title}</h2>
      <p className="speaker">Med {session.speaker}</p>
      <p>{session.description}</p>
    </article>
  );
}
