'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  Calculator,
  CheckCircle2,
  Download,
  FileQuestion,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';

const appRoutes = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: BookOpen },
  { href: '/resources', label: 'Library', icon: FolderOpen },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Sparkles },
];

const learningFlow = [
  {
    title: 'Plan the semester',
    text: 'Dashboard progress, deadlines, and subject gaps stay visible from one workspace.',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Study from the library',
    text: 'Open BCA notes, syllabus material, PYQs, and subject resources without leaving GradPath.',
    href: '/resources',
    icon: Library,
  },
  {
    title: 'Practice for exams',
    text: 'Move into topic practice, previous-year questions, quizzes, flashcards, and model papers.',
    href: '/practice',
    icon: FileQuestion,
  },
  {
    title: 'Submit and revise',
    text: 'Track assignments and use utilities for CGPA, marks prediction, and number conversion.',
    href: '/assignments',
    icon: CalendarCheck,
  },
];

const featureLinks = [
  { href: '/model-paper', label: 'Generate model papers', icon: FileText },
  { href: '/assignments', label: 'Track assignments', icon: ListChecks },
  { href: '/utilities', label: 'Open utilities', icon: Calculator },
  { href: '/ai-tutor', label: 'Ask AI Tutor', icon: Brain },
];

const resourceImages = [
  {
    src: '/assets/thumbnails/DSA-thumb.png',
    alt: 'Data Structures and Algorithms resource thumbnail',
    title: 'DSA Notes',
  },
  {
    src: '/assets/thumbnails/OS-thumb.png',
    alt: 'Operating System resource thumbnail',
    title: 'OS PYQs',
  },
  {
    src: '/assets/thumbnails/DBMS-thumb.png',
    alt: 'Database Management System resource thumbnail',
    title: 'DBMS Library',
  },
];

export default function LandingPage() {
  const router = useRouter();

  const openWorkspace = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
      return;
    }

    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="grid h-full grid-cols-3 gap-px">
            {resourceImages.map((image) => (
              <div key={image.src} className="relative min-h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-slate-950/70" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-gradpath.png"
              alt="GradPath logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-md bg-white object-contain p-1"
            />
            <span className="text-xl font-black tracking-tight">GradPath</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {appRoutes.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-sky-300"
            >
              Join
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
              <GraduationCap className="h-4 w-4" />
              BCA study command center
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Study, practice, and track your semester from one place.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-200">
              GradPath connects dashboard progress, curated BCA resources, PYQ practice,
              assignments, AI tutoring, model papers, and academic utilities into one
              focused student workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openWorkspace}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-sky-100"
              >
                Open workspace
                <LayoutDashboard className="h-4 w-4" />
              </button>
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-sky-400 px-5 text-sm font-black text-slate-950 transition hover:bg-sky-300"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/base.apk"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Download APK
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-white text-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Semester Snapshot
                  </p>
                  <h2 className="mt-1 text-2xl font-black">Today&apos;s GradPath</h2>
                </div>
                <span className="rounded-md bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-700">
                  68% ready
                </span>
              </div>
              <div className="space-y-4 p-5">
                {[
                  ['Practice', 'Operating System PYQs', '22 min'],
                  ['Library', 'DSA Unit 4 notes', 'Open'],
                  ['Assignment', 'DBMS ER model submission', 'Due soon'],
                ].map(([type, title, meta]) => (
                  <Link
                    key={title}
                    href={type === 'Practice' ? '/practice' : type === 'Library' ? '/resources' : '/assignments'}
                    className="flex items-center justify-between rounded-md border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        {type}
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">{title}</p>
                    </div>
                    <span className="text-xs font-black text-sky-700">{meta}</span>
                  </Link>
                ))}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {resourceImages.map((image) => (
                    <Link
                      key={image.src}
                      href="/resources"
                      className="overflow-hidden rounded-md border border-slate-200 bg-slate-50 transition hover:border-sky-300"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={160}
                        height={110}
                        className="h-24 w-full object-cover"
                      />
                      <p className="px-3 py-2 text-xs font-black text-slate-700">
                        {image.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {featureLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-4 text-sm font-black text-slate-800 transition hover:border-sky-300 hover:bg-sky-50"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-sky-700" />
                  {item.label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
            Built around the actual GradPath workflow
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            From syllabus coverage to exam practice, every action opens a real workspace.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {learningFlow.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-700">
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
              Resource library
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Real study material stays close to the dashboard.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              The public assets already include BCA syllabus files, semester PYQs,
              handwritten notes, and subject thumbnails. The landing page points
              students directly to the authenticated library where those resources live.
            </p>
            <Link
              href="/resources"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-amber-300 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-200"
            >
              Open library
              <FolderOpen className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {resourceImages.map((image) => (
              <Link
                key={image.src}
                href="/resources"
                className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-amber-300"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={360}
                  height={240}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-black">{image.title}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    View in library
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              Start with your real account
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Login, register, or open your existing dashboard.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Protected workspaces will ask for authentication, and the dashboard
              routes admins and students to the right side of GradPath.
            </p>
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={openWorkspace}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Open dashboard
              <CheckCircle2 className="h-4 w-4" />
            </button>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-200 px-5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
            >
              Sign in
              <LockKeyhole className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-sky-500 px-5 text-sm font-black text-white transition hover:bg-sky-600"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
