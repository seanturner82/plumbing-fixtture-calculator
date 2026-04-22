import { useState } from 'react';
import { FIXTURES, CATEGORIES } from '../data/fixtures';
import { round2 } from '../utils/calculations';
import type { FixtureQuantities, RowResult } from '../utils/calculations';

interface Props {
  quantities: FixtureQuantities;
  userNotes: Record<string, string>;
  rows: RowResult[];
  onChange: (id: string, qty: number) => void;
  onNoteChange: (id: string, note: string) => void;
  onReset: () => void;
}

export default function FixtureTable({ quantities, userNotes, rows, onChange, onNoteChange, onReset }: Props) {
  const [activeOnly, setActiveOnly] = useState(false);
  const [search, setSearch] = useState('');

  const rowMap = Object.fromEntries(rows.map((r) => [r.id, r]));
  const totalDFU = rows.reduce((s, r) => s + r.rowDFU, 0);
  const totalHot = rows.reduce((s, r) => s + r.rowHotWSFU, 0);
  const totalCold = rows.reduce((s, r) => s + r.rowColdWSFU, 0);
  const totalComb = rows.reduce((s, r) => s + r.rowCombinedWSFU, 0);

  const q = search.toLowerCase();

  function visibleInCategory(cat: string) {
    return FIXTURES.filter((f) => {
      if (f.category !== cat) return false;
      if (activeOnly && (quantities[f.id] ?? 0) === 0) return false;
      if (q && !f.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function adjust(id: string, delta: number) {
    const cur = quantities[id] ?? 0;
    onChange(id, Math.max(0, cur + delta));
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <span className="text-[10px] font-bold text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">§01</span>
        <h2 className="text-base font-semibold text-gray-800">Fixture Loading</h2>
        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fixtures..."
              className="pl-6 pr-3 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
            />
          </div>
          {/* Active only */}
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600"
            />
            Active only
          </label>
          {/* Reset */}
          <button
            onClick={onReset}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-[10px] uppercase tracking-wide text-gray-500">
              <th className="px-3 py-2 text-left font-semibold min-w-64">Fixture Type</th>
              <th className="px-2 py-2 text-center font-semibold w-28">QTY</th>
              <th className="px-3 py-2 text-right font-semibold w-14">DFU</th>
              <th className="px-3 py-2 text-right font-semibold w-14">HOT</th>
              <th className="px-3 py-2 text-right font-semibold w-14">COLD</th>
              <th className="px-3 py-2 text-right font-semibold w-14">COMB</th>
              <th className="px-3 py-2 text-right font-semibold w-16">Σ DFU</th>
              <th className="px-3 py-2 text-right font-semibold w-16">Σ HOT</th>
              <th className="px-3 py-2 text-right font-semibold w-16">Σ COLD</th>
              <th className="px-3 py-2 text-right font-semibold w-16 border-r border-gray-300">
                Σ <span className="normal-case">Comb</span>
              </th>
              <th className="px-3 py-2 text-left font-semibold min-w-40">Note (for report)</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => {
              const fixtures = visibleInCategory(cat);
              if (fixtures.length === 0) return null;

              return (
                <CategorySection
                  key={cat}
                  label={cat}
                  fixtures={fixtures}
                  quantities={quantities}
                  userNotes={userNotes}
                  rowMap={rowMap}
                  onAdjust={adjust}
                  onChange={onChange}
                  onNoteChange={onNoteChange}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-white font-semibold border-t-2 border-gray-500 text-xs">
              <td className="px-3 py-2" colSpan={2}>Totals</td>
              <td /><td /><td /><td />
              <td className="px-3 py-2 text-right">{round2(totalDFU)}</td>
              <td className="px-3 py-2 text-right">{round2(totalHot)}</td>
              <td className="px-3 py-2 text-right">{round2(totalCold)}</td>
              <td className="px-3 py-2 text-right border-r border-gray-600">{round2(totalComb)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CategorySection({
  label, fixtures, quantities, userNotes, rowMap, onAdjust, onChange, onNoteChange,
}: {
  label: string;
  fixtures: typeof FIXTURES;
  quantities: FixtureQuantities;
  userNotes: Record<string, string>;
  rowMap: Record<string, RowResult>;
  onAdjust: (id: string, delta: number) => void;
  onChange: (id: string, qty: number) => void;
  onNoteChange: (id: string, note: string) => void;
}) {
  return (
    <>
      <tr className="bg-gray-100 border-y border-gray-200">
        <td colSpan={11} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </td>
      </tr>
      {fixtures.map((f) => {
        const r = rowMap[f.id];
        const qty = quantities[f.id] ?? 0;
        const isActive = qty > 0;

        return (
          <tr
            key={f.id}
            className={`border-b border-gray-100 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            {/* Name */}
            <td className="px-3 py-1.5 text-gray-800">
              <span className="flex items-center gap-1.5">
                {f.name}
                {f.isFlushValve && (
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 leading-none">FV</span>
                )}
                {f.note && (
                  <span className="text-amber-500 cursor-help text-[10px]" title={f.note}>ⓘ</span>
                )}
              </span>
            </td>

            {/* QTY with –/+ */}
            <td className="px-2 py-1">
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={() => onAdjust(f.id, -1)}
                  className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-100 leading-none text-sm"
                >−</button>
                <input
                  type="number"
                  min={0}
                  value={qty === 0 ? '' : qty}
                  placeholder="0"
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    onChange(f.id, isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => onAdjust(f.id, 1)}
                  className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-100 leading-none text-sm"
                >+</button>
              </div>
            </td>

            {/* Per-unit values */}
            <td className="px-3 py-1.5 text-right text-gray-600">{round2(f.dfu) || '—'}</td>
            <td className="px-3 py-1.5 text-right text-gray-600">{f.hotWSFU ? round2(f.hotWSFU) : '—'}</td>
            <td className="px-3 py-1.5 text-right text-gray-600">{f.coldWSFU ? round2(f.coldWSFU) : '—'}</td>
            <td className="px-3 py-1.5 text-right text-gray-600">{f.combinedWSFU ? round2(f.combinedWSFU) : '—'}</td>

            {/* Row totals */}
            <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
              {isActive ? round2(r.rowDFU) : '—'}
            </td>
            <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
              {isActive ? round2(r.rowHotWSFU) : '—'}
            </td>
            <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
              {isActive ? round2(r.rowColdWSFU) : '—'}
            </td>
            <td className={`px-3 py-1.5 text-right font-medium border-r border-gray-200 ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
              {isActive ? round2(r.rowCombinedWSFU) : '—'}
            </td>

            {/* Note */}
            <td className="px-2 py-1">
              <input
                type="text"
                value={userNotes[f.id] ?? ''}
                onChange={(e) => onNoteChange(f.id, e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-0.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                placeholder=""
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}
