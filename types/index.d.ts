/**
 * Public TypeScript declarations for the Veripsa GitHub App integration
 * surface. These types describe stable tokens and public payload shapes only.
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
  | "Unresolved merge conflict markers";

export type VeripsaUnderlyingVerdict =
  | "clear"
  | "heads_up"
  | "wait_in_line"
  | "unknown"
  | "merge_conflict_markers";

export interface VeripsaCheckRunSignal {
  /** Literal check-run name posted by the GitHub App. */
  name: VeripsaCheckName;

  /** Human title. Branch on `token`, not the full title string. */
  title: string;

  /** Stable token after `Veripsa — `. */
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

  /** Leading bold token in the rendered Markdown body. */
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
  repositoryFullName: string;
  installationId?: number;
  prNumber?: number;
  headSha?: string;
  baseRef?: string;
  branchRef?: string;
}
