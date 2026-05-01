'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { resourceApi } from '@/features/resource/api/resource.api';
import { ResourceStats } from '@/features/resource/model/resource.types';
import { Card, CardContent } from '@/shared/ui/Card';
import { 
  FileText, 
  BookOpen, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Layers,
  Video,
  Link as LinkIcon,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/ui/Loader';

export const AdminDashboardView = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const data = await resourceApi.getResourceStats(token);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <Loader text="Loading analytical data..." />;

  const statCards = [
    {
      title: 'Total Resources',
      value: stats?.totalResources || 0,
      icon: Layers,
      color: 'bg-blue-500',
      description: 'Total uploaded materials'
    },
    {
      title: 'Study Notes',
      value: stats?.notesCount || 0,
      icon: BookOpen,
      color: 'bg-indigo-500',
      description: 'Unit-wise detailed notes'
    },
    {
      title: 'PYQ Library',
      value: stats?.pyqsCount || 0,
      icon: FileText,
      color: 'bg-violet-500',
      description: 'Previous year questions'
    },
    {
      title: 'Pending Content',
      value: stats?.pendingSubjectsCount || 0,
      icon: AlertCircle,
      color: 'bg-amber-500',
      description: 'Subjects missing materials'
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Command Center</span>
          </h1>
          <p className="mt-2 text-gray-500 font-medium text-lg">
            Manage your academic ecosystem and track resource coverage.
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/admin/resources')}
          className="flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:scale-105 transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Upload New Resource
        </button>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest">{card.title}</h3>
              <p className="text-3xl font-black text-gray-900 my-1">{card.value}</p>
              <p className="text-xs text-gray-400 font-medium">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Resource Distribution */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Resource Distribution</h3>
              <button className="text-sm font-bold text-blue-600 flex items-center gap-1">
                Full Report <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats?.byType.map((item, i) => {
                const colors = {
                  pdf: 'from-orange-500 to-red-500',
                  youtube: 'from-red-600 to-rose-600',
                  link: 'from-blue-500 to-cyan-500'
                };
                const labels = {
                   pdf: 'PDF Documents',
                   youtube: 'Video Content',
                   link: 'External Links'
                };
                const Icons = {
                  pdf: FileText,
                  youtube: Video,
                  link: LinkIcon
                };
                const type = item._id as keyof typeof colors;
                const Icon = Icons[type] || LinkIcon;

                return (
                  <div key={i} className="relative p-6 rounded-3xl bg-gray-50 flex flex-col items-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colors[type] || 'from-gray-400 to-gray-600'} rounded-2xl flex items-center justify-center text-white shadow-lg mb-4`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">{labels[type] || 'Other'}</span>
                    <span className="text-2xl font-black text-gray-900">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <aside className="space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Management Tools</h3>
          <div className="space-y-3">
            {[
              { label: 'System Health', icon: TrendingUp, active: true },
              { label: 'User Analytics', icon: ArrowUpRight, active: false },
              { label: 'Database Backup', icon: Layers, active: false }
            ].map((tool, i) => (
              <button 
                key={i}
                className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">{tool.label}</span>
                </div>
                {tool.active && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <CardContent className="p-8 relative z-10 text-white">
                <h4 className="font-black text-lg mb-2">Content Gap Analytics</h4>
                <p className="text-blue-100 text-xs leading-relaxed mb-4">
                  {stats?.pendingSubjectsCount || 0} subjects are currently lacking sufficient study materials.
                </p>
                <button 
                  onClick={() => router.push('/admin/resources')}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs hover:bg-blue-50 transition-all"
                >
                  Improve Coverage
                </button>
             </CardContent>
          </Card>
        </aside>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-black text-gray-900 mb-6">Difficulty Mix</h3>
            <div className="space-y-4">
              {(stats?.byDifficulty || []).length > 0 ? (
                stats?.byDifficulty?.map((item) => (
                  <div key={item._id || 'unset'} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500 capitalize">{item._id || 'Unset'}</span>
                    <span className="text-sm font-black text-gray-900">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 font-medium">No difficulty metadata yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Recently Published</h3>
              <button
                onClick={() => router.push('/admin/resources')}
                className="text-sm font-bold text-blue-600 flex items-center gap-1"
              >
                Manage <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {(stats?.recentResources || []).length > 0 ? (
                stats?.recentResources?.map((resource) => (
                  <div key={resource._id} className="p-4 rounded-2xl bg-gray-50 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{resource.title}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-1">
                        {resource.category} - {resource.type} {resource.difficulty ? `- ${resource.difficulty}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white text-gray-400 shrink-0">
                      {resource.qualityStatus || 'published'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 font-medium">No resources published yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
