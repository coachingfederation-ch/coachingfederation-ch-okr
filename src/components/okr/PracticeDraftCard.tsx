import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { qualityForVariant, type DraftCard, type DraftQuality } from "@/lib/playground-drafts";

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
export function PracticeDraftCard({ card }: { card: DraftCard }) {
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
      className="flex flex-col rounded-xl border border-border/70 bg-background p-4 shadow-soft"
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

      <div className="mt-4 flex flex-wrap gap-2">
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
