import type { StringKey } from "./i18n-strings";
import type { DraftCard, PlaygroundMode } from "./playground-drafts";
import type {
  GeneratedDrafts,
  InitiativeDraft,
  KrDraft,
  ObjectiveDraft,
} from "./ai-drafts.server";

type T = (key: StringKey) => string;

const BASELINE_LABEL: Record<KrDraft["baseline_state"], StringKey> = {
  known: "playground.baseline.known",
  pending: "playground.baseline.pending",
  exploratory: "playground.baseline.exploratory",
};

/**
 * Map the AI generation result onto the existing practice-card shape so the
 * playground and the assistant drawer keep rendering, editing, quality checks
 * and the insertion handoff exactly as before.
 */
export function toDraftCards(
  mode: PlaygroundMode,
  result: GeneratedDrafts,
  t: T,
): DraftCard[] {
  return result.drafts.map((draft, index) => {
    const id = `${mode}-ai-${index}`;
    const title = `${t("playground.ai.option")} ${index + 1}`;

    if (mode === "objective") {
      const d = draft as ObjectiveDraft;
      return {
        id,
        title,
        variants: [d.title],
        why: d.rationale,
        watchFor: d.warnings[0] ?? "",
        quality: d.quality,
        warnings: d.warnings,
      };
    }

    if (mode === "kr") {
      const d = draft as KrDraft;
      const meta = [
        { label: t("playground.meta.measurement"), value: d.measurement },
        { label: t("playground.meta.baseline"), value: t(BASELINE_LABEL[d.baseline_state]) },
        { label: t("playground.meta.target"), value: d.target_suggestion },
        { label: t("playground.meta.instrument"), value: d.instrument_suggestion },
      ].filter((m) => m.value.trim().length > 0);
      return {
        id,
        title,
        variants: [d.statement],
        why: d.measurement,
        watchFor: d.warnings[0] ?? "",
        quality: d.quality,
        meta,
        warnings: d.warnings,
      };
    }

    const d = draft as InitiativeDraft;
    const meta = [
      { label: t("playground.meta.owner"), value: d.owner_role },
      { label: t("playground.meta.effort"), value: d.effort },
      { label: t("playground.meta.timing"), value: d.timing },
    ].filter((m) => m.value.trim().length > 0);
    return {
      id,
      title,
      variants: [d.title],
      why: d.why,
      watchFor: d.warnings[0] ?? "",
      quality: d.quality,
      meta,
      warnings: d.warnings,
    };
  });
}
