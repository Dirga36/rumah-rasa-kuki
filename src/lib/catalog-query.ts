import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "@/lib/catalog.functions";

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
});
