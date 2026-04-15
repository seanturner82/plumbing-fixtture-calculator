// Hunter's Curve piecewise 6th-degree polynomial interpolation
// Converts Water Supply Fixture Units (WSFU) → GPM
// Coefficients extracted from HUNTERDATA sheets in the IPC v1.11 workbook
// Formula: GPM = b + c1·x + c2·x² + c3·x³ + c4·x⁴ + c5·x⁵ + c6·x⁶

type PolyCoeffs = [b: number, c1: number, c2: number, c3: number, c4: number, c5: number, c6: number];

function evalPoly(x: number, [b, c1, c2, c3, c4, c5, c6]: PolyCoeffs): number {
  return b + c1 * x + c2 * x ** 2 + c3 * x ** 3 + c4 * x ** 4 + c5 * x ** 5 + c6 * x ** 6;
}

// Flush Tank coefficients
const FT_LT30: PolyCoeffs = [
  1.1755231358680769,
  1.9557609838000838,
  -0.052702904715672225,
  -0.002761303553594391,
  0.0002429685903322884,
  -6.20944509783197e-6,
  5.4198645634637785e-8,
];

const FT_25_250: PolyCoeffs = [
  17.40552640913198,
  0.06653947792671444,
  0.006102136165334048,
  -7.235023302647867e-5,
  4.053203063315914e-7,
  -1.1178466065685459e-9,
  1.2225359842972214e-12,
];

const FT_250_1000: PolyCoeffs = [
  63.13098017053704,
  -0.31523737253127615,
  0.002742618464637604,
  -7.3336200710385985e-6,
  1.0415202405268202e-8,
  -7.53291423041916e-12,
  2.1691690965767317e-15,
];

// Flush Valve coefficients
const FV_LT30: PolyCoeffs = [
  5.5617793667260855,
  -0.8418926134533534,
  0.9952516270642122,
  -0.1197860727669694,
  0.006382656695156823,
  -0.00016117135290915496,
  1.5732501132946008e-6,
];

const FV_25_250: PolyCoeffs = [
  27.350948845474242,
  0.4734425292581624,
  0.00023027396321985413,
  -1.3867609543020676e-5,
  3.328562812448758e-8,
  1.4245229309352945e-10,
  -4.579884269147539e-13,
];

// Large x formula (shared by both FT and FV above 1000 WSFU)
function largeFT(x: number): number {
  if (x >= 9000) return 0.095 * x + 205;
  const t = x / 1000;
  return (
    (0.8759882 +
      1.259865 * t -
      0.02582505 * t ** 2 +
      0.0008687869 * t ** 3 -
      0.0000101455 * t ** 4) *
    100
  );
}

export type SystemType = 'FLUSH_TANK' | 'FLUSH_VALVE';

export function hunterGPM(wsfu: number, system: SystemType): number {
  if (wsfu <= 0) return 0;

  if (system === 'FLUSH_TANK') {
    if (wsfu < 30) return evalPoly(wsfu, FT_LT30);
    if (wsfu < 250) return evalPoly(wsfu, FT_25_250);
    if (wsfu < 1000) return evalPoly(wsfu, FT_250_1000);
    return largeFT(wsfu);
  } else {
    // FLUSH_VALVE
    if (wsfu < 5) return 0;
    if (wsfu < 30) return evalPoly(wsfu, FV_LT30);
    if (wsfu < 250) return evalPoly(wsfu, FV_25_250);
    if (wsfu < 1000) return evalPoly(wsfu, FT_250_1000); // shared above 250
    return largeFT(wsfu);
  }
}
