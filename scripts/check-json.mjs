import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      yield path;
    }
  }
}

const roots = ["schemas", "examples"];
let checked = 0;

for (const root of roots) {
  for await (const path of walk(root)) {
    JSON.parse(await readFile(path, "utf8"));
    checked += 1;
  }
}

console.log(`checked ${checked} JSON file${checked === 1 ? "" : "s"}`);
