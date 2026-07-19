# Observable check and comment output

## Check fields

A normalized signal maps fields without renaming their source:

- `name` ← `check_run.name`, exactly `Veripsa`;
- `title` ← `check_run.output.title`, human-facing and allowed to evolve outside stable token text;
- `conclusion` ← `check_run.conclusion`;
- `token` ← the normalization rules generated in [`CHECK_STATES.md`](./CHECK_STATES.md).

Do not look for `Veripsa — ` in `check_run.name`; it belongs to normal human-facing titles.

## Check states

[`contract/check-states.json`](./contract/check-states.json) is canonical. It generates the discriminated JSON Schema, TypeScript union, and [`CHECK_STATES.md`](./CHECK_STATES.md). Important invariants include:

- `Clear`, `Clear to land`, `Heading to`, and `Merge queue: clear` use `success`.
- `Paused (acknowledge to proceed)` and `Unresolved merge conflict markers` use `action_required`.
- `Acknowledged` uses `neutral` and requires `acknowledged: true` in the normalized signal.
- `Heading to <branch>` is an honest no-reservation/no-analyzable-surface result. It satisfies a required check but does not approve correctness.

## Comment availability

Veripsa keeps at most one managed coordination comment per PR and updates it in place.

- A completely clean `Clear` result is check-only.
- A clear PR with coordination co-signals uses `Clear to land` and has a managed comment.
- `Heads up` and `Wait in line` normally carry coordination context; a check can still survive when a separate comment post is unavailable.
- `Unknown`, paused, acknowledged, and unresolved-marker states carry explanatory context.
- Operational install/retry/merge-group states do not use the verdict-bearing comment schema.

The stable comment marker is:

```html
<!-- veripsa:PR-<number> -->
```

Locate the managed comment by marker, never author display name, timestamp, or sentence copy.

## ACK snapshot marker

When pause-and-acknowledge is active, the managed comment carries:

```html
<!-- veripsa-ack-snap:<12 lowercase hex> -->
```

The wire format is stable in v1. The 12-hex value is opaque: compare or preserve it only as directed by this contract; do not infer partners, files, scores, or any internal mechanism from it.

## Content boundary

Comments may identify content-free pointers such as PR refs, branch refs, paths, symbol names, and line ranges. They never contain source bodies, diff bodies, commit-message bodies, PR/issue body text, or secret values.

## Idempotency

Veripsa upserts one check per `(PR head commit, App)` and at most one marked managed comment per PR. Re-analysis updates existing surfaces rather than appending duplicate managed output.
