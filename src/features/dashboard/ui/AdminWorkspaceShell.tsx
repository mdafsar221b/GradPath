'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LucideIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

interface AdminNavItem {
  href?: string;
  id?: string;
  label: string;
  icon: LucideIcon;
}

interface AdminWorkspaceShellProps {
  title: string;
  description: string;
  primaryItems: AdminNavItem[];
  activePrimary: string;
  sections: AdminNavItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  children: React.ReactNode;
}

const baseItemClass =
  'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors';

export const AdminWorkspaceShell = ({
  title,
  description,
  primaryItems,
  activePrimary,
  sections,
  activeSection,
  onSectionChange,
  children,
}: AdminWorkspaceShellProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:w-72">
          <div className="border-b border-slate-100 px-2 pb-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white">
                G
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">GradPath</p>
                <p className="text-xs font-medium text-slate-500">Admin</p>
              </div>
            </button>
          </div>

          <div className="space-y-2 px-2 py-4">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePrimary === item.label;

              if (!item.href) return null;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${baseItemClass} ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-2 pt-4">
            <p className="px-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sections</p>
            <div className="mt-3 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => section.id && onSectionChange(section.id)}
                    className={`${baseItemClass} ${
                      isActive
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 px-2 pt-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                {user?.role || 'admin'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          <div className="border-b border-slate-100 px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => section.id && onSectionChange(section.id)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">{children}</div>
        </section>
      </div>
    </div>
  );
};
