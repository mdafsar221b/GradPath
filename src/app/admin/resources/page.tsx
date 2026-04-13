import { AdminResourceUpload } from '@/features/resource/ui/AdminResourceUpload';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
            <p className="mt-2 text-gray-500">Manage academic resources and study materials</p>
          </div>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <AdminResourceUpload />
      </div>
    </div>
  );
}
