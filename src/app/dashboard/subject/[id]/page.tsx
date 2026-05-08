'use client';

import { use } from 'react';
import { UnitList } from '@/features/academic/ui/UnitList';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { Loader } from '@/shared/ui/Loader';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';
import { ContextDiscussionPanel } from '@/features/discussion/ui/ContextDiscussionPanel';

export default function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Opening subject workspace..." />;
  }

  return (
    <StudentAppShell>
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-lg shadow-blue-100/40">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subject Overview</h1>
              <p className="mt-1 text-sm font-medium text-gray-500">Track units, confidence, and linked study material in one place.</p>
            </div>
          </div>
        </header>

        <ContextDiscussionPanel
          contextType="subject"
          subjectId={id}
          title="Subject Discussion"
          description="Ask subject-level doubts, share explanations, and let seniors answer within this exact syllabus context."
        />

        <main>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">Units in this subject</h2>
            <UnitList subjectId={id} />
          </div>
        </main>
      </div>
    </StudentAppShell>
  );
}
