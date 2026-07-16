/**
 * Public TypeScript declarations for the Veripsa GitHub App integration
 * surface. These types describe normalized public signals, not raw GitHub
 * webhook or check-run payloads. See OUTPUT.md for the normalization rules.
 * They do not expose Veripsa Core engine internals.
 */

export type VeripsaCheckName = "Veripsa";

export type VeripsaConclusion =
  | "success"
  | "neutral"
  | "action_required";

export type VeripsaVerdictToken =
  | "Clear"
  | "Clear to land"
  | "Heads up"
  | "Wait in line"
  | "Unknown"
  | "Paused (acknowledge to proceed)"
  | "Acknowledged"
  | "Unresolved merge conflict markers"
  | "Acknowledgement verification pending"
  | "Heading to"
  | "Watching"
  | "Early-access limit reached"
  | "Changed files not read"
  | "Branch state not verified"
  | "Merge queue: clear"
  | "Merge queue: review overlap"
  | "Merge queue: not analyzed";

export type VeripsaUnderlyingVerdict =
  | "clear"
  | "heads_up"
  | "wait_in_line"
  | "unknown"
  | "merge_conflict_markers";

export interface VeripsaCheckRunSignal {
  /**
   * Normalized view: `name` = check_run.name, `title` = check_run.output.title,
   * `conclusion` = check_run.conclusion, and `token` follows OUTPUT.md.
   */
  /** Literal check-run name posted by the GitHub App. */
  name: VeripsaCheckName;

  /** Human title. Branch on `token`, not the full title string. */
  title: string;

  /** Stable normalized token derived from the observable title. */
  token: VeripsaVerdictToken;

  /** GitHub check-run conclusion. */
  conclusion: VeripsaConclusion;

  /** Underlying verdict represented by the public token. */
  underlyingVerdict?: VeripsaUnderlyingVerdict;

  /** Pull request number when the check belongs to a PR. */
  prNumber?: number;

  /** Repository full name in `owner/name` form. */
  repositoryFullName?: string;

  /** PR head commit SHA. */
  headSha?: string;

  /** Whether `veripsa-ack` currently resolves this material coupling. */
  acknowledged?: boolean;
}

export interface VeripsaPrCommentSurface {
  /** Stable marker at the top of the Veripsa PR comment. */
  marker: `<!-- veripsa:PR-${number} -->`;

  /** Optional marker that binds ack to a specific material coupling. */
  ackSnapshotMarker?: `<!-- veripsa-ack-snap:${string} -->`;

  /**
   * Normalized verdict prefix for a coordination comment. These legacy values
   * are not the full human-facing bold sentence; see OUTPUT.md.
   */
  leadingVerdict:
    | "Clear to land."
    | "Wait in line."
    | "Heads up."
    | "Heads up — minor overlap."
    | "Unknown."
    | "Acknowledged.";

  /** Content-free PR refs such as `PR-17`. */
  partnerRefs?: string[];

  /** Content-free branch refs such as `BR-feature-agent-a`. */
  branchRefs?: string[];

  /** Content-free paths rendered in the comment body. */
  paths?: string[];
}

export interface VeripsaAckLabelContract {
  name: "veripsa-ack";
  meaning: "seen_and_proceeding";
  appliedBy: "human_or_agent";
  effectWhenPaused: "action_required_to_neutral";
  staleWhenMaterialCouplingChanges: true;
}

export interface VeripsaWebhookRoutingEvent {
  event:
    | "pull_request"
    | "push"
    | "repository"
    | "check_suite"
    | "check_run"
    | "merge_group"
    | "installation"
    | "installation_repositories";
  action?: string;
  /** Present for repository-scoped events; absent for account-level lifecycle events. */
  repositoryFullName?: string;
  installationId?: number;
  prNumber?: number;
  headSha?: string;
  baseRef?: string;
  branchRef?: string;
}
