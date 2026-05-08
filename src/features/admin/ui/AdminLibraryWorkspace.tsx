'use client';

import { useEffect, useMemo, useState } from 'react';
import { academicApi } from '@/features/academic/api/academic-api';
import { AdminResourceList, AdminResourceFilters } from '@/features/resource/ui/AdminResourceList';
import { Card, CardContent } from '@/shared/ui/Card';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

export const AdminLibraryWorkspace = () => {
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

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-none">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
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
          </div>
        </CardContent>
      </Card>

      <AdminResourceList
        filters={filters}
        title="Curated Academic Library"
        description="Manage semester resources before they feed student search, PYQ analysis, and model paper generation."
      />
    </div>
  );
};
