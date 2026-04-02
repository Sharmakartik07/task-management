'use client';

import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TaskFilters, TaskStatus, Priority } from '@/types';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: Partial<TaskFilters>) => void;
}

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ search: value, page: 1 });
    }, 350);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        <input
          ref={searchRef}
          defaultValue={filters.search || ''}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search tasks…"
          className="input pl-9 pr-8"
        />
        {filters.search && (
          <button
            onClick={() => {
              if (searchRef.current) searchRef.current.value = '';
              onChange({ search: '', page: 1 });
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={e => onChange({ status: e.target.value as TaskStatus | '', page: 1 })}
        className="input sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority || ''}
        onChange={e => onChange({ priority: e.target.value as Priority | '', page: 1 })}
        className="input sm:w-36"
      >
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            if (searchRef.current) searchRef.current.value = '';
            onChange({ search: '', status: '', priority: '', page: 1 });
          }}
          className="btn-ghost whitespace-nowrap"
        >
          <X size={13} className="inline mr-1" />
          Clear
        </button>
      )}
    </div>
  );
}
