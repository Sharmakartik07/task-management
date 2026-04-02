import { api } from './api';
import { Task, TasksResponse, TaskFilters } from '@/types';

export const tasksApi = {
  getAll: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const { data } = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return data;
  },

  getOne: async (id: string): Promise<Task> => {
    const { data } = await api.get<{ task: Task }>(`/tasks/${id}`);
    return data.task;
  },

  create: async (payload: Partial<Task>): Promise<Task> => {
    const { data } = await api.post<{ task: Task }>('/tasks', payload);
    return data.task;
  },

  update: async (id: string, payload: Partial<Task>): Promise<Task> => {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, payload);
    return data.task;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggle: async (id: string): Promise<Task> => {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}/toggle`);
    return data.task;
  },
};
