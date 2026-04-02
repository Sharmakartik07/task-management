import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
});

const mono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Taskr — Personal Task Management',
  description: 'Manage your tasks with clarity and focus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-ink-50 text-ink-900 font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0D0D0D',
                color: '#F5F5F0',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #2E2E28',
              },
              success: { iconTheme: { primary: '#4A7C59', secondary: '#F5F5F0' } },
              error: { iconTheme: { primary: '#E8622A', secondary: '#F5F5F0' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
