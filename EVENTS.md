# GitHub events Veripsa subscribes to

The Veripsa GitHub App registers for the events listed below. The
authoritative source is the App manifest; this page is a human-readable
summary of what each event is used for from the **integrator's** point
of view. It does **not** describe the engine's internal processing.

If this page ever diverges from the App's actual registration, the App
manifest is the truth — please [open an issue](./.github/ISSUE_TEMPLATE/)
and the spec will be corrected.

## Permissions

The App requests the following GitHub permissions (read-only unless
noted):

| Permission       | Level | Why                                                 |
|------------------|-------|-----------------------------------------------------|
| `contents`       | read  | Read repository structure (paths, refs, blob SHAs). |
| `pull_requests`  | write | Post advisory comments and manage the ack label.    |
| `checks`         | write | Post advisory check runs on PR head commits.        |
| `metadata`       | read  | Standard GitHub App requirement.                    |

Veripsa never requests `contents: write`. It does not push commits, open
PRs, or change branch protection.

## Subscribed events

### `pull_request`

The primary event. Veripsa reads PR-level structure (head SHA, base ref,
changed files) to maintain its pre-merge view of in-flight work.

Triggers analysis on: `opened`, `synchronize`, `reopened`,
`ready_for_review`, `edited` (when the base ref retargets),
`labeled` / `unlabeled` (only when the changed label is `veripsa-ack` —
see [`ACK_LABEL.md`](./ACK_LABEL.md)), and on transitions that retire a
PR from the in-flight set (`closed`, `merged`).

### `push`

Used to detect direct-to-branch changes (including branch-only work that
has not yet opened a PR) so the in-flight view stays current.

### `repository`

Used to track repository lifecycle (renamed, transferred, archived,
deleted) so Veripsa's view of which repositories it watches stays
consistent.

### `check_suite` and `check_run`

Used so Veripsa can observe whether other checks on a PR have completed.
The App posts its **own** check runs on PR head commits (see
[`OUTPUT.md`](./OUTPUT.md)).

### `merge_group`

Subscribed so Veripsa can stay consistent with repositories that use
GitHub's merge queue feature. Veripsa is **not** a merge queue itself;
this subscription exists only to keep the in-flight view honest when one
is in use.

### `installation` and `installation_repositories`

Lifecycle events for the App itself. Veripsa uses these to:

- onboard newly added repositories,
- release in-flight reservations when a repository is removed or the App
  is uninstalled / suspended,
- clean up data when the App is uninstalled (`installation.deleted`).

## What Veripsa does **not** subscribe to

Among the events Veripsa explicitly does not request: `issues`,
`issue_comment` (except where carried implicitly by the PR APIs),
`release`, `workflow_run`, `repository_dispatch`, organization-level
events, and anything that would imply reading file bodies.

## Payload-shape examples

Veripsa branches on a small, stable subset of each payload. The
following are the fields integrators most often need to mirror when
writing tools that consume the same webhook stream.

### `pull_request`

```json
{
  "action": "opened",
  "number": 42,
  "pull_request": {
    "number": 42,
    "head": { "sha": "<40-hex>", "ref": "<branch>" },
    "base": { "ref": "main" },
    "draft": false,
    "labels": [ { "name": "veripsa-ack" } ]
  },
  "repository": { "full_name": "<owner>/<repo>" },
  "installation": { "id": 12345678 },
  "sender": { "login": "<actor>" }
}
```

Veripsa keys on `action`, `pull_request.head.sha`, `pull_request.number`,
`pull_request.draft`, `pull_request.labels[].name` (only the
`veripsa-ack` entry), and `repository.full_name`. The `installation.id`
identifies the GitHub App installation that received the event.

### `push`

```json
{
  "ref": "refs/heads/<branch>",
  "before": "<40-hex>",
  "after":  "<40-hex>",
  "repository": { "full_name": "<owner>/<repo>" },
  "installation": { "id": 12345678 }
}
```

### `installation` / `installation_repositories`

```json
{
  "action": "created",
  "installation": {
    "id": 12345678,
    "account": { "login": "<owner>", "type": "Organization" }
  },
  "repositories_added": [ { "full_name": "<owner>/<repo>" } ],
  "repositories_removed": []
}
```

These examples are abridged — GitHub adds many more fields to each
payload. Veripsa ignores anything not listed here at the routing layer.

## Language coverage

Coverage varies by repository shape. Files Veripsa understands in depth
participate in richer collision detection; files outside that envelope are
still tracked so that direct same-file collisions are always caught, and
Veripsa returns an honest `Unknown` rather than a false "clear" when it
cannot see enough. The coverage envelope is described at a high level on
[veripsa.com/docs](https://veripsa.com/docs); implementation conditions are
not published.

If there is a language you need covered, [open a feature
request](./.github/ISSUE_TEMPLATE/).

## Source

This page is derived from the App's registered manifest on GitHub
and the event dispatch in the App's webhook handler.
If you see the App behaving in a way this page does not describe, please
[open an issue](./.github/ISSUE_TEMPLATE/).
