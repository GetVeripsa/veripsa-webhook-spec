# Contributing to veripsa-webhook-spec

Thank you for helping keep Veripsa's public integration contract accurate.

This repository exists so external tools can safely depend on the Veripsa
GitHub App surface without needing access to Veripsa Core internals. Good
contributions usually make the contract easier to consume from an agent,
dashboard, log shipper, security review, or test fixture.

## Good contributions

We welcome pull requests and issues for:

- corrections when the App's visible behaviour and this spec disagree,
- clearer wording around check-run titles, conclusions, PR comments, and
  `veripsa-ack`,
- JSON Schema or TypeScript type fixes,
- small examples that show how an agent or dashboard should branch on the
  public surface,
- security / compliance documentation for the public GitHub App surface,
- typo and link fixes.

## Out of scope

Please do not send:

- Veripsa Core engine internals,
- requests to publish scoring formulas or collision heuristics,
- private repository source code, diffs, or proprietary file contents,
- customer names, tokens, installation secrets, or confidential identifiers,
- code that requires Veripsa to read or publish source file bodies.

The public contract is intentionally content-free. A useful issue report can
usually be written with only the check title, GitHub `conclusion`, PR number
shape, label name, marker text, and the date you observed the behaviour.

## Compatibility rules

When proposing a change, call out whether it affects any stable surface:

- check-run title prefix tokens,
- GitHub check `conclusion` values,
- PR comment markers,
- `veripsa-ack` semantics,
- schema file paths,
- TypeScript exported names.

If the change only improves prose, say that explicitly.

## Local validation

This repository has no build step. To validate JSON files:

```sh
npm run check:json
```

The script checks that every JSON file under `schemas/` and `examples/`
parses correctly. Schema semantic validation is intentionally kept
dependency-free for now so the repo stays easy to inspect.

## Security

Do not report vulnerabilities by opening a public issue if the report
contains sensitive details. Use the disclosure path linked from
<https://veripsa.com/security/disclosure>.
