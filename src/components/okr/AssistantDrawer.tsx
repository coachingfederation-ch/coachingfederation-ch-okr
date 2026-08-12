import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale } from "@/lib/i18n";
import { PracticeWizard } from "@/components/okr/PracticeWizard";
import type { PlaygroundMode } from "@/lib/playground-drafts";

export type AssistantContext = {
  mode: PlaygroundMode;
  /** Human-readable context shown in the header, e.g. "OKR Set 2" or "KR 2.3". */
  contextLabel: string;
  /** Pre-filled first wizard answer (objective / key result text) when known. */
  lockedFirstAnswer?: string;
};

/**
 * Editor-facing OKR Assistant. It reuses the /playground guided wizard and
 * quality checks, but writes nothing: this stage shows drafts and coaching only.
 */
export function AssistantDrawer({
  context,
  onClose,
}: {
  context: AssistantContext | null;
  onClose: () => void;
}) {
  const { t } = useLocale();

  const titleKey =
    context?.mode === "objective"
      ? "assistant.title.objective"
      : context?.mode === "kr"
        ? "assistant.title.kr"
        : "assistant.title.initiative";

  return (
    <Sheet
      open={!!context}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        {context && (
          <>
            <SheetHeader>
              <p className="text-left text-[11px] font-semibold uppercase tracking-wider text-primary">
                {t("assistant.eyebrow")}
              </p>
              <SheetTitle className="text-left">
                {t(titleKey)} · {context.contextLabel}
              </SheetTitle>
              <SheetDescription className="text-left">
                {t("assistant.description")}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6">
              <PracticeWizard
                key={`${context.mode}-${context.contextLabel}`}
                mode={context.mode}
                title={context.contextLabel}
                lockedFirstAnswer={context.lockedFirstAnswer}
                context={context.lockedFirstAnswer ?? ""}
                showHandoff={false}
              />
            </div>

            <p
              role="status"
              className="mt-6 rounded-xl border border-accent/50 bg-accent/15 px-4 py-3 text-sm font-medium text-foreground"
            >
              {t("assistant.footer")}
            </p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
