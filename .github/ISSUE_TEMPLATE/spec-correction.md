---
name: Spec correction
about: The spec on this repo and the App's actual behaviour disagree
title: "[spec] "
labels: spec-correction
assignees: ''
---

## Where in the spec?

Which file and section? (e.g. `OUTPUT.md` → "The verdict ladder", or
`EVENTS.md` → "Subscribed events".)

## What does the spec say?

Quote (or screenshot) the spec line you believe is wrong.

## What did the App actually do?

Describe what you observed on a real PR or a real webhook payload:

- which event you saw,
- which check title / `conclusion` was posted,
- which marker text appeared in the comment,
- or which label-event behaviour you observed.

> Example: "The spec says `Veripsa — Heads up` posts `neutral`, but on
> PR-17 I saw the check posted as `action_required`."

**Do not paste private source code, diffs, or file contents** — this
spec repo is content-free and we do not need them. Pasting the check
title, the comment marker, the conclusion, and the verdict word is
enough.

## When did you observe it?

A date or a date range. The Veripsa team correlates against the deploy
log.

## Anything else?

(Optional.) Screenshots of the GitHub check or the comment (with
private content redacted) help.

---

**Please do not include:**

- Source code or file contents from your repo.
- Diffs or commit patches.
- Customer names or third-party identifiers.

We only need to know what Veripsa's surfaces showed you and what the
spec on this repo said.
