import { z } from "zod";

export type Pillar = "SG" | "OE" | "CE";
export const PILLARS: Pillar[] = ["SG", "OE", "CE"];

export type Contribution = "none" | "secondary" | "primary";
export const CONTRIBUTION_CYCLE: Contribution[] = ["none", "secondary", "primary"];

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
  initiative: 300,
  pillarLabel: 120,
  pillarDescription: 500,
  alignmentPillar: 120,
  alignmentHow: 800,
};

const trimmedString = (max: number) =>
  z.string().trim().max(max, { message: `Must be ${max} characters or fewer` });

export const uuidSchema = z.string().uuid();

export const okrSetPatchSchema = z.object({
  title: trimmedString(LIMITS.title).optional(),
  role_label: z.enum(ROLE_LABELS).optional(),
  role_name: trimmedString(LIMITS.roleName).optional(),
  customer: trimmedString(LIMITS.customer).optional(),
  pillars: z.array(z.enum(["SG", "OE", "CE"])).max(3).optional(),
  objective: trimmedString(LIMITS.objective).optional(),
  alignment: trimmedString(LIMITS.alignment).optional(),
});

export const keyResultPatchSchema = z.object({
  kr: trimmedString(LIMITS.kr).optional(),
  text: trimmedString(LIMITS.krText).optional(),
  target: trimmedString(LIMITS.target).optional(),
  lead: trimmedString(LIMITS.lead).optional(),
});

export const initiativePatchSchema = z.object({
  text: trimmedString(LIMITS.initiative).min(1, { message: "Cannot be empty" }),
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
export type PillarSummaryDTO = { code: Pillar; label: string; description: string };
export type InitiativeDTO = {
  id: string;
  okr_set_id: string;
  kr_id: string;
  text: string;
  sort_order: number;
};
export type KeyResultDTO = {
  id: string;
  okr_set_id: string;
  kr: string;
  text: string;
  target: string;
  lead: string;
  sort_order: number;
  initiatives: InitiativeDTO[];
};
export type OkrSetDTO = {
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

export type AlignmentRowDTO = {
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
