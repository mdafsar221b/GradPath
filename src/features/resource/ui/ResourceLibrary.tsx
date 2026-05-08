'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '../api/resource.api';
import { academicApi } from '@/features/academic/api/academic-api';
import { Resource, ResourceCategory, ResourceDifficulty, ResourceSubject, ResourceType, ResourceUnit } from '../model/resource.types';
import { getResourceOpenUrl } from '../lib/resource-utils';
import {
  Search,
  Filter,
  FileText,
  BookOpen,
  Video,
  Link as LinkIcon,
  Download,
  ExternalLink,
  GraduationCap,
  SlidersHorizontal,
} from 'lucide-react';
import { Loader } from '@/shared/ui/Loader';
import { useSearchParams } from 'next/navigation';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

const isSubjectObject = (subject: Resource['subjectId']): subject is ResourceSubject => typeof subject === 'object' && subject !== null;
const isUnitObject = (unit: Resource['unitId']): unit is ResourceUnit => typeof unit === 'object' && unit !== null;

export const ResourceLibrary = () => {
  const { token, user } = useAuthStore();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category') as ResourceCategory | null;

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [autoCategoryHint, setAutoCategoryHint] = useState('');

  const [filters, setFilters] = useState({
    category: (searchParams.get('category') as ResourceCategory) || 'notes',
    semester: user?.semester || 1,
    subjectId: searchParams.get('subjectId') || '',
    search: '',
    type: '' as ResourceType | '',
    difficulty: '' as ResourceDifficulty | '',
    year: '',
  });

  useEffect(() => {
    const nextCategory = (searchParams.get('category') as ResourceCategory) || 'notes';
    const nextSubjectId = searchParams.get('subjectId') || '';

    setFilters((prev) => ({
      ...prev,
      category: nextCategory,
      subjectId: nextSubjectId,
      semester: user?.semester || prev.semester,
    }));
  }, [searchParams, user?.semester]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data: SubjectOption[] = await academicApi.getSubjects(filters.semester);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, [filters.semester]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const queryParams = {
          category: filters.category,
          semester: filters.semester,
          subjectId: filters.subjectId || undefined,
          search: filters.search || undefined,
          type: filters.type,
          difficulty: filters.difficulty,
          year: filters.year,
        };

        const data = await resourceApi.getResources(queryParams, token);

        const hasManualFilters =
          Boolean(filters.subjectId) ||
          Boolean(filters.search) ||
          Boolean(filters.type) ||
          Boolean(filters.difficulty) ||
          Boolean(filters.year);

        if (
          filters.category === 'notes' &&
          data.length === 0 &&
          !requestedCategory &&
          !hasManualFilters
        ) {
          const pyqData = await resourceApi.getResources(
            { ...queryParams, category: 'pyq' },
            token
          );

          if (pyqData.length > 0) {
            setFilters((prev) => ({ ...prev, category: 'pyq' }));
            setResources(pyqData);
            setAutoCategoryHint(`Showing PYQ papers because Semester ${filters.semester} has no notes yet.`);
            return;
          }
        }

        setAutoCategoryHint('');
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
        setResources([]);
        setAutoCategoryHint('');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [token, filters.category, filters.semester, filters.subjectId, filters.search, filters.type, filters.difficulty, filters.year, requestedCategory]);

  const resetFilters = () => {
    setFilters({
      category: requestedCategory || 'notes',
      semester: user?.semester || 1,
      subjectId: searchParams.get('subjectId') || '',
      search: '',
      type: '',
      difficulty: '',
      year: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-600 rounded-md text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Syllabus-Mapped Library</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight md:text-3xl">Academic Resource Library</h1>
            <p className="mt-1 text-sm text-gray-500 font-medium max-w-xl">Notes, PYQs, videos, and links organized by semester, subject, and unit.</p>
          </div>

          <div className="flex gap-1.5 p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
            {(['notes', 'pyq'] as ResourceCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filters.category === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat === 'notes' ? 'Study Notes' : 'PYQ Papers'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, description, tags..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full h-10 pl-9 pr-3 bg-white border border-gray-100 rounded-xl font-semibold text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <select
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: Number(e.target.value), subjectId: '' })}
            className="h-10 bg-white border border-gray-100 rounded-xl px-3 font-semibold text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select
            value={filters.subjectId}
            onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
            className="h-10 bg-white border border-gray-100 rounded-xl px-3 font-semibold text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.code ? `${s.code} - ` : ''}{s.name}</option>)}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as ResourceType | '' })}
            className="h-10 bg-white border border-gray-100 rounded-xl px-3 font-semibold text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="youtube">Video</option>
            <option value="link">Link</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as ResourceDifficulty | '' })}
            className="h-10 bg-white border border-gray-100 rounded-xl px-3 font-semibold text-[13px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="exam">Exam</option>
          </select>
        </div>

        {autoCategoryHint ? (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {autoCategoryHint}
          </div>
        ) : null}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
              {resources.length} result{resources.length === 1 ? '' : 's'}
            </span>
            {filters.subjectId ? (
              <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                Subject filtered
              </span>
            ) : null}
            {filters.year ? (
              <span className="rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                Year {filters.year}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>

        {filters.category === 'pyq' && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-amber-50 border border-amber-100 p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[13px] font-black text-amber-900">Exam mode active</p>
                <p className="text-[11px] font-medium text-amber-700">Filter by year to inspect historical paper coverage and recent question trends.</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="2020-21"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="h-9 w-full sm:w-32 bg-white border border-amber-100 rounded-lg px-3 font-semibold text-[13px] outline-none"
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader text="Curating your library..." />
          </div>
        ) : resources.length > 0 ? (
          <div className={filters.category === 'pyq' ? "flex flex-col gap-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {resources.map((resource) => {
              const Icons = {
                pdf: FileText,
                youtube: Video,
                link: LinkIcon,
              };
              const Icon = Icons[resource.type] || BookOpen;
              const isExternal = resource.type !== 'pdf';
              const subject = isSubjectObject(resource.subjectId) ? resource.subjectId : null;
              const unit = isUnitObject(resource.unitId) ? resource.unitId : null;

              if (filters.category === 'pyq') {
                return (
                  <div key={resource._id} className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {resource.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                          {resource.year && <span className="text-emerald-600 font-black">{resource.year}</span>}
                          {resource.year && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                          <span className="truncate">{subject?.name || 'Subject Material'}</span>
                          {resource.difficulty && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="uppercase tracking-widest text-[9px] font-black bg-gray-50 px-2 py-0.5 rounded-full">{resource.difficulty}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={getResourceOpenUrl(resource)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      {isExternal ? 'View' : 'Open'}
                      {isExternal ? <ExternalLink className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                    </a>
                  </div>
                );
              }

              return (
                <div key={resource._id} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      resource.category === 'notes' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1.5 items-end ml-2">
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-[15px] font-black text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {resource.description && (
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-3 leading-relaxed">{resource.description}</p>
                  )}

                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span className="truncate">{subject?.name || 'Subject Material'}</span>
                    </div>
                    {resource.category === 'notes' && unit && (
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Unit {unit.unitNumber}: {unit.title}
                      </div>
                    )}
                  </div>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {resource.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[9px] font-black uppercase tracking-wider truncate max-w-[80px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={getResourceOpenUrl(resource)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 mt-auto bg-gray-50 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    {isExternal ? (
                      <>View Content <ExternalLink className="w-3.5 h-3.5" /></>
                    ) : (
                      <>Open PDF <Download className="w-3.5 h-3.5" /></>
                    )}
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Filter className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
