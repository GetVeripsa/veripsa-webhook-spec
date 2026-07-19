# Public observable truth matrix

| Surface | Contract |
| --- | --- |
| Check name | `check_run.name` is exactly `Veripsa`. |
| Human title | `check_run.output.title`; normal verdict titles use `Veripsa — <token>` with optional evolving sentence copy. |
| Normalized token/conclusion | Canonical in `contract/check-states.json`; generated in `CHECK_STATES.md` and Schema/types. |
| Clean Clear | Check-only, `success`, no managed coordination comment. |
| Heading to | `success`; no reservation or no analyzable surface; not correctness approval. |
| Managed comment | At most one per PR, located by `<!-- veripsa:PR-<number> -->`. |
| ACK snapshot | `<!-- veripsa-ack-snap:<12 lowercase hex> -->`; stable wire shape, opaque value. |
| ACK meaning | Seen this specific coupling and proceeding; not review/correctness/resolution. |
| Label ownership | Veripsa may create the repository label definition; only a human/agent explicitly applies it to a PR. |
| Event families | Eight discriminated families in `contract/webhook-events.json`. |
| Permissions | `contents:read`, `merge_queues:read`, `pull_requests:write`, `checks:write`, `metadata:read`. |
| Retained | Reduced content-free identifiers, names, paths/symbols/relationships, working/advisory/lifecycle and delivery metadata. |
| Transient-only | Raw webhook body, source/diff bodies, commit/PR/issue body text, configuration values, unrelated webhook fields. |
| Retention | Working/telemetry/delivery data is short-lived; advisory/lifecycle audit remains until account erasure. |
| Support | <https://veripsa.com/support>; best-effort target, not a contractual SLA. |
| Security | Email `support@veripsa.com` with subject prefix `[SECURITY]`; canonical process at <https://veripsa.com/security/disclosure>. |
| Fair-use limit | No automatic charge or paid-plan move; affected analysis surfaces an honest non-clear state rather than silently claiming safety. |
| Product scope | Advisory by default, content-free, within one installed repository; not merge queue, AI reviewer, or correctness checker. |
