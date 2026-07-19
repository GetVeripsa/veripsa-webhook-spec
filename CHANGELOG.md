# Changelog

## 1.0.0 — 2026-07-19

Initial versioned public contract.

### Corrected

- Separates exact `check_run.name` (`Veripsa`) from human-facing `check_run.output.title`.
- Locks `Heading to` to `success` across manifest, Schema, types, examples, and docs.
- Rejects impossible token/conclusion/underlying-verdict/ACK combinations.
- Defines the ACK snapshot as a 12-lowercase-hex opaque wire token.
- Defines clean `Clear` as check-only and clear coordination comments as `Clear to land`.
- Separates repository label-definition creation from explicit PR label application.

### Added

- Canonical check-state and webhook-event manifests.
- Full eight-event normalized routing envelope.
- Positive/negative example validation, TypeScript compile tests, local-link tests, generated-file drift checks, and CI.

### Deprecated

- `schemas/webhook-routing-event.schema.json` for new integrations. It remains a v1 compatibility schema for selected raw GitHub bodies.
- `VeripsaVerdictToken` in favor of `VeripsaCheckToken`.
