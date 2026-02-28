export interface SearchBarProps {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
  searchCall: () => void | Promise<void>;
}

export interface SearchContext {
  get searchQuery(): string;
  set searchQuery(v: string);
  get filterValue(): string;
  set filterValue(v: string);
  searchCall: () => void | Promise<void>;
}