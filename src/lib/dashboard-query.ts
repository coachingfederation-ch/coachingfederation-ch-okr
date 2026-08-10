import { queryOptions } from "@tanstack/react-query";
import { getDashboard } from "./okr.functions";

/**
 * Single source of truth for the dashboard read.
 *
 * The OKR page, the initiative portfolio and the board report all subscribe to
 * the same cache entry, so the report can never show a different snapshot than
 * the dashboard it is generated from.
 */
export const dashboardQueryOptions = queryOptions({
  queryKey: ["dashboard"] as const,
  queryFn: () => getDashboard(),
});
