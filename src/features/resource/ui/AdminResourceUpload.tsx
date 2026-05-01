'use client';

import { useState, useEffect } from 'react';
import { academicApi } from '@/features/academic/api/academic-api';
import { resourceApi } from '../api/resource.api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { 
  Loader2, 
  UploadCloud, 
  Link as LinkIcon, 
  Video, 
  ChevronLeft, 
  FileText, 
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResourceCategory } from '../model/resource.types';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
  semester: number;
}

interface UnitOption {
  _id: string;
  unitNumber: number;
  title: string;
}

export const AdminResourceUpload = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    unitId: '',
    title: '',
    category: 'notes' as ResourceCategory,
    type: 'pdf' as 'pdf' | 'youtube' | 'link',
    url: '',
    description: '',
    tags: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'exam',
    year: '',
    examSession: '',
    source: '',
    estimatedMinutes: '30',
  });
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [fetchingUnits, setFetchingUnits] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setFetchingSubjects(true);
      try {
        const data = await academicApi.getSubjects(semester);
        setSubjects(data);
        setFormData(prev => ({ ...prev, subjectId: '', unitId: '' }));
      } catch (error) {
        console.error('Error fetching subjects', error);
      } finally {
        setFetchingSubjects(false);
      }
    };
    fetchSubjects();
  }, [semester]);

  useEffect(() => {
    if (!formData.subjectId || formData.category === 'pyq') {
      setUnits([]);
      return;
    }
    const fetchUnits = async () => {
      setFetchingUnits(true);
      try {
        const data = await academicApi.getUnits(formData.subjectId);
        setUnits(data);
        setFormData(prev => ({ ...prev, unitId: '' }));
      } catch (error) {
        console.error('Error fetching units', error);
      } finally {
        setFetchingUnits(false);
      }
    };
    fetchUnits();
  }, [formData.subjectId, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('subjectId', formData.subjectId);
      if (formData.category === 'notes') {
        data.append('unitId', formData.unitId);
      }
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('tags', formData.tags);
      data.append('difficulty', formData.difficulty);
      data.append('source', formData.source);
      data.append('estimatedMinutes', formData.estimatedMinutes);
      if (formData.category === 'pyq') {
        data.append('year', formData.year);
        data.append('examSession', formData.examSession);
      }
      
      if (formData.type === 'pdf' && file) {
        data.append('file', file);
      } else {
        data.append('url', formData.url);
      }

      await resourceApi.createResource(data, token);
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        title: '',
        url: '',
        description: '',
        tags: '',
        year: '',
        examSession: '',
        source: '',
        estimatedMinutes: '30',
      }));
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
          {/* Sidebar Info */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white relative flex flex-col justify-between">
            <div className="relative z-10">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-12 text-sm font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Command Center
              </button>
              
              <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-blue-200" />
              </div>
              <h2 className="text-3xl font-black leading-tight mb-4">Upload Study <br/> Resources</h2>
              <p className="text-blue-100/80 leading-relaxed text-sm">
                Empower students by providing high-quality study materials, notes, and previous year questions.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-200">Notes</p>
                    <p className="text-xs opacity-70">Requires specific Unit selection</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-200">PYQs</p>
                    <p className="text-xs opacity-70">Directly linked to subjects</p>
                  </div>
               </div>
            </div>

            {/* Background pattern */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 p-10 space-y-8">
            <div className="space-y-6">
              {/* Category Picker */}
              <div className="bg-gray-50 p-1.5 rounded-2xl flex gap-1">
                {(['notes', 'pyq'] as ResourceCategory[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.category === cat 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat === 'notes' ? 'Study Notes' : 'PYQ Paper'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Semester</label>
                  <select 
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subject</label>
                  <select 
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    required
                    disabled={fetchingSubjects}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {formData.category === 'notes' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Unit Assignment</label>
                  <select 
                    value={formData.unitId}
                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                    required
                    disabled={fetchingUnits || !formData.subjectId}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Select Curriculum Unit</option>
                    {units.map(u => <option key={u._id} value={u._id}>Unit {u.unitNumber}: {u.title}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Resource Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Unit 3 Detailed Mechanism Notes"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                <textarea
                  placeholder="Short context: what this helps students revise or practice"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as typeof formData.difficulty })}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="exam">Exam Focused</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Study Time</label>
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={formData.estimatedMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedMinutes: e.target.value })}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Source</label>
                  <input
                    type="text"
                    placeholder="Faculty, book, web"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tags</label>
                <input
                  type="text"
                  placeholder="dbms, normalization, important, viva"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {formData.category === 'pyq' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Question Paper Year</label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      placeholder="2025"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Exam Session</label>
                    <input
                      type="text"
                      placeholder="Even Sem, Internal, Final"
                      value={formData.examSession}
                      onChange={(e) => setFormData({ ...formData, examSession: e.target.value })}
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Submission Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'pdf', icon: UploadCloud, label: 'Document' },
                    { id: 'youtube', icon: Video, label: 'Video' },
                    { id: 'link', icon: LinkIcon, label: 'Web Link' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t.id as typeof formData.type, url: '' })}
                      className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all gap-2 ${
                        formData.type === t.id 
                          ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                          : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <t.icon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {formData.type === 'pdf' ? (
                  <div className="relative border-2 border-dashed border-gray-100 rounded-[1.5rem] p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-200 hover:bg-blue-50/20 transition-all group">
                    <input 
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-white shadow-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-black text-gray-900">{file ? file.name : 'Choose PDF Document'}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Maximum size: 10MB</p>
                    </div>
                  </div>
                ) : (
                  <input 
                    type="url"
                    placeholder="Provide full URL (https://...)"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-4 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xl ${
                success 
                  ? 'bg-emerald-500 text-white shadow-emerald-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Successfully Uploaded
                </>
              ) : (
                'Publish Resource'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
