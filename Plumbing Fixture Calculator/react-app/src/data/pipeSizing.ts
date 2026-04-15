// Pipe sizing lookup tables extracted from IPC v1.11 workbook (sheet3.xml)
// All functions return a display string for the recommended pipe size.

// Sanitary Building Drain (F74): based on total sanitary DFU
export function sanitaryDrainSize(totalDFU: number): string {
  if (totalDFU <= 0) return '—';
  if (totalDFU < 180) return '4"';
  if (totalDFU < 390) return '5"';
  if (totalDFU < 700) return '6"';
  if (totalDFU < 1600) return '8"';
  return '>8"';
}

// Water Service Type K Cu @ 8 fps — Primarily Flush Valves (F76)
// Input: total combined WSFU (L65)
export function waterServiceTypeKFV(combinedWSFU: number): string {
  if (combinedWSFU < 1) return '—';
  if (combinedWSFU < 5.1) return '1"';
  if (combinedWSFU < 13) return '1¼"';
  if (combinedWSFU < 31) return '1½"';
  if (combinedWSFU < 128) return '2"';
  if (combinedWSFU < 686) return '3"';
  if (combinedWSFU < 1668) return '4"';
  if (combinedWSFU < 3150) return '6"';
  return '>6"';
}

// Water Service Type K Cu @ 8 fps — Primarily Flush Tanks (F77)
// Input: total combined WSFU (L65)
export function waterServiceTypeKFT(combinedWSFU: number): string {
  if (combinedWSFU < 1) return '—';
  if (combinedWSFU < 15) return '¾"';
  if (combinedWSFU < 28) return '1"';
  if (combinedWSFU < 54) return '1¼"';
  if (combinedWSFU < 101) return '1½"';
  if (combinedWSFU < 251) return '2"';
  if (combinedWSFU < 740) return '3"';
  if (combinedWSFU < 1668) return '4"';
  return '6"';
}

// Water Service Type L Cu @ 5 fps — Primarily Flush Tanks (F79)
// Input: total hot WSFU (J65)
export function waterServiceTypeL(hotWSFU: number): string {
  if (hotWSFU < 1) return '—';
  if (hotWSFU < 8) return '¾"';
  if (hotWSFU < 16) return '1"';
  if (hotWSFU < 28) return '1¼"';
  if (hotWSFU < 49) return '1½"';
  if (hotWSFU < 119) return '2"';
  if (hotWSFU < 245) return '2½"';
  if (hotWSFU < 440) return '3"';
  return '>3"';
}

// Returns true when the water service result is ≥ 3" (ductile iron note applies)
export function requiresDuctileIron(size: string): boolean {
  const numStr = size.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  return !isNaN(num) && num >= 3;
}
