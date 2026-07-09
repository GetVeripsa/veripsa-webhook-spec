# veripsa-webhook-spec

The public integration contract for the **Veripsa GitHub App** — the advisory, content-free GitHub App that helps teams notice risky PR landing order before `main` changes.

This repository is the open-source surface that external tools can build against. It defines:

- which **GitHub webhook events** the App subscribes to,
- the shape of **what it posts back** — check runs and PR comments,
- the semantics of the **`veripsa-ack`** label,
- machine-readable **JSON Schemas**, TypeScript declarations, and examples
  for agents, dashboards, log shippers, and security reviewers.

Veripsa lives at [veripsa.com](https://veripsa.com). The App itself is
installed from a free on-ramp; this repo is published separately so
integrators can treat the public output surface as a stable contract.

> This is the **integration contract**. It is **not** documentation of how
> Veripsa decides anything internally.

## Best links for readers

| Need | Link |
| --- | --- |
| Product overview | <https://veripsa.com/how-it-works> |
| Agent usage guide | <https://veripsa.com/docs/with-agents> |
| Share / quote Veripsa safely | <https://veripsa.com/share> |
| 日本語の共有キット | <https://veripsa.com/ja/share> |
| Changelog | <https://github.com/GetVeripsa/veripsa-changelog> |
| Roadmap | <https://github.com/GetVeripsa/veripsa-roadmap> |
| Blog RSS | <https://veripsa.com/blog/feed.xml> |
| Blog JSON Feed | <https://veripsa.com/blog/feed.json> |
| LLM discovery file | <https://veripsa.com/llms.txt> |

## Who this is for

- Developers building tooling on top of Veripsa output (dashboards, agent
  rules, log shippers).
- AI-agent maintainers who want their agent to **read Veripsa's check /
  comment / label** and react to it correctly.
- Security and compliance reviewers who want to know exactly which GitHub
  permissions and events the App uses.
- Maintainers who want a small fixture for testing how an autonomous agent
  should pause, acknowledge, or continue around PR warnings.

## What this is NOT

- It is **not** a description of Veripsa's internal engine, which
  stays private.
- It is **not** an API to call into Veripsa. The App is event-driven over
  GitHub webhooks; there is no public REST surface for integrators today.
- It is **not** an SLA. Veripsa is **advisory** — the check it posts is
  non-blocking by default; your branch-protection policy decides what is
  required to merge.

## Honest scope

- Veripsa is **content-free by design**: it does not store or display customer
  source file bodies. This repo documents the public output contract, not a
  code-review surface.
- Veripsa runs **same-owner per-repo** today. Other scopes are not a claim made
  by this spec.
- Veripsa is **not a merge queue** and **not an AI reviewer**. It gives teams a
  GitHub-native warning before a risky landing order turns into a `main`
  problem.

## Repository map

- [`EVENTS.md`](./EVENTS.md) — the GitHub webhook events Veripsa
  subscribes to, the GitHub permissions it requests, the events it
  explicitly does **not** subscribe to, and a high-level note on
  language coverage.
- [`OUTPUT.md`](./OUTPUT.md) — the verdict ladder (Clear / Heads up /
  Wait in line / Unknown), pause-and-acknowledge check states, GitHub
  `conclusion` mapping, PR-comment marker convention, and idempotent-upsert
  contract.
- [`ACK_LABEL.md`](./ACK_LABEL.md) — the `veripsa-ack` label: what adding
  it means, what removing it means, who can add it, and the stale-ack rule.
- [`schemas/`](./schemas/) — JSON Schemas for the public contract surfaces.
- [`types/index.d.ts`](./types/index.d.ts) — TypeScript declarations for
  integrators that want to branch on Veripsa's stable tokens.
- [`examples/`](./examples/) — copy-pasteable payload and comment examples.
- [`docs/ecosystem-impact.md`](./docs/ecosystem-impact.md) — how this repo
  fits into AI-agent and GitHub App tooling.

## Consuming the spec

The Markdown files are the human-readable source of truth. The schema and
type files mirror the same public surface for tool authors.

This repository includes `package.json` metadata so the assets can be
consumed as a package or published to a registry without changing paths.
Until a registry release exists, use GitHub paths directly or vendor the
specific schema files you need.

Stable entry points:

```text
schemas/check-run-signal.schema.json
schemas/pr-comment-surface.schema.json
schemas/webhook-routing-event.schema.json
schemas/ack-label.schema.json
types/index.d.ts
```

## Compatibility policy

Integrators may rely on:

- the literal check-run name prefix `Veripsa — `,
- the verdict / state tokens listed in [`OUTPUT.md`](./OUTPUT.md),
- the PR comment marker shape `<!-- veripsa:PR-<number> -->`,
- the ack-snapshot marker prefix `<!-- veripsa-ack-snap:`,
- the exact label name `veripsa-ack`,
- the JSON Schema file paths in `schemas/`.

Integrators should not rely on full human-facing sentence copy, comment
paragraph order, badge text, or private scoring details.

## Status

**Draft, but stable enough to integrate against.** The verdict ladder shape,
the comment marker shape, the ack label name, and the schema file paths are
the parts you should treat as stable. Human-facing wording may still evolve.

When the App's behaviour visibly changes, the change is announced in the
separate [veripsa-changelog](https://github.com/GetVeripsa/veripsa-changelog)
repo.

## Contributing

Contributions are welcome when they improve the public contract:

- schema corrections,
- ambiguous spec wording,
- missing examples,
- agent-integration notes,
- issue templates and documentation fixes.

Please do **not** include private source code, customer code excerpts, diffs,
or proprietary repository details. Veripsa Core engine internals remain
closed-source; this repo accepts contributions to the public integration
surface only. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Reporting an issue with the spec

If the spec on this repo and the App's actual behaviour diverge, please
[open an issue](./.github/ISSUE_TEMPLATE/). The App's actual behaviour
wins, and the spec gets corrected.

## License

The contents of this spec repo are licensed under the
[MIT License](./LICENSE). The Veripsa Core engine itself is **not**
open-source and is **not** distributed under this license — only the
public integration contract files in this repository are.
