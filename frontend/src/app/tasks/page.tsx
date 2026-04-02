'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import TaskFiltersBar from '@/components/tasks/TaskFiltersBar';
import PaginationBar from '@/components/tasks/Pagination';

export default function TasksPage() {
  const {
    tasks, pagination, filters, loading,
    createTask, updateTask, deleteTask, toggleTask,
    updateFilters,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (data: Partial<Task>) => {
    await createTask(data);
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteTask(id);
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTask(id);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="p-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink-900 mb-1">Tasks</h1>
          <p className="text-ink-400 text-sm">
            {pagination ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 animate-fade-up-delay-1">
        <TaskFiltersBar filters={filters} onChange={updateFilters} />
      </div>

      {/* Task list */}
      <div className="animate-fade-up-delay-2">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-ink-100 mt-0.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-ink-100 rounded w-2/3" />
                    <div className="h-3 bg-ink-50 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="font-display text-2xl text-ink-300 mb-2">No tasks found</p>
            <p className="text-ink-400 text-sm mb-6">
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters.'
                : 'Create your first task to get started.'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className={deletingId === task.id ? 'opacity-50 pointer-events-none' : ''}
              >
                <TaskCard
                  task={task}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationBar
            pagination={pagination}
            onPageChange={page => updateFilters({ page })}
          />
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSubmit={editingTask ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}
