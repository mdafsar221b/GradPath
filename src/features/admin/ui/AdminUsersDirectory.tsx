'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../api/admin.api';
import { AdminUserDirectoryFilters, AdminUserRow } from '../model/admin.types';
import { Card, CardContent } from '@/shared/ui/Card';
import { Loader } from '@/shared/ui/Loader';

const defaultFilters: AdminUserDirectoryFilters = {
  search: '',
  role: '',
  semester: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const AdminUsersDirectory = () => {
  const [filters, setFilters] = useState<AdminUserDirectoryFilters>(defaultFilters);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.getUserStats>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userStats, userDirectory] = await Promise.all([
          adminApi.getUserStats(),
          adminApi.getUsers(filters),
        ]);
        setStats(userStats);
        setUsers(userDirectory.users);
        setTotal(userDirectory.total);
      } catch (error) {
        console.error('Failed to fetch admin users directory', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const semesterCards = useMemo(() => stats?.bySemester || [], [stats]);

  if (loading && !stats) {
    return <Loader text="Loading user directory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0 },
          { label: 'Students', value: stats?.totalStudents || 0 },
          { label: 'Admins', value: stats?.totalAdmins || 0 },
          { label: 'Filtered Rows', value: total },
        ].map((item) => (
          <Card key={item.label} className="border border-slate-200 shadow-none">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200 shadow-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {semesterCards.map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Semester {item._id}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{item.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search name or email"
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
            />
            <select
              value={filters.role}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                role: e.target.value as AdminUserDirectoryFilters['role'],
                semester: e.target.value === 'admin' ? '' : prev.semester,
              }))}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
            >
              <option value="">All roles</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={filters.semester}
              onChange={(e) => setFilters((prev) => ({
                ...prev,
                semester: e.target.value ? Number(e.target.value) : '',
                role: e.target.value ? 'student' : prev.role,
              }))}
              disabled={filters.role === 'admin'}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">All semesters</option>
              {[1, 2, 3, 4, 5, 6].map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as AdminUserDirectoryFilters['sortBy'] }))}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
            >
              <option value="createdAt">Newest</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="semester">Semester</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortOrder: e.target.value as AdminUserDirectoryFilters['sortOrder'] }))}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? <Loader text="Refreshing user directory..." /> : null}

      <Card className="border border-slate-200 shadow-none">
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm font-medium text-slate-500">
              No users match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    {['Name', 'Email', 'Role', 'Semester', 'Created'].map((heading) => (
                      <th key={heading} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase text-slate-600">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {user.role === 'student' ? `Semester ${user.semester || '-'}` : 'Admin'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
