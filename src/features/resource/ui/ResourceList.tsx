'use client';

import { useEffect, useState } from 'react';
import { resourceApi } from '../api/resource.api';
import { Resource } from '../model/resource.types';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { FileText, Video, Link as LinkIcon, ExternalLink } from 'lucide-react';

export const ResourceList = ({ subjectId, unitId }: { subjectId: string; unitId: string }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchResources = async () => {
      if (!token) return;
      try {
        const data = await resourceApi.getResources({ subjectId, unitId }, token);
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch resources', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [subjectId, unitId, token]);

  if (loading) return <div className="text-sm text-gray-400 py-2">Loading materials...</div>;
  if (resources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Study Materials</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {resources.map((res) => (
          <a
            key={res._id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group"
          >
            <div className="mr-3">
              {res.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
              {res.type === 'youtube' && <Video className="w-5 h-5 text-red-600" />}
              {res.type === 'link' && <LinkIcon className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600">
                {res.title}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
};
