# What Veripsa posts back

For every analyzed PR, Veripsa upserts two things on GitHub:

1. one **check run** on the PR's head commit, carrying the verdict and a
   GitHub `conclusion`;
2. one **PR comment** carrying the human-readable explanation plus a
   stable HTML marker integrators can use to find it.

Both are upserted in place — re-analysis of the same head commit updates
the existing check / comment rather than creating a new one.

> Veripsa does not block merges by itself. Whether a Veripsa check is
> required to merge is entirely controlled by your repository's
> branch-protection rules.

## The verdict ladder

Veripsa surfaces one of five verdicts on the check run. The exact title
copy after the em-dash may evolve; the **shape** of the ladder is stable
and is what integrators should branch on (via the check title prefix,
not full-string match).

The table below is the ladder in its **advisory form**. For a
**material** in-flight collision — a **Wait in line** verdict, or a
**Heads up** verdict with a named in-flight partner PR — the check is
normally posted in the pause-and-acknowledge shape instead
(`Veripsa — Paused (acknowledge to proceed)` /
`Veripsa — Acknowledged`; see
[一時停止 (pause-and-acknowledge)](#一時停止-pause-and-acknowledge)
below). The advisory form of those verdicts is still observable — on
fork PRs, and when the pause state could not be computed for an event —
so integrators should handle both shapes.

| Verdict          | Check title prefix          | When it appears                                  | GitHub `conclusion` |
|------------------|------------------------------|--------------------------------------------------|---------------------|
| Clear            | `Veripsa — Clear` *or* `Veripsa — Clear to land` | Nothing else in flight touches this PR's surface (the `Clear to land` variant signals the same verdict alongside an informational co-signal — e.g. nearby in-flight work that is not a collision). | `success`           |
| Heads up         | `Veripsa — Heads up`         | Cross-PR overlap (advisory form; with a named in-flight partner PR it is material and posts paused — see below). | `neutral`           |
| Wait in line     | `Veripsa — Wait in line`     | Direct collision ahead (advisory form; normally posts paused — see below). | `neutral`           |
| Heads up (minor) | `Veripsa — Heads up`         | Minor overlap on a build / list file (never pauses). | `neutral`           |
| Unknown          | `Veripsa — Unknown`          | Not enough signal to call it clear.              | `neutral`           |

The check title starts with the literal string `Veripsa — `; the token
that follows (`Clear`, `Clear to land`, `Heads up`, `Wait in line`,
`Unknown`, `Paused (acknowledge to proceed)`, `Acknowledged`,
`Unresolved merge conflict markers`) is the machine-readable signal.
The trailing copy after the second em-dash (when present) is
human-facing and may vary.

Integrators should branch on the prefix tokens up to (but not including)
the second em-dash; treat both `Clear` and `Clear to land` as the
**Clear** verdict.

## When the `conclusion` changes

- **`success`** is posted only for the **Clear** verdict.
- **`neutral`** is posted for the advisory verdicts, for the
  **Acknowledged** pause state, and for the informational states below.
- **`action_required`** is posted in exactly two situations: a material
  in-flight collision that has not yet been acknowledged (see
  [一時停止 (pause-and-acknowledge)](#一時停止-pause-and-acknowledge))
  and unresolved merge conflict markers (below).

A `neutral` check is, by GitHub's definition, a check that has completed
and does not gate a merge. An `action_required` check gates the merge
only if your branch-protection policy marks the Veripsa check as
required. The signal you act on lives in the **check title** and the
**PR comment** Veripsa posts in parallel.

## Informational (non-verdict) check states

Veripsa also posts `neutral` checks for a few operational states that
are not themselves a verdict:

- **"Veripsa is now watching"** — posted on first install / first
  analysis of a PR before a verdict is available.
- **"Veripsa paused — free tier reached"** — posted when the
  installation is beyond its plan's coverage and Veripsa is not
  analyzing further. This is a visible state, not a silent miss; it is
  `neutral`, never `failure`.
- **"Veripsa — changed files not read, not analyzed"** — posted when
  Veripsa could not read the PR's changed-files list for that event.
  Veripsa does not silently fall back to "Clear" in this case; it
  surfaces that it did not analyze.

## Unresolved merge conflict markers

If the PR's diff adds a paired set of literal git merge conflict markers
(`<<<<<<<` together with `>>>>>>>`) inside one or more changed files,
Veripsa's single check run for that head commit hard-fails:

| Check title                                          | GitHub `conclusion` |
|-------------------------------------------------------|---------------------|
| `Veripsa — Unresolved merge conflict markers`         | `action_required`   |

There is **no separate second check**: the one-check-per-head-commit
contract (see [Check-run idempotency](#check-run-idempotency)) still
holds. The same check run's conclusion, title, and summary are replaced
with the hard-fail lead; any coupling verdict for the same PR remains
visible in the PR comment body, below the conflict-marker block.

This and the pause-and-acknowledge state (next section) are the only
two situations in which Veripsa emits `action_required`. The signal is
content-free: only the path and the first marker line number are
reported; no file body is read or posted. It is a hard-fail because an
unresolved marker will break the build regardless of any coupling
verdict.

## 一時停止 (pause-and-acknowledge)

Pause-and-acknowledge is Veripsa's **default behaviour on every
installation**. It is not a plan feature and there is no opt-in or
opt-out switch. When a verdict names a **material** in-flight collision
— **Wait in line**, or **Heads up** with a named in-flight partner PR —
Veripsa posts the check with `conclusion: action_required` until the PR
carries the `veripsa-ack` label. The label is the explicit
acknowledgement signal; see [`ACK_LABEL.md`](./ACK_LABEL.md).

The check title reshapes around the ack state:

| State on the PR                                              | Check title prefix                            | GitHub `conclusion` |
|---------------------------------------------------------------|-----------------------------------------------|---------------------|
| Paused — `veripsa-ack` not yet on the PR                      | `Veripsa — Paused (acknowledge to proceed)`   | `action_required`   |
| Acknowledged — `veripsa-ack` is on the PR for this coupling   | `Veripsa — Acknowledged`                      | `neutral`           |
| Re-paused — coupling materially changed; prior ack went stale | `Veripsa — Paused (acknowledge to proceed)`   | `action_required`   |

On a re-pause, Veripsa also removes the stale `veripsa-ack` label so
the PR visibly reads un-acked again.

What does **not** pause:

- **Heads up** with no named in-flight partner (a solo notice), and the
  minor build/list-file overlap — these stay plain `neutral`.
- **Unknown** and the informational states — `neutral`.
- **Fork PRs** — never paused (a fork contributor cannot add the base
  repository's label); the advisory `neutral` form of the verdict is
  posted as-is.

If the pause state cannot be computed for an event (for example, a
transient GitHub API error), Veripsa fails open: the advisory `neutral`
form of the verdict is posted unchanged, never a spurious pause.

The `action_required` conclusion signals "the author has not yet
acknowledged this specific collision"; it is **not** Veripsa asserting
that the change is wrong. Whether `action_required` actually blocks the
merge is decided by your branch-protection policy (the Veripsa check
must be marked required for `action_required` to gate the merge).

## The PR comment

Alongside the check run, Veripsa upserts a single PR comment that
carries the human-readable explanation of the verdict plus structured
pointers an agent can react to.

### The comment marker

Every Veripsa comment **starts** with an invisible HTML marker that
uniquely identifies it as Veripsa's comment for that PR:

```
<!-- veripsa:PR-<number> -->
```

For example, on PR #42 the marker is `<!-- veripsa:PR-42 -->`.

The marker is:

- **Invisible** in GitHub's rendered markdown — it is an HTML comment.
- **Stable** across re-renders of the same PR — `<number>` is the PR
  number.
- **Sufficient to locate** Veripsa's comment in the PR's comment thread
  programmatically: search the body for the marker substring.

> Integrators MUST locate the comment by the marker, not by author
> display name, posting timestamp, or body text.

### Comment idempotency

Veripsa posts **exactly one** marked comment per PR.

- The first analysis of a PR creates the comment with the marker
  prepended.
- Every subsequent analysis on the same PR **edits the existing comment
  in place** — same marker, replaced body. Veripsa does not append new
  comments on re-analysis.
- The marker is preserved on edit; the rest of the body may change
  freely between events.

### Where structured info lives in the body

The comment body is GitHub-flavored markdown intended for humans. A few
conventions agents can rely on:

- The comment **opens** with a bold human header that matches the check
  title (e.g. `**Clear to land.**`, `**Wait in line.**`, `**Heads up —
  minor overlap.**`). Branch on the leading bold token, not on the full
  sentence. On a **paused** PR the bold header still carries the
  underlying verdict (e.g. **Wait in line**) with the pause instruction
  quoted directly beneath it; on an **acknowledged** PR the header is
  rewritten to the acknowledged state.
- Cross-PR partners are referenced using stable, content-free refs:
  - `PR-<number>` for PRs (e.g. `PR-17`),
  - `BR-<branch-slug>` for branch-only changes that have not yet opened
    a PR.
- File paths are rendered as inline code spans (`` `path/to/file.ext` ``).
- The body **never** contains file contents, diffs, or excerpts of
  customer source. Only paths, symbol names, line ranges, PR / branch
  refs.

### The ack-snapshot marker

When 一時停止 (pause-and-acknowledge) has engaged on a PR — a material
collision was posted — the comment body also carries a second invisible
HTML marker that binds an acknowledgement to the specific coupling it
covers:

```
<!-- veripsa-ack-snap:<opaque token> -->
```

This marker is read back by Veripsa on subsequent events to decide
whether an existing `veripsa-ack` label is still valid for the
**current** coupling, or whether the coupling has materially changed
and the ack is stale. Integrators generally do not need to parse this
marker.

## Check-run idempotency

Veripsa upserts **one** check per (PR head commit, App). Re-analysis of
the same head commit updates the existing check in place rather than
creating a new one.

## What Veripsa does NOT post

- Veripsa does not open or close PRs.
- Veripsa does not push commits, suggest commits, or open PRs of its
  own.
- Veripsa does not post issue comments outside the PR's own comment
  thread.
- Veripsa does not post review comments on individual diff lines.
- Veripsa never posts a `failure`, `cancelled`, or `timed_out`
  conclusion as part of its verdict surface.
