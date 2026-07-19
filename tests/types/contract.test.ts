import type { VeripsaAckSnapshotMarker, VeripsaCheckRunSignal, VeripsaOpaqueLowercaseHex12, VeripsaPrCommentSurface, VeripsaWebhookRoutingEnvelope } from "../../types/index";
const accept = (_value: VeripsaCheckRunSignal) => undefined;
accept({ name: "Veripsa", title: "Veripsa — heading to main", token: "Heading to", conclusion: "success" });
accept({ name: "Veripsa", title: "Veripsa — Paused (acknowledge to proceed)", token: "Paused (acknowledge to proceed)", conclusion: "action_required", underlyingVerdict: "wait_in_line", acknowledged: false });
accept({ name: "Veripsa", title: "Veripsa — Acknowledged", token: "Acknowledged", conclusion: "neutral", underlyingVerdict: "heads_up", acknowledged: true });
// @ts-expect-error Clear cannot be neutral.
accept({ name: "Veripsa", title: "Veripsa — Clear", token: "Clear", conclusion: "neutral", underlyingVerdict: "clear" });
// @ts-expect-error Heading to cannot be neutral.
accept({ name: "Veripsa", title: "Veripsa — heading to main", token: "Heading to", conclusion: "neutral" });
// @ts-expect-error Paused cannot be acknowledged true.
accept({ name: "Veripsa", title: "Veripsa — Paused (acknowledge to proceed)", token: "Paused (acknowledge to proceed)", conclusion: "action_required", underlyingVerdict: "wait_in_line", acknowledged: true });
// @ts-expect-error Acknowledged requires acknowledged true.
accept({ name: "Veripsa", title: "Veripsa — Acknowledged", token: "Acknowledged", conclusion: "neutral", underlyingVerdict: "heads_up", acknowledged: false });
const comment: VeripsaPrCommentSurface = { marker: "<!-- veripsa:PR-7 -->", leadingVerdict: "Clear to land." };
const event: VeripsaWebhookRoutingEnvelope = { event: "merge_group", action: "checks_requested", installationId: 1, repositoryFullName: "example/repo", headSha: "0123456789abcdef0123456789abcdef01234567", baseRef: "main" };
void comment; void event;

declare const validatedAckToken: VeripsaOpaqueLowercaseHex12;
const validAckMarker: VeripsaAckSnapshotMarker = `<!-- veripsa-ack-snap:${validatedAckToken} -->`;
// @ts-expect-error Arbitrary strings are not validated 12-lowercase-hex tokens.
const invalidAckMarker: VeripsaAckSnapshotMarker = "<!-- veripsa-ack-snap:anything -->";
void validAckMarker; void invalidAckMarker;
