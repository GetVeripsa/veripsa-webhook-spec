# The `veripsa-ack` label

`veripsa-ack` means: **“I have seen this specific material coupling and I am proceeding anyway.”** It is not correctness approval, code review approval, or proof that the coupling is resolved.

## Definition versus application

Two operations are deliberately separate:

1. **Repository label definition:** Veripsa may lazily create the repository's `veripsa-ack` label definition when a material state first needs it.
2. **Application to a PR:** Veripsa never applies `veripsa-ack` to a pull request on its own. A human or agent with suitable base-repository permission must explicitly apply it.

This distinction is part of the v1 public contract.

## Effect

For a material `Wait in line` or named-partner `Heads up` state, the unacknowledged normalized check is `Paused (acknowledge to proceed)` with `action_required`. A matching explicit ACK reshapes it to `Acknowledged`, `neutral`, and `acknowledged: true`.

The check gates a merge only when the repository owner independently marks the Veripsa check as required.

## Staleness

An ACK is bound to the specific material coupling. When partners or colliding paths materially change, the prior ACK becomes stale, the high-salience state returns, and the stale PR label is removed or slated for removal.

The comment's 12-lowercase-hex ACK snapshot token is opaque. Its format is public; its derivation is not.

## Fork PRs

Fork contributors cannot apply the base repository's label. Fork PRs therefore keep the advisory non-paused form and receive redacted cross-PR context.
