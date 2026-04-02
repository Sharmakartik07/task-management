'use client';

import { Pagination } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = pagination;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-xs text-ink-400 font-mono">
        {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className={clsx(
            'p-2 rounded-sm transition-colors',
            hasPrevPage
              ? 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              : 'text-ink-200 cursor-not-allowed'
          )}
        >
          <ChevronLeft size={15} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | '...')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-ink-300 text-sm">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={clsx(
                  'w-8 h-8 text-sm rounded-sm transition-colors',
                  p === page
                    ? 'bg-ink-900 text-ink-50'
                    : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                )}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={clsx(
            'p-2 rounded-sm transition-colors',
            hasNextPage
              ? 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              : 'text-ink-200 cursor-not-allowed'
          )}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
