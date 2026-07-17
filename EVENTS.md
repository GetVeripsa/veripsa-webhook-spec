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
| `contents`       | read  | Read repository structure and file text transiently to derive the documented content-free metadata. |
| `merge_queues`   | read  | Keep merge-group state consistent with merge queues. |
| `pull_requests`  | write | Post advisory comments and manage the ack label.    |
| `checks`         | write | Post advisory check runs on PR head commits.        |
| `metadata`       | read  | Standard GitHub App requirement.                    |

Veripsa never requests `contents: write`. It does not push commits, open
PRs, or change branch protection.

GitHub exposes PR conversations and labels through issue-backed APIs. Veripsa
uses them only for the PR's own managed comment and `veripsa-ack` label; it
does not request the `issues` permission or subscribe to Issue events.

## Subscribed events

### `pull_request`

The primary event. Veripsa reads PR-level structure (head SHA, base ref,
changed files) to maintain its pre-merge view of in-flight work.

Triggers analysis on: `opened`, `synchronize`, `reopened`,
`ready_for_review`, `converted_to_draft`, `edited` (when the base ref retargets),
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
[`OUTPUT.md`](./OUTPUT.md)); its own requested suite can also trigger recovery
of a missing check for a fresh PR head.

### `merge_group`

Subscribed so Veripsa can stay consistent with repositories that use
GitHub's merge queue feature. Veripsa is **not** a merge queue itself;
this subscription exists only to keep the in-flight view honest when one
is in use.

## Automatic App lifecycle deliveries

### `installation` and `installation_repositories`

GitHub sends these App lifecycle deliveries automatically; they are not extra
Issue or organization-event subscriptions.

Lifecycle events for the App itself. Veripsa uses these to:

- onboard newly added repositories,
- release in-flight reservations when a repository is removed or the App
  is uninstalled / suspended,
- clean up data when the App is uninstalled (`installation.deleted`).

## What Veripsa does **not** subscribe to

Among the events Veripsa explicitly does not request: `issues`,
`issue_comment`, `sub_issues`, `release`, `workflow_run`, `deployment`,
`deployment_status`, `repository_dispatch`, and organization-level events.

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

These examples are abridged — GitHub adds many more fields to each payload.
They are not a sanitizer allow-list: Veripsa retains only the minimized
routing, lifecycle, structural, and output metadata documented in
[`DATA_HANDLING.md`](./DATA_HANDLING.md).

## Language and framework coverage

Coverage varies by repository shape. This public matrix describes capability
levels, not private analysis or scoring mechanics.

| Coverage tier | Surfaces |
| --- | --- |
| Rich structural | Python, JavaScript/JSX, TypeScript/TSX, Go, Java, Ruby, PHP, C#, Rust, C/C++, Kotlin, Swift, Dart, Elixir, and HTML |
| Component structural | Astro, Vue, and Svelte |
| Stylesheet structural | CSS, SCSS/Sass, Less, and Stylus |
| File-level fallback | Other changed paths remain eligible for direct same-file collision detection. |

Framework and stylesheet tiers also contribute to coverage. This describes
coverage, not private relationship, ranking, or verdict mechanics. When coverage is insufficient, Veripsa returns
`Unknown` rather than a false `Clear`.

If there is a language you need covered, [open a feature
request](./.github/ISSUE_TEMPLATE/).

## Source

This page is derived from the App's registered manifest on GitHub
and the event dispatch in the App's webhook handler.
If you see the App behaving in a way this page does not describe, please
[open an issue](./.github/ISSUE_TEMPLATE/).
