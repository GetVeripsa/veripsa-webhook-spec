# veripsa-webhook-spec

The public integration contract for the **Veripsa GitHub App** — the
advisory, content-free GitHub App that flags pre-merge structural overlap
across in-flight PRs for teams running parallel AI coding agents.

This repo describes:

- which **GitHub webhook events** the App subscribes to,
- the shape of **what it posts back** — check runs and PR comments,
- the semantics of the **`veripsa-ack`** label.

Veripsa lives at [veripsa.com](https://veripsa.com). The App itself is
installed from a free on-ramp; this repo is published separately so
integrators (dashboards, agents, log shippers, security reviewers) can
treat the surface as a stable contract.

> This is the **integration contract**. It is **not** documentation of how
> the engine decides anything. Engine internals stay private.

## Who this is for

- Developers building tooling on top of Veripsa output (dashboards, agent
  rules, log shippers).
- AI-agent maintainers who want their agent to **read Veripsa's check /
  comment / label** and react to it correctly.
- Security and compliance reviewers who want to know exactly which GitHub
  permissions and events the App uses.

## What this is NOT

- It is **not** a description of Veripsa's internal engine, which
  stays private.
- It is **not** an API to call into Veripsa. The App is event-driven over
  GitHub webhooks; there is no public REST surface for integrators today.
- It is **not** an SLA. Veripsa is **advisory** — the check it posts is
  non-blocking by default; your branch-protection policy decides what is
  required to merge.

## Honest scope

- Veripsa is **content-free**: it never reads, stores, or transmits file
  bodies. Only paths, symbol names, line ranges, structural relationships,
  and GitHub identifiers cross the wire.
- Veripsa runs **same-owner per-repo**. Other scopes
  are not a claim made by this spec.
- Veripsa is **not a merge queue** and **not an AI reviewer**. It records
  who-is-changing-what across in-flight PRs and surfaces structural
  overlap before merge.

## Contents

- [`EVENTS.md`](./EVENTS.md) — the GitHub webhook events Veripsa
  subscribes to, the GitHub permissions it requests, the events it
  explicitly does **not** subscribe to, and a high-level note on
  language coverage.
- [`OUTPUT.md`](./OUTPUT.md) — the verdict ladder (Clear / Heads up /
  Wait in line / Unknown) and its GitHub `conclusion` mapping, the
  PR-comment marker convention, and the idempotent-upsert contract.
- [`ACK_LABEL.md`](./ACK_LABEL.md) — the `veripsa-ack` label: what
  adding it means, what removing it means, who can add it, and the
  stale-ack rule.

## Status

**Draft.** The contract is stable enough for integrators to branch on the
verdict-prefix tokens and the comment marker. Wording of human-facing
copy may still evolve. The verdict-ladder shape, the marker shape, and
the label name are the parts you should treat as stable.

When the App's behaviour visibly changes, the change is announced in the
separate [veripsa-changelog](https://github.com/GetVeripsa/veripsa-changelog)
repo.

## Reporting an issue with the spec

If the spec on this repo and the App's actual behaviour diverge, please
[open an issue](./.github/ISSUE_TEMPLATE/). The App's actual behaviour
wins, and the spec gets corrected.

We do **not** accept code contributions here — this repo is documentation
only. The Veripsa Core engine is not open-source.

## License

The contents of this spec repo are licensed under the
[MIT License](./LICENSE). The Veripsa Core engine itself is **not**
open-source and is **not** distributed under this license — only the
documentation text in this repo is.
