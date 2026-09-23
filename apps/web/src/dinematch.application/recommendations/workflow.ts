import type { WorkflowStep } from "./contracts";

/** The visible stages mirror the five LangGraph agents planned for the API. */
export const recommendationWorkflowSteps: readonly WorkflowStep[] = [
  { label: "Understand", description: "Interpret preferences" },
  { label: "Retrieve", description: "Find nearby candidates" },
  { label: "Filter", description: "Keep hard constraints intact" },
  { label: "Rank", description: "Compare fit" },
  { label: "Validate", description: "Check evidence" },
];
