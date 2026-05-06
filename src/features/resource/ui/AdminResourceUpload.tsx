'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { academicApi } from '@/features/academic/api/academic-api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '../api/resource.api';
import { ResourceCategory, ResourceType } from '../model/resource.types';
import { CheckCircle2, FileText, Link as LinkIcon, Loader2, UploadCloud, Video } from 'lucide-react';

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

const buildTitle = ({
  subject,
  unit,
  category,
  year,
}: {
  subject?: SubjectOption;
  unit?: UnitOption;
  category: ResourceCategory;
  year: string;
}) => {
  const subjectLabel = [subject?.code, subject?.name].filter(Boolean).join(' - ');

  if (!subjectLabel) return '';
  if (category === 'pyq') {
    return [subjectLabel, year || 'PYQ', 'PYQ'].filter(Boolean).join(' | ');
  }

  return [subjectLabel, unit ? `Unit ${unit.unitNumber}` : '', 'Notes'].filter(Boolean).join(' | ');
};

export const AdminResourceUpload = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [lastSubmittedCategory, setLastSubmittedCategory] = useState<ResourceCategory>('notes');

  const [formData, setFormData] = useState({
    category: 'notes' as ResourceCategory,
    subjectId: '',
    unitId: '',
    year: '',
    examSession: '',
    type: 'pdf' as ResourceType,
    url: '',
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await academicApi.getSubjects(semester);
        setSubjects(data);
        setFormData((prev) => ({ ...prev, subjectId: '', unitId: '', year: '', examSession: '' }));
      } catch (fetchError) {
        console.error('Error fetching subjects', fetchError);
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
      try {
        const data = await academicApi.getUnits(formData.subjectId);
        setUnits(data);
        setFormData((prev) => ({ ...prev, unitId: '' }));
      } catch (fetchError) {
        console.error('Error fetching units', fetchError);
      }
    };

    fetchUnits();
  }, [formData.subjectId, formData.category]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject._id === formData.subjectId),
    [subjects, formData.subjectId]
  );

  const selectedUnit = useMemo(
    () => units.find((unit) => unit._id === formData.unitId),
    [units, formData.unitId]
  );

  const generatedTitle = useMemo(
    () => buildTitle({
      subject: selectedSubject,
      unit: selectedUnit,
      category: formData.category,
      year: formData.year,
    }),
    [selectedSubject, selectedUnit, formData.category, formData.year]
  );

  const resetForm = () => {
    setFormData({
      category: 'notes',
      subjectId: '',
      unitId: '',
      year: '',
      examSession: '',
      type: 'pdf',
      url: '',
    });
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      setLastSubmittedCategory(formData.category);
      const data = new FormData();
      data.append('subjectId', formData.subjectId);
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('title', generatedTitle);

      if (formData.category === 'notes') {
        data.append('unitId', formData.unitId);
      } else {
        data.append('year', formData.year.trim());
        data.append('examSession', formData.examSession.trim());
      }

      if (formData.type === 'pdf' && file) {
        data.append('file', file);
      } else {
        data.append('url', formData.url.trim());
      }

      await resourceApi.createResource(data, token);
      setSuccess('Resource uploaded.');
      resetForm();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Upload failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    !formData.subjectId ||
    !generatedTitle ||
    (formData.category === 'notes' && !formData.unitId) ||
    (formData.category === 'pyq' && !formData.year.trim()) ||
    (formData.type === 'pdf' ? !file : !formData.url.trim());

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-black text-gray-900">Upload Resource</h2>
        <p className="mt-1 text-sm text-gray-500">Only the required fields are kept here.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="flex flex-wrap gap-2">
          {(['notes', 'pyq'] as ResourceCategory[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, category, unitId: '', year: '', examSession: '' }))}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                formData.category === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category === 'notes' ? 'Notes' : 'PYQ'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <option key={item} value={item}>
                  Semester {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData((prev) => ({ ...prev, subjectId: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.code ? `${subject.code} - ` : ''}{subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.category === 'notes' ? (
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Unit</label>
            <select
              value={formData.unitId}
              onChange={(e) => setFormData((prev) => ({ ...prev, unitId: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
              required
              disabled={!formData.subjectId}
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  Unit {unit.unitNumber}: {unit.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">PYQ Year</label>
              <input
                type="text"
                placeholder="2020-21"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Exam Session</label>
              <input
                type="text"
                placeholder="Winter, Mid Sem, Final"
                value={formData.examSession}
                onChange={(e) => setFormData((prev) => ({ ...prev, examSession: e.target.value }))}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Title</label>
          <input
            type="text"
            value={generatedTitle}
            readOnly
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 text-sm font-semibold text-gray-700 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pdf', label: 'PDF', icon: UploadCloud },
              { id: 'youtube', label: 'YouTube', icon: Video },
              { id: 'link', label: 'Link', icon: LinkIcon },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: item.id as ResourceType, url: '' }))}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold ${
                  formData.type === item.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {formData.type === 'pdf' ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
            <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm font-medium text-gray-700"
            />
            <p className="mt-3 text-sm text-gray-500">{file ? file.name : 'Select a PDF file.'}</p>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
              required
            />
          </div>
        )}

        {success ? (
          <div className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            {lastSubmittedCategory === 'pyq'
              ? 'PYQ resource uploaded. Open it in the library to curate question text.'
              : success}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Upload
        </button>
      </form>
    </div>
  );
};
