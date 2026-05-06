'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { academicApi } from '@/features/academic/api/academic-api';
import { AdminResourceList, AdminResourceFilters } from '@/features/resource/ui/AdminResourceList';
import { AdminResourceUpload } from '@/features/resource/ui/AdminResourceUpload';
import { useAdminResourceStats } from '@/features/dashboard/ui/AdminDashboardSections';
import { Card, CardContent } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';

type ResourceTab = 'upload' | 'library' | 'review';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

const tabs: ResourceTab[] = ['upload', 'library', 'review'];

export const AdminResourcesWorkspace = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = tabs.includes((searchParams.get('tab') || '') as ResourceTab)
    ? (searchParams.get('tab') as ResourceTab)
    : 'upload';

  const { stats, loading: statsLoading } = useAdminResourceStats();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [filters, setFilters] = useState<AdminResourceFilters>({
    subjectId: '',
    semester: undefined,
    category: '',
    type: '',
    difficulty: '',
    qualityStatus: '',
    year: '',
    search: '',
    tag: '',
  });
  const [reviewStatus, setReviewStatus] = useState<'' | 'draft' | 'review' | 'published' | 'archived'>('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const results = await Promise.all([1, 2, 3, 4, 5, 6].map((semester) => academicApi.getSubjects(semester)));
        setSubjects(results.flat());
      } catch (error) {
        console.error('Failed to fetch subjects for admin filters', error);
      }
    };

    fetchSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!filters.semester) return subjects;
    return subjects.filter((subject) => subject.semester === filters.semester);
  }, [filters.semester, subjects]);

  const setTab = (tab: ResourceTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`/admin/resources?${params.toString()}`);
  };

  if (statsLoading) {
    return <Loader text="Loading resources workspace..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTab(tab)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold capitalize ${
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'upload' ? <AdminResourceUpload /> : null}

      {activeTab === 'library' ? (
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <input
                  value={filters.search || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Search by title, description, or tag"
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                />
                <select
                  value={filters.semester || ''}
                  onChange={(e) => setFilters((prev) => ({
                    ...prev,
                    semester: e.target.value ? Number(e.target.value) : undefined,
                    subjectId: '',
                  }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All semesters</option>
                  {[1, 2, 3, 4, 5, 6].map((semester) => (
                    <option key={semester} value={semester}>
                      Semester {semester}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.subjectId || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, subjectId: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All subjects</option>
                  {filteredSubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.code ? `${subject.code} - ` : ''}{subject.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All categories</option>
                  <option value="notes">Notes</option>
                  <option value="pyq">PYQ</option>
                </select>
                <select
                  value={filters.type || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as AdminResourceFilters['type'] }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All types</option>
                  <option value="pdf">PDF</option>
                  <option value="youtube">YouTube</option>
                  <option value="link">Link</option>
                </select>
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value as AdminResourceFilters['difficulty'] }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="exam">Exam</option>
                </select>
                <select
                  value={filters.qualityStatus || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, qualityStatus: e.target.value as AdminResourceFilters['qualityStatus'] }))}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <input
                  value={filters.year || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                  placeholder="Year"
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                />
                <input
                  value={filters.tag || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, tag: e.target.value }))}
                  placeholder="Tag"
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <AdminResourceList
            filters={filters}
            title="Resource Library"
            description="Filtered resource results across semesters, subjects, quality status, and tags."
          />
        </div>
      ) : null}

      {activeTab === 'review' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(stats?.byQualityStatus || []).map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setReviewStatus((current) => (current === item._id ? '' : (item._id as typeof reviewStatus)))}
                className={`rounded-3xl border p-5 text-left shadow-sm transition-colors ${
                  reviewStatus === item._id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${reviewStatus === item._id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {item._id || 'published'}
                </p>
                <p className="mt-3 text-3xl font-black">{item.count}</p>
                <p className={`mt-2 text-sm ${reviewStatus === item._id ? 'text-slate-200' : 'text-slate-500'}`}>
                  Click to {reviewStatus === item._id ? 'clear the filter' : 'filter the review queue'}
                </p>
              </button>
            ))}
          </div>

          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-6">
              <h2 className="text-lg font-black text-slate-900">Latest activity</h2>
              <p className="mt-1 text-sm text-slate-500">Recent uploads with current quality states.</p>
              <div className="mt-5 divide-y divide-slate-100">
                {(stats?.recentResources || []).map((resource) => (
                  <div key={resource._id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{resource.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {resource.category} | {resource.type}
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold capitalize text-slate-600">
                      {resource.qualityStatus || 'published'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <AdminResourceList
            filters={{ qualityStatus: reviewStatus || undefined }}
            title="Review Queue"
            description="Inspect resources by publication state and update them directly from the queue."
            emptyMessage="No resources are waiting in this quality state."
          />
        </div>
      ) : null}
    </div>
  );
};
