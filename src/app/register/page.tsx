import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10 p-12 max-w-xl text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
            Start your academic <br />
            <span className="text-blue-200">success story here.</span>
          </h1>
          <p className="text-lg text-blue-100 font-medium leading-relaxed max-w-md">
            Create an account to unlock syllabus tracking, curated resources, targeted PYQs, and an active peer community.
          </p>
          
          <div className="mt-12 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-fit">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">All-in-one platform</p>
              <p className="text-xs text-blue-200 font-medium">Built for modern learning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 lg:bg-white relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">GradPath</span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
