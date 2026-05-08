'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';

export const AppTopNav = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <button className="flex items-center gap-2 group" onClick={() => router.push('/dashboard')}>
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">G</div>
            <span className="text-xl font-black text-gray-900 tracking-tight">GradPath</span>
          </button>

          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/resources')} className="text-xs font-black uppercase text-gray-400 hover:text-blue-600">Library</button>
            <button onClick={() => router.push('/practice')} className="text-xs font-black uppercase text-gray-400 hover:text-blue-600">Practice</button>

            <div className="hidden sm:block text-right pl-4 border-l border-gray-100">
              <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || 'Student'}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{user?.role || 'student'}</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
