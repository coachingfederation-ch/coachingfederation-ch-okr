import { z } from "zod";
import { LOCALES, type Locale, type TranslationsMap } from "./i18n-shared";

export type Pillar = "SG" | "OE" | "CE";
export const PILLARS: Pillar[] = ["SG", "OE", "CE"];

export type Contribution = "none" | "secondary" | "primary";
export const CONTRIBUTION_CYCLE: Contribution[] = ["none", "secondary", "primary"];

export type InitiativeStatus = "planned" | "in_progress" | "done" | "canceled";
export const INITIATIVE_STATUSES: InitiativeStatus[] = [
  "planned",
  "in_progress",
  "done",
  "canceled",
];

/**
 * Why a *planned* initiative is or is not moving. Deliberately separate from
 * `status` (delivery progress): availability only carries meaning while the
 * status is 'planned' and must be ignored everywhere else.
 */
export type InitiativeAvailability = "open" | "blocked" | "parked";
export const INITIATIVE_AVAILABILITIES: InitiativeAvailability[] = ["open", "blocked", "parked"];

/** What a volunteer is signing up for, in time. */
export type InitiativeCommitment = "one_off" | "recurring" | "workstream";
export const INITIATIVE_COMMITMENTS: InitiativeCommitment[] = [
  "one_off",
  "recurring",
  "workstream",
];

/** What kind of person the initiative is looking for. */
export type InitiativeHelpNeeded = "lead" | "helpers" | "skill";
export const INITIATIVE_HELP_NEEDED: InitiativeHelpNeeded[] = ["lead", "helpers", "skill"];

export type KrType = "metric" | "milestone";
export const KR_TYPES: KrType[] = ["metric", "milestone"];

export type MilestoneStatus = "not_started" | "in_progress" | "done";
export const MILESTONE_STATUSES: MilestoneStatus[] = ["not_started", "in_progress", "done"];

export const ROLE_LABELS = ["Owner", "Steward", "Contact"] as const;
export type RoleLabel = (typeof ROLE_LABELS)[number];

// Length caps (used both client + server)
export const LIMITS = {
  title: 120,
  roleName: 100,
  customer: 200,
  objective: 1000,
  alignment: 1500,
  kr: 12,
  krText: 500,
  target: 200,
  lead: 100,
  measure: 300,
  instrument: 200,
  value: 60,

  initiative: 300,
  initiativeOwner: 100,
  initiativeDescription: 2000,
  initiativeBlockedReason: 300,
  initiativeSkillNote: 300,
  pillarLabel: 120,
  pillarDescription: 500,
  alignmentPillar: 120,
  alignmentHow: 800,

  // ASPIRE-style planning fields
  idea: 1000,
  whyNow: 800,
  proposedOwner: 100,
  aspiration: 600,
  betPart: 400,
  learningCheckpoint: 200,
  supportNeeded: 800,
  outOfScope: 800,
  leadName: 100,
  signalName: 200,
  signalNote: 300,
  milestoneTitle: 200,
  learningText: 1000,
  authorName: 100,
};

const trimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { message: `Must be ${max} characters or fewer` });

export const uuidSchema = z.string().uuid();

export const localeSchema = z.enum(LOCALES);

export const okrSetPatchSchema = z.object({
  title: trimmedString(LIMITS.title).optional(),
  role_label: z.enum(ROLE_LABELS).optional(),
  role_name: trimmedString(LIMITS.roleName).optional(),
  customer: trimmedString(LIMITS.customer).optional(),
  pillars: z
    .array(z.enum(["SG", "OE", "CE"]))
    .max(3)
    .optional(),
  objective: trimmedString(LIMITS.objective).optional(),
  alignment: trimmedString(LIMITS.alignment).optional(),
});

const dateOrNull = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()])
  .transform((v) => (v ? v : null));

