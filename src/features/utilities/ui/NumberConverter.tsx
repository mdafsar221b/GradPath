'use client';

import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';

type ConverterBase = '2' | '8' | '10' | '16';

const baseValidators: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

const digitMap: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
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

export const NumberConverter = () => {
  const [converterBase, setConverterBase] = useState<ConverterBase>('10');
  const [converterInput, setConverterInput] = useState('255');
  const [copyMessage, setCopyMessage] = useState('');

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

  return (
    <main className="mx-auto max-w-7xl space-y-6 overflow-x-hidden">
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5 shadow-sm lg:p-6">
        <div className="space-y-5">
          <div className="max-w-4xl">
            <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">
              Support Tool
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 lg:text-5xl">Number Converter</h1>
            <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-600">
              Convert values across binary, octal, decimal, and hexadecimal bases instantly.
            </p>
          </div>
        </div>
      </section>

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
    </main>
  );
};
