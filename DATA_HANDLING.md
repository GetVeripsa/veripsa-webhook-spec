# Data handling

This document describes the public data boundary of Veripsa Core. It says
what can reach the service, what can be retained, and how deletion works. It
does **not** describe Veripsa's private analysis, ranking, or scoring methods.

The [Privacy Policy](https://veripsa.com/privacy) is the controlling policy if
this summary and the live policy ever differ.

## What reaches the service

GitHub sends signed webhook requests for the events and repositories covered
by an installation. Veripsa reduces each request to the fields needed for
routing and processing before it enters the durable delivery queue. The
original request body exists transiently during request handling; it is not
kept as the durable queue payload or written to application logs.

To keep an advisory current, Veripsa Core may also read repository files and
diff data transiently through the GitHub API. Source file bodies and diff
bodies are discarded rather than stored or displayed. GitHub secret-store
values are not exposed to the App and are never available to read. Committed
configuration text, including a committed `.env`-style file, may be read
transiently, but its body and values are not retained.

## What may be retained

The retained data is content-free service metadata, including:

- GitHub installation, account, repository, pull-request, commit, and delivery
  identifiers;
- public GitHub login handles needed to identify an author, sender, or actor;
- repository and pull-request metadata such as owner/repository name, PR
  number, branch or ref, commit and content fingerprints, labels, changed path
  names, line ranges, and timestamps;
- content-free structural metadata such as language, file/config/schema and
  symbol names and kinds, and named relationship types between those records;
- content-free working state such as advisory state, in-flight coordination,
  coverage freshness/counts, and check, comment, and optional ACK state;
- delivery and lifecycle metadata such as event/action, processing status,
  retry state, outcome, and operational error details.

GitHub login handles and repository, path, configuration-key, or symbol names
can reveal personal or customer information even though they are not source
bodies. Veripsa treats them as scoped customer data. Commit-message bodies, PR
or issue bodies, source bodies, diff bodies, and configuration or secret value
bodies are not retained.

## Retention and deletion

| Data class | Retention and deletion |
| --- | --- |
| Active content-free working set | Kept while needed to serve an installed repository. Inactive rebuildable working-set and cache rows may be pruned after a period of inactivity, normally 30 days. Purged on uninstall and account erasure. |
| Operational push and landing telemetry | Retained for 30 days, then pruned. |
| Webhook delivery audit | A completed delivery's reduced payload is cleared as soon as processing completes. Terminal completed or failed delivery rows are pruned after 30 days. |
| Advisory history | Kept as an append-only content-free record until account erasure; it is not the live working set. |
| Account-lifecycle audit | Kept as an append-only operational record until account erasure. |

Uninstalling the GitHub App stops new processing and purges the rebuildable
working set. To delete append-only advisory and lifecycle records as well,
request account erasure at [support@veripsa.com](mailto:support@veripsa.com).

You can limit or change the repositories in scope from the GitHub App's
installation settings at any time.

## Canonical policy and security links

- [Privacy Policy](https://veripsa.com/privacy)
- [Trust Center and detailed retention table](https://veripsa.com/trust)
- [Security overview](https://veripsa.com/security)
- [Vulnerability disclosure](https://veripsa.com/security/disclosure)
