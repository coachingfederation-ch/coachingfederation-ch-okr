import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { addInitiative } from "@/lib/okr.functions";
import {
  INITIATIVE_STATUSES,
  LIMITS,
  type DashboardDTO,
  type InitiativeStatus,
} from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import type { StringKey } from "@/lib/i18n-strings";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUS_KEY: Record<InitiativeStatus, StringKey> = {
  planned: "initiatives.status.planned",
  in_progress: "initiatives.status.in_progress",
  done: "initiatives.status.done",
  canceled: "initiatives.status.canceled",
};

const STATUS_DOT: Record<InitiativeStatus, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-primary",
  done: "bg-emerald-500",
  canceled: "bg-muted-foreground/50",
};

export function NewInitiativeDialog({
  open,
  onOpenChange,
  dashboard,
  defaultKrId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dashboard: DashboardDTO;
  defaultKrId?: string;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const addFn = useServerFn(addInitiative);

  const krOptions = useMemo(
    () =>
      dashboard.okr_sets.flatMap((s) =>
        s.key_results.map((k) => ({
          id: k.id,
          label: `${k.kr || "—"} · ${pickTranslation(k, "text", k.text, locale) || "Untitled KR"}`,
          groupLabel: `${s.number}. ${pickTranslation(s, "title", s.title, locale) || "Untitled OKR"}`,
          groupId: s.id,
        })),
      ),
    [dashboard, locale],
  );

  const firstKrId = krOptions[0]?.id ?? "";
  const [krId, setKrId] = useState<string>(defaultKrId || firstKrId);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<InitiativeStatus>("planned");

  // Reset when opening
  useEffect(() => {
    if (open) {
      setKrId(defaultKrId || firstKrId);
      setTitle("");
      setOwner("");
      setDescription("");
      setStatus("planned");
    }
  }, [open, defaultKrId, firstKrId]);

  const create = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          kr_id: krId,
          text: title.trim(),
          owner: owner.trim() || undefined,
          description: description.trim() || undefined,
          status,
          sourceLang: locale,
        },
      }),
    onSuccess: () => {
      toast.success(t("initiatives.created"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  // Group KR options by OKR set for nicer UX
  const grouped = useMemo(() => {
    const map = new Map<string, { groupLabel: string; items: typeof krOptions }>();
    for (const opt of krOptions) {
      const g = map.get(opt.groupId);
      if (g) g.items.push(opt);
      else map.set(opt.groupId, { groupLabel: opt.groupLabel, items: [opt] });
    }
    return Array.from(map.values());
  }, [krOptions]);

  const canSubmit = krId && title.trim().length > 0 && !create.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t("initiatives.newTitle")}</SheetTitle>
          <SheetDescription>{t("initiatives.subtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-w-0 px-6 py-4">
          <div className="grid gap-4 min-w-0">
            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ni-kr">{t("initiatives.form.kr")}</Label>
              <Select value={krId} onValueChange={setKrId}>
                <SelectTrigger id="ni-kr" className="w-full min-w-0">
                  <SelectValue placeholder={t("initiatives.form.selectKr")} className="truncate" />
                </SelectTrigger>

                <SelectContent>
                  {grouped.map((g) => (
                    <SelectGroup key={g.groupLabel}>
                      <SelectLabel>{g.groupLabel}</SelectLabel>
                      {g.items.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          KR {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="ni-title">{t("initiatives.form.title")}</Label>
              <Textarea
                id="ni-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, LIMITS.initiative))}
                placeholder={t("initiatives.form.titlePlaceholder")}
                rows={2}
                maxLength={LIMITS.initiative}
                autoFocus
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="ni-owner">{t("initiatives.form.owner")}</Label>
              <Input
                id="ni-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value.slice(0, LIMITS.initiativeOwner))}
                placeholder={t("initiatives.form.ownerPlaceholder")}
                maxLength={LIMITS.initiativeOwner}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="ni-desc">{t("initiatives.form.description")}</Label>
              <Textarea
                id="ni-desc"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, LIMITS.initiativeDescription))
                }
                placeholder={t("initiatives.form.descriptionPlaceholder")}
                rows={4}
                maxLength={LIMITS.initiativeDescription}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="ni-status">{t("initiatives.form.status")}</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as InitiativeStatus)}>
                <SelectTrigger id="ni-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INITIATIVE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} aria-hidden />
                        {t(STATUS_KEY[s])}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={create.isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={() => create.mutate()} disabled={!canSubmit}>
            {create.isPending ? t("common.creating") : t("common.create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

