# Product Requirements Document
## IPC Plumbing Fixture Calculator — React Web App

**Version:** 1.0  
**Date:** 2026-04-15  
**Author:** heeltoeengineer  
**Source Tool:** `0000000000 CALC-FIXTURE TOTAL 2006 - 18 IPC (v1.11).xlsm`

---

## 1. Overview

A standalone, browser-based React application that replicates the functionality of the existing Excel macro plumbing fixture calculator. The app allows engineers to calculate drainage fixture units (DFU) and water supply fixture units (WSFU) per the 2006–2018 International Plumbing Code (IPC), convert WSFU to GPM using Hunter's Curve piecewise polynomial interpolation, and receive minimum pipe size recommendations for sanitary drains and water service lines.

The app is **session-based only** — no data persistence. Navigating away or refreshing the page clears all input.

---

## 2. Goals

- Replace the Excel tool with a faster, more accessible, platform-independent tool
- Maintain full calculation fidelity to the IPC v1.11 workbook
- Provide JSON and CSV export so engineers can save and share results
- Be intuitive for engineers familiar with the Excel tool

---

## 3. Non-Goals

- No user accounts, authentication, or cloud sync
- No backend server
- No mobile-first optimization (desktop engineering tool)
- No support for codes other than 2006–2018 IPC

---

## 4. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Vite + React + TypeScript | Fast dev, type safety for numeric data |
| Styling | Tailwind CSS | Clean engineering UI, no extra dependencies |
| State | React `useState` | All local, session-only |
| Export | Browser Blob API | No library needed |

---

## 5. App Structure

```
react-app/
  src/
    data/
      fixtures.ts        # All 46 fixture definitions
      hunterCurve.ts     # Polynomial coefficients + GPM function
      pipeSizing.ts      # Pipe size lookup tables
    components/
      ProjectHeader.tsx  # 6-field project metadata form
      FixtureTable.tsx   # Grouped fixture table with qty inputs
      ResultsPanel.tsx   # Totals, GPM, pipe sizing, warnings
      ExportButtons.tsx  # JSON + CSV download
    utils/
      calculations.ts    # All math (totals, system type, Hunter's Curve, pipe sizes)
      exporters.ts       # buildJSON() and buildCSV()
    App.tsx
    main.tsx
```

---

## 6. Features

### 6.1 Project Header
Six free-text input fields:
- Project Name
- Location
- Client
- Job Number
- Date
- Calculated By

### 6.2 Fixture Table
- All 46 IPC fixtures, grouped into collapsible categories
- Columns: Fixture Type | Qty (editable) | DFU/ea | Hot WSFU/ea | Cold WSFU/ea | Combined WSFU/ea | Row DFU | Row Hot | Row Cold | Row Combined
- Qty inputs: integer, min 0
- Toggle: "Show active only" (hides zero-quantity rows)
- Sticky column headers

**Fixture Categories:**
1. Bathroom Groups
2. Water Closets (flush tank, flush valve, flushometer tank)
3. Urinals
4. Lavatories
5. Bathtub / Bidet / Showers
6. Sinks (private, public, service, bar, laundry, wash fountain, flushing rim)
7. Dishwashers
8. Clothes Washers
9. Specialty Kitchen Equipment
10. Utility (floor drain, drinking fountain, wall hydrant, clinical service sink)
11. Misc Continuous Flow (GPM)

