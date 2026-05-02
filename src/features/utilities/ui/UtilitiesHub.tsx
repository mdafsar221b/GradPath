'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calculator, Copy, FileSpreadsheet, Goal, Loader2, Save, Sigma } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { Loader } from '@/shared/ui/Loader';
import { resultsApi } from '../api/results.api';
import { ResultProfileResponse, ResultSemester } from '../model/utilities.types';
import {
  buildPlanner,
  buildSemestersLabel,
  getCgpaValueFromPercentage,
  getPercentageFromCgpa,
  recomputeProfileSemesters,
  summarizeResults,
} from '../lib/utilities-calculations';

type UtilitiesTab = 'results' | 'planner' | 'cgpa' | 'converter';
type ConverterBase = '2' | '8' | '10' | '16';

const tabItems: { id: UtilitiesTab; label: string; icon: typeof FileSpreadsheet }[] = [
  { id: 'results', label: 'Results Vault', icon: FileSpreadsheet },
  { id: 'planner', label: 'Target Planner', icon: Goal },
  { id: 'cgpa', label: 'CGPA / Percentage', icon: Calculator },
  { id: 'converter', label: 'Number Converter', icon: Sigma },
];

const formulaPresets = [
  { id: 'cgpa-9-5', label: 'CGPA x 9.5', multiplier: 9.5, offset: 0 },
  { id: 'cgpa-10', label: 'CGPA x 10', multiplier: 10, offset: 0 },
  { id: 'custom', label: 'Custom Formula', multiplier: 9.5, offset: 0 },
];

const baseValidators: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

const digitMap: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
};

const parseBaseValue = (value: string, base: number) => {
  const sanitized = value.trim();
  if (!sanitized) return null;

  if (!baseValidators[base].test(sanitized)) {
    throw new Error('Invalid digits for the selected base');
  }

  let result = 0;
  for (const character of sanitized.toUpperCase()) {
    result = (result * base) + digitMap[character];
  }
  return result;
};

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

const computeSemesterStatus = (semester: ResultSemester) => {
  if (semester.isComplete) return 'Complete';
  const hasAnyMarks = semester.theorySubjects.some(
    (subject) => subject.writtenMarks !== null || subject.internalMarks !== null
  ) || semester.practicalMarks !== null;
  return hasAnyMarks ? 'Draft' : 'Empty';
};

const statCardClass = 'min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm';

