import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import {
  setInitiativePrimaryKr,
  setInitiativeSecondaryKrs,
} from "@/lib/okr.functions";
import type { DashboardDTO, InitiativeDTO, KeyResultDTO } from "@/lib/okr-schemas";
import { pickTranslation, useLocale } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "none" | "secondary" | "primary";

type Row = {
  initiative: InitiativeDTO;
  originChip: string;
  originTitle: string;
  currentRole: Role;
  title: string;
  owner: string;
};

export function LinkInitiativesDialog({
  open,
  onOpenChange,
  kr,
  dashboard,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kr: KeyResultDTO | null;
  dashboard: DashboardDTO;
}) {
  const { t, locale } = useLocale();
  const qc = useQueryClient();
  const setPrimaryFn = useServerFn(setInitiativePrimaryKr);
  const setSecondaryFn = useServerFn(setInitiativeSecondaryKrs);

  const rows: Row[] = useMemo(() => {
    if (!kr) return [];
    const out: Row[] = [];
    for (const s of dashboard.okr_sets) {
      const originTitle = pickTranslation(s, "title", s.title, locale) || "Untitled OKR";
      for (const k of s.key_results) {
        const krLabel = k.kr || "—";
        const chip = `${s.number}.${krLabel.includes(".") ? krLabel.split(".")[1] : krLabel}`;
        for (const it of k.initiatives) {
          const isPrimary = it.kr_id === kr.id;
          const isSecondary = (it.secondary_kr_ids ?? []).includes(kr.id);
          const currentRole: Role = isPrimary
            ? "primary"
            : isSecondary
              ? "secondary"
              : "none";
          out.push({
            initiative: it,
            originChip: chip,
            originTitle,
            currentRole,
            title: pickTranslation(it, "text", it.text, locale) || "",
            owner: pickTranslation(it, "owner", it.owner, locale) || "",
          });
        }
      }
    }
    return out;
  }, [dashboard, kr, locale]);

  const [choices, setChoices] = useState<Record<string, Role>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      const initial: Record<string, Role> = {};
      for (const r of rows) initial[r.initiative.id] = r.currentRole;
      setChoices(initial);
      setSearch("");
    }
  }, [open, rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.title, r.owner, r.originTitle, r.originChip]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  const save = useMutation({
    mutationFn: async () => {
      if (!kr) return;
      const changed = rows.filter((r) => choices[r.initiative.id] !== r.currentRole);
      for (const r of changed) {
        const next = choices[r.initiative.id];
        if (next === "primary") {
          await setPrimaryFn({ data: { id: r.initiative.id, kr_id: kr.id } });
        } else if (next === "secondary") {
          const current = new Set(r.initiative.secondary_kr_ids ?? []);
          current.add(kr.id);
          await setSecondaryFn({
            data: { id: r.initiative.id, kr_ids: Array.from(current) },
          });
        } else {
          // none — only reachable when previously secondary (primary is locked)
          const current = (r.initiative.secondary_kr_ids ?? []).filter(
            (id) => id !== kr.id,
          );
          await setSecondaryFn({
            data: { id: r.initiative.id, kr_ids: current },
          });
        }
      }
    },
    onSuccess: () => {
      toast.success(t("initiative.linksUpdated"));
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const dirty = rows.some((r) => choices[r.initiative.id] !== r.currentRole);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("initiative.linkDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("initiative.linkDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("initiative.linkDialog.search")}
          />
          <p className="text-xs text-muted-foreground">
            {t("initiative.linkDialog.primaryHint")}
          </p>

          <div className="max-h-[50vh] overflow-y-auto rounded-md border border-border/70">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm italic text-muted-foreground">
                {t("initiative.linkDialog.empty")}
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {filtered.map((r) => {
                  const val = choices[r.initiative.id] ?? "none";
                  const primaryLocked = r.currentRole === "primary" && val === "primary";
                  return (
                    <li key={r.initiative.id} className="flex items-start gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="inline-flex h-5 items-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                            {r.originChip}
                          </span>
                          <span className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {r.originTitle}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {r.title || <span className="italic text-muted-foreground">—</span>}
                        </p>
                        {r.owner && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.owner}</p>
                        )}
                        {primaryLocked && (
                          <p className="mt-1 text-[11px] italic text-muted-foreground">
                            {t("initiative.linkDialog.primaryLocked")}
                          </p>
                        )}
                      </div>
                      <RoleSelector
                        value={val}
                        onChange={(v) =>
                          setChoices((prev) => ({ ...prev, [r.initiative.id]: v }))
                        }
                        canDemotePrimary={r.currentRole !== "primary"}
                        t={{
                          none: t("initiative.linkDialog.role.none"),
                          secondary: t("initiative.linkDialog.role.secondary"),
                          primary: t("initiative.linkDialog.role.primary"),
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={save.isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>
            {save.isPending ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleSelector({
  value,
  onChange,
  canDemotePrimary,
  t,
}: {
  value: Role;
  onChange: (v: Role) => void;
  canDemotePrimary: boolean;
  t: { none: string; secondary: string; primary: string };
}) {
  const opts: { v: Role; label: string }[] = [
    { v: "none", label: t.none },
    { v: "secondary", label: t.secondary },
    { v: "primary", label: t.primary },
  ];
  return (
    <div className="inline-flex shrink-0 items-center rounded-md border border-border/70 bg-white p-0.5 text-xs">
      {opts.map((o) => {
        const active = value === o.v;
        // If this row is currently primary, don't let the user demote it here.
        const disabled = !canDemotePrimary && value === "primary" && o.v !== "primary";
        return (
          <button
            key={o.v}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.v)}
            className={cn(
              "rounded px-2.5 py-1 font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
              disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
