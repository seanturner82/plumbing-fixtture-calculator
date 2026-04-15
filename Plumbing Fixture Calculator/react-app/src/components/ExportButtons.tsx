import type { CalcResults } from '../utils/calculations';
import { exportJSON, exportCSV } from '../utils/exporters';
import type { ProjectInfo } from '../utils/exporters';

interface Props {
  project: ProjectInfo;
  results: CalcResults;
}

export default function ExportButtons({ project, results }: Props) {
  const hasData = results.totals.dfu > 0 || results.totals.combinedWSFU > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Export Results</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Saves project info, active fixtures, totals, GPM, and pipe sizing.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportJSON(project, results)}
            disabled={!hasData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <DownloadIcon />
            Export JSON
          </button>
          <button
            onClick={() => exportCSV(project, results)}
            disabled={!hasData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <DownloadIcon />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2v8M5 7l3 3 3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
