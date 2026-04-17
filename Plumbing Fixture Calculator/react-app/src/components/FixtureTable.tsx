import { useState } from 'react';
import { FIXTURES } from '../data/fixtures';
import { round2 } from '../utils/calculations';
import type { FixtureQuantities, RowResult } from '../utils/calculations';

interface Props {
  quantities: FixtureQuantities;
  rows: RowResult[];
  onChange: (id: string, qty: number) => void;
}

export default function FixtureTable({ quantities, rows, onChange }: Props) {
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  function handleQtyChange(id: string, raw: string) {
    const val = parseInt(raw, 10);
    onChange(id, isNaN(val) || val < 0 ? 0 : val);
  }

  const rowMap = Object.fromEntries(rows.map((r) => [r.id, r]));
  const standard = FIXTURES.filter((f) => f.section === 'standard');
  const specialty = FIXTURES.filter((f) => f.section === 'specialty-kitchen');

  function visibleFixtures(list: typeof FIXTURES) {
    return showActiveOnly ? list.filter((f) => (quantities[f.id] ?? 0) > 0) : list;
  }

  const allRows = rows;
  const totalDFU = allRows.reduce((s, r) => s + r.rowDFU, 0);
  const totalHot = allRows.reduce((s, r) => s + r.rowHotWSFU, 0);
  const totalCold = allRows.reduce((s, r) => s + r.rowColdWSFU, 0);
  const totalComb = allRows.reduce((s, r) => s + r.rowCombinedWSFU, 0);

  function FixtureRow({ f }: { f: (typeof FIXTURES)[0] }) {
    const r = rowMap[f.id];
    const qty = quantities[f.id] ?? 0;
    const isActive = qty > 0;

    return (
      <tr className={`border-b border-gray-200 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
        <td className="px-3 py-1.5 text-gray-900 min-w-72">
          {f.name}
          {f.note && (
            <span className="ml-1 text-amber-600 text-xs cursor-help" title={f.note}>⚠</span>
          )}
        </td>
        <td className="px-2 py-1 text-center">
          <input
            type="number"
            min={0}
            step={1}
            value={qty === 0 ? '' : qty}
            placeholder="0"
            onChange={(e) => handleQtyChange(f.id, e.target.value)}
            className="w-14 border border-gray-400 bg-[#dce6f1] rounded px-1 py-0.5 text-center text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
          />
        </td>
        <td className="px-3 py-1.5 text-right text-gray-700">{round2(f.dfu) || '—'}</td>
        <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
          {isActive ? round2(r.rowDFU) : '—'}
        </td>
        <td className="px-3 py-1.5 text-right text-gray-700">{f.hotWSFU ? round2(f.hotWSFU) : '—'}</td>
        <td className="px-3 py-1.5 text-right text-gray-700">{f.coldWSFU ? round2(f.coldWSFU) : '—'}</td>
        <td className="px-3 py-1.5 text-right text-gray-700">{f.combinedWSFU ? round2(f.combinedWSFU) : '—'}</td>
        <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
          {isActive ? round2(r.rowHotWSFU) : '—'}
        </td>
        <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
          {isActive ? round2(r.rowColdWSFU) : '—'}
        </td>
        <td className={`px-3 py-1.5 text-right font-medium ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>
          {isActive ? round2(r.rowCombinedWSFU) : '—'}
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#e2efda]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-green-900">
          2006–18 IPC Fixture Loading
        </h2>
        <label className="flex items-center gap-2 text-xs text-green-900 cursor-pointer select-none font-medium">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-400 text-green-700 focus:ring-green-600"
          />
          Show active only
        </label>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          {/* Multi-row header matching Excel layout */}
          <thead>
            <tr className="bg-[#375623] text-white border-b border-gray-400">
              <th rowSpan={2} className="px-3 py-1.5 text-left font-semibold uppercase tracking-wide border-r border-green-700 min-w-72">
                Fixture Type
              </th>
              <th rowSpan={2} className="px-2 py-1.5 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-14">
                QTY
              </th>
              <th rowSpan={2} className="px-3 py-1.5 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">
                D.F.U.<br />(EA)
              </th>
              <th rowSpan={2} className="px-3 py-1.5 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">
                Total<br />D.F.U.
              </th>
              <th colSpan={3} className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-b border-green-700 border-r border-green-700">
                S.F.U. (EA)
              </th>
              <th colSpan={3} className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-b border-green-700">
                Total S.F.U.
              </th>
            </tr>
            <tr className="bg-[#375623] text-white border-b-2 border-gray-400">
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">Hot</th>
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">Cold</th>
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">Comb.</th>
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">Hot</th>
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide border-r border-green-700 min-w-16">Cold</th>
              <th className="px-3 py-1 text-center font-semibold uppercase tracking-wide min-w-16">Service</th>
            </tr>
          </thead>
          <tbody>
            {visibleFixtures(standard).map((f) => (
              <FixtureRow key={f.id} f={f} />
            ))}

            {/* Specialty Kitchen section divider */}
            {(!showActiveOnly || visibleFixtures(specialty).length > 0) && (
              <tr className="bg-[#375623] border-y-2 border-gray-400">
                <td colSpan={10} className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                  Specialty Kitchen Equip.
                </td>
              </tr>
            )}
            {visibleFixtures(specialty).map((f) => (
              <FixtureRow key={f.id} f={f} />
            ))}
          </tbody>

          {/* Totals footer */}
          <tfoot>
            <tr className="bg-[#375623] text-white font-bold border-t-2 border-gray-400">
              <td className="px-3 py-2 text-xs uppercase tracking-wide" colSpan={2}>Total Units:</td>
              <td />
              <td className="px-3 py-2 text-right text-sm">{round2(totalDFU)}</td>
              <td />
              <td />
              <td />
              <td className="px-3 py-2 text-right text-sm">{round2(totalHot)}</td>
              <td className="px-3 py-2 text-right text-sm">{round2(totalCold)}</td>
              <td className="px-3 py-2 text-right text-sm">{round2(totalComb)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
