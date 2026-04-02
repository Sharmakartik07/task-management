'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { CheckSquare, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ink-300 border-t-ink-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-ink-100 flex flex-col">
        <div className="px-6 py-5 border-b border-ink-100">
          <span className="font-display text-xl text-ink-900 tracking-tight">Taskr</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-600
                       hover:bg-ink-50 hover:text-ink-900 rounded-sm transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/tasks"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-600
                       hover:bg-ink-50 hover:text-ink-900 rounded-sm transition-colors"
          >
            <CheckSquare size={16} />
            All Tasks
          </Link>
        </nav>

        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
              <User size={14} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink-800 truncate">{user.name}</p>
              <p className="text-xs text-ink-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink-500
                       hover:text-accent hover:bg-accent/5 rounded-sm transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
