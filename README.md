# Organizing Dashboard — data-free shell (PWA)

The phone app for a WTU organizer's working dashboard: grievance-deadline
countdowns, school coverage, visit staleness, and a school-day calculator.

**This repo hosts code only. No member data, case data, or school-page
content is ever committed or served here.** The app is an empty shell until
its owner imports `dashboard-data.json` (kept in their own OneDrive) on the
device — via the iOS Files picker or clipboard paste, both proven by the
import spike this page replaced. Imported data lives in `localStorage` on
the device and nowhere else.

## How it fits together (plan v4, "one template, two outputs")

- `index.html` here **is** the single source of truth for all dashboard code
  (engine, renderers, self-test, import UI). It ships with an empty
  `DASHBOARD-DATA` marker block.
- The owner's private workspace generates the **desktop** dashboard from this
  same template by injecting `window.__DATA__` between the markers
  (`dashboard/build-dashboard.ps1` there). One codebase, two outputs — the
  code never forks.
- The **phone** gets this hosted shell via GitHub Pages + Add to Home Screen,
  and loads data by import instead of injection.

## Guard rails

- On-load engine self-test (11 assertions over the CBA school-day counting
  rules) shows a header pill: `deadline math ✓` or a loud red failure.
- The public DCPS duty calendar (`CALDATA`) is built into the shell so
  deadline math and the self-test run before any import; an imported file's
  `calendar` key overrides it.
- Imports validate `schemaVersion` (currently 1) and required fields before
  anything is stored.
- A stale-snapshot pill flags data older than 3 school days / 7 calendar days.

## Files

- `index.html` — the whole app (inline CSS/JS, no dependencies).
- `manifest.webmanifest` — standalone display for Add to Home Screen.
