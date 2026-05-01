'use client';

import { ResourceLibrary } from '@/features/resource/ui/ResourceLibrary';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';

export default function ResourcesPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/dashboard')}>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">G</div>
              <span className="text-xl font-black text-gray-900 tracking-tight">GradPath</span>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Student</p>
                </div>
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ResourceLibrary />
    </div>
  );
}
