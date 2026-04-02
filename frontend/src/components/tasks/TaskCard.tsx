'use client';

import { Task } from '@/types';
import { format } from 'date-fns';
import { Calendar, Edit2, Trash2, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'badge-pending',
  IN_PROGRESS: 'badge-in-progress',
  COMPLETED: 'badge-completed',
};

const PRIORITY_CLASSES: Record<string, string> = {
  LOW: 'badge-low',
  MEDIUM: 'badge-medium',
  HIGH: 'badge-high',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={clsx(
      'card p-4 transition-all duration-200 hover:shadow-md group',
      isCompleted && 'opacity-70'
    )}>
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 shrink-0 text-ink-300 hover:text-sage transition-colors"
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted
            ? <CheckCircle2 size={18} className="text-sage" />
            : <Circle size={18} />
          }
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            'text-sm font-medium text-ink-900 mb-1 leading-snug',
            isCompleted && 'line-through text-ink-400'
          )}>
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-ink-400 mb-2 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className={STATUS_CLASSES[task.status]}>{STATUS_LABELS[task.status]}</span>
            <span className={PRIORITY_CLASSES[task.priority]}>{task.priority.toLowerCase()}</span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-ink-400 font-mono">
                <Calendar size={10} />
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost p-1.5"
            title="Edit task"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-ink-400 hover:text-accent hover:bg-accent/5 rounded-sm transition-colors"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
