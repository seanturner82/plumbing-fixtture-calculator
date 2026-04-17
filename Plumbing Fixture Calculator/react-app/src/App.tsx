import { useState, useMemo } from 'react';
import ProjectHeader from './components/ProjectHeader';
import FixtureTable from './components/FixtureTable';
import ResultsPanel from './components/ResultsPanel';
import ExportButtons from './components/ExportButtons';
import InfoModal from './components/InfoModal';
import { calculate } from './utils/calculations';
import type { FixtureQuantities } from './utils/calculations';
import type { ProjectInfo } from './utils/exporters';

const EMPTY_PROJECT: ProjectInfo = {
  name: '',
  location: '',
  client: '',
  jobNumber: '',
  date: '',
  calculatedBy: '',
};

export default function App() {
  const [project, setProject] = useState<ProjectInfo>(EMPTY_PROJECT);
  const [quantities, setQuantities] = useState<FixtureQuantities>({});
  const [showInfo, setShowInfo] = useState(false);

  function handleQtyChange(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }

  const results = useMemo(() => calculate(quantities), [quantities]);

  return (
    <div className="min-h-screen bg-gray-100">
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      {/* Top Bar */}
      <header className="bg-[#375623] text-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Plumbing Fixture Calculator</h1>
            <p className="text-green-300 text-xs mt-0.5">International Plumbing Code</p>
          </div>
          <div className="text-right flex items-center gap-3">
            <p className="text-green-300 text-xs">Session-based · Data not saved on refresh</p>
            <button
              onClick={() => setShowInfo(true)}
              className="w-6 h-6 rounded-full border border-green-300 text-green-200 hover:bg-green-700 hover:text-white text-xs font-bold leading-none flex items-center justify-center"
              aria-label="About this calculator"
            >
              i
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-5">
        {/* Project Info */}
        <ProjectHeader project={project} onChange={setProject} />

        {/* Fixture Schedule */}
        <FixtureTable quantities={quantities} rows={results.rows} onChange={handleQtyChange} />

        {/* Results */}
        <ResultsPanel results={results} />

        {/* Export */}
        <ExportButtons project={project} results={results} />
      </main>

      <footer className="max-w-screen-xl mx-auto px-6 py-4 text-xs text-gray-400 border-t border-gray-200 mt-4 text-center">
        A Henderson Companies tool. © 2026 Henderson Companies. All rights reserved.
      </footer>
    </div>
  );
}
