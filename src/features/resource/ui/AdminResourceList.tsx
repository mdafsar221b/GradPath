'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '../api/resource.api';
import { Resource, ResourceSubject, ResourceUnit } from '../model/resource.types';
import { Edit2, Trash2, Loader2, X, ExternalLink } from 'lucide-react';

const getSubject = (resource: Resource): ResourceSubject | null => (
  typeof resource.subjectId === 'object' && resource.subjectId !== null ? resource.subjectId : null
);

const getUnit = (resource: Resource): ResourceUnit | null => (
  typeof resource.unitId === 'object' && resource.unitId !== null ? resource.unitId : null
);

export const AdminResourceList = () => {
  const { token } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    url: '',
    category: 'notes' as 'notes' | 'pyq',
    type: 'pdf' as 'pdf' | 'youtube' | 'link',
    description: '',
    tags: '',
    difficulty: 'intermediate' as 'beginner' | 'intermediate' | 'exam',
  });

  const fetchResources = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await resourceApi.getResources({}, token);
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    if (!token) return;

    try {
      await resourceApi.deleteResource(id, token);
      setResources(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Failed to delete resource', error);
      alert('Failed to delete resource');
    }
  };

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setEditForm({
      title: resource.title,
      url: resource.url,
      category: resource.category,
      type: resource.type,
      description: resource.description || '',
      tags: resource.tags?.join(', ') || '',
      difficulty: resource.difficulty || 'intermediate',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingResource) return;

    setSaving(true);
    try {
      const tags = editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await resourceApi.updateResource(editingResource._id, { ...editForm, tags }, token);
      setResources(prev => prev.map(r => (
        r._id === editingResource._id
          ? { ...r, ...editForm, tags }
          : r
      )));
      setEditingResource(null);
    } catch (error) {
      console.error('Failed to update resource', error);
      alert('Failed to update resource');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Manage Uploaded Resources</h3>
        <span className="text-sm font-medium text-gray-500">{resources.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Title & Details</th>
              <th className="px-6 py-4">Subject & Sem</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  No resources uploaded yet.
                </td>
              </tr>
            ) : (
              resources.map(resource => {
                const subject = getSubject(resource);
                const unit = getUnit(resource);

                return (
                  <tr key={resource._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 mb-1">{resource.title}</div>
                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                        <span className="uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">{resource.category}</span>
                        {resource.difficulty && <span className="uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{resource.difficulty}</span>}
                        {resource.year && <span className="uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">{resource.year}</span>}
                        {resource.url && (
                          <a href={resource.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                            Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">
                        {subject?.name || 'Unknown Subject'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Sem {subject?.semester || '?'} - {unit ? `Unit ${unit.unitNumber}` : 'Overall'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        resource.type === 'pdf' ? 'bg-red-100 text-red-700' :
                        resource.type === 'youtube' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(resource)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Resource"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Resource</h3>
              <button
                onClick={() => setEditingResource(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Resource Type</label>
                <select
                  value={editForm.type}
                  onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value as typeof editForm.type }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="youtube">YouTube Video</option>
                  <option value="link">Web Link</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">URL / Link</label>
                <input
                  type="text"
                  value={editForm.url}
                  onChange={e => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Difficulty</label>
                <select
                  value={editForm.difficulty}
                  onChange={e => setEditForm(prev => ({ ...prev, difficulty: e.target.value as typeof editForm.difficulty }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="exam">Exam Focused</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tags</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={e => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
