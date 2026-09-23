import type { PreferenceChip } from "../contracts";

export interface PreferenceInterpreter {
  interpret(prompt: string, defaults: PreferenceChip[]): PreferenceChip[];
}
