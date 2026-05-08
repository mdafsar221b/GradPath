'use client';

import { MessageCircleMore } from 'lucide-react';
import { ContextDiscussionPanel } from '@/features/discussion/ui/ContextDiscussionPanel';
import { useRequireAuth } from '@/shared/lib/useRequireAuth';
import { StudentAppShell } from '@/shared/ui/StudentAppShell';
import { Loader } from '@/shared/ui/Loader';

export default function DiscussionsPage() {
  const { isAuthenticated } = useRequireAuth();

  if (!isAuthenticated) {
    return <Loader fullPage text="Opening the community discussion room..." />;
  }

  return (
    <StudentAppShell>
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <MessageCircleMore className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            <span className="font-black text-slate-950">Universal Academic Room:</span>{' '}
            one shared chat for general doubts, quick peer help, and senior guidance.
          </p>
        </section>

        <ContextDiscussionPanel
          contextType="global"
          title="Community Chat"
          description="Send a message, reply to classmates, and keep one visible discussion stream across semesters."
          mode="chat"
        />
      </div>
    </StudentAppShell>
  );
}
