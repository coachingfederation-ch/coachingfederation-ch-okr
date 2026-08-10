import type {
  DashboardDTO,
  InitiativeDTO,
  InitiativeStatus,
  KeyResultDTO,
  OkrSetDTO,
} from "./okr-schemas";
import { INITIATIVE_STATUSES } from "./okr-schemas";

/** A key result together with the objective it belongs to. */
export type KrRef = { kr: KeyResultDTO; set: OkrSetDTO; label: string };

export type ObjectiveReport = {
  set: OkrSetDTO;
  krs: KrRef[];
  metricCount: number;
  withInstrument: number;
  withBaseline: number;
  /** Unique initiatives touching this objective (primary or secondary links). */
  initiatives: InitiativeDTO[];
  statusCounts: Record<InitiativeStatus, number>;
  krsWithoutInitiative: string[];
};

export type ReportModel = {
  sets: OkrSetDTO[];
  allKrs: KrRef[];
  metricKrs: KrRef[];
  milestoneKrs: KrRef[];
  /** Every distinct initiative in the dashboard. */
  initiativeCount: number;
  readiness: {
    metricTotal: number;
    total: number;
    instrument: number;
    baseline: number;
    current: number;
  };
  objectives: ObjectiveReport[];
  /** Key result labels grouped by what is still missing. Derived, never stored. */
  open: {
    noInstrument: string[];
    noBaseline: string[];
    noLead: string[];
    noInitiatives: string[];
  };
  krsWithoutInitiative: string[];
};

const filled = (v: string | null | undefined) => !!v && v.trim() !== "";

const emptyStatusCounts = (): Record<InitiativeStatus, number> =>
  INITIATIVE_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: 0 }),
    {} as Record<InitiativeStatus, number>,
  );

/**
 * Derives every figure the board report shows from the live dashboard payload.
 *
 * Deliberately readiness-oriented: 2026 is a baselining year, so counts of
 * instruments and baselines carry the story rather than progress percentages,
 * which would all read zero.
 */
export function buildReportModel(data: DashboardDTO): ReportModel {
  const sets = data.okr_sets;

  const allKrs: KrRef[] = [];
  const allInitiatives = new Map<string, InitiativeDTO>();
  // KR id -> initiatives linked to it, primary or secondary.
  const linked = new Map<string, Map<string, InitiativeDTO>>();

  for (const set of sets) {
    for (const kr of set.key_results) {
      allKrs.push({ kr, set, label: kr.kr || `${set.number}.?` });
      if (!linked.has(kr.id)) linked.set(kr.id, new Map());
      for (const init of kr.initiatives) {
        allInitiatives.set(init.id, init);
        linked.get(kr.id)!.set(init.id, init);
      }
    }
  }
  for (const init of allInitiatives.values()) {
    for (const secondaryId of init.secondary_kr_ids ?? []) {
      const bucket = linked.get(secondaryId);
      if (bucket) bucket.set(init.id, init);
    }
  }

  const metricKrs = allKrs.filter((r) => r.kr.kr_type === "metric");
  const milestoneKrs = allKrs.filter((r) => r.kr.kr_type === "milestone");

  const readiness = {
    metricTotal: metricKrs.length,
    total: allKrs.length,
    instrument: metricKrs.filter((r) => filled(r.kr.instrument)).length,
    baseline: metricKrs.filter((r) => filled(r.kr.baseline_2026)).length,
    current: metricKrs.filter((r) => filled(r.kr.current_value) && !!r.kr.current_as_of)
      .length,
  };

  const objectives: ObjectiveReport[] = sets.map((set) => {
    const krs = allKrs.filter((r) => r.set.id === set.id);
    const metric = krs.filter((r) => r.kr.kr_type === "metric");
    const initiatives = new Map<string, InitiativeDTO>();
    const krsWithoutInitiative: string[] = [];
    for (const r of krs) {
      const bucket = linked.get(r.kr.id);
      if (!bucket || bucket.size === 0) krsWithoutInitiative.push(r.label);
      bucket?.forEach((init, id) => initiatives.set(id, init));
    }
    const statusCounts = emptyStatusCounts();
    for (const init of initiatives.values()) statusCounts[init.status] += 1;

    return {
      set,
      krs,
      metricCount: metric.length,
      withInstrument: metric.filter((r) => filled(r.kr.instrument)).length,
      withBaseline: metric.filter((r) => filled(r.kr.baseline_2026)).length,
      initiatives: [...initiatives.values()],
      statusCounts,
      krsWithoutInitiative,
    };
  });

  const open = {
    noInstrument: metricKrs.filter((r) => !filled(r.kr.instrument)).map((r) => r.label),
    noBaseline: metricKrs.filter((r) => !filled(r.kr.baseline_2026)).map((r) => r.label),
    noLead: allKrs.filter((r) => !filled(r.kr.lead)).map((r) => r.label),
    noInitiatives: allKrs
      .filter((r) => (linked.get(r.kr.id)?.size ?? 0) === 0)
      .map((r) => r.label),
  };

  return {
    sets,
    allKrs,
    metricKrs,
    milestoneKrs,
    initiativeCount: allInitiatives.size,
    readiness,
    objectives,
    open,
    krsWithoutInitiative: open.noInitiatives,
  };
}

/** How many initiatives (primary + secondary) are attached to one key result. */
export function krInitiativeTotal(kr: KeyResultDTO, model: ReportModel): number {
  const objective = model.objectives.find((o) => o.krs.some((r) => r.kr.id === kr.id));
  if (!objective) return kr.initiatives.length;
  return objective.initiatives.filter(
    (i) => i.kr_id === kr.id || (i.secondary_kr_ids ?? []).includes(kr.id),
  ).length;
}
