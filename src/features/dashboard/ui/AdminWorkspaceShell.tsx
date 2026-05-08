'use client';

import Link from 'next/link';
import { useMemo, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  UploadCloud,
  FileCheck2,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

interface AdminWorkspaceShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const expandedWidth = 'lg:w-72';
const collapsedWidth = 'lg:w-20';

const NavContent = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  logout,
  router,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const primaryNavItems = useMemo(
    () => [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard, match: (path: string) => path === '/admin' },
      { href: '/admin/resources/upload', label: 'Upload Resource', icon: UploadCloud, match: (path: string) => path.startsWith('/admin/resources/upload') },
      { href: '/admin/resources/library', label: 'Resource Library', icon: FolderOpen, match: (path: string) => path.startsWith('/admin/resources/library') },
      { href: '/admin/users', label: 'Users Directory', icon: Users, match: (path: string) => path.startsWith('/admin/users') },
    ],
    []
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
        collapsed ? collapsedWidth : expandedWidth
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white">
            G
          </div>
          {!collapsed ? (
            <div className="min-w-0 text-left">
              <p className="truncate text-lg font-black text-slate-900">GradPath</p>
              <p className="text-xs font-medium text-slate-500">Admin Console</p>
            </div>
          ) : null}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapsed((prev: boolean) => !prev)}
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
      </nav>

      <div className="border-t border-slate-100 px-3 py-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className={`text-sm font-bold text-slate-900 ${collapsed ? 'hidden' : 'block'}`}>{user?.name || 'Admin'}</p>
          <p className={`text-xs font-medium uppercase tracking-[0.12em] text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>
            {user?.role || 'admin'}
          </p>
          {collapsed ? <p className="text-center text-xs font-bold text-slate-900">{user?.name?.charAt(0) || 'A'}</p> : null}
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
  );
};

export const AdminWorkspaceShell = ({
  title,
  description,
  children,
}: AdminWorkspaceShellProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-black tracking-tight text-slate-900">GradPath Admin</span>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close navigation overlay"
        />
      ) : null}

      <Suspense fallback={null}>
        <NavContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          user={user}
          logout={logout}
          router={router}
        />
      </Suspense>

      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <main className="min-h-screen px-4 py-6 pt-20 lg:px-8 lg:pt-8">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h1 className="text-2xl font-black text-slate-900">{title}</h1>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            <div className="p-6">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};
