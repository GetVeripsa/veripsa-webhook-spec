export * from "./check-states.generated";
export * from "./webhook-events.generated";
import type { VeripsaCheckState } from "./check-states.generated";
import type { VeripsaWebhookRoutingEnvelope } from "./webhook-events.generated";

export type VeripsaCheckName = "Veripsa";
export type VeripsaConclusion = "success" | "neutral" | "action_required";

export interface VeripsaCheckRunBase {
  /** Literal check_run.name. It is not the human-facing title. */
  name: VeripsaCheckName;
  /** Full check_run.output.title. Branch on token, not the full sentence. */
  title: string;
  prNumber?: number;
  repositoryFullName?: string;
  headSha?: string;
}
export type VeripsaCheckRunSignal = VeripsaCheckRunBase & VeripsaCheckState;

/**
 * Opaque token validated at the normalization boundary as exactly 12 lowercase
 * hexadecimal characters. The brand prevents arbitrary strings from being
 * treated as validated tokens in TypeScript; consumers must validate first.
 */
declare const veripsaOpaqueLowercaseHex12Brand: unique symbol;
export type VeripsaOpaqueLowercaseHex12 = string & {
  readonly [veripsaOpaqueLowercaseHex12Brand]: "VeripsaOpaqueLowercaseHex12";
};

/** Runtime wire format: <!-- veripsa-ack-snap:<12 lowercase hex> -->. */
export type VeripsaAckSnapshotMarker =
  `<!-- veripsa-ack-snap:${VeripsaOpaqueLowercaseHex12} -->`;

export interface VeripsaPrCommentSurface {
  marker: `<!-- veripsa:PR-${number} -->`;
  ackSnapshotMarker?: VeripsaAckSnapshotMarker;
  /** Clean Clear is check-only; a clear coordination comment normalizes to Clear to land. */
  leadingVerdict:
    | "Clear to land."
    | "Wait in line."
    | "Heads up."
    | "Heads up — minor overlap."
    | "Unknown."
    | "Acknowledged.";
  partnerRefs?: string[];
  branchRefs?: string[];
  paths?: string[];
}

export interface VeripsaAckLabelContract {
  name: "veripsa-ack";
  meaning: "seen_and_proceeding";
  repositoryDefinitionCreatedBy: "veripsa_when_needed";
  appliedToPullRequestBy: "human_or_agent";
  effectWhenPaused: "action_required_to_neutral";
  staleWhenMaterialCouplingChanges: true;
}

/** @deprecated Use VeripsaWebhookRoutingEnvelope; this alias remains for v1 compatibility. */
export type VeripsaWebhookRoutingEvent = VeripsaWebhookRoutingEnvelope;
