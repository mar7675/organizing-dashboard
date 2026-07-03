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
- A page-level CSP (`connect-src 'none'`) structurally blocks any network egress
  from page code — imported data cannot be sent anywhere, verified by test.
- A "Clear data from this device" button wipes the imported data, its metadata,
  and any jot draft; the originals stay in the owner's OneDrive.
- Error logging is scrubbed: console output names the failure point and error
  type only, never exception content.

## Files

- `index.html` — the whole app (inline CSS/JS, no dependencies).
- `manifest.webmanifest` — standalone display + icons for Add to Home Screen.
- `sw.js` — offline cache (stale-while-revalidate): the shell opens instantly with
  no signal, and a pushed code update arrives by the second launch after it lands.
- `icon-180/192/512.png` — WTU shield on the brand maroon (180 is the iOS
  home-screen icon; re-add to Home Screen to pick up an icon change).

Everything here is generated/synced from the owner's private workspace by
`dashboard/build-dashboard.ps1` — edit there, not here.
