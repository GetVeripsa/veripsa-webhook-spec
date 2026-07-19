# veripsa-webhook-spec

The versioned public integration contract for **Veripsa Core** — the advisory, content-free GitHub App for pre-merge PR traffic control between open pull requests. It documents only what an integrator can observe: subscribed event families, requested permissions, normalized checks and comments, `veripsa-ack`, and the content-free data boundary.

> This repository does not publish Veripsa Core internals, scoring, ranking, or collision heuristics.

## Stable field boundary

- `check_run.name` is exactly `Veripsa`.
- `check_run.output.title` is the human-facing title. Normal verdict titles begin with `Veripsa — `, but integrations should normalize them to the stable token in [`CHECK_STATES.md`](./CHECK_STATES.md), not full-string-match evolving sentence copy.
- An unknown future title is unsupported: preserve and display the full title and GitHub `conclusion`; do not guess a known verdict.

## Start here

| Need | Source |
| --- | --- |
| Collision walkthrough | <https://veripsa.com/collision> |
| Observable truth matrix | [`TRUTH_MATRIX.md`](./TRUTH_MATRIX.md) |
| Check/token/conclusion contract | [`CHECK_STATES.md`](./CHECK_STATES.md) |
| Output and comment normalization | [`OUTPUT.md`](./OUTPUT.md) |
| Event families and fields | [`WEBHOOK_EVENTS.md`](./WEBHOOK_EVENTS.md) |
| Permissions and raw webhook notes | [`EVENTS.md`](./EVENTS.md) |
| ACK label semantics | [`ACK_LABEL.md`](./ACK_LABEL.md) |
| Data handling and retention | [`DATA_HANDLING.md`](./DATA_HANDLING.md) |
| Compatibility and migration | [`COMPATIBILITY.md`](./COMPATIBILITY.md) |

## Machine-readable entry points

```text
contract/check-states.json
contract/webhook-events.json
schemas/check-run-signal.schema.json
schemas/pr-comment-surface.schema.json
schemas/webhook-routing-envelope.schema.json
schemas/webhook-routing-event.schema.json      # legacy selected raw bodies
schemas/ack-label.schema.json
types/index.d.ts
```

The two files under `contract/` are the canonical machine sources. Generated Schema, declaration, and Markdown files are checked for drift in CI.

## Version and consumption

Current public contract: **v1.0.0**. The contract version is independent from product deploy versions.

No registry release is promised. Until one exists, vendor assets from an immutable Git tag or commit. Mutable `main` URLs are suitable for reading, not for pinning a production integration. See [`CHANGELOG.md`](./CHANGELOG.md) and [`COMPATIBILITY.md`](./COMPATIBILITY.md).

## Product boundary

Veripsa is advisory by default, content-free by design, and coordinates work within one installed repository today. It works alongside merge queues, AI reviewers, CI, tests, branch protection, and human review; it is not a replacement for those systems or a correctness checker.

- Product docs: <https://veripsa.com/docs>
- Support: <https://veripsa.com/support>
- Security: <https://veripsa.com/security/disclosure>

## Local verification

```sh
npm ci
npm run check
npm pack --dry-run
```

`check:types` requires TypeScript 5.x on `PATH`; CI installs it explicitly. Schema validation uses Python `jsonschema` with draft 2020-12 support.

## License

The public contract files are MIT-licensed. Veripsa Core is not distributed by this repository and is not covered by this license.
