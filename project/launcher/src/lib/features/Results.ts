import type { ResultAction } from "./ResultAction";

export interface SearchResult {
  icon_path: string | null;
  icon_color: string | null;
  title: string;
  description: string | null;
  action: ResultAction | null;
}
