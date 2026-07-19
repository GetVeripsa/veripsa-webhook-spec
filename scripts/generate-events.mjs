import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const checkOnly = process.argv.includes("--check");
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(resolve(root, "contract/webhook-events.json"), "utf8"));
const fieldSchemas = {
  action: { type: "string", minLength: 1 },
  installationId: { type: "integer", minimum: 1 },
  repositoryFullName: { type: "string", pattern: "^[^/\\s]+/[^/\\s]+$" },
  prNumber: { type: "integer", minimum: 1 },
  headSha: { type: "string", pattern: "^[0-9a-f]{40}$" },
  baseRef: { type: "string", minLength: 1 },
  branchRef: { type: "string", minLength: 1 },
  accountLogin: { type: "string", minLength: 1 },
  accountType: { enum: ["User", "Organization"] },
  repositoriesAdded: { type: "array", uniqueItems: true, items: { type: "string", pattern: "^[^/\\s]+/[^/\\s]+$" } },
  repositoriesRemoved: { type: "array", uniqueItems: true, items: { type: "string", pattern: "^[^/\\s]+/[^/\\s]+$" } }
};
function branch(evt) {
  const fields = [...evt.required, ...evt.optional];
  const properties = { event: { const: evt.event } };
  for (const field of fields) properties[field] = fieldSchemas[field];
  return { type: "object", additionalProperties: false, required: ["event", ...evt.required], properties };
}
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `https://github.com/GetVeripsa/veripsa-webhook-spec/raw/v${manifest.contractVersion}/schemas/webhook-routing-envelope.schema.json`,
  title: "Veripsa normalized webhook-routing envelope",
  description: "A discriminated normalized envelope covering every public event family listed in EVENTS.md. It is not a raw GitHub webhook body.",
  oneOf: manifest.events.map(branch)
};
const tsType = (field) => ({
  action:"string", installationId:"number", repositoryFullName:"string", prNumber:"number", headSha:"string", baseRef:"string", branchRef:"string", accountLogin:"string", accountType:'"User" | "Organization"', repositoriesAdded:"string[]", repositoriesRemoved:"string[]"
})[field];
const union = manifest.events.map(evt => {
  const lines = [`      event: ${JSON.stringify(evt.event)};`];
  for (const f of evt.required) lines.push(`      ${f}: ${tsType(f)};`);
  for (const f of evt.optional) lines.push(`      ${f}?: ${tsType(f)};`);
  return `  | {\n${lines.join("\n")}\n    }`;
}).join("\n");
const types = `/** Generated from contract/webhook-events.json. Do not edit by hand. */\n` +
`export type VeripsaWebhookEventName =\n${manifest.events.map(e=>`  | ${JSON.stringify(e.event)}`).join("\n")};\n\n` +
`export type VeripsaWebhookRoutingEnvelope =\n${union};\n`;
const docs = `# Webhook event contract\n\nGenerated from \`contract/webhook-events.json\` for contract **v${manifest.contractVersion}**. This table describes the reduced normalized routing envelope, not the raw GitHub body.\n\n` + [
  "| Event | Required normalized fields | Optional fields | Used for | Retained boundary | Transient-only boundary |",
  "| --- | --- | --- | --- | --- | --- |",
  ...manifest.events.map(e => `| \`${e.event}\` | ${e.required.map(f=>`\`${f}\``).join(", ")} | ${e.optional.length ? e.optional.map(f=>`\`${f}\``).join(", ") : "—"} | ${e.uses} | ${e.retained} | ${e.transient} |`)
].join("\n") + "\n";
async function emit(path, content) {
  const full = resolve(root, path);
  if (checkOnly) {
    const current = await readFile(full, "utf8").catch(() => "");
    if (current !== content) throw new Error(`${path} is stale; run npm run generate`);
  } else await writeFile(full, content, "utf8");
}
await emit("schemas/webhook-routing-envelope.schema.json", JSON.stringify(schema, null, 2) + "\n");
await emit("types/webhook-events.generated.d.ts", types);
await emit("WEBHOOK_EVENTS.md", docs);
console.log(checkOnly ? "webhook generated files are current" : "generated webhook contract");
