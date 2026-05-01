'use client';

import { useState } from 'react';
import { AdminResourceUpload } from '@/features/resource/ui/AdminResourceUpload';
import { AdminResourceList } from '@/features/resource/ui/AdminResourceList';
import { LayoutDashboard, UploadCloud, List } from 'lucide-react';
import Link from 'next/link';

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="mt-2 text-gray-500">Manage academic resources and study materials</p>
          </div>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shrink-0"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'upload' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Resource
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'manage' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
            Manage Resources
          </button>
        </div>

        {activeTab === 'upload' ? <AdminResourceUpload /> : <AdminResourceList />}
      </div>
    </div>
  );
}
