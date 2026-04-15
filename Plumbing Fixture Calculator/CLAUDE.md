# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Contents

This repository contains a single Excel macro-enabled workbook:

**`0000000000 CALC-FIXTURE TOTAL 2006 - 18 IPC (v1.11).xlsm`**

A plumbing fixture unit calculator based on the International Plumbing Code (IPC), covering 2006–2018 editions. Current version: v1.11 (last updated 2024-08-08). Originally authored by Warren Rosenbrook at Henderson Engineering Inc. (HEI).

## Workbook Structure

The file is an `.xlsm` (Excel macro-enabled workbook) containing 5 sheets, color-coded by tab:

| Sheet | Tab Color | Purpose |
|---|---|---|
| `Version` | — | Version/revision history |
| `How-To Guide` | Orange | Usage instructions (print-ready) |
| `IPC` | Green | Main calculation sheet |
| `HUNTERDATA (FT)` | Black | Hunter's Curve reference data — flush tanks |
| `HUNTERDATA (FV)` | Black | Hunter's Curve reference data — flush valves |

## Calculator Overview

The `IPC` sheet calculates:
- **Drainage Fixture Units (DFU)** — for sanitary building drain sizing
- **Water Supply Fixture Units (WSFU)** — both hot and cold, for water service line sizing
- **Fixture unit → GPM conversion** via Hunter's Curve interpolation (from `HUNTERDATA` sheets)
- Minimum pipe size recommendations for sanitary drains and Type K/L copper water service

Fixtures covered include private/public water closets (flush tank and flush valve), lavatories, bathtubs, showers, sinks, urinals, dishwashers, floor drains, clothes washers, drinking fountains, and specialty kitchen equipment.

## Cell Color Codes

| Color | Meaning |
|---|---|
| Blue | Input — user must provide values |
| Light Orange | Optional input / override |
| Clear | Calculated output — do not edit |
| Grey | Inactive (not applicable given current inputs) |
| Red | Critical warning — output unreliable until resolved |

## Important Constraints

- **Do not insert or delete rows/columns.** Use the pre-provided hidden rows (unhide/hide as needed).
- The sheet is protected by default to prevent accidental formula edits. Unprotect via Excel ribbon → Review → Unprotect Sheet.
- Contains VBA macros (`xl/vbaProject.bin`) for formatting and copy/clip operations — requires a macro-enabled Excel environment to run.
- The workbook's absolute path is set to a SharePoint location (`hendersoneng.sharepoint.com`) — this is cosmetic metadata and does not affect local use.

## Working With This File Programmatically

The `.xlsm` is a ZIP archive. To inspect without Excel:

```bash
# List contents
unzip -l "0000000000 CALC-FIXTURE TOTAL 2006 - 18 IPC (v1.11).xlsm"

# Extract and read a specific sheet
unzip -p "0000000000 CALC-FIXTURE TOTAL 2006 - 18 IPC (v1.11).xlsm" xl/worksheets/sheet3.xml
```

Sheet XML mapping (from `xl/workbook.xml`):
- `sheet1.xml` → Version
- `sheet2.xml` → How-To Guide
- `sheet3.xml` → IPC (main calc)
- `sheet4.xml` → HUNTERDATA (FT)
- `sheet5.xml` → HUNTERDATA (FV)

To parse with Python: use `openpyxl` (note: `openpyxl` does not execute VBA macros).
