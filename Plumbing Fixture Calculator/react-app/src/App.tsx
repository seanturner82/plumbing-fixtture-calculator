import { useState, useMemo } from 'react';
import ProjectHeader from './components/ProjectHeader';
import FixtureTable from './components/FixtureTable';
import HunterCurveChart from './components/HunterCurveChart';
import CalculatedTotals from './components/CalculatedTotals';
import InfoModal from './components/InfoModal';
import { calculate } from './utils/calculations';
import { exportJSON, exportCSV } from './utils/exporters';
import type { FixtureQuantities } from './utils/calculations';
import type { ProjectInfo } from './utils/exporters';

const EMPTY_PROJECT: ProjectInfo = {
  name: '',
  location: '',
  client: '',
  jobNumber: '',
  date: new Date().toISOString().slice(0, 10),
  calculatedBy: '',
};

export default function App() {
  const [project, setProject] = useState<ProjectInfo>(EMPTY_PROJECT);
  const [quantities, setQuantities] = useState<FixtureQuantities>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [showInfo, setShowInfo] = useState(false);

  function handleQtyChange(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }

  function handleNoteChange(id: string, note: string) {
    setUserNotes((prev) => ({ ...prev, [id]: note }));
  }

  function handleReset() {
    setQuantities({});
    setUserNotes({});
  }

  const results = useMemo(() => calculate(quantities), [quantities]);
  const hasData = results.totals.dfu > 0 || results.totals.combinedWSFU > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 pt-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                Henderson Engineers · Plumbing
              </p>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Fixture Loading &amp; Pipe Sizing Calculator
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                2006–2018 International Plumbing Code · Hunter's Curve Interpolation · v1.11
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <button
                onClick={() => exportJSON(project, results)}
                disabled={!hasData}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                JSON
              </button>
              <button
                onClick={() => exportCSV(project, results)}
                disabled={!hasData}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded hover:bg-gray-700"
              >
                Print / PDF
              </button>
              <button
                onClick={() => setShowInfo(true)}
                className="w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:bg-gray-100 text-xs font-bold flex items-center justify-center ml-1"
                aria-label="About this calculator"
              >
                i
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto w-full px-6 py-4 flex flex-col gap-4 flex-1">
        {/* Project info strip */}
        <ProjectHeader project={project} onChange={setProject} />

        {/* Chart + Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <HunterCurveChart
            combinedWSFU={results.totals.combinedWSFU}
            hotWSFU={results.totals.hotWSFU}
            systemType={results.systemType}
            combinedGPM={results.gpm.combinedGPM}
          />
          <CalculatedTotals results={results} />
        </div>

        {/* Fixture table */}
        <FixtureTable
          quantities={quantities}
          userNotes={userNotes}
          rows={results.rows}
          onChange={handleQtyChange}
          onNoteChange={handleNoteChange}
          onReset={handleReset}
        />
      </main>

      <footer className="border-t border-gray-200 py-3 text-center text-xs text-gray-400">
        A Henderson Companies tool. © 2026 Henderson Companies. All rights reserved.
      </footer>
    </div>
  );
}
