# Compatibility policy

The public contract is versioned independently from product deployment.

- **Patch:** prose clarification, stricter tests that do not reject previously valid contract data, or corrections to generated artifacts without changing stable wire shapes.
- **Minor:** additive token/event/optional field/schema path. Consumers must treat unknown future titles/tokens as unsupported rather than guessing.
- **Major:** removal/rename of a stable token, field, marker, schema path, or a changed required conclusion/meaning.

Deprecated v1 paths remain available for the lifetime of v1. New integrations should prefer `webhook-routing-envelope.schema.json`; `webhook-routing-event.schema.json` remains a selected raw-body compatibility surface.

Human-facing sentence copy and paragraph order are not stable. Stable assets are the exact check name, normalized tokens and their conclusion constraints, marker shapes, label name/meaning, versioned schema IDs, and exported TypeScript names not marked deprecated.
