# Data handling

The Privacy Policy at <https://veripsa.com/privacy> is controlling if this summary ever diverges.

## What reaches the service

GitHub sends signed webhook requests for repositories selected in an installation. Veripsa reduces each request before durable queuing. The original body exists transiently during handling and is not the durable queue payload or application-log content.

Veripsa may read repository files and diff data transiently through GitHub APIs. Source and diff bodies are discarded rather than retained or displayed. GitHub secret-store values are not exposed to the App. A committed configuration file may be read transiently, but its body and values are not retained.

## What may be retained

Content-free service metadata may include installation/account/repository/PR/commit/delivery identifiers; public GitHub handles; repository/ref/path/line-range/configuration-key/schema/language/symbol names; fingerprints; named structural relationships; coverage freshness; advisory/check/comment/ACK state; delivery/retry/outcome/error metadata; and timestamps.

Names can themselves contain personal or customer information, so Veripsa treats them as scoped customer data. Source bodies, diff bodies, commit-message bodies, PR/issue bodies, and configuration/secret value bodies are not retained.

## Retention classes

| Class | Retention |
| --- | --- |
| Active content-free working set | Kept while needed for an installed repository; inactive rebuildable rows may normally be pruned after 30 days; purged on uninstall and account erasure. |
| Operational push and landing telemetry | 30 days, then pruned. |
| Webhook delivery audit | Reduced payload cleared after processing; terminal rows pruned after 30 days. |
| Advisory history | Append-only content-free record retained until account erasure. |
| Account-lifecycle audit | Append-only operational record retained until account erasure. |

Uninstall stops new processing and purges rebuildable working state. Account erasure also removes append-only advisory and lifecycle records; request it through <https://veripsa.com/support> or `support@veripsa.com`.
