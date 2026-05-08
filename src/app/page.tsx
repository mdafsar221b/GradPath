'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';

const primaryRoutes = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/resources', label: 'Library' },
  { href: '/practice', label: 'Practice' },
  { href: '/model-paper', label: 'PYQ Analysis' },
  { href: '/discussions', label: 'Discussions' },
];

const coreAreas = [
  {
    title: 'Structured Library',
    text: 'Keep notes, PYQs, PDFs, videos, and links mapped to semester, subject, and unit.',
    href: '/resources',
    icon: FolderOpen,
  },
  {
    title: 'Practice Workspace',
    text: 'Move from topic-wise study into curated previous-year questions and exam-focused revision.',
    href: '/practice',
    icon: FileQuestion,
  },
  {
    title: 'PYQ Analysis',
    text: 'Inspect repeated topics, marks patterns, and generate model papers from curated local history.',
    href: '/model-paper',
    icon: FileText,
  },
];

const workflowSteps = [
  'Upload notes and PYQ papers into the academic library.',
  'Map each resource to semester, subject, and unit.',
  'Curate question entries from previous-year papers.',
  'Use the same structured data for practice and model paper generation.',
];

const supportAreas = [
  {
    title: 'Dashboard Tracking',
    text: 'Coverage, subject progress, and next academic actions stay visible.',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Assignment Support',
    text: 'Deadlines remain in the system without breaking the main exam-prep flow.',
    href: '/assignments',
    icon: ListChecks,
  },
  {
    title: 'Discussion Group',
    text: 'Use one open community room for general academic help, then move into subject and PYQ discussions when the topic becomes specific.',
    href: '/discussions',
    icon: GraduationCap,
  },
  {
    title: 'Revision Support',
    text: 'Flashcards and quizzes remain available as supporting study tools.',
    href: '/practice',
    icon: BookOpen,
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5f7f2_0%,#f8fafc_45%,#ffffff_100%)] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950">GradPath</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                BCA Academic Workflow
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {primaryRoutes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Syllabus-Mapped PYQ Workflow
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
              Organize BCA resources properly, then use that structure for PYQ analysis and model papers.
            </h1>

            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-600">
              GradPath is built around one academic flow: collect notes and previous-year papers,
              map them to semester and syllabus structure, curate questions, and reuse that data
              for practice, trend analysis, and exam-style paper generation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openWorkspace}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/model-paper"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-black text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                View PYQ analysis
                <FileText className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Core Input
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">Notes + PYQs</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Academic material enters one structured library instead of random folders.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Core Structure
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">Syllabus Mapping</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Resources stay attached to semester, subject, unit, and curated question history.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Core Output
                </p>
                <p className="mt-3 text-2xl font-black text-slate-950">Exam Intelligence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The same local data powers topic signals, practice, and model paper generation.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Main Flow
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              One clear academic pipeline
            </h2>
            <div className="mt-6 space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Core Areas
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              The landing page now points to the three parts that matter most.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {coreAreas.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[2rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-slate-950 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-slate-950">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Why This Matters
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Generic chat tools do not maintain your department&apos;s academic structure.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              GradPath is useful because it keeps local BCA resources and previous-year papers
              organized first. Analysis and model paper generation come after the academic data
              has already been mapped and curated.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Supporting Tools
            </p>
            <div className="mt-5 space-y-4">
              {supportAreas.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-950 hover:bg-slate-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Start Here
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Open the workspace and follow one clean flow.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Dashboard for coverage, library for structured resources, practice for curated PYQs,
              discussions for peer help, and PYQ analysis for subject trends and model paper generation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={openWorkspace}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-black text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
