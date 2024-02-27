export interface Page<T> {
  pageIndex: number;
  itemsPerPage: number;
  pageCount: number;
  itemCount: number;
  items: T[];
}
