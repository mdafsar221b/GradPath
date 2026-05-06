'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '../api/resource.api';
import { Resource } from '../model/resource.types';
import { getResourceOpenUrl, getResourceSubject, getResourceUnit } from '../lib/resource-utils';
import { Edit2, ExternalLink, Loader2, Save, Trash2, X } from 'lucide-react';
import { AdminPyqQuestionManager } from '@/features/pyq/ui/AdminPyqQuestionManager';
import { pyqApi } from '@/features/pyq/api/pyq.api';

export interface AdminResourceFilters {
  subjectId?: string;
  semester?: number;
  category?: string;
  type?: '' | 'pdf' | 'youtube' | 'link';
  difficulty?: '' | 'beginner' | 'intermediate' | 'exam';
  qualityStatus?: '' | 'draft' | 'review' | 'published' | 'archived';
  year?: string;
  search?: string;
  tag?: string;
}

interface AdminResourceListProps {
  filters?: AdminResourceFilters;
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export const AdminResourceList = ({
  filters = {},
  title = 'Resource Library',
  description = 'All filtered resources are listed here.',
  emptyMessage = 'No resources match the current filters.',
}: AdminResourceListProps) => {
  const { token } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [curatingResource, setCuratingResource] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ url: '', year: '', qualityStatus: 'published', tags: '' });
  const [pyqCounts, setPyqCounts] = useState<Record<string, number>>({});

  const fetchResources = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await resourceApi.getResources(filters, token);
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    const fetchPyqCounts = async () => {
      try {
        const statuses = await pyqApi.getResourceStatuses(filters.subjectId);
        setPyqCounts(Object.fromEntries(statuses.map((status) => [status.resourceId, status.questionCount])));
      } catch (error) {
        console.error('Failed to fetch PYQ curation status', error);
      }
    };

    fetchPyqCounts();
  }, [filters.subjectId]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Delete this resource?')) return;

    try {
      await resourceApi.deleteResource(id, token);
      setResources((prev) => prev.filter((resource) => resource._id !== id));
    } catch (error) {
      console.error('Failed to delete resource', error);
    }
  };

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource);
    setEditForm({
      url: resource.type === 'pdf' ? '' : resource.url,
      year: resource.year || '',
      qualityStatus: resource.qualityStatus || 'published',
      tags: (resource.tags || []).join(', '),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingResource) return;

    setSaving(true);
    try {
      const updateData: Partial<Resource> = {
        year: editingResource.category === 'pyq' ? editForm.year.trim() : undefined,
        qualityStatus: editForm.qualityStatus as Resource['qualityStatus'],
        tags: editForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingResource.type !== 'pdf') {
        updateData.url = editForm.url.trim();
      }

      const updated = await resourceApi.updateResource(editingResource._id, updateData, token);
      setResources((prev) => prev.map((resource) => (
        resource._id === editingResource._id ? updated : resource
      )));
      setEditingResource(null);
    } catch (error) {
      console.error('Failed to update resource', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <span className="text-sm font-semibold text-gray-500">{resources.length} results</span>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {resources.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm font-medium text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          resources.map((resource) => {
            const subject = getResourceSubject(resource);
            const unit = getResourceUnit(resource);

            return (
              <div key={resource._id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-900">{resource.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                    <span>{subject?.name || 'Unknown Subject'}</span>
                    <span>Sem {subject?.semester || '?'}</span>
                    <span>{resource.category === 'notes' ? `Unit ${unit?.unitNumber || '?'}` : resource.year || 'PYQ'}</span>
                    <span className="rounded-lg bg-gray-100 px-2 py-1 uppercase">{resource.type}</span>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 capitalize text-blue-700">{resource.qualityStatus || 'published'}</span>
                    {resource.category === 'pyq' ? (
                      <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700">
                        {pyqCounts[resource._id] || 0} curated questions
                      </span>
                    ) : null}
                    {(resource.tags || []).slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-lg bg-slate-100 px-2 py-1 lowercase text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getResourceOpenUrl(resource)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:border-blue-200 hover:text-blue-600"
                  >
                    Open
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleEditClick(resource)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                    title="Edit resource"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {resource.category === 'pyq' ? (
                    <button
                      onClick={() => setCuratingResource(resource)}
                      className="rounded-xl border border-amber-200 px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50"
                      title="Curate PYQ questions"
                    >
                      Curate PYQ
                    </button>
                  ) : null}
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:text-red-600"
                    title="Delete resource"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {editingResource ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h3 className="text-lg font-black text-gray-900">Edit Resource</h3>
              <button onClick={() => setEditingResource(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Title</label>
                <input
                  value={editingResource.title}
                  readOnly
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 text-sm font-semibold text-gray-700 outline-none"
                />
              </div>

              {editingResource.category === 'pyq' ? (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">PYQ Year</label>
                  <input
                    type="text"
                    value={editForm.year}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              ) : null}

              {editingResource.type !== 'pdf' ? (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Link</label>
                  <input
                    type="url"
                    value={editForm.url}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, url: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  PDF link is managed by upload. Use <span className="font-bold">Open</span> to view it.
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Quality Status</label>
                <select
                  value={editForm.qualityStatus}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, qualityStatus: e.target.value }))}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  {['draft', 'review', 'published', 'archived'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Tags</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="notes, important, pyq"
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {curatingResource ? (
        <AdminPyqQuestionManager
          resource={curatingResource}
          onClose={() => {
            setCuratingResource(null);
            pyqApi.getResourceStatuses(filters.subjectId)
              .then((statuses) => setPyqCounts(Object.fromEntries(statuses.map((status) => [status.resourceId, status.questionCount]))))
              .catch((error) => console.error('Failed to refresh PYQ curation status', error));
          }}
        />
      ) : null}
    </div>
  );
};
