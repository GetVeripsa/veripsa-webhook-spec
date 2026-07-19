# Contributing

Contributions may clarify observable output, fix Schema/type/example drift, improve agent/dashboard consumption, or correct the public data boundary. Do not submit Core source, private scoring or heuristics, SQL/table internals, customer code, diffs, tokens, or proprietary identifiers.

Run:

```sh
npm ci
npm run generate
npm run check
npm pack --dry-run
```

Generated files must be committed with their canonical manifest changes. Classify contract impact as patch, minor/additive, or major/breaking in the PR description. Prose-only changes must say so explicitly.

Security reports do not belong in public issues. Follow <https://veripsa.com/security/disclosure>.
