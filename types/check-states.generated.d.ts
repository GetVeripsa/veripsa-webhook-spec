/** Generated from contract/check-states.json. Do not edit by hand. */
export type VeripsaCheckToken =
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

/** @deprecated Use VeripsaCheckToken; operational states are not verdicts. */
export type VeripsaVerdictToken = VeripsaCheckToken;

export type VeripsaUnderlyingVerdict =
  | "clear"
  | "heads_up"
  | "wait_in_line"
  | "unknown"
  | "merge_conflict_markers";

export type VeripsaCheckState =
  | {
      token: "Clear";
      conclusion: "success";
      underlyingVerdict: "clear";
      acknowledged?: never;
    }
  | {
      token: "Clear to land";
      conclusion: "success";
      underlyingVerdict: "clear";
      acknowledged?: never;
    }
  | {
      token: "Heads up";
      conclusion: "neutral";
      underlyingVerdict: "heads_up";
      acknowledged?: never;
    }
  | {
      token: "Wait in line";
      conclusion: "neutral";
      underlyingVerdict: "wait_in_line";
      acknowledged?: never;
    }
  | {
      token: "Unknown";
      conclusion: "neutral";
      underlyingVerdict: "unknown";
      acknowledged?: never;
    }
  | {
      token: "Paused (acknowledge to proceed)";
      conclusion: "action_required";
      underlyingVerdict: "heads_up" | "wait_in_line";
      acknowledged?: false;
    }
  | {
      token: "Acknowledged";
      conclusion: "neutral";
      underlyingVerdict: "heads_up" | "wait_in_line";
      acknowledged: true;
    }
  | {
      token: "Unresolved merge conflict markers";
      conclusion: "action_required";
      underlyingVerdict: "merge_conflict_markers";
      acknowledged?: never;
    }
  | {
      token: "Acknowledgement verification pending";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Heading to";
      conclusion: "success";
      acknowledged?: never;
    }
  | {
      token: "Watching";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Early-access limit reached";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Changed files not read";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Branch state not verified";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Merge queue: clear";
      conclusion: "success";
      acknowledged?: never;
    }
  | {
      token: "Merge queue: review overlap";
      conclusion: "neutral";
      acknowledged?: never;
    }
  | {
      token: "Merge queue: not analyzed";
      conclusion: "neutral";
      acknowledged?: never;
    };
