import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { QualityChecks } from "@/components/okr/QualityChecks";
import { DraftHandoff } from "@/components/okr/DraftHandoff";
import {
  qualityForVariant,
  type DraftCard,
  type DraftQuality,
  type PlaygroundMode,
} from "@/lib/playground-drafts";

const QUALITY_STYLES: Record<DraftQuality, string> = {
  strong: "border-primary/40 bg-primary/10 text-primary",
  usable: "border-accent/50 bg-accent/20 text-foreground",
  refine: "border-border bg-muted text-muted-foreground",
};

const QUALITY_LABEL = {
  strong: "playground.quality.strong",
  usable: "playground.quality.usable",
  refine: "playground.quality.refine",
} as const;

/**
 * One practice draft. All interaction (variant cycling, inline editing,
 * clipboard copy) is local to this component — nothing is persisted.
 */
export function PracticeDraftCard({
  card,
  mode,
  answers,
  showHandoff = true,
  selected,
  selectLabel,
  selectedLabel,
  onSelect,
  onStatementChange,
}: {
  card: DraftCard;
  mode: PlaygroundMode;
  /** The three wizard answers, used by the baseline / instrument / owner checks. */
  answers: string[];
  /** Hide the public sign-in handoff (authenticated assistant drawer). */
  showHandoff?: boolean;
  /** Chain selection state; omitted for standalone practice. */
  selected?: boolean;
  selectLabel?: string;
  selectedLabel?: string;
  onSelect?: (statement: string) => void;
  /** Called while selected, whenever the shown statement changes. */
  onStatementChange?: (statement: string) => void;
}) {
  const { t } = useLocale();
  const [variantIndex, setVariantIndex] = useState(0);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [buffer, setBuffer] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const statementRef = useRef<HTMLParagraphElement | null>(null);

  const base = card.variants[variantIndex] ?? card.variants[0] ?? "";
  const statement = edits[variantIndex] ?? base;
  const quality = qualityForVariant(variantIndex);
  const headingId = `${card.id}-title`;

  // Keep the chain context in sync with local edits / variant cycling.
  useEffect(() => {
    if (selected) onStatementChange?.(statement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statement, selected]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(statement);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-background p-4 shadow-soft",
        selected ? "border-primary ring-1 ring-primary/30" : "border-border/70",
      )}
      aria-labelledby={headingId}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("playground.result.tag")}
        </p>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            QUALITY_STYLES[quality],
          )}
        >
          {t(QUALITY_LABEL[quality])}
        </span>
      </div>

      <h5 id={headingId} className="mt-2 text-sm font-semibold text-foreground">
        {card.title}
      </h5>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            rows={4}
            value={buffer}
            aria-labelledby={headingId}
            onChange={(e) => setBuffer(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-11"
              onClick={() => {
                setEdits((prev) => ({ ...prev, [variantIndex]: buffer.trim() || base }));
                setIsEditing(false);
                window.setTimeout(() => statementRef.current?.focus(), 0);
              }}
            >
              {t("playground.card.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setIsEditing(false)}
            >
              {t("playground.card.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <p
          ref={statementRef}
          tabIndex={-1}
          className="mt-2 text-sm leading-relaxed text-foreground/90 focus:outline-none"
        >
          {statement}
        </p>
      )}

      <dl className="mt-3 space-y-2">
        <div>
          <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t("playground.card.why")}
          </dt>
          <dd className="text-sm text-foreground/90">{card.why}</dd>
        </div>
        {quality !== "strong" && card.watchFor && (
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("playground.card.watch")}
            </dt>
            <dd className="text-sm text-foreground/90">{card.watchFor}</dd>
          </div>
        )}
      </dl>

      <QualityChecks mode={mode} statement={statement} answers={answers} />

      {showHandoff && <DraftHandoff mode={mode} statement={statement} />}

      <div className="mt-4 flex flex-wrap gap-2">
        {selectLabel && onSelect && (
          <Button
            type="button"
            variant={selected ? "default" : "outline"}
            className="h-11"
            aria-pressed={Boolean(selected)}
            onClick={() => onSelect(statement)}
          >
            {selected ? (selectedLabel ?? selectLabel) : selectLabel}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => {
            setVariantIndex((i) => (i + 1) % card.variants.length);
            setIsEditing(false);
          }}
        >
          {t("playground.card.tryAnother")}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={() => {
              setBuffer(statement);
              setIsEditing(true);
            }}
          >
            {t("playground.card.edit")}
          </Button>
        )}
        <Button type="button" variant="outline" className="h-11" onClick={copy}>
          {t("playground.card.copy")}
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        <span aria-hidden="true">
          {t("playground.card.variant")} {variantIndex + 1} {t("playground.wizard.of")}{" "}
          {card.variants.length}
        </span>
        <span aria-live="polite" className="ml-2 font-medium text-primary">
          {copyState === "copied"
            ? t("playground.card.copied")
            : copyState === "failed"
              ? t("playground.card.copyFailed")
              : ""}
        </span>
      </p>
    </article>
  );
}
