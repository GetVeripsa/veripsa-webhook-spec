import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const checkOnly = process.argv.includes("--check");
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(await readFile(resolve(root, "contract/check-states.json"), "utf8"));
const common = {
  name: { const: manifest.checkName },
  title: { type: "string" },
  token: { type: "string" },
  conclusion: { enum: ["success", "neutral", "action_required"] },
  underlyingVerdict: { type: "string" },
  prNumber: { type: "integer", minimum: 1 },
  repositoryFullName: { type: "string", pattern: "^[^/\\s]+/[^/\\s]+$" },
  headSha: { type: "string", pattern: "^[0-9a-f]{40}$" },
  acknowledged: { type: "boolean" }
};

function schemaBranch(state) {
  const properties = {
    ...common,
    name: { const: manifest.checkName },
    title: { type: "string", pattern: state.titlePattern },
    token: { const: state.token },
    conclusion: { const: state.conclusion }
  };
  const required = ["name", "title", "token", "conclusion"];
  if (state.underlyingVerdicts.length === 1) {
    properties.underlyingVerdict = { const: state.underlyingVerdicts[0] };
    required.push("underlyingVerdict");
  } else if (state.underlyingVerdicts.length > 1) {
    properties.underlyingVerdict = { enum: state.underlyingVerdicts };
    required.push("underlyingVerdict");
  } else {
    delete properties.underlyingVerdict;
  }
  if (state.acknowledged === "true") {
    properties.acknowledged = { const: true };
    required.push("acknowledged");
  } else if (state.acknowledged === "false") {
    properties.acknowledged = { const: false };
  } else {
    delete properties.acknowledged;
  }
  return { type: "object", additionalProperties: false, required, properties };
}

const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `https://github.com/GetVeripsa/veripsa-webhook-spec/raw/v${manifest.contractVersion}/schemas/check-run-signal.schema.json`,
  title: "Veripsa normalized check-run signal",
  description: "Normalized public signal derived from check_run.name, check_run.output.title, and check_run.conclusion. The oneOf branches reject impossible token/conclusion/underlying-verdict/ack combinations.",
  oneOf: manifest.states.map(schemaBranch)
};

const quoteUnion = (values) => values.map(v => `  | ${JSON.stringify(v)}`).join("\n");
const tokens = manifest.states.map(s => s.token);
const underlying = [...new Set(manifest.states.flatMap(s => s.underlyingVerdicts))];
const stateUnion = manifest.states.map((s) => {
  const lines = [
    `      token: ${JSON.stringify(s.token)};`,
    `      conclusion: ${JSON.stringify(s.conclusion)};`
  ];
  if (s.underlyingVerdicts.length === 1) lines.push(`      underlyingVerdict: ${JSON.stringify(s.underlyingVerdicts[0])};`);
  if (s.underlyingVerdicts.length > 1) lines.push(`      underlyingVerdict: ${s.underlyingVerdicts.map(JSON.stringify).join(" | ")};`);
  if (s.acknowledged === "true") lines.push("      acknowledged: true;");
  if (s.acknowledged === "false") lines.push("      acknowledged?: false;");
  if (s.acknowledged === "forbidden") lines.push("      acknowledged?: never;");
  return `  | {\n${lines.join("\n")}\n    }`;
}).join("\n");
const types = `/** Generated from contract/check-states.json. Do not edit by hand. */\n` +
`export type VeripsaCheckToken =\n${quoteUnion(tokens)};\n\n` +
`/** @deprecated Use VeripsaCheckToken; operational states are not verdicts. */\n` +
`export type VeripsaVerdictToken = VeripsaCheckToken;\n\n` +
`export type VeripsaUnderlyingVerdict =\n${quoteUnion(underlying)};\n\n` +
`export type VeripsaCheckState =\n${stateUnion};\n`;

const header = `# Check-state contract\n\nGenerated from \`contract/check-states.json\` for contract **v${manifest.contractVersion}**. Human sentence copy may evolve; integrations depend on \`check_run.name === \"${manifest.checkName}\"\` plus the normalized token.\n\n`;
const table = [
  "| Token | Observable title example | Conclusion | Underlying verdict | ACK field | PR comment | Stability |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...manifest.states.map(s => `| \`${s.token}\` | \`${s.titleExample}\` | \`${s.conclusion}\` | ${s.underlyingVerdicts.length ? s.underlyingVerdicts.map(v=>`\`${v}\``).join(" / ") : "—"} | \`${s.acknowledged}\` | \`${s.commentAvailability}\` | \`${s.stability}\` |`)
].join("\n") + "\n";

async function emit(path, content) {
  const full = resolve(root, path);
  if (checkOnly) {
    const current = await readFile(full, "utf8").catch(() => "");
    if (current !== content) throw new Error(`${path} is stale; run npm run generate`);
  } else {
    await writeFile(full, content, "utf8");
  }
}
await emit("schemas/check-run-signal.schema.json", JSON.stringify(schema, null, 2) + "\n");
await emit("types/check-states.generated.d.ts", types);
await emit("CHECK_STATES.md", header + table);
console.log(checkOnly ? "check-state generated files are current" : "generated check-state contract");
