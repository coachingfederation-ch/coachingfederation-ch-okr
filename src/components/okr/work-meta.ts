import type {
  BetConfidence,
  EvidenceType,
  InitiativeKind,
  LearningDecision,
  PhaseType,
  SignalDirection,
  WorkSize,
} from "@/lib/okr-schemas";
import type { StringKey } from "@/lib/i18n-strings";

/**
 * Presentation metadata for the ASPIRE-style portfolio. Kept next to the
 * existing `initiative-meta` helpers so both portfolio views share one
 * vocabulary instead of each route inventing its own labels and colours.
 */

export const KIND_KEY: Record<InitiativeKind, StringKey> = {
  candidate: "work.kind.candidate",
  simple_task: "work.kind.simple_task",
  initiative: "work.kind.initiative",
};

export const KIND_PLURAL_KEY: Record<InitiativeKind, StringKey> = {
  candidate: "work.kinds.candidate",
  simple_task: "work.kinds.simple_task",
  initiative: "work.kinds.initiative",
};

/** Chips lean on brand tokens: yellow for raw ideas, blue for committed work. */
export const KIND_CHIP: Record<InitiativeKind, string> = {
  candidate: "border-accent/50 bg-accent/15 text-foreground",
  simple_task: "border-highlight/40 bg-highlight/10 text-primary",
  initiative: "border-primary/30 bg-primary/10 text-primary",
};

export const SIZE_KEY: Record<WorkSize, StringKey> = {
  small: "work.size.small",
  medium: "work.size.medium",
};

export const PHASE_TYPE_KEY: Record<PhaseType, StringKey> = {
  delivery: "work.phaseType.delivery",
  discovery: "work.phaseType.discovery",
};

export const CONFIDENCE_KEY: Record<BetConfidence, StringKey> = {
  pretty_confident: "work.confidence.pretty_confident",
  worth_testing: "work.confidence.worth_testing",
  wild_card: "work.confidence.wild_card",
};

export const CONFIDENCE_CHIP: Record<BetConfidence, string> = {
  pretty_confident: "border-primary/30 bg-primary/10 text-primary",
  worth_testing: "border-highlight/40 bg-highlight/10 text-primary",
  wild_card: "border-accent/50 bg-accent/15 text-foreground",
};

export const EVIDENCE_KEY: Record<EvidenceType, StringKey> = {
  see: "work.evidence.see",
  hear: "work.evidence.hear",
  measure: "work.evidence.measure",
};

export const DIRECTION_KEY: Record<SignalDirection, StringKey> = {
  up: "work.direction.up",
  down: "work.direction.down",
};

export const DECISION_KEY: Record<LearningDecision, StringKey> = {
  growing: "work.decision.growing",
  tweak: "work.decision.tweak",
  surprise: "work.decision.surprise",
  let_go: "work.decision.let_go",
};

export const DECISION_CHIP: Record<LearningDecision, string> = {
  growing: "border-primary/30 bg-primary/10 text-primary",
  tweak: "border-highlight/40 bg-highlight/10 text-primary",
  surprise: "border-accent/50 bg-accent/15 text-foreground",
  let_go: "border-border bg-muted text-muted-foreground",
};

/** How much planning structure a kind carries. Drives the detail one-pager. */
export function hasPlanningLayer(kind: InitiativeKind): boolean {
  return kind === "initiative";
}

export function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateRange(
  start: string | null,
  end: string | null,
  locale: string,
): string | null {
  if (!start && !end) return null;
  return `${formatDate(start, locale)} → ${formatDate(end, locale)}`;
}
