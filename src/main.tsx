import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Link, Outlet, useLocation, useParams } from "react-router";
import { RouterProvider } from "react-router/dom";
import type { Variant } from "./shared/api";
import { clients } from "./shared/queries";
import { SimulatorPanel } from "./shared/SimulatorPanel";
import * as baseRouter from "./base/router";
import * as taskRouter from "./tasks/router";
import * as solutionRouter from "./solution/router";
import * as baseData from "./base/data";
import * as taskData from "./tasks/data";
import * as solutionData from "./solution/data";
import * as baseDesign from "./base/design";
import * as taskDesign from "./tasks/design";
import * as solutionDesign from "./solution/design";
import * as baseQuestions from "./base/questions";
import * as taskQuestions from "./tasks/questions";
import * as solutionQuestions from "./solution/questions";
import "./styles.css";

const variants = {
  base: {
    label: "Referanse",
    note: "Eksplisitt async-state med TanStack Query",
    ...baseRouter,
    ...baseData,
    ...baseDesign,
    ...baseQuestions,
  },
  tasks: {
    label: "Oppgaver",
    note: "Din kode · velg data, router eller design",
    ...taskRouter,
    ...taskData,
    ...taskDesign,
    ...taskQuestions,
  },
  solution: {
    label: "Fasit",
    note: "Suspense, transitions og Actions i samspill",
    ...solutionRouter,
    ...solutionData,
    ...solutionDesign,
    ...solutionQuestions,
  },
};

function Home() {
  return (
    <main className="home">
      <span className="eyebrow">React 18 + 19 · Praktisk workshop</span>
      <h1>
        Hva skjer
        <br />
        mens vi venter?
      </h1>
      <p className="lead">Samme app. Samme API. Tre måter å utforske async-flyter på.</p>
      <div className="variant-cards">
        {(Object.keys(variants) as Variant[]).map((variant) => (
          <Link key={variant} to={`/${variant}`}>
            <span className="eyebrow">/{variant}</span>
            <h2>{variants[variant].label} ↗</h2>
            <p>{variants[variant].note}</p>
          </Link>
        ))}
      </div>
      <p>
        Start med å prøve referansen. Åpne deretter <code>src/tasks/</code>, velg et spor og gjør
        ett steg av gangen sammen med partneren din.
      </p>
      <p>
        Les <code>README.md</code> for oppgaver og dokumentasjonslenker.
      </p>
    </main>
  );
}
function Layout({ variant }: { variant: Variant }) {
  const location = useLocation();
  const suffix = location.pathname.replace(`/${variant}`, "") + location.search;
  return (
    <QueryClientProvider client={clients[variant]}>
      <header className="app-header">
        <Link to="/" className="brand">
          mellomrom<span>event hub / async react</span>
        </Link>
        <nav aria-label="Appvariant">
          {(Object.keys(variants) as Variant[]).map((value) => (
            <Link
              key={value}
              aria-current={value === variant ? "page" : undefined}
              to={`/${value}${suffix}`}
            >
              {variants[value].label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <div className="page-heading">
          <span className="eyebrow">En liten konferanse om store mellomtilstander</span>
          <h1>
            To dager.
            <br />
            Mange gode spørsmål.
          </h1>
          <p>{variants[variant].note}</p>
        </div>
        <Outlet />
      </main>
      <SimulatorPanel />
    </QueryClientProvider>
  );
}
function Detail({ variant }: { variant: Variant }) {
  const { id = "" } = useParams();
  const { SessionPage } = variants[variant];
  return (
    <>
      <Link className="back-link" to={`/${variant}`} viewTransition={variant !== "base"}>
        ← Til programmet
      </Link>
      <SessionPage key={id} id={id} />
    </>
  );
}
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  ...(Object.keys(variants) as Variant[]).map((variant) => {
    const { Schedule, Questions } = variants[variant];
    return {
      path: `/${variant}`,
      element: <Layout variant={variant} />,
      children: [
        {
          index: true,
          element: (
            <>
              <Schedule />
              <Link className="stretch-link" to="questions">
                Ekstra: spørsmålsskjema →
              </Link>
            </>
          ),
        },
        { path: "sessions/:id", element: <Detail variant={variant} /> },
        {
          path: "questions",
          element: (
            <>
              <Link className="back-link" to={`/${variant}`}>
                ← Til programmet
              </Link>
              <Questions />
            </>
          ),
        },
      ],
    };
  }),
  {
    path: "*",
    element: (
      <main className="home">
        <h1>Siden finnes ikke</h1>
        <Link to="/">Til forsiden</Link>
      </main>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} useTransitions />
  </StrictMode>,
);
