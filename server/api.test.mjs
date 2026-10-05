import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createApiServer } from "./api.mjs";

const server = createApiServer();
let base;
before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
  await request("/simulator", "PATCH", { delayMs: 0 });
});
after(() => new Promise((resolve) => server.close(resolve)));
async function request(path, method = "GET", body) {
  const response = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

test("filtrerer programmet og bevarer favoritter på tvers av API-kall", async () => {
  const day = await request("/sessions?day=2");
  assert.equal(day.status, 200);
  assert.equal(day.data.length, 3);
  assert.ok(day.data.every((session) => session.day === "2"));
  assert.deepEqual((await request("/sessions/cache/favorite", "PUT", { favorite: true })).data, {
    favorite: true,
  });
  assert.deepEqual((await request("/sessions/cache/favorite")).data, { favorite: true });
});
test("neste lagring feiler én gang og endrer ikke bekreftet data", async () => {
  await request("/simulator", "PATCH", { failNextSave: true });
  // Lesinger skal ikke forbruke engangsfeilen.
  await request("/sessions/cache");
  assert.equal((await request("/sessions/cache/favorite", "PUT", { favorite: false })).status, 503);
  assert.deepEqual((await request("/sessions/cache/favorite")).data, { favorite: true });
  assert.equal((await request("/simulator")).data.failNextSave, false);
  assert.equal((await request("/sessions/cache/favorite", "PUT", { favorite: false })).status, 200);
});
test("validerer spørsmål på serveren og nullstiller eksempeldata", async () => {
  assert.equal((await request("/questions", "POST", { text: "Hei" })).status, 400);
  const saved = await request("/questions", "POST", { text: "Hvordan fungerer Suspense?" });
  assert.equal(saved.status, 201);
  assert.equal((await request("/questions")).data.length, 1);
  await request("/reset", "POST");
  assert.deepEqual((await request("/questions")).data, []);
  assert.deepEqual((await request("/sessions/cache/favorite")).data, { favorite: false });
});
test("avviser ugyldig simulatoroppsett og ukjente sesjoner", async () => {
  assert.equal((await request("/simulator", "PATCH", { delayMs: -1 })).status, 400);
  assert.equal((await request("/sessions/finnes-ikke")).status, 404);
});
