'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  SquareCheckBig,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

interface StudentAppShellProps {
  children: React.ReactNode;
}

const expandedWidth = 'lg:w-72';
const collapsedWidth = 'lg:w-20';

export const StudentAppShell = ({ children }: StudentAppShellProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (path: string) => path === '/dashboard' || path.startsWith('/dashboard/subject/') },
      { href: '/resources', label: 'Library', icon: FolderOpen, match: (path: string) => path === '/resources' },
      { href: '/practice', label: 'Practice', icon: BookOpen, match: (path: string) => path === '/practice' },
      { href: '/model-paper', label: 'PYQ Analysis', icon: FileText, match: (path: string) => path === '/model-paper' },
      { href: '/assignments', label: 'Assignments', icon: SquareCheckBig, match: (path: string) => path === '/assignments' },
      { href: '/ai-tutor', label: 'AI Tutor', icon: Sparkles, match: (path: string) => path === '/ai-tutor' },
      { href: '/utilities', label: 'Utilities', icon: Calculator, match: (path: string) => path === '/utilities' },
    ],
    []
  );

  const primaryNavItems = navItems.slice(0, 5);
  const supportNavItems = navItems.slice(5);

  return (
    <div className="min-h-screen bg-slate-100">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close navigation overlay"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          collapsed ? collapsedWidth : expandedWidth
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white">
              G
            </div>
            {!collapsed ? (
              <div className="min-w-0 text-left">
                <p className="truncate text-lg font-black text-slate-900">GradPath</p>
                <p className="text-xs font-medium text-slate-500">Student</p>
              </div>
            ) : null}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 lg:flex"
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 lg:hidden"
              aria-label="Close navigation"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed ? (
            <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>
          ) : null}
          <div className="space-y-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
          </div>

          {!collapsed ? (
            <p className="px-4 pb-2 pt-5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Support Tools
            </p>
          ) : null}
          <div className="space-y-2">
          {supportNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
          </div>
        </nav>

        <div className="border-t border-slate-100 px-3 py-4">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className={`text-sm font-bold text-slate-900 ${collapsed ? 'hidden' : 'block'}`}>{user?.name || 'Student'}</p>
            <p className={`text-xs font-medium uppercase tracking-[0.12em] text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>
              Semester {user?.semester || '-'}
            </p>
            {collapsed ? <p className="text-center text-xs font-bold text-slate-900">{user?.name?.charAt(0) || 'S'}</p> : null}
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>Logout</span> : null}
          </button>
        </div>
      </aside>

      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <main className="min-h-screen px-4 py-6 pt-20 lg:px-8 lg:pt-8">{children}</main>
      </div>
    </div>
  );
};
