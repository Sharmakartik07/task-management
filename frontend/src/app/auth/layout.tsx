export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 border-r border-ink-700">
        <div>
          <span className="font-display text-2xl text-ink-50 tracking-tight">Taskr</span>
        </div>
        <div>
          <blockquote className="font-display text-3xl text-ink-200 leading-snug mb-6">
            "Clarity is not the absence of complexity, but mastery of it."
          </blockquote>
          <p className="text-ink-500 text-sm">
            Your personal command centre for getting things done.
          </p>
        </div>
        <p className="text-ink-600 text-xs font-mono">© {new Date().getFullYear()} Taskr</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <span className="font-display text-2xl text-ink-50 tracking-tight">Taskr</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
