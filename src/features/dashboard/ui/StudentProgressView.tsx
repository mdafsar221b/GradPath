'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SubjectList } from '@/features/academic/ui/SubjectList';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

export const StudentProgressView = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-md shadow-blue-100/40 md:p-6">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_58%)] md:block" />
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                Semester {user.semester || '-'}
              </span>
              <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                Progress
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
              Track every subject clearly.
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-gray-600">
              Move subject by subject, check coverage, and open the exact unit, resource, or PYQ path you need next.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => router.push('/resources')}
              className="h-10 rounded-xl px-5 text-sm shadow-md shadow-blue-100"
            >
              Open Library
            </Button>
            <Button
              onClick={() => router.push('/model-paper')}
              variant="outline"
              className="h-10 rounded-xl px-5 text-sm"
            >
              PYQ Analysis
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SubjectList semester={user.semester || 1} />
      </section>
    </main>
  );
};
