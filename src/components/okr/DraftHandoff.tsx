import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n";
import type { PlaygroundMode } from "@/lib/playground-drafts";

/** Session-only storage key. Never persisted to the database. */
export const HANDOFF_KEY = "playground.handoff.draft";

export type HandoffDraft = { mode: PlaygroundMode; statement: string };

export function readHandoffDraft(): HandoffDraft | null {
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HandoffDraft;
    return parsed?.statement ? parsed : null;
  } catch {
    return null;
  }
}

export function clearHandoffDraft() {
  try {
    window.sessionStorage.removeItem(HANDOFF_KEY);
  } catch {
    /* storage unavailable — the handoff is optional */
  }
}

/**
 * Secondary CTA on a practice draft card. It never writes to live OKR data:
 * signed-out users are sent to /auth (draft kept in sessionStorage only) and
 * editors get an explanatory state pointing at the live dashboard.
 */
export function DraftHandoff({ mode, statement }: { mode: PlaygroundMode; statement: string }) {
  const { t } = useLocale();
  const { user, canEdit, isLoading } = useAuth();
  const [showEditorHint, setShowEditorHint] = useState(false);

  if (isLoading) return null;

  const notSaved = (
    <p className="mt-2 text-xs text-muted-foreground">{t("playground.handoff.notSavedNote")}</p>
  );

  if (!user) {
    return (
      <div className="mt-3 border-t border-border/60 pt-3">
        <Button asChild variant="outline" className="h-11">
          <Link
            to="/auth"
            onClick={() => {
              try {
                window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ mode, statement }));
              } catch {
                /* storage unavailable — sign-in still works */
              }
            }}
          >
            {t("playground.handoff.signIn")}
          </Link>
        </Button>
        {notSaved}
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="mt-3 border-t border-border/60 pt-3">
        <p className="text-xs text-muted-foreground">{t("playground.handoff.noRights")}</p>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <Button
        type="button"
        variant="outline"
        className="h-11"
        aria-expanded={showEditorHint}
        onClick={() => setShowEditorHint((v) => !v)}
      >
        {t("playground.handoff.use")}
      </Button>
      {showEditorHint && (
        <div className="mt-3 rounded-lg border border-accent/50 bg-accent/15 p-3">
          <p className="text-sm text-foreground/90">{t("playground.handoff.editorHint")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild className="h-11">
              <Link to="/okrs">{t("playground.handoff.openDashboard")}</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setShowEditorHint(false)}
            >
              {t("playground.handoff.close")}
            </Button>
          </div>
        </div>
      )}
      {notSaved}
    </div>
  );
}
