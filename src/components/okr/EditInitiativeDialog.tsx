import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, X as XIcon } from "lucide-react";

import {
  updateInitiative,
  deleteInitiative,
  setInitiativeSecondaryKrs,
} from "@/lib/okr.functions";
import {
  INITIATIVE_STATUSES,
  LIMITS,
  type DashboardDTO,
  type InitiativeDTO,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
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

export function EditInitiativeDialog({
  open,
  onOpenChange,
  initiative,
  dashboard,
  canEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initiative: InitiativeDTO | null;
  dashboard: DashboardDTO;
  canEdit: boolean;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const updateFn = useServerFn(updateInitiative);
  const deleteFn = useServerFn(deleteInitiative);

  const krContext = useMemo(() => {
    if (!initiative) return null;
    for (const s of dashboard.okr_sets) {
      for (const k of s.key_results) {
        if (k.id === initiative.kr_id) {
          return {
            krLabel: k.kr || "—",
            krText: pickTranslation(k, "text", k.text, locale) || "Untitled KR",
            okrTitle:
              pickTranslation(s, "title", s.title, locale) || "Untitled OKR",
            okrNumber: s.number,
          };
        }
      }
    }
    return null;
  }, [initiative, dashboard, locale]);

  // Flat list of all KRs with their OKR context, for the secondary picker.
  const allKrs = useMemo(() => {
    const list: {
      id: string;
      okrNumber: number;
      krLabel: string;
      krText: string;
      okrTitle: string;
      chip: string;
    }[] = [];
    for (const s of dashboard.okr_sets) {
      for (const k of s.key_results) {
        const label = k.kr || "—";
        const chip =
          `${s.number}.` +
          (label.includes(".") ? label.split(".")[1] : label);
        list.push({
          id: k.id,
          okrNumber: s.number,
          krLabel: label,
          krText: pickTranslation(k, "text", k.text, locale) || "Untitled KR",
          okrTitle:
            pickTranslation(s, "title", s.title, locale) || "Untitled OKR",
          chip,
        });
      }
    }
    return list;
  }, [dashboard, locale]);

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<InitiativeStatus>("planned");
  const [secondaryIds, setSecondaryIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open && initiative) {
      setTitle(pickTranslation(initiative, "text", initiative.text, locale) || "");
      setOwner(pickTranslation(initiative, "owner", initiative.owner, locale) || "");
      setDescription(
        pickTranslation(initiative, "description", initiative.description, locale) || "",
      );
      setStatus(initiative.status);
      setSecondaryIds(initiative.secondary_kr_ids ?? []);
    }
  }, [open, initiative, locale]);


  const save = useMutation({
    mutationFn: () => {
      if (!initiative) throw new Error("No initiative");
      return updateFn({
        data: {
          id: initiative.id,
          patch: {
            text: title.trim(),
            owner: owner.trim(),
            description: description.trim(),
            status,
          },
          sourceLang: locale,
        },
      });
    },
    onSuccess: () => {
      toast.success(t("initiatives.updated"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const remove = useMutation({
    mutationFn: () => {
      if (!initiative) throw new Error("No initiative");
      return deleteFn({ data: { id: initiative.id } });
    },
    onSuccess: () => {
      toast.success(t("initiatives.deleted"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setConfirmOpen(false);
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const busy = save.isPending || remove.isPending;
  const canSubmit = canEdit && !!initiative && title.trim().length > 0 && !busy;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>{t("initiatives.editTitle")}</SheetTitle>
          <SheetDescription>{t("initiatives.editDescription")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-w-0 px-6 py-4">
          <div className="grid gap-4 min-w-0">
            {krContext && (
              <div className="grid gap-1.5">
                <Label>{t("initiatives.form.kr")}</Label>
                <div className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                      {krContext.okrNumber}.
                      {krContext.krLabel.includes(".")
                        ? krContext.krLabel.split(".")[1]
                        : krContext.krLabel}
                    </span>
                    <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {krContext.okrTitle}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{krContext.krText}</p>
                </div>
              </div>
            )}

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-title">{t("initiatives.form.title")}</Label>
              <Textarea
                id="ei-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, LIMITS.initiative))}
                placeholder={t("initiatives.form.titlePlaceholder")}
                rows={2}
                maxLength={LIMITS.initiative}
                disabled={!canEdit}
                autoFocus
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-owner">{t("initiatives.form.owner")}</Label>
              <Input
                id="ei-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value.slice(0, LIMITS.initiativeOwner))}
                placeholder={t("initiatives.form.ownerPlaceholder")}
                maxLength={LIMITS.initiativeOwner}
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-desc">{t("initiatives.form.description")}</Label>
              <Textarea
                id="ei-desc"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, LIMITS.initiativeDescription))
                }
                placeholder={t("initiatives.form.descriptionPlaceholder")}
                rows={4}
                maxLength={LIMITS.initiativeDescription}
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-1.5 min-w-0">
              <Label htmlFor="ei-status">{t("initiatives.form.status")}</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as InitiativeStatus)}
                disabled={!canEdit}
              >
                <SelectTrigger id="ei-status" className="w-full min-w-0">
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

        <SheetFooter className="px-6 py-4 border-t flex-row items-center gap-2 sm:justify-between">
          {canEdit ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={busy}
            >
              {t("initiatives.delete")}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              {t("common.cancel")}
            </Button>
            {canEdit && (
              <Button onClick={() => save.mutate()} disabled={!canSubmit}>
                {save.isPending ? t("common.saving") : t("common.save")}
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("initiatives.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("initiatives.deleteConfirmBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                remove.mutate();
              }}
              disabled={remove.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {remove.isPending ? t("common.deleting") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
