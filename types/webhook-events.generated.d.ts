/** Generated from contract/webhook-events.json. Do not edit by hand. */
export type VeripsaWebhookEventName =
  | "pull_request"
  | "push"
  | "repository"
  | "check_suite"
  | "check_run"
  | "merge_group"
  | "installation"
  | "installation_repositories";

export type VeripsaWebhookRoutingEnvelope =
  | {
      event: "pull_request";
      action: string;
      installationId: number;
      repositoryFullName: string;
      prNumber: number;
      headSha: string;
      baseRef: string;
      branchRef?: string;
    }
  | {
      event: "push";
      installationId: number;
      repositoryFullName: string;
      branchRef: string;
      headSha: string;
      action?: string;
    }
  | {
      event: "repository";
      action: string;
      installationId: number;
      repositoryFullName: string;
    }
  | {
      event: "check_suite";
      action: string;
      installationId: number;
      repositoryFullName: string;
      headSha?: string;
    }
  | {
      event: "check_run";
      action: string;
      installationId: number;
      repositoryFullName: string;
      headSha?: string;
    }
  | {
      event: "merge_group";
      action: string;
      installationId: number;
      repositoryFullName: string;
      headSha: string;
      baseRef: string;
    }
  | {
      event: "installation";
      action: string;
      installationId: number;
      accountLogin: string;
      accountType: "User" | "Organization";
    }
  | {
      event: "installation_repositories";
      action: string;
      installationId: number;
      accountLogin: string;
      accountType: "User" | "Organization";
      repositoriesAdded: string[];
      repositoriesRemoved: string[];
    };
