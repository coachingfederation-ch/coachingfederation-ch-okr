import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { addInitiative, updateInitiative } from "@/lib/okr.functions";
import { LIMITS, type DashboardDTO, type InitiativeDTO } from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NO_TEAM = "none";

/**
 * The short path into the portfolio for members mirrored from the Welcome app.
 * Deliberately smaller than the guided journey: a proposal only needs a title,
 * the key result it serves and a sentence of context — an editor fills in the
 * rest when they accept it.
 */
export function ProposeDialog({
  open,
  onOpenChange,
  dashboard,
  defaultKrId,
  initiative,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dashboard: DashboardDTO;
  defaultKrId?: string;
  /** When set, the dialog edits this proposal instead of creating a new one. */
  initiative?: InitiativeDTO;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const propose = useServerFn(addInitiative);
  const update = useServerFn(updateInitiative);

  const krOptions = useMemo(
    () =>
      dashboard.okr_sets.flatMap((s) =>
        s.key_results.map((k) => ({
          id: k.id,
          label: `${k.kr || "—"} · ${pickTranslation(k, "text", k.text, locale) || "Untitled KR"}`,
        })),
      ),
    [dashboard, locale],
  );
  const teams = dashboard.teams ?? [];

  const firstKrId = krOptions[0]?.id ?? "";
  const [krId, setKrId] = useState(defaultKrId || firstKrId);
  const [teamId, setTeamId] = useState(NO_TEAM);
  const [text, setText] = useState("");
  const [whyNow, setWhyNow] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initiative) {
      setKrId(initiative.kr_id);
      setTeamId(initiative.team_id ?? NO_TEAM);
      setText(initiative.text);
      setWhyNow(initiative.why_now);
      setDescription(initiative.description);
      return;
    }
    setKrId(defaultKrId || firstKrId);
    setTeamId(NO_TEAM);
    setText("");
    setWhyNow("");
    setDescription("");
  }, [open, defaultKrId, firstKrId, initiative]);

  const mutation = useMutation({
    mutationFn: async (): Promise<void> => {
      await (initiative
        ? update({
            data: {
              id: initiative.id,
              patch: {
                text: text.trim(),
                why_now: whyNow.trim(),
                description: description.trim(),
                team_id: teamId === NO_TEAM ? null : teamId,
              },
              sourceLang: locale,
            },
          })
        : propose({
            data: {
              kr_id: krId,
              text: text.trim(),
              why_now: whyNow.trim(),
              description: description.trim(),
              team_id: teamId === NO_TEAM ? null : teamId,
              kind: "candidate" as const,
              sourceLang: locale,
            },
          }));
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(t("propose.success"));
      onOpenChange(false);
    },
    onError: () => toast.error(t("propose.error")),
  });

  const canSubmit = text.trim().length > 0 && !!krId && !mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("propose.title")}</DialogTitle>
          <DialogDescription>{t("propose.intro")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="propose-title">{t("initiatives.form.title")}</Label>
            <Input
              id="propose-title"
              value={text}
              maxLength={LIMITS.initiative}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("initiatives.form.titlePlaceholder")}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="propose-kr">{t("propose.kr")}</Label>
            <Select value={krId} onValueChange={setKrId}>
              <SelectTrigger id="propose-kr">
                <SelectValue placeholder={t("initiatives.form.selectKr")} />
              </SelectTrigger>
              <SelectContent>
                {krOptions.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="propose-why">{t("propose.whyNow")}</Label>
            <Textarea
              id="propose-why"
              rows={2}
              value={whyNow}
              maxLength={LIMITS.whyNow}
              onChange={(e) => setWhyNow(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="propose-desc">{t("initiatives.description")}</Label>
            <Textarea
              id="propose-desc"
              rows={3}
              value={description}
              maxLength={LIMITS.initiativeDescription}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="propose-team">{t("propose.team")}</Label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger id="propose-team">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_TEAM}>{t("propose.teamNone")}</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {pickTranslation(team, "name", team.name, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button disabled={!canSubmit} onClick={() => mutation.mutate()}>
            {t("propose.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
