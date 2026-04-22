import { round2 } from '../utils/calculations';
import type { CalcResults } from '../utils/calculations';

interface Props {
  results: CalcResults;
}

export default function CalculatedTotals({ results }: Props) {
  const { totals, gpm, pipeSizing, hasPintUrinals, requiresDuctileIron: needsDuctile } = results;
  const hasData = totals.dfu > 0 || totals.combinedWSFU > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-4 h-full">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Calculated Totals</p>

      {/* DFU + Combined GPM */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded overflow-hidden">
        <div className="bg-white p-3">
          <p className="text-[10px] text-gray-500 leading-tight">Total Sanitary DFU</p>
          <p className="text-[10px] text-gray-400">fixture units</p>
          <p className="text-4xl font-light text-gray-900 mt-1">{hasData ? round2(totals.dfu) : 0}</p>
        </div>
        <div className="bg-white p-3">
          <p className="text-[10px] text-gray-500 leading-tight">Combined Demand</p>
          <p className="text-[10px] text-gray-400">GPM at peak</p>
          <p className="text-4xl font-light text-gray-900 mt-1">{hasData ? round2(gpm.combinedGPM) : 0}</p>
        </div>
      </div>

      {/* Hot / Cold WSFU */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-200 rounded p-3">
          <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">Hot WSFU</p>
          <p className="text-2xl font-light text-red-500 mt-0.5">{hasData ? round2(gpm.hotGPM) : 0}
            <span className="text-xs font-normal text-gray-400 ml-1">gpm</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{round2(totals.hotWSFU)} WSFU</p>
        </div>
        <div className="border border-gray-200 rounded p-3">
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">Cold WSFU</p>
          <p className="text-2xl font-light text-blue-500 mt-0.5">{hasData ? round2(gpm.coldGPM) : 0}
            <span className="text-xs font-normal text-gray-400 ml-1">gpm</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{round2(totals.coldWSFU)} WSFU</p>
        </div>
      </div>

      {/* Pipe sizing */}
      <div className="border border-gray-200 rounded p-3 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pipe Sizing Guidelines</p>
        <PipeLine label="Min Sanitary Drain" value={pipeSizing.sanitaryDrain} sub={`${round2(totals.dfu)} DFU`} />
        <PipeLine label="Type K Cu @ 8 fps (FV)" value={pipeSizing.typeKFV} sub={`${round2(totals.combinedWSFU)} WSFU`} warn={needsDuctile} />
        <PipeLine label="Type K Cu @ 8 fps (FT)" value={pipeSizing.typeKFT} sub={`${round2(totals.combinedWSFU)} WSFU`} warn={needsDuctile} />
        <PipeLine label="Type L Cu @ 5 fps (HW)" value={pipeSizing.typeL} sub={`${round2(totals.hotWSFU)} WSFU`} warn={needsDuctile} />
      </div>

      {/* Warnings */}
      {(hasPintUrinals || needsDuctile) && (
        <div className="space-y-1.5">
          {needsDuctile && (
            <Warning>Water service 3″+: use ductile iron pipe.</Warning>
          )}
          {hasPintUrinals && (
            <Warning>Pint urinals: WSFU values are Henderson estimates — do not use where code values are required on plans.</Warning>
          )}
        </div>
      )}
      <p className="text-[10px] text-gray-400">Do not use 2½″ pipe for water service. (IPC)</p>
    </div>
  );
}

function PipeLine({ label, value, sub, warn }: { label: string; value: string; sub: string; warn?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10px] text-gray-500 leading-tight">{label}</span>
      <span className="flex items-baseline gap-1.5 shrink-0">
        <span className={`text-sm font-bold ${warn && value !== '—' ? 'text-amber-600' : 'text-gray-800'}`}>{value}</span>
        <span className="text-[10px] text-gray-400">{sub}</span>
      </span>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-[10px] text-amber-800">
      <span>⚠</span>
      <span>{children}</span>
    </div>
  );
}
