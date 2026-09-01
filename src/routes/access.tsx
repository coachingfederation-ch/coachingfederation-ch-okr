import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Network, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { getAccessOverview, syncAccessDirectory } from "@/lib/access.functions";
import { getStructureOverview, syncStructure } from "@/lib/op-structure.functions";
import { useAuth } from "@/lib/auth-context";
import { formatSwissDate } from "@/components/okr/kr-metrics";
import { AuthBadge } from "@/components/okr/AuthBadge";
import { TopNav } from "@/components/okr/TopNav";
import { LanguageSwitcher } from "@/components/okr/LanguageSwitcher";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "Access directory — The Switzerland Chapter of ICF" },
      {
        name: "description",
        content:
          "Admin view of the editor and admin directory mirrored from the ICF Switzerland member area.",
      },
      { property: "og:title", content: "Access directory — The Switzerland Chapter of ICF" },
      {
        property: "og:description",
        content: "Who can edit the OKR dashboard, and when the directory was last synced.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccessPage,
});

function AccessPage() {
  const { isAdmin, user, isLoading } = useAuth();
  const fetchOverview = useServerFn(getAccessOverview);
  const runSync = useServerFn(syncAccessDirectory);
  const queryClient = useQueryClient();

  const overview = useQuery({
    queryKey: ["access-overview"],
    queryFn: () => fetchOverview(),
    enabled: isAdmin,
  });

  const sync = useMutation({
    mutationFn: () => runSync(),
    onSuccess: (result) => {
      if (result.ok) toast.success(`Synced ${result.count} people from the member area.`);
      else toast.error(result.error || "Sync failed");
      void queryClient.invalidateQueries({ queryKey: ["access-overview"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Sync failed"),
  });

  // Teams are the Welcome app's operational structure, mirrored here.
  const fetchStructure = useServerFn(getStructureOverview);
  const runStructureSync = useServerFn(syncStructure);

  const structure = useQuery({
    queryKey: ["structure-overview"],
    queryFn: () => fetchStructure(),
    enabled: isAdmin,
  });

  const structureSync = useMutation({
    mutationFn: () => runStructureSync(),
    onSuccess: (result) => {
      if (result.ok) toast.success(`Synced ${result.count} units from the member area.`);
      else toast.error(result.error || "Sync failed");
      void queryClient.invalidateQueries({ queryKey: ["structure-overview"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Sync failed"),
  });

  return (
    <main className="min-h-dvh">
      <header className="bg-hero px-8 py-6 text-hero-foreground">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <TopNav />
          <LanguageSwitcher />
          <AuthBadge />
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <p className="eyebrow !text-accent">Administration</p>
          <h1 className="display-lg mt-2">Access directory</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-hero-foreground/75">
            Editors and admins are managed in the ICF Switzerland member area and mirrored here by
            email address. People receive their rights the next time they sign in.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-8 py-10">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Checking your access…</p>
        ) : !user ? (
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="font-semibold text-primary underline">
              Sign in
            </Link>{" "}
            with an admin account to view the directory.
          </p>
        ) : !isAdmin ? (
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
            <p className="text-sm font-semibold text-hero">Admins only</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This page is available to admins of the member area.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-hero">Last sync</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {overview.data?.lastRunAt
                    ? `${formatSwissDate(overview.data.lastRunAt.slice(0, 10))} · ${overview.data.lastStatus}`
                    : "Never run yet"}
                </p>
                {overview.data?.lastError ? (
                  <p className="mt-1 break-words text-sm text-destructive">
                    {overview.data.lastError}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => sync.mutate()}
                disabled={sync.isPending}
                className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm transition-shadow hover:shadow disabled:opacity-50"
              >
                <RefreshCw className={sync.isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                Sync now
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
              <div className="flex items-center gap-2 border-b border-border/70 px-6 py-4">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-hero">
                  People with rights ({overview.data?.entries.length ?? 0})
                </h2>
              </div>
              {overview.isPending ? (
                <p className="px-6 py-6 text-sm text-muted-foreground">Loading…</p>
              ) : overview.isError ? (
                <p className="px-6 py-6 text-sm text-destructive">
                  Could not load the directory right now.
                </p>
              ) : (
                <ul className="divide-y divide-border/70">
                  {overview.data.entries.map((entry) => (
                    <li
                      key={entry.email}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
                    >
                      <span className="min-w-0 break-all text-sm text-hero">{entry.email}</span>
                      <span className="inline-flex h-6 items-center rounded-full bg-surface px-2.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {entry.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-hero">
                    Operational structure ({structure.data?.units.length ?? 0})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => structureSync.mutate()}
                  disabled={structureSync.isPending}
                  className="btn-mono inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-sm transition-shadow hover:shadow disabled:opacity-50"
                >
                  <RefreshCw
                    className={structureSync.isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"}
                  />
                  Sync now
                </button>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  Teams in the OKR portfolio mirror the operational structure of the member area.
                  They are edited there, not here.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {structure.data?.lastRunAt
                    ? `Last sync: ${formatSwissDate(structure.data.lastRunAt.slice(0, 10))} · ${structure.data.lastStatus}`
                    : "Never run yet"}
                </p>
                {structure.data?.lastError ? (
                  <p className="mt-1 break-words text-sm text-destructive">
                    {structure.data.lastError}
                  </p>
                ) : null}
              </div>
              {structure.data && structure.data.units.length > 0 ? (
                <ul className="divide-y divide-border/70 border-t border-border/70">
                  {structure.data.units.map((unit) => (
                    <li
                      key={unit.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
                    >
                      <span className="min-w-0 text-sm text-hero">{unit.name}</span>
                      {unit.is_community ? (
                        <span className="inline-flex h-6 items-center rounded-full bg-surface px-2.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                          community
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
