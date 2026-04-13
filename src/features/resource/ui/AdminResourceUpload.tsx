'use client';

import { useState, useEffect } from 'react';
import { academicApi } from '@/features/academic/api/academic-api';
import { resourceApi } from '../api/resource.api';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { Loader2, UploadCloud, Link as LinkIcon, Youtube } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AdminResourceUpload = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    unitId: '',
    title: '',
    type: 'pdf' as 'pdf' | 'youtube' | 'link',
    url: '',
  });
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [fetchingUnits, setFetchingUnits] = useState(false);

  // Security check
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch subjects when semester changes
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

  // Fetch units when subject changes
  useEffect(() => {
    if (!formData.subjectId) {
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
  }, [formData.subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append('subjectId', formData.subjectId);
      data.append('unitId', formData.unitId);
      data.append('type', formData.type);
      data.append('title', formData.title);
      
      if (formData.type === 'pdf' && file) {
        data.append('file', file);
      } else {
        data.append('url', formData.url);
      }

      await resourceApi.createResource(data, token);
      alert('Resource uploaded successfully!');
      setFormData(prev => ({ ...prev, title: '', url: '' }));
      setFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Study Resource</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select 
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select 
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              required
              disabled={fetchingSubjects}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.code} - {s.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
          <select 
            value={formData.unitId}
            onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
            required
            disabled={fetchingUnits || !formData.subjectId}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          >
            <option value="">Select Unit</option>
            {units.map(u => <option key={u._id} value={u._id}>Unit {u.unitNumber}: {u.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
          <input 
            type="text"
            placeholder="e.g. Unit 3 Detailed Notes"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
          <div className="flex gap-4">
            {[
              { id: 'pdf', icon: UploadCloud, label: 'PDF' },
              { id: 'youtube', icon: Youtube, label: 'YouTube' },
              { id: 'link', icon: LinkIcon, label: 'Link' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.id as any, url: '' })}
                className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  formData.type === t.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-600' 
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
              >
                <t.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {formData.type === 'pdf' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF File</label>
            <input 
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL (YouTube or Website)</label>
            <input 
              type="url"
              placeholder="https://..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
};
