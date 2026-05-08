'use client';

import { useMemo, useState } from 'react';
import { getCgpaValueFromPercentage, getPercentageFromCgpa } from '../lib/utilities-calculations';

const formulaPresets = [
  { id: 'cgpa-9-5', label: 'CGPA x 9.5', multiplier: 9.5, offset: 0 },
  { id: 'cgpa-10', label: 'CGPA x 10', multiplier: 10, offset: 0 },
  { id: 'custom', label: 'Custom Formula', multiplier: 9.5, offset: 0 },
];

export const CgpaConverter = () => {
  const [formulaPreset, setFormulaPreset] = useState(formulaPresets[0].id);
  const [multiplier, setMultiplier] = useState(formulaPresets[0].multiplier.toString());
  const [offset, setOffset] = useState(formulaPresets[0].offset.toString());
  const [percentageInput, setPercentageInput] = useState('75');
  const [cgpaInput, setCgpaInput] = useState('7.89');

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

  const percentageValue = Number(percentageInput) || 0;
  const cgpaValue = Number(cgpaInput) || 0;

  return (
    <main className="mx-auto max-w-7xl space-y-6 overflow-x-hidden">
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-sm lg:p-6">
        <div className="space-y-5">
          <div className="max-w-4xl">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">
              Support Tool
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-5xl">CGPA Converter</h1>
            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-600">
              Easily convert between CGPA and Percentage based on university formulas.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
          <h2 className="text-xl font-black text-slate-900">CGPA / Percentage</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Use your university&apos;s official rule if available.
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
    </main>
  );
};
