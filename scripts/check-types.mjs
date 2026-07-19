import { spawnSync } from "node:child_process";
const run = spawnSync("tsc", ["-p", "tsconfig.json", "--noEmit"], { stdio: "inherit", shell: process.platform === "win32" });
if (run.error?.code === "ENOENT") {
  console.error("TypeScript compiler not found. Install TypeScript 5.x before running check:types.");
  process.exit(1);
}
process.exit(run.status ?? 1);
