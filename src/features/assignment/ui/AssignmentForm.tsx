'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { academicApi } from '@/features/academic/api/academic-api';
import { useAssignmentStore } from '../model/assignment.store';
import { Loader2, Plus } from 'lucide-react';

interface SubjectOption {
  _id: string;
  name: string;
  code?: string;
}

interface UnitOption {
  _id: string;
  unitNumber: number;
  title: string;
}

export const AssignmentForm = () => {
  const { user, token } = useAuthStore();
  const addAssignment = useAssignmentStore((state) => state.addAssignment);

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  
  const [formData, setFormData] = useState({
    subjectId: '',
    unitId: '',
    title: '',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [fetchingUnits, setFetchingUnits] = useState(false);

  useEffect(() => {
    if (user?.semester) {
      const fetchSubjects = async () => {
        setFetchingSubjects(true);
        try {
          const data = await academicApi.getSubjects(user.semester as number);
          setSubjects(data);
        } catch (error) {
          console.error('Failed to fetch subjects', error);
        } finally {
          setFetchingSubjects(false);
        }
      };
      fetchSubjects();
    }
  }, [user?.semester]);

  useEffect(() => {
    if (formData.subjectId) {
      const fetchUnits = async () => {
        setFetchingUnits(true);
        try {
          const data = await academicApi.getUnits(formData.subjectId);
          setUnits(data);
        } catch (error) {
          console.error('Failed to fetch units', error);
        } finally {
          setFetchingUnits(false);
        }
      };
      fetchUnits();
    } else {
      setUnits([]);
    }
  }, [formData.subjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      await addAssignment(formData, token);
      setFormData({ subjectId: '', unitId: '', title: '', dueDate: '' });
      alert('Assignment added!');
    } catch (error) {
      console.error('Failed to add assignment', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-500" />
        New Assignment
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Subject</label>
          <select 
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            required
            disabled={fetchingSubjects}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Unit</label>
          <select 
            value={formData.unitId}
            onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
            required
            disabled={fetchingUnits || !formData.subjectId}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select Unit</option>
            {units.map(u => <option key={u._id} value={u._id}>Unit {u.unitNumber}: {u.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Assignment Title</label>
          <input 
            type="text"
            placeholder="e.g. Write Tutorial 1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Due Date</label>
            <input 
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 h-[42px] bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};
