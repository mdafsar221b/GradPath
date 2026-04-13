'use client';

import { use } from 'react';
import { UnitList } from '@/features/academic/ui/UnitList';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="rounded-full w-10 h-10 p-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Subject Overview</h1>
        </header>

        <main>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">Units in this subject</h2>
            <UnitList subjectId={id} />
          </div>
        </main>
      </div>
    </div>
  );
}
