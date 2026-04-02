'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl text-ink-50 mb-2">Create account</h1>
      <p className="text-ink-400 text-sm mb-8">Start managing your tasks with clarity.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label text-ink-400">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Smith"
            className="input bg-ink-800 border-ink-700 text-ink-100 placeholder:text-ink-600
                       focus:border-accent"
          />
        </div>

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
            placeholder="Min. 6 characters"
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
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-ink-500 text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-accent hover:text-accent-light transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
