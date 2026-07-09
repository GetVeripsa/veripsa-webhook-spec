# Ecosystem impact

Veripsa's public spec exists for maintainers who are adding autonomous coding
agents to normal GitHub workflows.

The product problem is narrow: when humans and AI coding agents work in
parallel, pull requests that look independent can collide before merge. Git
catches textual merge conflicts late. CI catches correctness failures only
after code runs. Veripsa adds a pre-merge coordination signal: one GitHub App
check and one PR comment that describe structural overlap across in-flight
work without publishing source file bodies.

## Why this repo is public

The Veripsa Core engine is private. The integration surface is public because
external tooling needs stable contracts:

- an agent needs to know when `action_required` means "acknowledge this
  material coupling before proceeding";
- a dashboard needs to find the single Veripsa PR comment without matching
  prose;
- a log shipper needs to capture the verdict token without storing source;
- a security reviewer needs to see requested GitHub permissions and event
  subscriptions;
- a sandbox or benchmark needs small example payloads that do not contain
  proprietary code.

This repository is the boundary between those two worlds. It deliberately
documents what external tools can observe, not how Veripsa decides.

## Integration patterns

### Agent rule

1. Read the latest check named `Veripsa`.
2. Branch on the token after `Veripsa — `.
3. Treat `Paused (acknowledge to proceed)` as a deliberate stop.
4. Read the marked PR comment for content-free partner refs and paths.
5. Add `veripsa-ack` only when the agent or maintainer has decided to
   proceed despite the coupling.

### Dashboard rule

1. Locate the PR comment by `<!-- veripsa:PR-<number> -->`.
2. Extract partner refs (`PR-<number>` and `BR-<branch-slug>`).
3. Store paths and refs, not file bodies.
4. Treat human prose as display text, not a parser target.

### Security review rule

1. Review `EVENTS.md` for subscribed GitHub events.
2. Review `OUTPUT.md` for the exact public signal emitted back to GitHub.
3. Review `ACK_LABEL.md` for label semantics.
4. Verify that examples and schemas remain content-free.

## What would count as ecosystem adoption

This repo is meant to be useful even before broad adoption numbers exist.
Concrete signs of adoption would include:

- agent projects branching on the schemas or TypeScript declarations,
- dashboards showing Veripsa verdicts across repositories,
- fixture repos using the example payloads to test AI-agent handoff logic,
- security reviews linking to this public contract instead of requesting
  source-code access to Veripsa Core,
- external issues or PRs clarifying the public contract.

## Maintainer promise

We will keep the public contract conservative:

- publish only observable surfaces,
- keep schema paths stable once external users depend on them,
- avoid source-code snippets in examples,
- correct the spec when the live App and repo disagree,
- announce user-visible behaviour changes in the changelog repo.