export const keyResultPatchSchema = z.object({
  kr: trimmedString(LIMITS.kr).optional(),
  text: trimmedString(LIMITS.krText).optional(),
  target: trimmedString(LIMITS.target).optional(),
  lead: trimmedString(LIMITS.lead).optional(),
  kr_type: z.enum(["metric", "milestone"]).optional(),
  measure: trimmedString(LIMITS.measure).optional(),
  instrument: trimmedString(LIMITS.instrument).optional(),
  baseline_2026: trimmedString(LIMITS.value).optional(),
  baseline_locked: z.boolean().optional(),
  current_value: trimmedString(LIMITS.value).optional(),
  current_as_of: dateOrNull.optional(),
  target_2027: trimmedString(LIMITS.value).optional(),
  milestone_status: z.enum(["not_started", "in_progress", "done"]).optional(),
  milestone_due: dateOrNull.optional(),
});

/**
 * ASPIRE-style work kinds. All three live in the same `initiatives` table;
 * `kind` decides how much planning structure a card carries.
 */
export type InitiativeKind = "candidate" | "simple_task" | "initiative";
export const INITIATIVE_KINDS: InitiativeKind[] = ["candidate", "simple_task", "initiative"];

export type WorkSize = "small" | "medium";
export const WORK_SIZES: WorkSize[] = ["small", "medium"];

export type PhaseType = "delivery" | "discovery";
export const PHASE_TYPES: PhaseType[] = ["delivery", "discovery"];

export type BetConfidence = "pretty_confident" | "worth_testing" | "wild_card";
export const BET_CONFIDENCES: BetConfidence[] = ["pretty_confident", "worth_testing", "wild_card"];

export type EvidenceType = "see" | "hear" | "measure";
export const EVIDENCE_TYPES: EvidenceType[] = ["see", "hear", "measure"];

export type SignalDirection = "up" | "down";
export const SIGNAL_DIRECTIONS: SignalDirection[] = ["up", "down"];

export type LearningDecision = "growing" | "tweak" | "surprise" | "let_go";
export const LEARNING_DECISIONS: LearningDecision[] = ["growing", "tweak", "surprise", "let_go"];

const planningFields = {
  kind: z.enum(["candidate", "simple_task", "initiative"]).optional(),
  size: z.enum(["small", "medium"]).nullable().optional(),
  team_id: uuidSchema.nullable().optional(),
  idea: trimmedString(LIMITS.idea).optional(),
  why_now: trimmedString(LIMITS.whyNow).optional(),
  proposed_owner: trimmedString(LIMITS.proposedOwner).optional(),
  start_date: dateOrNull.optional(),
  end_date: dateOrNull.optional(),
  phase: z.number().int().min(1).max(20).optional(),
  phase_type: z.enum(["delivery", "discovery"]).nullable().optional(),
  aspiration: trimmedString(LIMITS.aspiration).optional(),
  bet_action: trimmedString(LIMITS.betPart).optional(),
  bet_change: trimmedString(LIMITS.betPart).optional(),
  bet_question: trimmedString(LIMITS.betPart).optional(),
  confidence: z.enum(["pretty_confident", "worth_testing", "wild_card"]).nullable().optional(),
  // `learning_checkpoint` is a real date column: an empty string must become
  // NULL, otherwise Postgres rejects the update with an invalid date syntax.
  learning_checkpoint: dateOrNull.optional(),
  support_needed: trimmedString(LIMITS.supportNeeded).optional(),
  out_of_scope: trimmedString(LIMITS.outOfScope).optional(),
  lead_name: trimmedString(LIMITS.leadName).optional(),
};

export const initiativePatchSchema = z.object({
  text: trimmedString(LIMITS.initiative).min(1, { message: "Cannot be empty" }).optional(),
  owner: trimmedString(LIMITS.initiativeOwner).optional(),
  description: trimmedString(LIMITS.initiativeDescription).optional(),
  status: z.enum(["planned", "in_progress", "done", "canceled"]).optional(),
  availability: z.enum(["open", "blocked", "parked"]).optional(),
  blocked_reason: trimmedString(LIMITS.initiativeBlockedReason).optional(),
  commitment: z.enum(["one_off", "recurring", "workstream"]).nullable().optional(),
  help_needed: z.enum(["lead", "helpers", "skill"]).nullable().optional(),
  skill_note: trimmedString(LIMITS.initiativeSkillNote).optional(),
  ...planningFields,
});

