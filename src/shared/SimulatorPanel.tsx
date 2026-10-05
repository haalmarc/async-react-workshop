import { useEffect, useState } from "react";
import { api, type Simulator } from "./api";
import { clients } from "./queries";

export function SimulatorPanel() {
  const [settings, setSettings] = useState<Simulator | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const data = await api<Simulator>("/simulator");
        if (active) setSettings(data);
      } catch {
        if (active) setMessage("API-serveren svarer ikke. Start med pnpm dev.");
      }
    }
    void refresh();
    const timer = setInterval(refresh, 1000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function update(patch: Partial<Simulator>) {
    setBusy(true);
    try {
      setSettings(
        await api<Simulator>("/simulator", { method: "PATCH", body: JSON.stringify(patch) }),
      );
      setMessage("Simulatoren er oppdatert.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Feil");
    } finally {
      setBusy(false);
    }
  }
  async function clearCache() {
    setBusy(true);
    try {
      // resetQueries tømmer data og varsler aktive observatører (clear gjør ikke det).
      await Promise.all(
        Object.values(clients).map(async (cache) => {
          await cache.cancelQueries();
          await cache.resetQueries();
        }),
      );
      setMessage("Cache tømt i alle variantene. Aktive data lastes på nytt.");
    } finally {
      setBusy(false);
    }
  }
  async function reset() {
    setBusy(true);
    try {
      await api("/reset", { method: "POST" });
      await clearCache();
      setMessage("Eksempeldata tilbakestilt.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Feil");
    } finally {
      setBusy(false);
    }
  }
  return (
    <aside className="simulator" aria-label="Simulator">
      <div className="simulator-controls">
        <strong>Test ventingen</strong>
        <label>
          API-forsinkelse{" "}
          <select
            aria-label="API-forsinkelse"
            disabled={busy || !settings}
            value={settings?.delayMs ?? 1000}
            onChange={(event) => void update({ delayMs: Number(event.target.value) })}
          >
            <option value={0}>0 sek</option>
            <option value={1000}>1 sek</option>
            <option value={3000}>3 sek</option>
          </select>
        </label>
        <button
          disabled={busy || !settings}
          aria-pressed={settings?.failNextSave ?? false}
          onClick={() => void update({ failNextSave: !settings?.failNextSave })}
        >
          {settings?.failNextSave ? "Neste lagring vil feile ✓" : "La neste lagring feile"}
        </button>
        <button disabled={busy} onClick={() => void clearCache()}>
          Tøm cache
        </button>
        <button disabled={busy} onClick={() => void reset()}>
          Nullstill data
        </button>
      </div>
      <p role="status">
        {message || "Forsinkelse gjelder nye API-kall. Cache kan gjøre et nytt besøk umiddelbart."}
      </p>
    </aside>
  );
}
