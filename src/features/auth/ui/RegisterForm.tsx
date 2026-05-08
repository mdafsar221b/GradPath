'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../model/use-auth-store';
import { authApi } from '../api/auth-api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Loader2, ArrowRight, User, Mail, Lock, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    semester: '1',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !formData.password) {
      setError('Enter your name, email, and password');
      setLoading(false);
      return;
    }
    
    try {
      const data = await authApi.register({
        ...formData,
        name: normalizedName,
        email: normalizedEmail,
        semester: parseInt(formData.semester),
      });
      setAuth(data, data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-blue-50/50">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Join GradPath</h2>
        <p className="text-gray-500 font-medium">Start your academic tracking journey</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold text-center animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="Full Name"
            name="name"
            placeholder="Afsar Ali"
            value={formData.name}
            onChange={handleChange}
            required
            className="pl-11"
          />
          <User className="w-5 h-5 text-gray-400 absolute left-4 bottom-3.5" />
        </div>

        <div className="relative">
          <Input
            label="College Email"
            name="email"
            type="email"
            placeholder="afsar@college.edu"
            value={formData.email}
            onChange={handleChange}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            required
            className="pl-11"
          />
          <Mail className="w-5 h-5 text-gray-400 absolute left-4 bottom-3.5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Semester</label>
            <div className="relative">
              <select
                name="semester"
                className="w-full p-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>Sem {num}</option>
                ))}
              </select>
              <GraduationCap className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-11"
            />
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 bottom-3.5" />
          </div>
        </div>

        <Button type="submit" className="w-full h-14 text-base group" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Create Your Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 font-medium">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
