import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';
import { PageMeta } from '../types';

export interface PageQuery {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (query: Record<string, unknown>): PageQuery => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.limit) || DEFAULT_PAGE_SIZE));
  return { page, limit, skip: (page - 1) * limit };
};

export const pageMeta = (total: number, { page, limit }: PageQuery): PageMeta => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