### 6.3 Results Panel
**Totals table:**
- Total Sanitary DFU
- Total Hot WSFU, Cold WSFU, Combined WSFU
- System type badge: FLUSH TANK or FLUSH VALVE (auto-determined)
- Hot GPM, Cold GPM, Combined GPM (Hunter's Curve outputs)

**Pipe Sizing (4 outputs):**
- Min Sanitary Building Drain (from total DFU)
- Water Service Type K Cu @ 8 fps — Flush Valves (from combined GPM)
- Water Service Type K Cu @ 8 fps — Flush Tanks (from combined GPM)
- Water Service Type L Cu @ 5 fps — Flush Tanks (from hot GPM)

**Warnings (always visible if applicable):**
- Pint urinal note (if 0.125 GPF urinal qty > 0): "Code does not contain WSFU values for pint urinals. Values shown are Henderson's estimates and should not be used in jurisdictions requiring fixture units on plans."
- 2½" prohibition: "Do not use 2½\" pipe for water service."
- Ductile iron note: shown when water service pipe size ≥ 3"

### 6.4 Export
**Export JSON** — downloads `plumbing-fixture-calc.json`:
```json
{
  "project": {
    "name": "", "location": "", "client": "",
    "jobNumber": "", "date": "", "calculatedBy": ""
  },
  "fixtures": [
    {
      "name": "", "qty": 0,
      "dfu": 0, "hotWSFU": 0, "coldWSFU": 0, "combinedWSFU": 0,
      "rowDFU": 0, "rowHotWSFU": 0, "rowColdWSFU": 0, "rowCombinedWSFU": 0
    }
  ],
  "totals": {
    "dfu": 0, "hotWSFU": 0, "coldWSFU": 0, "combinedWSFU": 0,
    "systemType": "FLUSH_TANK",
    "hotGPM": 0, "coldGPM": 0, "combinedGPM": 0
  },
  "pipeSizing": {
    "sanitaryDrain": "",
    "waterServiceTypeKFV": "",
    "waterServiceTypeKFT": "",
    "waterServiceTypeL": ""
  },
  "exportedAt": "<ISO 8601 timestamp>",
  "codeReference": "2006-2018 IPC"
}
```

**Export CSV** — downloads `plumbing-fixture-calc.csv`:
- Section 1: Project header key-value pairs
- Blank row separator
- Section 2: Fixture rows (only qty > 0), with column headers
- Section 3: Totals rows
- Section 4: Pipe sizing rows

---

## 7. Calculation Logic

### 7.1 Per-Fixture Row
```
rowDFU            = qty × fixture.dfu
rowHotWSFU        = qty × fixture.hotWSFU
rowColdWSFU       = qty × fixture.coldWSFU
rowCombinedWSFU   = qty × fixture.combinedWSFU
```

### 7.2 Grand Totals
```
totalDFU          = Σ rowDFU  (all fixtures)
totalHotWSFU      = Σ rowHotWSFU
totalColdWSFU     = Σ rowColdWSFU
totalCombinedWSFU = Σ rowCombinedWSFU
```

### 7.3 System Type
```
hasFlushValve = any fixture where isFlushValve=true has qty > 0
systemType = hasFlushValve ? "FLUSH_VALVE" : "FLUSH_TANK"
```

### 7.4 Hunter's Curve GPM Conversion
Piecewise 6th-degree polynomial: `GPM = b + c1·x + c2·x² + c3·x³ + c4·x⁴ + c5·x⁵ + c6·x⁶`

**Flush Tank coefficients:**

| Range | b | c1 | c2 | c3 | c4 | c5 | c6 |
|---|---|---|---|---|---|---|---|
| x < 30 | 1.1755 | 1.9558 | -0.0527 | -0.002761 | 2.430e-4 | -6.209e-6 | 5.420e-8 |
| 25 ≤ x < 250 | 17.406 | 0.0665 | 0.00610 | -7.235e-5 | 4.053e-7 | -1.118e-9 | 1.223e-12 |
| 250 ≤ x < 1000 | 63.131 | -0.3152 | 2.743e-3 | -7.334e-6 | 1.042e-8 | -7.533e-12 | 2.169e-15 |
| 1000 ≤ x < 9000 | `(0.8759882 + 1.259865·t - 0.02582505·t² + 0.0008687869·t³ - 0.0000101455·t⁴) × 100` where `t = x/1000` |
| x ≥ 9000 | `0.095·x + 205` |

**Flush Valve coefficients:**

| Range | b | c1 | c2 | c3 | c4 | c5 | c6 |
|---|---|---|---|---|---|---|---|
| x < 30 | 5.562 | -0.842 | 0.9953 | -0.1198 | 6.383e-3 | -1.612e-4 | 1.573e-6 |
| 25 ≤ x < 250 | 27.351 | 0.4734 | 2.303e-4 | -1.387e-5 | 3.329e-8 | 1.425e-10 | -4.580e-13 |
| x ≥ 250 | Same as Flush Tank formulas above |

Note: Hot water always uses the Flush Tank curve. Cold/Combined use the curve matching `systemType`.

### 7.5 Pipe Sizing

**Sanitary Building Drain** (from `totalDFU`):
| DFU | Pipe Size |
|---|---|
| < 180 | 4" |
| < 390 | 5" |
| < 700 | 6" |
| < 1600 | 8" |
| ≥ 1600 | >8" |

**Combined Drain** (from `totalCombinedWSFU` DFU values):
| DFU | Pipe Size |
|---|---|
| < 5.1 | 1" |
| < 13 | 1¼" |
| < 31 | 1½" |
| < 128 | 2" |
| < 686 | 3" |
| < 1668 | 4" |
| < 3150 | 6" |
| ≥ 3150 | >6" |

**Water Service (Type K Cu @ 8 fps and Type L Cu @ 5 fps):** GPM-threshold lookup tables derived from the Excel IF-chain formulas in the pipe sizing output rows. Extract during implementation from `sheet3.xml` cells F78 and F80.

> ⚠️ 2½" pipe must never appear in any water service sizing output per IPC requirements.

---

## 8. Fixture Data Reference

All 46 fixtures with DFU and WSFU values as defined in the IPC v1.11 workbook. Key fixtures:

| Fixture | DFU | Hot WSFU | Cold WSFU | Flush Valve? |
|---|---|---|---|---|
| Bathroom Group (1.6 GPF Flush Tank) | 5.0 | 1.5 | 2.7 | No |
| Bathroom Group (3.5 GPF Flush Tank) | 6.0 | 3.0 | 6.0 | No |
| Private Water Closet (1.6 GPF Flush Tank) | 3.0 | — | 2.2 | No |
| Public Water Closet (1.6 GPF Flush Tank) | 4.0 | — | 2.2 | No |
| Private Water Closet (1.6 GPF Flush Valve) | 4.0 | — | 10.0 | Yes |
| Public Water Closet (1.6 GPF Flush Valve) | 6.0 | — | 10.0 | Yes |
| Private WC (1.6 GPF Flushometer Tank) | 3.0 | — | 2.2 | No |
| Urinal (1.0 GPF) | 2.0 | — | 5.0 | Yes |
| Urinal (0.125 GPF pint) | 0.5 | — | * | Yes |
| Urinal (Waterless) | 0.5 | — | 0 | No |
| Private Lavatory | 1.0 | 0.5 | 0.5 | No |
| Public Lavatory | 1.0 | 1.5 | 1.5 | No |
| Bathtub (Private) | 2.0 | 1.0 | 1.0 | No |
| Bidet | 1.0 | 1.5 | 1.5 | No |
| Shower (Private, one head) | 2.0 | 1.5 | 1.5 | No |
| Shower (Public, each head) | 2.0 | 3.0 | 3.0 | No |
| Floor Drain | 2.0 | — | — | No |
| Drinking Fountain | 0.5 | — | 0.25 | No |
| Dishwasher (Residential) | 2.0 | 1.4 | — | No |
| Dishwasher (Restaurant) | 3.0 | 6.0 | — | No |
| Private Clothes Washer | 2.0 | 1.0 | 1.0 | No |
| Public Clothes Washer | 3.0 | 3.0 | 3.0 | No |
| Commercial Washer Extractor | 6.0 | 7.5 | 7.5 | No |
| Sink (Private — bar, kitchen) | 1.0 | 1.0 | 1.0 | No |
| Sink (Public — kitchen or breakroom) | 2.0 | 1.5 | 1.5 | No |
| Service Sink (Mop Basin) | 3.0 | — | 3.0 | No |
| Clinical Service Sink | 3.0 | — | 3.0 | No |
| Private Laundry Tub | 2.0 | 1.0 | 1.0 | No |
| Sink (Flushing Rim) | 3.0 | — | 3.0 | No |
| Sink (Wash Fountain, per head) | 2.0 | 1.5 | 1.5 | No |
| Wall Hydrant | 1.0 | — | 2.5 | No |
| Wall Hydrant (Non-Freeze) | 1.0 | — | 2.5 | No |

*Pint urinal WSFU values are Henderson estimates; note required.

Full kitchen equipment fixture list to be sourced from `xl/sharedStrings.xml` during implementation (ice machine, coffee maker, tea maker, cappuccino machine, hot food table, dipper well, kettle, pre-scrapper, carbonator, disposers, etc.).

---

## 9. UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  IPC Plumbing Fixture Calculator                2006–18 IPC  │
├──────────────────────────────────────────────────────────────┤
│  Project: ______  Location: ______  Client: ______           │
│  Job #: ______    Date: ______      Calc By: ______          │
├──────────────────────────────────────────────────────────────┤
│  [Show active only ☐]                                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ BATHROOM GROUPS              ▾                          │ │
│  │ Fixture Type     | Qty | DFU | Hot | Cold | Comb | ... │ │
│  │ BG 1.6 FT        | [ ] | 5.0 | 1.5 | 2.7  | 3.6  | 0  │ │
│  └─────────────────────────────────────────────────────────┘ │
│  (more category groups...)                                   │
├──────────────────────────────────────────────────────────────┤
│  RESULTS                                                     │
│  Total DFU: 0  |  Hot WSFU: 0  |  Cold WSFU: 0             │
│  System Type: [FLUSH TANK]   Combined GPM: 0                │
│                                                              │
│  Pipe Sizing:                                                │
│  ┌─────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ Sanitary Drain  │ │ Type K @ 8fps FV │ │ Type L @ 5fps│ │
│  │      4"         │ │       2"         │ │      2"      │ │
│  └─────────────────┘ └──────────────────┘ └──────────────┘ │
│                                                              │
│  ⚠ Do not use 2½" water service pipe.                       │
├──────────────────────────────────────────────────────────────┤
│  [Export JSON]  [Export CSV]                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. Verification Checklist

- [ ] App loads with no console errors
- [ ] Enter qty=10 for "Private Water Closet (1.6 GPF Flush Tank)" → Total DFU = 30, System Type = FLUSH TANK
- [ ] Add qty=1 for "Public Water Closet (1.6 GPF Flush Valve)" → System Type switches to FLUSH VALVE
- [ ] GPM outputs cross-checked against Excel workbook for a known fixture set
- [ ] Export JSON → valid JSON with correct structure
- [ ] Export CSV → opens correctly in Excel with project header + fixture rows + totals
- [ ] Page refresh → all inputs cleared
- [ ] "Show active only" toggle hides zero-quantity fixture rows
- [ ] Pint urinal warning appears when qty > 0
- [ ] 2½" never appears as a pipe size output
