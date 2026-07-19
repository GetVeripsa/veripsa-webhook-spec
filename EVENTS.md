# GitHub permissions and events

The GitHub App manifest is the runtime authority; this repository is the versioned public contract for integrators. Report visible drift through the issue templates without including private code.

## Permissions

| Permission | Level | Public purpose |
| --- | --- | --- |
| `contents` | read | Read repository structure and file/diff text transiently to derive content-free metadata. |
| `merge_queues` | read | Keep merge-group state consistent where GitHub merge queues are used. |
| `pull_requests` | write | Maintain the App's managed PR comment, lazily create the label definition when needed, and react to explicit `veripsa-ack` application/removal. |
| `checks` | write | Create or update Veripsa check runs. |
| `metadata` | read | Standard GitHub App repository metadata. |

Veripsa does not request `contents: write`, does not push commits, does not open PRs, and does not change branch protection.

## Event families

The complete normalized event contract is generated in [`WEBHOOK_EVENTS.md`](./WEBHOOK_EVENTS.md) and validated by [`schemas/webhook-routing-envelope.schema.json`](./schemas/webhook-routing-envelope.schema.json):

- `pull_request`
- `push`
- `repository`
- `check_suite`
- `check_run`
- `merge_group`
- `installation`
- `installation_repositories`

The normalized envelope carries `event` explicitly. It does not ask consumers to infer an event name from payload shape.

## Raw payload compatibility schema

[`schemas/webhook-routing-event.schema.json`](./schemas/webhook-routing-event.schema.json) remains at its existing path for v1 compatibility. It validates selected abridged raw bodies only (`pull_request`, `push`, and installation lifecycle). Raw GitHub bodies do not include the `X-GitHub-Event` header, so new integrations should use the normalized envelope instead.

For raw pull-request examples, the top-level `number` is canonical. The semantic example test rejects a contradictory nested `pull_request.number`; standard JSON Schema cannot compare two arbitrary sibling values.

## Events not requested

Veripsa does not subscribe to Issue, issue-comment, sub-issue, release, workflow-run, deployment, deployment-status, repository-dispatch, or organization-level event families.

## `check_suite` and `check_run` boundary

These deliveries are used to observe completion/recovery state. Veripsa may retain reduced check/head identifiers and processing outcomes needed operationally. It does not retain other providers' check output bodies as customer content.