export const initiativeCreateSchema = z.object({
  text: trimmedString(LIMITS.initiative).min(1, { message: "Cannot be empty" }),
  owner: trimmedString(LIMITS.initiativeOwner).optional(),
  description: trimmedString(LIMITS.initiativeDescription).optional(),
  status: z.enum(["planned", "in_progress", "done", "canceled"]).optional(),
  availability: z.enum(["open", "blocked", "parked"]).optional(),
  blocked_reason: trimmedString(LIMITS.initiativeBlockedReason).optional(),
  commitment: z.enum(["one_off", "recurring", "workstream"]).nullable().optional(),
  help_needed: z.enum(["lead", "helpers", "skill"]).nullable().optional(),
  skill_note: trimmedString(LIMITS.initiativeSkillNote).optional(),
  kind: z.enum(["candidate", "simple_task", "initiative"]).optional(),
  team_id: uuidSchema.nullable().optional(),
  idea: trimmedString(LIMITS.idea).optional(),
  why_now: trimmedString(LIMITS.whyNow).optional(),
  proposed_owner: trimmedString(LIMITS.proposedOwner).optional(),
});

export const signalPatchSchema = z.object({
  name: trimmedString(LIMITS.signalName).optional(),
  evidence: z.enum(["see", "hear", "measure"]).optional(),
  how_noticed: trimmedString(LIMITS.signalNote).optional(),
  starting_point: trimmedString(LIMITS.signalNote).optional(),
  direction: z.enum(["up", "down"]).nullable().optional(),
});

export const milestonePatchSchema = z.object({
  title: trimmedString(LIMITS.milestoneTitle).optional(),
  owner: trimmedString(LIMITS.initiativeOwner).optional(),
  due_date: dateOrNull.optional(),
});

export const learningEntryPatchSchema = z.object({
  entry_date: dateOrNull.optional(),
  author_name: trimmedString(LIMITS.authorName).optional(),
  decision: z.enum(["growing", "tweak", "surprise", "let_go"]).optional(),
  what_happened: trimmedString(LIMITS.learningText).optional(),
  signals_telling: trimmedString(LIMITS.learningText).optional(),
  surprised_us: trimmedString(LIMITS.learningText).optional(),
  proud_of: trimmedString(LIMITS.learningText).optional(),
  do_next: trimmedString(LIMITS.learningText).optional(),
  next_move: trimmedString(LIMITS.learningText).optional(),
});

export const alignmentRowPatchSchema = z.object({
  pillar: trimmedString(LIMITS.alignmentPillar).optional(),
  sg: z.enum(["none", "secondary", "primary"]).optional(),
  oe: z.enum(["none", "secondary", "primary"]).optional(),
  ce: z.enum(["none", "secondary", "primary"]).optional(),
  how: trimmedString(LIMITS.alignmentHow).optional(),
});

export const pillarSummaryPatchSchema = z.object({
  label: trimmedString(LIMITS.pillarLabel).optional(),
  description: trimmedString(LIMITS.pillarDescription).optional(),
});

// DTOs
type WithTranslations = {
  translations?: TranslationsMap;
  source_lang?: Locale;
};

export type PillarSummaryDTO = WithTranslations & {
  code: Pillar;
  label: string;
  description: string;
};
export type TeamDTO = WithTranslations & {
  id: string;
  name: string;
  position: number;
  /** Slug of the matching unit in the Welcome app's operational structure. */
  external_slug: string | null;
  is_community: boolean;
};

export type SignalDTO = WithTranslations & {
  id: string;
  initiative_id: string;
  name: string;
  evidence: EvidenceType;
  how_noticed: string;
  starting_point: string;
  direction: SignalDirection | null;
  sort_order: number;
};

export type MilestoneDTO = WithTranslations & {
  id: string;
  initiative_id: string;
  title: string;
  owner: string;
  due_date: string | null;
  sort_order: number;
};

