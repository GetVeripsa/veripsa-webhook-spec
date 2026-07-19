# Webhook event contract

Generated from `contract/webhook-events.json` for contract **v1.0.0**. This table describes the reduced normalized routing envelope, not the raw GitHub body.

| Event | Required normalized fields | Optional fields | Used for | Retained boundary | Transient-only boundary |
| --- | --- | --- | --- | --- | --- |
| `pull_request` | `action`, `installationId`, `repositoryFullName`, `prNumber`, `headSha`, `baseRef` | `branchRef` | PR lifecycle, head/base identity, changed-file routing, and exact veripsa-ack label transitions. | Reduced identifiers, refs, labels, paths, processing state, and timestamps as documented in DATA_HANDLING.md. | Original webhook body, PR/source/diff bodies, and fields outside the reduced routing surface. |
| `push` | `installationId`, `repositoryFullName`, `branchRef`, `headSha` | `action` | Direct-to-branch and branch-only work tracking. | Reduced repository/ref/commit and processing metadata. | Original webhook body and commit/file bodies. |
| `repository` | `action`, `installationId`, `repositoryFullName` | — | Rename, transfer, archive, and deletion lifecycle consistency. | Reduced repository and lifecycle identifiers/status. | Original webhook body and unrelated repository fields. |
| `check_suite` | `action`, `installationId`, `repositoryFullName` | `headSha` | Observe other check completion and recover a missing fresh-head Veripsa check. | Reduced check/head identifiers and processing outcome when needed operationally. | Check output bodies and unrelated suite payload fields. |
| `check_run` | `action`, `installationId`, `repositoryFullName` | `headSha` | Observe other check completion and the App's own requested-check lifecycle. | Reduced check/head identifiers and processing outcome when needed operationally. | Other providers' check output text and unrelated payload fields. |
| `merge_group` | `action`, `installationId`, `repositoryFullName`, `headSha`, `baseRef` | — | Keep the in-flight view consistent with GitHub merge queues. | Reduced merge-group, repository, ref, head, and processing metadata. | Original webhook body and unrelated merge-group fields. |
| `installation` | `action`, `installationId`, `accountLogin`, `accountType` | — | Install, suspend, unsuspend, and uninstall lifecycle. | Installation/account identifiers and lifecycle audit metadata. | Original webhook body and unrelated account fields. |
| `installation_repositories` | `action`, `installationId`, `accountLogin`, `accountType`, `repositoriesAdded`, `repositoriesRemoved` | — | Add or remove repositories from an installation. | Installation/account/repository identifiers and lifecycle processing state. | Original webhook body and unrelated repository fields. |
