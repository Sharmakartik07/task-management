'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl text-ink-50 mb-2">Welcome back</h1>
      <p className="text-ink-400 text-sm mb-8">Sign in to your account to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label text-ink-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input bg-ink-800 border-ink-700 text-ink-100 placeholder:text-ink-600
                       focus:border-accent"
          />
        </div>

        <div>
          <label className="label text-ink-400">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input bg-ink-800 border-ink-700 text-ink-100 placeholder:text-ink-600
                       focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 text-sm font-medium tracking-wide
                     hover:bg-accent-light transition-colors duration-200 rounded-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-ink-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-accent hover:text-accent-light transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
