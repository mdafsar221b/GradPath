'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '../api/resource.api';
import { academicApi } from '@/features/academic/api/academic-api';
import { Resource, ResourceCategory, ResourceDifficulty, ResourceSubject, ResourceType, ResourceUnit } from '../model/resource.types';
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

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const [filters, setFilters] = useState({
    category: (searchParams.get('category') as ResourceCategory) || 'notes',
    semester: user?.semester || 1,
    subjectId: searchParams.get('subjectId') || '',
    search: '',
    type: '' as ResourceType | '',
    difficulty: '' as ResourceDifficulty | '',
    year: '' as number | '',
  });

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
      if (!token) return;
      setLoading(true);
      try {
        const data = await resourceApi.getResources({
          category: filters.category,
          semester: filters.semester,
          subjectId: filters.subjectId || undefined,
          search: filters.search || undefined,
          type: filters.type,
          difficulty: filters.difficulty,
          year: filters.year,
        }, token);
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [token, filters.category, filters.semester, filters.subjectId, filters.search, filters.type, filters.difficulty, filters.year]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">BCA Resource Explorer</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Academic Library</h1>
            <p className="mt-2 text-gray-500 font-medium">Notes, PYQs, videos, and links mapped to your semester.</p>
          </div>

          <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
            {(['notes', 'pyq'] as ResourceCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilters({ ...filters, category: cat })}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filters.category === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat === 'notes' ? 'Study Notes' : 'PYQ Papers'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, description, tags..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <select
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: Number(e.target.value), subjectId: '' })}
            className="h-14 bg-white border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select
            value={filters.subjectId}
            onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
            className="h-14 bg-white border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.code ? `${s.code} - ` : ''}{s.name}</option>)}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as ResourceType | '' })}
            className="h-14 bg-white border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Types</option>
            <option value="pdf">PDF</option>
            <option value="youtube">Video</option>
            <option value="link">Link</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as ResourceDifficulty | '' })}
            className="h-14 bg-white border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="exam">Exam</option>
          </select>
        </div>

        {filters.category === 'pyq' && (
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm font-black text-amber-900">Exam mode active</p>
                <p className="text-xs font-medium text-amber-700">Filter by year to focus on recent question-paper trends.</p>
              </div>
            </div>
            <input
              type="number"
              min={2000}
              max={2100}
              placeholder="Year"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : '' })}
              className="h-11 w-full sm:w-32 bg-white border border-amber-100 rounded-xl px-4 font-bold text-sm outline-none"
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader text="Curating your library..." />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              return (
                <div key={resource._id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      resource.category === 'notes' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>

                  {resource.description && (
                    <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4">{resource.description}</p>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      {subject?.name || 'Subject Material'}
                    </div>
                    {resource.category === 'notes' && unit && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-tighter">
                        Unit {unit.unitNumber}: {unit.title}
                      </div>
                    )}
                    {resource.category === 'pyq' && (resource.year || resource.examSession) && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-black uppercase tracking-tighter">
                        {resource.year || 'PYQ'} {resource.examSession ? `- ${resource.examSession}` : ''}
                      </div>
                    )}
                  </div>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {resource.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    {isExternal ? (
                      <>View Content <ExternalLink className="w-4 h-4" /></>
                    ) : (
                      <>Download PDF <Download className="w-4 h-4" /></>
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
