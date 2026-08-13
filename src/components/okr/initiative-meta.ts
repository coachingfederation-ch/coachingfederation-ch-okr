import type {
  InitiativeAvailability,
  InitiativeCommitment,
  InitiativeHelpNeeded,
} from "@/lib/okr-schemas";
import type { StringKey } from "@/lib/i18n-strings";

export const AVAILABILITY_KEY: Record<InitiativeAvailability, StringKey> = {
  open: "initiative.availability.open",
  blocked: "initiative.availability.blocked",
  parked: "initiative.availability.parked",
};

export const AVAILABILITY_CHIP: Record<InitiativeAvailability, string> = {
  open: "border-primary/30 bg-primary/10 text-primary",
  blocked: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  parked: "border-border bg-muted text-muted-foreground",
};

export const COMMITMENT_KEY: Record<InitiativeCommitment, StringKey> = {
  one_off: "initiative.commitment.one_off",
  recurring: "initiative.commitment.recurring",
  workstream: "initiative.commitment.workstream",
};

export const HELP_NEEDED_KEY: Record<InitiativeHelpNeeded, StringKey> = {
  lead: "initiative.helpNeeded.lead",
  helpers: "initiative.helpNeeded.helpers",
  skill: "initiative.helpNeeded.skill",
};

export const HELP_GROUP_KEY: Record<InitiativeHelpNeeded | "unscoped", StringKey> = {
  lead: "volunteer.group.lead",
  helpers: "volunteer.group.helpers",
  skill: "volunteer.group.skill",
  unscoped: "volunteer.group.unscoped",
};

/** Smallest commitment first is deliberate: it lowers the bar to say yes. */
export const COMMITMENT_ORDER: Record<string, number> = {
  one_off: 0,
  recurring: 1,
  workstream: 2,
};

export function commitmentRank(c: InitiativeCommitment | null): number {
  return c ? (COMMITMENT_ORDER[c] ?? 3) : 3;
}

/** Amber treatment reused from undefined instruments on key results. */
export const AMBER_NOTE =
  "inline-flex items-center rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700";

export function formatUpdated(iso: string | null, locale: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

/** An initiative flattened with its OKR/KR context, shared by both portfolio views. */
export type FlatInitiative = import("@/lib/okr-schemas").InitiativeDTO & {
  okrTitle: string;
  okrId: string;
  okrNumber: number;
  krLabel: string;
  /** Labels of the key results this initiative also contributes to (secondary links). */
  secondaryLabels: string[];
  /** Resolved team name, or null when the work has not been picked up by a team. */
  teamName: string | null;
};
