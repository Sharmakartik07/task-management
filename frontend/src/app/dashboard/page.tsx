'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/lib/tasks';
import { Task } from '@/types';
import { CheckCircle2, Circle, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [all, completed, inProgress, pending] = await Promise.all([
          tasksApi.getAll({ limit: 5, page: 1 }),
          tasksApi.getAll({ status: 'COMPLETED', limit: 1 }),
          tasksApi.getAll({ status: 'IN_PROGRESS', limit: 1 }),
          tasksApi.getAll({ status: 'PENDING', limit: 1 }),
        ]);
        setRecentTasks(all.tasks);
        setStats({
          total: all.pagination.total,
          completed: completed.pagination.total,
          inProgress: inProgress.pagination.total,
          pending: pending.pagination.total,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: Circle, color: 'text-ink-500' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-sage' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-dark' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="p-8 animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink-900 mb-1">
          Good {getGreeting()}, {user?.name.split(' ')[0]}.
        </h1>
        <p className="text-ink-400 text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`card p-5 animate-fade-up-delay-${i + 1}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-ink-400 uppercase tracking-widest font-medium">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className="font-display text-3xl text-ink-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {!loading && stats.total > 0 && (
        <div className="card p-5 mb-8 animate-fade-up-delay-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-ink-400 uppercase tracking-widest font-medium">Overall Progress</span>
            <span className="font-mono text-sm text-ink-500">{completionRate}%</span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card animate-fade-up-delay-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <h2 className="font-medium text-ink-800 text-sm">Recent Tasks</h2>
          <Link href="/tasks" className="flex items-center gap-1 text-xs text-accent hover:text-accent-dark transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-5 h-5 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="p-8 text-center text-ink-400 text-sm">
            No tasks yet.{' '}
            <Link href="/tasks" className="text-accent hover:underline">Create your first task →</Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-50">
            {recentTasks.map(task => (
              <li key={task.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-ink-50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  task.status === 'COMPLETED' ? 'bg-sage' :
                  task.status === 'IN_PROGRESS' ? 'bg-amber' : 'bg-ink-300'
                }`} />
                <span className={`flex-1 text-sm min-w-0 truncate ${
                  task.status === 'COMPLETED' ? 'line-through text-ink-400' : 'text-ink-800'
                }`}>{task.title}</span>
                <span className="text-xs text-ink-400 font-mono shrink-0">
                  {format(new Date(task.createdAt), 'MMM d')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
