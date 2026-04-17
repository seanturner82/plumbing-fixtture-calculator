import { FIXTURES } from '../data/fixtures';
import { hunterGPM } from '../data/hunterCurve';
import type { SystemType } from '../data/hunterCurve';
import {
  sanitaryDrainSize,
  waterServiceTypeKFV,
  waterServiceTypeKFT,
  waterServiceTypeL,
  requiresDuctileIron,
} from '../data/pipeSizing';

export type FixtureQuantities = Record<string, number>; // fixtureId → qty

export interface RowResult {
  id: string;
  name: string;
  section: string;
  qty: number;
  dfu: number;
  hotWSFU: number;
  coldWSFU: number;
  combinedWSFU: number;
  rowDFU: number;
  rowHotWSFU: number;
  rowColdWSFU: number;
  rowCombinedWSFU: number;
  note?: string;
}

export interface Totals {
  dfu: number;
  hotWSFU: number;
  coldWSFU: number;
  combinedWSFU: number;
}

export interface GPMOutputs {
  hotGPM: number;
  coldGPM: number;
  combinedGPM: number;
}

export interface PipeSizing {
  sanitaryDrain: string;
  typeKFV: string;
  typeKFT: string;
  typeL: string;
}

export interface CalcResults {
  rows: RowResult[];
  totals: Totals;
  systemType: SystemType;
  gpm: GPMOutputs;
  pipeSizing: PipeSizing;
  hasPintUrinals: boolean;
  requiresDuctileIron: boolean;
}

export function calculate(quantities: FixtureQuantities): CalcResults {
  const rows: RowResult[] = FIXTURES.map((f) => {
    const qty = Math.max(0, Math.round(quantities[f.id] ?? 0));
    return {
      id: f.id,
      name: f.name,
      section: f.section,
      qty,
      dfu: f.dfu,
      hotWSFU: f.hotWSFU,
      coldWSFU: f.coldWSFU,
      combinedWSFU: f.combinedWSFU,
      rowDFU: qty * f.dfu,
      rowHotWSFU: qty * f.hotWSFU,
      rowColdWSFU: qty * f.coldWSFU,
      rowCombinedWSFU: qty * f.combinedWSFU,
      note: f.note,
    };
  });

  const totals: Totals = rows.reduce(
    (acc, r) => ({
      dfu: acc.dfu + r.rowDFU,
      hotWSFU: acc.hotWSFU + r.rowHotWSFU,
      coldWSFU: acc.coldWSFU + r.rowColdWSFU,
      combinedWSFU: acc.combinedWSFU + r.rowCombinedWSFU,
    }),
    { dfu: 0, hotWSFU: 0, coldWSFU: 0, combinedWSFU: 0 }
  );

  // System type: flush valve if any flush-valve fixture has qty > 0
  const systemType: SystemType =
    FIXTURES.some((f) => f.isFlushValve && (quantities[f.id] ?? 0) > 0)
      ? 'FLUSH_VALVE'
      : 'FLUSH_TANK';

  // Hot always uses flush tank curve per Excel Q69 (uses FT coefficients for R69/hot column)
  const hotGPM = hunterGPM(totals.hotWSFU, 'FLUSH_TANK');
  const coldGPM = hunterGPM(totals.coldWSFU, systemType);
  const combinedGPM = hunterGPM(totals.combinedWSFU, systemType);

  const sizeKFV = waterServiceTypeKFV(totals.combinedWSFU);
  const sizeKFT = waterServiceTypeKFT(totals.combinedWSFU);
  const sizeL = waterServiceTypeL(totals.hotWSFU);

  const hasPintUrinals = (quantities['urinal-pint'] ?? 0) > 0;
  const needsDuctile =
    requiresDuctileIron(sizeKFV) ||
    requiresDuctileIron(sizeKFT) ||
    requiresDuctileIron(sizeL);

  return {
    rows,
    totals,
    systemType,
    gpm: { hotGPM, coldGPM, combinedGPM },
    pipeSizing: {
      sanitaryDrain: sanitaryDrainSize(totals.dfu),
      typeKFV: sizeKFV,
      typeKFT: sizeKFT,
      typeL: sizeL,
    },
    hasPintUrinals,
    requiresDuctileIron: needsDuctile,
  };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
