import { readFile } from "node:fs/promises";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const states = JSON.parse(await readFile("contract/check-states.json", "utf8"));
const events = JSON.parse(await readFile("contract/webhook-events.json", "utf8"));
if (pkg.version === "0.0.0" || pkg.version !== states.contractVersion || pkg.version !== events.contractVersion) {
  throw new Error("package and contract versions must match and must not be 0.0.0");
}
const readme = await readFile("README.md", "utf8");
if (!readme.includes('`check_run.name` is exactly `Veripsa`')) throw new Error("README must lock check_run.name");
if (!readme.includes('`check_run.output.title`')) throw new Error("README must separate output.title from name");
if (readme.includes("check-run name prefix `Veripsa — `")) throw new Error("stale name/title wording returned");
const heading = states.states.find(s => s.token === "Heading to");
if (!heading || heading.conclusion !== "success") throw new Error("Heading to must remain success");

const types = await readFile("types/index.d.ts", "utf8");
if (!types.includes("VeripsaOpaqueLowercaseHex12")) throw new Error("ACK marker token must be branded as validated 12-lowercase-hex");
if (types.includes("veripsa-ack-snap:${string}")) throw new Error("ACK marker type must not accept arbitrary strings");

const expectedEvents = ["pull_request","push","repository","check_suite","check_run","merge_group","installation","installation_repositories"];
if (JSON.stringify(events.events.map(e=>e.event)) !== JSON.stringify(expectedEvents)) throw new Error("event manifest drift");
console.log("contract invariants verified");
