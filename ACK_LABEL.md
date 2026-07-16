# The `veripsa-ack` label

`veripsa-ack` is the single PR label Veripsa reacts to. It is an **optional,
explicit, recorded acknowledgement** of a structural coupling that Veripsa
has surfaced. Installing or using Veripsa does not require a routine ACK step,
per-agent setup, CLI polling command, or copied merge rule.

## What "ack" means

**Ack means: "I have seen this coupling and I am proceeding anyway."**

It does **not** mean:

- "this code is correct" — Veripsa does not assert correctness;
- "this PR is approved" — ack is **not** a review approval; GitHub's
  normal review and branch-protection rules are independent of
  `veripsa-ack`;
- "the collision is resolved" — the collision may still be real; ack
  only records that someone took responsibility for proceeding.

## When the label matters

The label is meaningful only on PRs where Veripsa has surfaced a
**material coupling** in its high-salience check state (see
[`OUTPUT.md`](./OUTPUT.md)). The state appears automatically; recording an ACK
is optional unless the repository owner independently makes the Veripsa check
required and chooses ACK as its exception path.

- On a **Clear** PR, the label has no effect.
- On a **Heads up** PR with no named in-flight partner (a solo notice),
  or a minor build/list-file overlap, the label has no effect — those
  never pause.
- On a material PR — a **Wait in line** verdict, or a **Heads up**
  verdict with a named in-flight partner PR — the label toggles the
  check's `conclusion` from `action_required` to `neutral` and
  re-renders the comment to record the ack.

## Adding / removing the label

- **Who can add it.** Anyone with write access to the PR's base
  repository (humans, bots, autonomous agents using a token with
  `pull_requests: write`). Fork contributors cannot add it; their PRs
  are treated as non-material for ack purposes.
- **How an agent adds it.** Using the standard GitHub CLI:
  `gh pr edit <PR> --add-label veripsa-ack`.
- **How a human adds it.** From the PR sidebar's Labels picker.
- **Removing it.** Removing the label re-raises the pause on the next
  event that re-analyses the PR.

Veripsa is subscribed to `pull_request` `labeled` / `unlabeled` events
but only acts on them when the changed label is exactly `veripsa-ack`.
Other label changes are ignored at the routing layer.

## Stale acks

An ack is bound to the **specific coupling** it covered (which partners,
which files). If the coupling **materially changes** between events — a
different partner PR, a different set of colliding files — the prior
ack is considered **stale**:

- the high-salience state re-raises on the next analysis,
- the `veripsa-ack` label is slated for removal so the PR visibly reads
  un-acked again.

This makes ack a **fresh, recorded decision per coupling**, not a
one-time opt-out for the lifetime of the PR.

The binding is recorded in an invisible HTML marker
(`<!-- veripsa-ack-snap:<12-hex> -->`) inside Veripsa's PR comment; see
[`OUTPUT.md`](./OUTPUT.md) for the marker shape. Integrators generally
do not need to parse it.

## What Veripsa never does with labels

- Veripsa does not add or remove **any label other than `veripsa-ack`**.
- Veripsa does not add `veripsa-ack` itself; the label is
  human-or-agent-applied.
- Veripsa does not interpret label color, description, or position in
  the picker. The label name is the entire contract.

## Naming and color

- Veripsa relies on the **exact label name** `veripsa-ack`. Capitalisation
  matters. The label is created lazily on first need; it does not have
  to exist on the repository ahead of time.
- Color, description, and label-picker position are not part of the
  contract — you may change them freely. Veripsa will not overwrite
  them.
