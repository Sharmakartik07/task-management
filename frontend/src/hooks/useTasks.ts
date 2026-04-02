'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Task, TaskFilters, Pagination } from '@/types';
import { tasksApi } from '@/lib/tasks';

export function useTasks(initialFilters: TaskFilters = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10, ...initialFilters });
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getAll(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload: Partial<Task>) => {
    const task = await tasksApi.create(payload);
    toast.success('Task created!');
    await fetchTasks();
    return task;
  };

  const updateTask = async (id: string, payload: Partial<Task>) => {
    const task = await tasksApi.update(id, payload);
    toast.success('Task updated!');
    setTasks(prev => prev.map(t => t.id === id ? task : t));
    return task;
  };

  const deleteTask = async (id: string) => {
    await tasksApi.delete(id);
    toast.success('Task deleted');
    setTasks(prev => prev.filter(t => t.id !== id));
    if (pagination) setPagination(p => p ? { ...p, total: p.total - 1 } : p);
  };

  const toggleTask = async (id: string) => {
    const task = await tasksApi.toggle(id);
    setTasks(prev => prev.map(t => t.id === id ? task : t));
    return task;
  };

  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  };

  return {
    tasks, pagination, filters, loading,
    createTask, updateTask, deleteTask, toggleTask,
    updateFilters, refetch: fetchTasks,
  };
}
