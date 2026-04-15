import { useState, useMemo } from 'react';
import ProjectHeader from './components/ProjectHeader';
import FixtureTable from './components/FixtureTable';
import ResultsPanel from './components/ResultsPanel';
import ExportButtons from './components/ExportButtons';
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

  function handleQtyChange(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }

  const results = useMemo(() => calculate(quantities), [quantities]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">IPC Plumbing Fixture Calculator</h1>
            <p className="text-blue-200 text-xs mt-0.5">2006–2018 International Plumbing Code</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Session-based · Data not saved on refresh</p>
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

      <footer className="max-w-screen-xl mx-auto px-6 py-4 text-xs text-gray-400 border-t border-gray-200 mt-4">
        IPC Plumbing Fixture Calculator · 2006–2018 IPC · Hunter's Curve piecewise polynomial
        interpolation · v1.11 data · For preliminary sizing only — always verify per project-specific
        conditions and applicable code.
      </footer>
    </div>
  );
}
