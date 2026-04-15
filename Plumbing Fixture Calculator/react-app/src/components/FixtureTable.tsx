import React, { useState } from 'react';
import { FIXTURES, CATEGORIES } from '../data/fixtures';
import { round2 } from '../utils/calculations';
import type { FixtureQuantities, RowResult } from '../utils/calculations';

interface Props {
  quantities: FixtureQuantities;
  rows: RowResult[];
  onChange: (id: string, qty: number) => void;
}

const COL_HEADERS = [
  { label: 'Fixture Type', wide: true },
  { label: 'Qty', wide: false },
  { label: 'DFU/ea', wide: false },
  { label: 'Hot WSFU/ea', wide: false },
  { label: 'Cold WSFU/ea', wide: false },
  { label: 'Comb. WSFU/ea', wide: false },
  { label: 'Row DFU', wide: false },
  { label: 'Row Hot', wide: false },
  { label: 'Row Cold', wide: false },
  { label: 'Row Comb.', wide: false },
];

export default function FixtureTable({ quantities, rows, onChange }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  function toggleCategory(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function handleQtyChange(id: string, raw: string) {
    const val = parseInt(raw, 10);
    onChange(id, isNaN(val) || val < 0 ? 0 : val);
  }

  const rowMap = Object.fromEntries(rows.map((r) => [r.id, r]));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Fixture Schedule — 2006–18 IPC
        </h2>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show active only
        </label>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
              {COL_HEADERS.map((h) => (
                <th
                  key={h.label}
                  className={`px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${h.wide ? 'min-w-64' : 'min-w-20 text-right'}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => {
              const catFixtures = FIXTURES.filter((f) => f.category === cat);
              const visibleFixtures = showActiveOnly
                ? catFixtures.filter((f) => (quantities[f.id] ?? 0) > 0)
                : catFixtures;

              if (showActiveOnly && visibleFixtures.length === 0) return null;
              const isCollapsed = collapsed[cat];

              return (
                <React.Fragment key={cat}>
                  {/* Category header row */}
                  <tr
                    className="bg-blue-50 border-y border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => toggleCategory(cat)}
                  >
                    <td colSpan={10} className="px-4 py-2 font-semibold text-blue-800 text-xs uppercase tracking-wide">
                      <span className="mr-2">{isCollapsed ? '▶' : '▼'}</span>
                      {cat}
                    </td>
                  </tr>

                  {/* Fixture rows */}
                  {!isCollapsed &&
                    visibleFixtures.map((f) => {
                      const r = rowMap[f.id];
                      const qty = quantities[f.id] ?? 0;
                      const isActive = qty > 0;

                      return (
                        <tr
                          key={f.id}
                          className={`border-b border-gray-100 transition-colors ${isActive ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-3 py-2 text-gray-800 min-w-64">
                            {f.name}
                            {f.note && (
                              <span className="ml-1 text-amber-600 text-xs" title={f.note}>
                                ⚠
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-1 text-right">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={qty === 0 ? '' : qty}
                              placeholder="0"
                              onChange={(e) => handleQtyChange(f.id, e.target.value)}
                              className="w-16 border border-gray-300 rounded px-2 py-1 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2 text-right text-gray-600">{round2(f.dfu)}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{f.hotWSFU ? round2(f.hotWSFU) : '—'}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{f.coldWSFU ? round2(f.coldWSFU) : '—'}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{f.combinedWSFU ? round2(f.combinedWSFU) : '—'}</td>
                          <td className={`px-3 py-2 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                            {isActive ? round2(r.rowDFU) : '—'}
                          </td>
                          <td className={`px-3 py-2 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                            {isActive ? round2(r.rowHotWSFU) : '—'}
                          </td>
                          <td className={`px-3 py-2 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                            {isActive ? round2(r.rowColdWSFU) : '—'}
                          </td>
                          <td className={`px-3 py-2 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
                            {isActive ? round2(r.rowCombinedWSFU) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Totals footer */}
          <tfoot>
            <tr className="bg-gray-800 text-white font-semibold border-t-2 border-gray-400">
              <td className="px-3 py-3 text-sm">TOTALS</td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td className="px-3 py-3 text-right text-sm" id="total-dfu">
                {round2(rows.reduce((s, r) => s + r.rowDFU, 0))}
              </td>
              <td className="px-3 py-3 text-right text-sm">
                {round2(rows.reduce((s, r) => s + r.rowHotWSFU, 0))}
              </td>
              <td className="px-3 py-3 text-right text-sm">
                {round2(rows.reduce((s, r) => s + r.rowColdWSFU, 0))}
              </td>
              <td className="px-3 py-3 text-right text-sm">
                {round2(rows.reduce((s, r) => s + r.rowCombinedWSFU, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
