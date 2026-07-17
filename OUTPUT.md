# What Veripsa posts back

For every analyzed PR, Veripsa upserts one **check run** on the PR's head
commit, carrying the verdict and a GitHub `conclusion`. When there is
coordination context worth explaining, it may also upsert one managed **PR
comment** with a stable HTML marker. A PR that stays clear from its first
analysis may remain check-only.

Both surfaces are updated in place when present; re-analysis does not append
duplicate checks or managed comments.

> Veripsa does not block merges by itself. Whether a Veripsa check is
> required to merge is entirely controlled by your repository's
> branch-protection rules.

## The verdict ladder

Veripsa surfaces one of four verdicts on the check run. The exact title
copy after the em-dash may evolve; the **shape** of the ladder is stable
and is what integrators should branch on (via the check title prefix,
not full-string match).

The table below is the ladder in its **advisory form**. A minor Heads up is a
variant of Heads up, not a fifth verdict. For a
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

### Normalized check signal

The package schema/type named `VeripsaCheckRunSignal` is a documented
**normalized view**, not GitHub's raw check-run payload. Map
`check_run.name` to `name`, `check_run.output.title` to `title`, and
`check_run.conclusion` to `conclusion`. Normalize the title to `token` as
follows:

- For verdict titles beginning `Veripsa — `, take the stable prefix described
  above and normalize only its first letter to title case.
- Map `Veripsa is now watching` to `Watching` and
  `Veripsa paused — early-access limit reached` to
  `Early-access limit reached`.
- Map the documented changed-files, branch-verification, heading,
  acknowledgement-verification, and merge-queue titles to their correspondingly
  named enum value; dynamic branch text is not part of the `Heading to` token.
- Treat an unknown future title as an unsupported token; branch on the GitHub
  `conclusion` and display the full title rather than guessing a verdict.

## When the `conclusion` changes

- **`success`** is posted for a **Clear** PR verdict and the
  **Merge queue: clear** operational state.
- **`neutral`** is posted for the advisory verdicts, for the
  **Acknowledged** pause state, and for the informational states below.
- **`action_required`** is posted in exactly two situations: a material
  in-flight collision that has not yet been acknowledged (see
  [一時停止 (pause-and-acknowledge)](#一時停止-pause-and-acknowledge))
  and unresolved merge conflict markers (below).

A `neutral` check is, by GitHub's definition, a check that has completed
and does not gate a merge. An `action_required` check gates the merge
only if your branch-protection policy marks the Veripsa check as
required. The signal you act on lives in the **check title** and, when present,
the managed **PR comment**.

## Informational (non-verdict) check states

Veripsa also posts checks for operational states that are not themselves a PR
coordination verdict. Normalize their observable titles to the tokens below:

- **"Veripsa is now watching"** — posted on first install / first
  repository ingest before a PR verdict is available. Token: `Watching`.
- **"Veripsa paused — early-access limit reached"** — posted when the
  installation is beyond its plan's coverage and Veripsa is not
  analyzing further. This is a visible state, not a silent miss; it is
  `neutral`, never `failure`. Token: `Early-access limit reached`.
- **"Veripsa — changed files not read, not analyzed"** — posted when
  Veripsa could not read the PR's changed-files list for that event.
  Veripsa does not silently fall back to "Clear" in this case; it
  surfaces that it did not analyze. Token: `Changed files not read`.
- **"Veripsa — branch state not verified, retrying"** — posted when live
  branch state could not be verified safely. Token: `Branch state not verified`.
- **"Veripsa — acknowledgement verification pending"** — preserves an
  existing ACK without silently rebinding it while branch state is unavailable.
  Token: `Acknowledgement verification pending`.
- **"Veripsa — heading to <branch>"** — no in-flight reservation is recorded
  for that PR yet. Token: `Heading to`; the branch is dynamic display text.
- **"Veripsa — merge queue: clear"**, **"review overlap"**, or **"not
  analyzed"** — the observable merge-group states. Tokens: `Merge queue:
  clear`, `Merge queue: review overlap`, and `Merge queue: not analyzed`.

All of these operational states are `neutral` except `Merge queue: clear`
and `Heading to <branch>`, which are `success`.

## Unresolved merge conflict markers

If the PR's diff adds a paired set of literal git merge conflict marker shapes
(`<<<<<<<` together with `>>>>>>>`) at the start of added lines in one or more
changed files, Veripsa treats it as a likely unresolved conflict and posts a
high-salience result:

| Check title                                          | GitHub `conclusion` |
|-------------------------------------------------------|---------------------|
| `Veripsa — Unresolved merge conflict markers`         | `action_required`   |

There is **no separate second check**: the one-check-per-head-commit
contract (see [Check-run idempotency](#check-run-idempotency)) still
holds. The same check run's conclusion, title, and summary are replaced
with the high-salience lead; any coupling verdict for the same PR remains
visible in the PR comment body, below the conflict-marker block.

This and the pause-and-acknowledge state (next section) are the only two
situations in which Veripsa emits `action_required`. The detector inspects the
diff transiently, but only the path and marker line number cross the retained or
posted boundary; file and diff bodies are not retained or posted. A literal
pair can also appear intentionally (for example, in documentation), so the
result asks for inspection rather than asserting that the change is wrong.

## 一時停止 (pause-and-acknowledge)

Normal Veripsa use requires no acknowledgement step, agent command, copied
merge rule, or extra per-agent setup. When a verdict names a **material**
in-flight collision — **Wait in line**, or **Heads up** with a named in-flight partner PR —
Veripsa posts the check with `conclusion: action_required` until the PR
carries a matching `veripsa-ack` label or the coupling changes. This is a
high-salience GitHub-native signal, not a workflow Veripsa forces: when the
check is not required by repository policy, the PR can still merge without
adding the label. Teams that want an auditable exception can optionally use
the label; see [`ACK_LABEL.md`](./ACK_LABEL.md).

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

The `action_required` conclusion signals that a specific collision deserves
attention and has no matching optional acknowledgement. It is **not** Veripsa
asserting that the change is wrong or imposing an ACK ceremony. Whether it
actually blocks the merge is decided by your branch-protection policy (the
Veripsa check must be marked required for `action_required` to gate the merge).

## The PR comment

When a verdict needs explanation, Veripsa upserts a managed PR comment with
human-readable context and structured pointers an agent can react to. Clear
or no-reservation results may be check-only. The normalized
`VeripsaPrCommentSurface` schema covers verdict-bearing coordination comments;
operational comments remain human-facing unless separately documented.

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

When a PR needs a comment, Veripsa keeps **at most one** marked comment per PR.

- The first analysis that needs a comment creates it with the marker prepended.
- Subsequent comment-bearing analyses **edit the existing comment in place**
  — same marker, replaced body.
- The marker is preserved on edit; the rest of the body may change
  freely between events.
- A PR that stays clear from the start may have no Veripsa PR comment.

### Where structured info lives in the body

The comment body is GitHub-flavored markdown intended for humans. A few
conventions agents can rely on:

- After its `### Veripsa — heading to ...` heading, a coordination comment has
  a bold human lead whose verdict prefix matches the check (for example,
  `Clear`, `Clear to land`, `Wait in line`, `Heads up`, or `Unknown`). Full
  sentence copy and icons may evolve; normalize the prefix to the legacy
  `leadingVerdict` values in the schema rather than matching the entire line.
  On a **paused** PR the bold lead still carries the
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