export const UtilitiesHub = () => {
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<UtilitiesTab>('results');
  const [profile, setProfile] = useState<ResultProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedSemester, setExpandedSemester] = useState(1);
  const [targetPercentage, setTargetPercentage] = useState('75');
  const [formulaPreset, setFormulaPreset] = useState(formulaPresets[0].id);
  const [multiplier, setMultiplier] = useState(formulaPresets[0].multiplier.toString());
  const [offset, setOffset] = useState(formulaPresets[0].offset.toString());
  const [percentageInput, setPercentageInput] = useState('75');
  const [cgpaInput, setCgpaInput] = useState('7.89');
  const [converterBase, setConverterBase] = useState<ConverterBase>('10');
  const [converterInput, setConverterInput] = useState('255');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      setLoading(true);
      setError('');

      try {
        const data = await resultsApi.getProfile(token);
        setProfile({
          ...data,
          semesters: recomputeProfileSemesters(data.semesters),
        });
        const firstIncompleteSemester = data.semesters.find((semester) => !semester.isComplete)?.semesterNumber || 1;
        setExpandedSemester(firstIncompleteSemester);
      } catch (fetchError) {
        console.error('Failed to load results profile', fetchError);
        setError('Could not load your marks profile right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const summary = useMemo(() => (profile ? summarizeResults(profile.semesters) : null), [profile]);

  const planner = useMemo(() => {
    if (!profile) return null;
    return buildPlanner(profile.semesters, Number(targetPercentage) || 0, user?.semester || null);
  }, [profile, targetPercentage, user?.semester]);

  const activeFormula = useMemo(() => {
    if (formulaPreset !== 'custom') {
      const preset = formulaPresets.find((item) => item.id === formulaPreset);
      return {
        multiplier: preset?.multiplier || 9.5,
        offset: preset?.offset || 0,
      };
    }

    return {
      multiplier: Number(multiplier) || 0,
      offset: Number(offset) || 0,
    };
  }, [formulaPreset, multiplier, offset]);

  const conversionResult = useMemo(() => {
    try {
      const decimalValue = parseBaseValue(converterInput, Number(converterBase));
      if (decimalValue === null) return null;

      return {
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
      };
    } catch (conversionError) {
      return {
        error: conversionError instanceof Error ? conversionError.message : 'Invalid number',
      };
    }
  }, [converterBase, converterInput]);

  const updateSemester = (semesterNumber: number, updater: (semester: ResultSemester) => ResultSemester) => {
    setProfile((currentProfile) => {
      if (!currentProfile) return currentProfile;

      const semesters = recomputeProfileSemesters(
        currentProfile.semesters.map((semester) => (
          semester.semesterNumber === semesterNumber ? updater(semester) : semester
        ))
      );

      return {
        ...currentProfile,
        semesters,
      };
    });
  };

  const saveProfile = async () => {
    if (!token || !profile) return;

    setSaving(true);
    setError('');

    try {
      const updated = await resultsApi.updateProfile(profile.semesters, token);
      setProfile({
        ...updated,
        semesters: recomputeProfileSemesters(updated.semesters),
      });
    } catch (saveError) {
      console.error('Failed to save results profile', saveError);
      setError(saveError instanceof Error ? saveError.message : 'Could not save your result profile.');
    } finally {
      setSaving(false);
    }
  };

  const copyValue = async (label: string, value: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied`);
      window.setTimeout(() => setCopyMessage(''), 1800);
    } catch (copyError) {
      console.error('Failed to copy', copyError);
      setCopyMessage('Copy failed');
      window.setTimeout(() => setCopyMessage(''), 1800);
    }
  };

  if (loading) {
    return <Loader fullPage text="Preparing your utilities hub..." />;
  }

  if (!profile || !summary) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-5 text-sm font-semibold text-red-700">
        {error || 'Utilities are unavailable right now.'}
      </div>
    );
  }

  const percentageValue = Number(percentageInput) || 0;
  const cgpaValue = Number(cgpaInput) || 0;

  return (
    <main className="mx-auto max-w-7xl space-y-6 overflow-x-hidden">
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-sm lg:p-6">
        <div className="space-y-5">
          <div className="max-w-4xl">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">
              Utilities Hub
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-5xl">Marks Planning and Converters</h1>
            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-600">
              Save semester results once, calculate target percentages, estimate next-semester marks, convert CGPA, and use quick number tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className={statCardClass}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Current Percentage</p>
              <p className="mt-2 break-words text-2xl font-black text-slate-900 lg:text-3xl">{formatPercentage(summary.currentPercentage)}</p>
            </div>
            <div className={statCardClass}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Marks Secured</p>
              <p className="mt-2 break-words text-2xl font-black text-slate-900 lg:text-3xl">{summary.obtainedMarks}/3000</p>
            </div>
            <div className={statCardClass}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Semesters Saved</p>
              <p className="mt-2 break-words text-2xl font-black text-slate-900 lg:text-3xl">{summary.completedSemesterCount}/6</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
                active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {activeTab === 'results' ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Results Vault</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Enter semester-wise written, internal, and practical marks. Totals are calculated automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:bg-blue-300"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Results
            </button>
          </div>

          {profile.semesters.map((semester) => {
            const status = computeSemesterStatus(semester);
            const isExpanded = expandedSemester === semester.semesterNumber;

            return (
              <div key={semester.semesterNumber} className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedSemester((current) => (current === semester.semesterNumber ? 0 : semester.semesterNumber))}
                  className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-slate-50 lg:items-center lg:px-5"
                >
                  <div className="min-w-0">
                    <p className="break-words text-base font-black text-slate-900 lg:text-lg">{buildSemestersLabel(semester)}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {semester.theorySubjects.length} theory subjects - practical max {semester.practicalMax}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                      status === 'Complete'
                        ? 'bg-emerald-50 text-emerald-700'
                        : status === 'Draft'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {status}
                  </span>
                </button>

                {isExpanded ? (
                  <div className="border-t border-slate-100 px-4 py-4 lg:px-5 lg:py-5">
                    <div className="space-y-4">
                      {semester.theorySubjects.map((subject, index) => (
                        <div key={`${semester.semesterNumber}-${subject.code}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{subject.code}</p>
                              <p className="mt-1 break-words text-sm font-semibold text-slate-900">{subject.name}</p>
                            </div>
                            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[420px]">
                              <label className="text-xs font-bold text-slate-500">
                                Written / 70
                                <input
                                  type="number"
                                  min={0}
                                  max={70}
                                  value={subject.writtenMarks ?? ''}
                                  onChange={(event) => updateSemester(semester.semesterNumber, (currentSemester) => ({
                                    ...currentSemester,
                                    theorySubjects: currentSemester.theorySubjects.map((item, itemIndex) => (
                                      itemIndex === index
                                        ? { ...item, writtenMarks: event.target.value === '' ? null : Number(event.target.value) }
                                        : item
                                    )),
                                  }))}
                                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                                />
                              </label>
                              <label className="text-xs font-bold text-slate-500">
                                Internal / 30
                                <input
                                  type="number"
                                  min={0}
                                  max={30}
                                  value={subject.internalMarks ?? ''}
                                  onChange={(event) => updateSemester(semester.semesterNumber, (currentSemester) => ({
                                    ...currentSemester,
                                    theorySubjects: currentSemester.theorySubjects.map((item, itemIndex) => (
                                      itemIndex === index
                                        ? { ...item, internalMarks: event.target.value === '' ? null : Number(event.target.value) }
                                        : item
                                    )),
                                  }))}
                                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                                />
                              </label>
                              <div className="text-xs font-bold text-slate-500">
                                Total / 100
                                <div className="mt-2 flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-900">
                                  {subject.totalMarks}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
                        <div className="rounded-2xl bg-slate-50 px-4 py-4">
                          <p className="text-sm font-semibold text-slate-700">Semester summary</p>
                          <p className="mt-2 text-xs font-medium text-slate-500">
                            Only complete semesters are used in target planning and predictions.
                          </p>
                        </div>
                        <label className="rounded-2xl bg-slate-50 px-4 py-4 text-xs font-bold text-slate-500">
                          Practical / {semester.practicalMax}
                          <input
                            type="number"
                            min={0}
                            max={semester.practicalMax}
                            value={semester.practicalMarks ?? ''}
                            onChange={(event) => updateSemester(semester.semesterNumber, (currentSemester) => ({
                              ...currentSemester,
                              practicalMarks: event.target.value === '' ? null : Number(event.target.value),
                            }))}
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800"
                          />
                        </label>
                        <div className="rounded-2xl bg-slate-50 px-4 py-4">
                          <p className="text-xs font-bold text-slate-500">Semester total</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">{semester.semesterTotal}</p>
                          <p className="text-xs font-medium text-slate-500">out of 500</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>
      ) : null}

      {activeTab === 'planner' && planner ? (
        <section className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div className="min-w-0">
                <h2 className="text-xl font-black text-slate-900">Target Planner</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Set a final course percentage and see the minimum and safer next-semester targets.
                </p>
              </div>
              <div className="w-full">
                <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Target Percentage
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={targetPercentage}
                  onChange={(event) => setTargetPercentage(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Current Percentage', value: formatPercentage(planner.currentPercentage) },
              { label: 'Target Percentage', value: `${planner.targetPercentage}%` },
              { label: 'Marks Needed', value: `${planner.minimumMarksNeeded}` },
              { label: 'Marks Remaining', value: `${planner.remainingMarks}` },
            ].map((card) => (
              <div key={card.label} className={statCardClass}>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                <p className="mt-3 break-words text-3xl font-black text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>

          {!planner.achievable ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              Target not achievable with remaining marks.
            </div>
          ) : planner.alreadySecured ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              Target already secured based on your saved results.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
              <h3 className="text-lg font-black text-slate-900">Next Semester Recommendation</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {planner.nextSemesterNumber ? `Semester ${planner.nextSemesterNumber}` : 'All semesters already recorded'}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Minimum Needed</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{planner.nextSemesterMinimum}/500</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Safe Target</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {planner.nextSemesterSafeRange.min}-{planner.nextSemesterSafeRange.max}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {planner.subjectTargets.map((subject) => (
                  <div key={`${subject.code}-${subject.name}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{subject.code}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{subject.name}</p>
                      </div>
                      <div className="text-sm font-black text-slate-900">{subject.minimumTotalTarget}/100 minimum</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700 xl:grid-cols-4">
                      <div className="rounded-xl bg-white px-3 py-3">Written: {subject.writtenTarget}/70</div>
                      <div className="rounded-xl bg-white px-3 py-3">Internal: {subject.internalTarget}/30</div>
                      <div className="rounded-xl bg-white px-3 py-3">Minimum: {subject.minimumTotalTarget}/100</div>
                      <div className="rounded-xl bg-white px-3 py-3">Safe: {subject.safeTotalTarget}/100</div>
                    </div>
                  </div>
                ))}

                {planner.practicalTarget ? (
                  <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Practical Target</p>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-800">
                        Minimum: {planner.practicalTarget.minimumTarget}/{planner.practicalTarget.max}
                      </div>
                      <div className="rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-800">
                        Safe: {planner.practicalTarget.safeTarget}/{planner.practicalTarget.max}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
                <h3 className="text-sm font-black text-slate-900">Prediction from Past Results</h3>
                <p className="mt-1 text-xs font-medium text-slate-500">Estimated from your completed semester history.</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Predicted Next Semester</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      {planner.predictedNextSemesterTotal !== null ? `${planner.predictedNextSemesterTotal}/500` : 'Need history'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Projected Final Percentage</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                      {planner.projectedFinalPercentage !== null ? formatPercentage(planner.projectedFinalPercentage) : 'Need history'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
                <h3 className="text-sm font-black text-slate-900">How this works</h3>
                <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                  <li>Marks needed are based on a 3000-mark course total.</li>
                  <li>Recommendations never exceed actual written, internal, or practical caps.</li>
                  <li>Safe targets sit above the strict minimum so you have a buffer.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === 'cgpa' ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <h2 className="text-xl font-black text-slate-900">CGPA / Percentage</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Use your university&apos;s official rule if available. This tool is formula-based and does not affect target planning.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="text-xs font-bold text-slate-500">
                Formula
                <select
                  value={formulaPreset}
                  onChange={(event) => setFormulaPreset(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                >
                  {formulaPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>{preset.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold text-slate-500">
                Multiplier
                <input
                  type="number"
                  value={formulaPreset === 'custom' ? multiplier : activeFormula.multiplier}
                  onChange={(event) => setMultiplier(event.target.value)}
                  disabled={formulaPreset !== 'custom'}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
              </label>
              <label className="text-xs font-bold text-slate-500">
                Offset
                <input
                  type="number"
                  value={formulaPreset === 'custom' ? offset : activeFormula.offset}
                  onChange={(event) => setOffset(event.target.value)}
                  disabled={formulaPreset !== 'custom'}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">Percentage to CGPA</p>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={percentageInput}
                  onChange={(event) => setPercentageInput(event.target.value)}
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
                <p className="mt-4 text-3xl font-black text-slate-900">
                  {getCgpaValueFromPercentage(percentageValue, activeFormula.multiplier, activeFormula.offset)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-900">CGPA to Percentage</p>
                <input
                  type="number"
                  min={0}
                  value={cgpaInput}
                  onChange={(event) => setCgpaInput(event.target.value)}
                  className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
                <p className="mt-4 text-3xl font-black text-slate-900">
                  {getPercentageFromCgpa(cgpaValue, activeFormula.multiplier, activeFormula.offset)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-sm font-black text-slate-900">Formula Note</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
              This utility assumes a formula in the form:
              <span className="mt-2 block rounded-xl bg-slate-50 px-3 py-3 font-black text-slate-900">
                Percentage = (CGPA × Multiplier) + Offset
              </span>
            </p>
          </div>
        </section>
      ) : null}

      {activeTab === 'converter' ? (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <h2 className="text-xl font-black text-slate-900">Number Converter</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Convert one value across binary, octal, decimal, and hexadecimal.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <label className="text-xs font-bold text-slate-500">
                Input Base
                <select
                  value={converterBase}
                  onChange={(event) => setConverterBase(event.target.value as ConverterBase)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                >
                  <option value="2">Binary</option>
                  <option value="8">Octal</option>
                  <option value="10">Decimal</option>
                  <option value="16">Hexadecimal</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-500">
                Value
                <input
                  type="text"
                  value={converterInput}
                  onChange={(event) => setConverterInput(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800"
                />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {conversionResult && 'error' in conversionResult ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 md:col-span-2">
                  {conversionResult.error}
                </div>
              ) : (
                [
                  { label: 'Binary', value: conversionResult?.binary || '' },
                  { label: 'Octal', value: conversionResult?.octal || '' },
                  { label: 'Decimal', value: conversionResult?.decimal || '' },
                  { label: 'Hexadecimal', value: conversionResult?.hexadecimal || '' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <button
                        type="button"
                        onClick={() => copyValue(item.label, item.value)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </button>
                    </div>
                    <p className="mt-3 break-all text-lg font-black text-slate-900">{item.value || '-'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <h3 className="text-sm font-black text-slate-900">Quick Notes</h3>
            <ul className="mt-3 space-y-2 text-sm font-medium text-slate-600">
              <li>Binary accepts only 0 and 1.</li>
              <li>Octal accepts digits 0 to 7.</li>
              <li>Hex accepts 0 to 9 and A to F.</li>
            </ul>
            {copyMessage ? (
              <div className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {copyMessage}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
};
