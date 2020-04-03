export interface TableListItem {
  id?: number;
  title?: string;
  classify?: string;
  url?: string;
  minUrl?: string;
  date?: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  title?: string;
  classify?: string;
  desc?: string;
  pageSize?: number;
  currentPage?: number;
}
