import { round2 } from './calculations';
import type { CalcResults } from './calculations';

export interface ProjectInfo {
  name: string;
  location: string;
  client: string;
  jobNumber: string;
  date: string;
  calculatedBy: string;
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(project: ProjectInfo, results: CalcResults): void {
  const activeFixtures = results.rows.filter((r) => r.qty > 0);

  const payload = {
    project,
    fixtures: activeFixtures.map((r) => ({
      name: r.name,
      qty: r.qty,
      dfu: r.dfu,
      hotWSFU: r.hotWSFU,
      coldWSFU: r.coldWSFU,
      combinedWSFU: r.combinedWSFU,
      rowDFU: round2(r.rowDFU),
      rowHotWSFU: round2(r.rowHotWSFU),
      rowColdWSFU: round2(r.rowColdWSFU),
      rowCombinedWSFU: round2(r.rowCombinedWSFU),
    })),
    totals: {
      dfu: round2(results.totals.dfu),
      hotWSFU: round2(results.totals.hotWSFU),
      coldWSFU: round2(results.totals.coldWSFU),
      combinedWSFU: round2(results.totals.combinedWSFU),
      systemType: results.systemType,
      hotGPM: round2(results.gpm.hotGPM),
      coldGPM: round2(results.gpm.coldGPM),
      combinedGPM: round2(results.gpm.combinedGPM),
    },
    pipeSizing: {
      sanitaryDrain: results.pipeSizing.sanitaryDrain,
      waterServiceTypeKFV: results.pipeSizing.typeKFV,
      waterServiceTypeKFT: results.pipeSizing.typeKFT,
      waterServiceTypeL: results.pipeSizing.typeL,
    },
    exportedAt: new Date().toISOString(),
    codeReference: '2006-2018 IPC',
  };

  downloadBlob(JSON.stringify(payload, null, 2), 'plumbing-fixture-calc.json', 'application/json');
}

function escapeCSV(val: string | number): string {
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(...cells: (string | number)[]): string {
  return cells.map(escapeCSV).join(',');
}

export function exportCSV(project: ProjectInfo, results: CalcResults): void {
  const lines: string[] = [];

  // Project header
  lines.push(row('PROJECT', project.name));
  lines.push(row('LOCATION', project.location));
  lines.push(row('CLIENT', project.client));
  lines.push(row('JOB NUMBER', project.jobNumber));
  lines.push(row('DATE', project.date));
  lines.push(row('CALCULATED BY', project.calculatedBy));
  lines.push('');

  // Fixture table header
  lines.push(
    row(
      'FIXTURE TYPE',
      'QTY',
      'DFU/EA',
      'HOT WSFU/EA',
      'COLD WSFU/EA',
      'COMBINED WSFU/EA',
      'ROW DFU',
      'ROW HOT WSFU',
      'ROW COLD WSFU',
      'ROW COMBINED WSFU'
    )
  );

  const activeFixtures = results.rows.filter((r) => r.qty > 0);
  for (const r of activeFixtures) {
    lines.push(
      row(
        r.name,
        r.qty,
        r.dfu,
        r.hotWSFU,
        r.coldWSFU,
        r.combinedWSFU,
        round2(r.rowDFU),
        round2(r.rowHotWSFU),
        round2(r.rowColdWSFU),
        round2(r.rowCombinedWSFU)
      )
    );
  }

  lines.push('');

  // Totals
  lines.push(row('TOTALS', '', '', '', '', '', round2(results.totals.dfu), round2(results.totals.hotWSFU), round2(results.totals.coldWSFU), round2(results.totals.combinedWSFU)));
  lines.push('');

  // GPM and system type
  lines.push(row('SYSTEM TYPE', results.systemType));
  lines.push(row('HOT GPM (HUNTER\'S CURVE)', round2(results.gpm.hotGPM)));
  lines.push(row('COLD GPM (HUNTER\'S CURVE)', round2(results.gpm.coldGPM)));
  lines.push(row('COMBINED GPM (HUNTER\'S CURVE)', round2(results.gpm.combinedGPM)));
  lines.push('');

  // Pipe sizing
  lines.push(row('PIPE SIZING', ''));
  lines.push(row('MIN SANITARY BUILDING DRAIN', results.pipeSizing.sanitaryDrain));
  lines.push(row('WATER SERVICE - TYPE K CU @ 8 FPS (FLUSH VALVES)', results.pipeSizing.typeKFV));
  lines.push(row('WATER SERVICE - TYPE K CU @ 8 FPS (FLUSH TANKS)', results.pipeSizing.typeKFT));
  lines.push(row('HOT WATER SERVICE - TYPE L CU @ 5 FPS (FLUSH TANKS)', results.pipeSizing.typeL));
  lines.push('');

  lines.push(row('CODE REFERENCE', '2006-2018 IPC'));
  lines.push(row('EXPORTED', new Date().toISOString()));

  downloadBlob(lines.join('\r\n'), 'plumbing-fixture-calc.csv', 'text/csv;charset=utf-8;');
}
