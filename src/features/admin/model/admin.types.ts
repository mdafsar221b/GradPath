export interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  semester?: number;
  createdAt: string;
}

export interface AdminUsersResponse {
  total: number;
  users: AdminUserRow[];
}

export interface AdminUserStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  bySemester: { _id: number; count: number }[];
}

export interface AdminUserDirectoryFilters {
  search: string;
  role: '' | 'student' | 'admin';
  semester: '' | number;
  sortBy: 'name' | 'email' | 'role' | 'semester' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}
