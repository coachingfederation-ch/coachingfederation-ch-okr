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
export const INITIATIVE_AVAILABILITIES: InitiativeAvailability[] = [
  "open",
  "blocked",
  "parked",
];

/** What a volunteer is signing up for, in time. */
export type InitiativeCommitment = "one_off" | "recurring" | "workstream";
export const INITIATIVE_COMMITMENTS: InitiativeCommitment[] = [
  "one_off",
  "recurring",
  "workstream",
];

/** What kind of person the initiative is looking for. */
export type InitiativeHelpNeeded = "lead" | "helpers" | "skill";
export const INITIATIVE_HELP_NEEDED: InitiativeHelpNeeded[] = [
  "lead",
  "helpers",
  "skill",
];


export type KrType = "metric" | "milestone";
export const KR_TYPES: KrType[] = ["metric", "milestone"];

export type MilestoneStatus = "not_started" | "in_progress" | "done";
export const MILESTONE_STATUSES: MilestoneStatus[] = [
  "not_started",
  "in_progress",
  "done",
];



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
  pillarLabel: 120,
  pillarDescription: 500,
  alignmentPillar: 120,
  alignmentHow: 800,
};


const trimmedString = (max: number) =>
  z.string().trim().max(max, { message: `Must be ${max} characters or fewer` });

export const uuidSchema = z.string().uuid();

export const localeSchema = z.enum(LOCALES);


export const okrSetPatchSchema = z.object({
  title: trimmedString(LIMITS.title).optional(),
  role_label: z.enum(ROLE_LABELS).optional(),
  role_name: trimmedString(LIMITS.roleName).optional(),
  customer: trimmedString(LIMITS.customer).optional(),
  pillars: z.array(z.enum(["SG", "OE", "CE"])).max(3).optional(),
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


export const initiativePatchSchema = z.object({
  text: trimmedString(LIMITS.initiative).min(1, { message: "Cannot be empty" }).optional(),
  owner: trimmedString(LIMITS.initiativeOwner).optional(),
  description: trimmedString(LIMITS.initiativeDescription).optional(),
  status: z.enum(["planned", "in_progress", "done", "canceled"]).optional(),
});

export const initiativeCreateSchema = z.object({
  text: trimmedString(LIMITS.initiative).min(1, { message: "Cannot be empty" }),
  owner: trimmedString(LIMITS.initiativeOwner).optional(),
  description: trimmedString(LIMITS.initiativeDescription).optional(),
  status: z.enum(["planned", "in_progress", "done", "canceled"]).optional(),
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
export type InitiativeDTO = WithTranslations & {
  id: string;
  okr_set_id: string;
  kr_id: string;
  text: string;
  owner: string;
  description: string;
  status: InitiativeStatus;
  sort_order: number;
  secondary_kr_ids: string[];
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
};

// Translatable fields per table — the single source of truth used server-side
// to know which fields to send through the translator.
export const TRANSLATABLE_FIELDS = {
  okr_sets: ["title", "role_name", "customer", "objective", "alignment"] as const,
  // Numeric fields (baseline_2026, current_value, target_2027) are deliberately
  // NOT translatable — they must never be sent through the translator.
  key_results: ["text", "target", "lead", "measure", "instrument"] as const,

  initiatives: ["text", "owner", "description"] as const,
  alignment_rows: ["pillar", "how"] as const,
  pillar_summaries: ["label", "description"] as const,
} as const;

