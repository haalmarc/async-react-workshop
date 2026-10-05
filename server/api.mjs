import { createServer } from "node:http";
import { setTimeout as delay } from "node:timers/promises";
import { createDatabase, sessions } from "./data.mjs";

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("For stor forespørsel");
  }
  return JSON.parse(body || "{}");
}

export function createApiServer() {
  const db = createDatabase();
  const simulator = { delayMs: 1000, failNextSave: false };

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const method = request.method;
    const send = (status, data) => {
      response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(JSON.stringify(data));
    };

    try {
      // Administrasjon er umiddelbar; forsinkelsen gjelder bare appens data-API.
      if (url.pathname === "/api/simulator") {
        if (method === "PATCH") {
          const patch = await readJson(request);
          if (patch.delayMs !== undefined) {
            if (![0, 1000, 3000].includes(patch.delayMs))
              return send(400, { message: "Ugyldig forsinkelse" });
            simulator.delayMs = patch.delayMs;
          }
          if (typeof patch.failNextSave === "boolean") simulator.failNextSave = patch.failNextSave;
        } else if (method !== "GET") return send(405, { message: "Metoden støttes ikke" });
        return send(200, simulator);
      }
      if (url.pathname === "/api/reset" && method === "POST") {
        db.favorites.clear();
        db.questions.length = 0;
        db.nextQuestionId = 1;
        simulator.failNextSave = false;
        return send(200, { ok: true });
      }

      const isSave = method === "PUT" || method === "POST";
      // Reserver feilen før await: «neste» betyr neste forespørsel som ankommer.
      const shouldFail = isSave && simulator.failNextSave;
      if (shouldFail) simulator.failNextSave = false;
      await delay(simulator.delayMs);
      if (shouldFail)
        return send(503, { message: "Simulert feil: endringen ble ikke lagret. Prøv igjen." });

      if (url.pathname === "/api/sessions" && method === "GET") {
        return send(
          200,
          sessions.filter((session) => session.day === (url.searchParams.get("day") ?? "1")),
        );
      }
      const match = url.pathname.match(/^\/api\/sessions\/([^/]+)(\/favorite)?$/);
      if (match) {
        const session = sessions.find((item) => item.id === match[1]);
        if (!session) return send(404, { message: "Sesjonen finnes ikke" });
        if (!match[2] && method === "GET") return send(200, session);
        if (match[2] && method === "GET")
          return send(200, { favorite: db.favorites.has(session.id) });
        if (match[2] && method === "PUT") {
          const { favorite } = await readJson(request);
          if (typeof favorite !== "boolean")
            return send(400, { message: "favorite må være en boolean" });
          if (favorite) db.favorites.add(session.id);
          else db.favorites.delete(session.id);
          return send(200, { favorite });
        }
      }
      if (url.pathname === "/api/questions") {
        if (method === "GET") return send(200, db.questions);
        if (method === "POST") {
          const { text } = await readJson(request);
          if (typeof text !== "string" || text.trim().length < 5)
            return send(400, { message: "Spørsmålet må ha minst fem tegn." });
          if (text.length > 500) return send(400, { message: "Spørsmålet kan ha maks 500 tegn." });
          const question = { id: db.nextQuestionId++, text: text.trim() };
          db.questions.push(question);
          return send(201, question);
        }
      }
      send(404, { message: "Ukjent API-endepunkt" });
    } catch (error) {
      send(400, { message: error instanceof Error ? error.message : "Ugyldig forespørsel" });
    }
  });
}
