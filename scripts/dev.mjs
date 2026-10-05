import { spawn } from "node:child_process";

// Start begge prosessene, og stopp begge når én feiler eller Ctrl+C trykkes.
const children = [
  spawn(process.execPath, ["--watch", "server/index.mjs"], { stdio: "inherit" }),
  spawn("pnpm", ["dev:client"], { stdio: "inherit" }),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) child.kill("SIGTERM");
}
for (const child of children) {
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => stop(code ?? 0));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