export type LearningEntryDTO = WithTranslations & {
  id: string;
  initiative_id: string;
  entry_date: string;
  author_name: string;
  decision: LearningDecision;
  what_happened: string;
  signals_telling: string;
  surprised_us: string;
  proud_of: string;
  do_next: string;
  next_move: string;
};

export type InitiativeDTO = WithTranslations & {
  id: string;
  okr_set_id: string;
  kr_id: string;
  text: string;
  owner: string;
  description: string;
  status: InitiativeStatus;
  /** Only meaningful while `status` is 'planned'. */
  availability: InitiativeAvailability;
  blocked_reason: string;
  commitment: InitiativeCommitment | null;
  help_needed: InitiativeHelpNeeded | null;
  skill_note: string;
  /** ISO timestamp, surfaced so stale volunteer cards visibly decay. */
  updated_at: string | null;
  sort_order: number;
  secondary_kr_ids: string[];

  // ASPIRE planning layer
  kind: InitiativeKind;
  size: WorkSize | null;
  team_id: string | null;
  idea: string;
  why_now: string;
  proposed_owner: string;
  start_date: string | null;
  end_date: string | null;
  phase: number;
  phase_type: PhaseType | null;
  aspiration: string;
  bet_action: string;
  bet_change: string;
  bet_question: string;
  confidence: BetConfidence | null;
  learning_checkpoint: string | null;
  support_needed: string;
  out_of_scope: string;
  lead_name: string;
  signals: SignalDTO[];
  milestones: MilestoneDTO[];
  learning_entries: LearningEntryDTO[];
};

export type KeyResultDTO = WithTranslations & {
  id: string;
  okr_set_id: string;
  kr: string;
  text: string;
  /** Legacy free-text target from the source document. Kept for reference only. */
  target: string;
  lead: string;
  kr_type: KrType;
  measure: string;
  instrument: string;
  baseline_2026: string;
  baseline_locked: boolean;
  current_value: string;
  current_as_of: string | null;
  target_2027: string;
  milestone_status: MilestoneStatus;
  milestone_due: string | null;
  sort_order: number;
  initiatives: InitiativeDTO[];
};

export type OkrSetDTO = WithTranslations & {
  id: string;
  number: number;
  title: string;
  role_label: RoleLabel;
  role_name: string;
  customer: string;
  pillars: Pillar[];
  objective: string;
  alignment: string;
  sort_order: number;
  key_results: KeyResultDTO[];
};

export type AlignmentRowDTO = WithTranslations & {
  id: string;
  pillar: string;
  sg: Contribution;
  oe: Contribution;
  ce: Contribution;
  how: string;
  sort_order: number;
};
export type DashboardDTO = {
  pillars: PillarSummaryDTO[];
  okr_sets: OkrSetDTO[];
  alignment_rows: AlignmentRowDTO[];
  teams: TeamDTO[];
};

// Translatable fields per table — the single source of truth used server-side
// to know which fields to send through the translator.
export const TRANSLATABLE_FIELDS = {
  okr_sets: ["title", "role_name", "customer", "objective", "alignment"] as const,
  // Numeric fields (baseline_2026, current_value, target_2027) are deliberately
  // NOT translatable — they must never be sent through the translator.
  key_results: ["text", "target", "lead", "measure", "instrument"] as const,

  // Enum fields (availability, commitment, help_needed) are NOT translatable —
  // their labels come from the i18n strings.
  initiatives: [
    "text",
    "owner",
    "description",
    "blocked_reason",
    "skill_note",
    "idea",
    "why_now",
    "proposed_owner",
    "aspiration",
    "bet_action",
    "bet_change",
    "bet_question",

    "support_needed",
    "out_of_scope",
    "lead_name",
  ] as const,
  initiative_signals: ["name", "how_noticed", "starting_point"] as const,
  initiative_milestones: ["title", "owner"] as const,
  initiative_learning_entries: [
    "author_name",
    "what_happened",
    "signals_telling",
    "surprised_us",
    "proud_of",
    "do_next",
    "next_move",
  ] as const,
  teams: ["name"] as const,
  alignment_rows: ["pillar", "how"] as const,
  pillar_summaries: ["label", "description"] as const,
} as const;
