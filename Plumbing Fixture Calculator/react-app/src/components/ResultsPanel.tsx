import { round2 } from '../utils/calculations';
import type { CalcResults } from '../utils/calculations';

interface Props {
  results: CalcResults;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function PipeCard({
  label,
  size,
  sub,
  warn,
}: {
  label: string;
  size: string;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-4 text-center ${warn ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className={`text-3xl font-bold ${warn ? 'text-amber-700' : 'text-blue-700'}`}>{size}</div>
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1 leading-tight">
        {label}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function ResultsPanel({ results }: Props) {
  const { totals, systemType, gpm, pipeSizing, hasPintUrinals, requiresDuctileIron: needsDuctile } = results;
  const isFV = systemType === 'FLUSH_VALVE';
  const hasData = totals.dfu > 0 || totals.hotWSFU > 0 || totals.coldWSFU > 0 || totals.combinedWSFU > 0;

  return (
    <div className="space-y-4">
      {/* Totals + GPM */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Results</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              isFV ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {isFV ? 'Flush Valve System' : 'Flush Tank System'}
          </span>
        </div>

        <div className="p-5 space-y-4">
          {/* Fixture unit totals */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Fixture Unit Totals
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Sanitary DFU" value={hasData ? round2(totals.dfu) : '—'} />
              <StatCard label="Hot WSFU" value={hasData ? round2(totals.hotWSFU) : '—'} />
              <StatCard label="Cold WSFU" value={hasData ? round2(totals.coldWSFU) : '—'} />
              <StatCard label="Combined WSFU" value={hasData ? round2(totals.combinedWSFU) : '—'} />
            </div>
          </div>

          {/* GPM (Hunter's Curve) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Flow Rate — Hunter's Curve (GPM)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                label="Hot Water"
                value={hasData && totals.hotWSFU > 0 ? round2(gpm.hotGPM) : '—'}
                sub="Flush Tank Curve"
              />
              <StatCard
                label="Cold Water"
                value={hasData && totals.coldWSFU > 0 ? round2(gpm.coldGPM) : '—'}
                sub={isFV ? 'Flush Valve Curve' : 'Flush Tank Curve'}
              />
              <StatCard
                label="Combined"
                value={hasData && totals.combinedWSFU > 0 ? round2(gpm.combinedGPM) : '—'}
                sub={isFV ? 'Flush Valve Curve' : 'Flush Tank Curve'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pipe Sizing */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Pipe Sizing Guidelines
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            For preliminary sizing only — verify per project conditions
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Sanitary */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Sanitary Drainage
            </p>
            <div className="grid grid-cols-1 gap-3">
              <PipeCard
                label="Min Sanitary Building Drain"
                size={pipeSizing.sanitaryDrain}
                sub={`Based on ${round2(totals.dfu)} total DFU`}
              />
            </div>
          </div>

          {/* Water Service */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Water Service Lines
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <PipeCard
                label="Type K Cu @ 8 fps — Flush Valves"
                size={pipeSizing.typeKFV}
                sub={`Based on ${round2(totals.combinedWSFU)} combined WSFU`}
                warn={needsDuctile && pipeSizing.typeKFV !== '—'}
              />
              <PipeCard
                label="Type K Cu @ 8 fps — Flush Tanks"
                size={pipeSizing.typeKFT}
                sub={`Based on ${round2(totals.combinedWSFU)} combined WSFU`}
                warn={needsDuctile && pipeSizing.typeKFT !== '—'}
              />
              <PipeCard
                label="Type L Cu @ 5 fps — Hot Water"
                size={pipeSizing.typeL}
                sub={`Based on ${round2(totals.hotWSFU)} hot WSFU`}
                warn={needsDuctile && pipeSizing.typeL !== '—'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(hasPintUrinals || needsDuctile) && (
        <div className="space-y-2">
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <span className="text-lg leading-none mt-0.5">⚠</span>
            <span>
              <strong>Do not use 2½″ pipe for water service piping.</strong>
            </span>
          </div>
          {needsDuctile && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              <span className="text-lg leading-none mt-0.5">⚠</span>
              <span>
                <strong>Water service 3″ and larger:</strong> Use ductile iron pipe.
              </span>
            </div>
          )}
          {hasPintUrinals && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              <span className="text-lg leading-none mt-0.5">⚠</span>
              <span>
                <strong>Pint urinals (0.125 GPF):</strong> The IPC does not contain official WSFU values
                for pint urinals. Values shown are Henderson's estimates and are less than code values.
                Do not use in jurisdictions where fixture units must appear on plans.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Always-visible 2.5" reminder */}
      {!hasPintUrinals && !needsDuctile && (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-500">
          <span>ℹ</span>
          <span>Do not use 2½″ pipe for water service piping. (IPC requirement)</span>
        </div>
      )}
    </div>
  );
}
