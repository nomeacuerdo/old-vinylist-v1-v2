export type SourceData = {
  head: { field?: string | undefined; title?: string | undefined; }[];
  meta?: Array<Array<string | number>>;
  body: string[][];
};

export type SortByTypes = {
  col: string | undefined;
  sort_order: "asc" | "desc";
};

export type SortFunctionTypes = (
  sortBy: SortByTypes
) => Promise<void> | void | null;
