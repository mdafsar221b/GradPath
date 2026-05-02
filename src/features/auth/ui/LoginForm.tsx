'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../model/use-auth-store';
import { authApi } from '../api/auth-api';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authApi.login({ email, password });
      setAuth(data, data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-blue-50/50">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 font-medium">Log in to keep tracking your progress</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold text-center animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            label="College Email"
            type="email"
            placeholder="afsar@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-11"
          />
          <Mail className="w-5 h-5 text-gray-400 absolute left-4 bottom-3.5" />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-11"
          />
          <Lock className="w-5 h-5 text-gray-400 absolute left-4 bottom-3.5" />
        </div>

        <Button type="submit" className="w-full h-14 text-base group" disabled={loading}>
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Sign In to GradPath
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 font-medium">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">
          Join GradPath
        </Link>
      </p>
    </div>
  );
};
