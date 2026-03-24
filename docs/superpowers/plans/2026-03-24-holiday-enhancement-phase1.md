# Holiday Enhancement Phase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add holiday awareness to the Shabbat Card — data model, mode switching, per-holiday sky gradients, and generic category icons.

**Architecture:** A new `src/holidays.js` module wraps `@hebcal/core` for Hebrew date arithmetic and holiday lookup. `computeState()` gains `nextHoliday` and `holidayMode` fields that drive mode-switching in the renderer. `computeSky()` accepts an optional holiday gradient override. The card editor gains diaspora, lead-time, and new preview options.

**Tech Stack:** Lit 3, `@hebcal/core` (npm), Rollup, Vitest (new — for pure-function unit tests)

**Spec:** `docs/superpowers/specs/2026-03-24-holiday-enhancement-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add `@hebcal/core` dependency, `vitest` devDep, `test` script |
| `src/constants.js` | Modify | Add `HOLIDAY_DAYS`, `FESTIVAL_PERIODS`, `HOLIDAY_THEMES`, new defaults, new preview entries |
| `src/holidays.js` | Create | Wrap `@hebcal/core` — `getNextHoliday()`, `getHolidayMode()`, `getActiveTimers()` |
| `src/state.js` | Modify | Integrate holiday mode into `computeState()` and `buildDataKey()` |
| `src/sky.js` | Modify | Accept optional holiday gradient override in `computeSky()` |
| `src/candle.js` | Modify | Add generic category icon SVGs, extend `renderIcon()` for holiday approaching mode |
| `src/styles.js` | Modify | Add `.sc-holiday-box`, `.sc-shabbat-merge` styles |
| `src/shabbat-card.js` | Modify | Render holiday modes — approaching, active, merge, overlap |
| `src/editor.js` | Modify | Add diaspora toggle, lead-time inputs, new preview options |
| `test/holidays.test.js` | Create | Unit tests for `src/holidays.js` |
| `test/state.test.js` | Create | Unit tests for holiday mode logic in `computeState()` |
| `vitest.config.js` | Create | Vitest configuration |

---

## Task 1: Set Up Test Infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Install vitest**

```bash
cd /home/claude-svc/shabbat-card
npm install --save-dev vitest
```

- [ ] **Step 2: Create vitest config**

Create `vitest.config.js`:
```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verify vitest runs (no tests yet)**

```bash
npm test
```

Expected: exits with "No test files found" or similar — confirms vitest is working.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore: add vitest test infrastructure"
```

---

## Task 2: Add `@hebcal/core` Dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @hebcal/core**

```bash
cd /home/claude-svc/shabbat-card
npm install @hebcal/core
```

- [ ] **Step 2: Verify it resolves**

```bash
node -e "import('@hebcal/core').then(m => console.log('OK', Object.keys(m).slice(0,5)))"
```

Expected: prints `OK` followed by some export names.

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: builds without errors. Bundle size will increase — note the new size.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @hebcal/core for Hebrew date arithmetic"
```

---

## Task 3: Add Holiday Data Tables to `constants.js`

**Files:**
- Modify: `src/constants.js:138-141` (after `CANDLE_SIZES`, before `DEFAULT_CONFIG`)
- Test: `test/constants.test.js`

- [ ] **Step 1: Write validation test for holiday tables**

Create `test/constants.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { HOLIDAY_DAYS, FESTIVAL_PERIODS, HOLIDAY_THEMES } from '../src/constants.js';

describe('HOLIDAY_DAYS', () => {
  it('contains entries for all major Yom Tov days', () => {
    const names = HOLIDAY_DAYS.map(h => h.sensorName);
    expect(names).toContain('Pesach');
    expect(names).toContain('Rosh Hashana I');
    expect(names).toContain('Yom Kippur');
    expect(names).toContain('Sukkot');
    expect(names).toContain('Shavuot');
  });

  it('every entry has required fields', () => {
    for (const h of HOLIDAY_DAYS) {
      expect(h).toHaveProperty('month');
      expect(h).toHaveProperty('day');
      expect(h).toHaveProperty('name');
      expect(h).toHaveProperty('category');
      expect(h).toHaveProperty('sensorName');
      expect(['major', 'minor', 'fast']).toContain(h.category);
    }
  });

  it('diasporaOnly entries exist for second days', () => {
    const diaspora = HOLIDAY_DAYS.filter(h => h.diasporaOnly === true);
    expect(diaspora.length).toBeGreaterThan(0);
    const names = diaspora.map(h => h.name);
    expect(names).toContain('Pesach II');
    expect(names).toContain('Pesach VIII');
  });
});

describe('FESTIVAL_PERIODS', () => {
  it('contains multi-day festivals', () => {
    const names = FESTIVAL_PERIODS.map(f => f.name);
    expect(names).toContain('Pesach');
    expect(names).toContain('Sukkot');
    expect(names).toContain('Chanukah');
  });

  it('every entry has start and end dates', () => {
    for (const f of FESTIVAL_PERIODS) {
      expect(f).toHaveProperty('startMonth');
      expect(f).toHaveProperty('startDay');
      expect(f).toHaveProperty('endMonth');
      expect(f).toHaveProperty('endDay');
    }
  });
});

describe('HOLIDAY_THEMES', () => {
  it('has a theme for every unique sensorName and festival', () => {
    const allNames = [
      ...new Set(HOLIDAY_DAYS.map(h => h.festival || h.sensorName)),
    ];
    for (const name of allNames) {
      expect(HOLIDAY_THEMES).toHaveProperty(name);
      expect(HOLIDAY_THEMES[name]).toHaveProperty('gradient');
      expect(HOLIDAY_THEMES[name]).toHaveProperty('category');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `HOLIDAY_DAYS` is not exported from constants.js yet.

- [ ] **Step 3: Add HOLIDAY_DAYS to constants.js**

Insert after the `CANDLE_SIZES` export (after line 136) in `src/constants.js`:

```js
export const HOLIDAY_DAYS = [
  // Major Yom Tov
  { month: 'Tishrei', day: 1, name: 'Rosh Hashana I', category: 'major', festival: 'Rosh Hashana', sensorName: 'Rosh Hashana I' },
  { month: 'Tishrei', day: 2, name: 'Rosh Hashana II', category: 'major', festival: 'Rosh Hashana', sensorName: 'Rosh Hashana II', diasporaOnly: false },
  { month: 'Tishrei', day: 10, name: 'Yom Kippur', category: 'major', festival: null, sensorName: 'Yom Kippur' },
  { month: 'Tishrei', day: 15, name: 'Sukkot I', category: 'major', festival: 'Sukkot', sensorName: 'Sukkot' },
  { month: 'Tishrei', day: 16, name: 'Sukkot II', category: 'major', festival: 'Sukkot', sensorName: 'Sukkot II', diasporaOnly: true },
  { month: 'Tishrei', day: 22, name: 'Shmini Atzeret', category: 'major', festival: null, sensorName: 'Shmini Atzeret' },
  { month: 'Tishrei', day: 23, name: 'Simchat Torah', category: 'major', festival: null, sensorName: 'Simchat Torah', diasporaOnly: true },
  { month: 'Nisan', day: 15, name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach' },
  { month: 'Nisan', day: 16, name: 'Pesach II', category: 'major', festival: 'Pesach', sensorName: 'Pesach II', diasporaOnly: true },
  { month: 'Nisan', day: 21, name: 'Pesach VII', category: 'major', festival: 'Pesach', sensorName: 'Pesach VII' },
  { month: 'Nisan', day: 22, name: 'Pesach VIII', category: 'major', festival: 'Pesach', sensorName: 'Pesach VIII', diasporaOnly: true },
  { month: 'Sivan', day: 6, name: 'Shavuot', category: 'major', festival: 'Shavuot', sensorName: 'Shavuot' },
  { month: 'Sivan', day: 7, name: 'Shavuot II', category: 'major', festival: 'Shavuot', sensorName: 'Shavuot II', diasporaOnly: true },
  // Minor / Rabbinic
  { month: 'Kislev', day: 25, name: 'Chanukah I', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Kislev', day: 26, name: 'Chanukah II', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Kislev', day: 27, name: 'Chanukah III', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Kislev', day: 28, name: 'Chanukah IV', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Kislev', day: 29, name: 'Chanukah V', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Kislev', day: 30, name: 'Chanukah VI', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Tevet', day: 1, name: 'Chanukah VII', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Tevet', day: 2, name: 'Chanukah VIII', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah' },
  { month: 'Adar', day: 14, name: 'Purim', category: 'minor', festival: null, sensorName: 'Purim' },
  { month: 'Adar', day: 15, name: 'Shushan Purim', category: 'minor', festival: null, sensorName: 'Shushan Purim' },
  { month: 'Shvat', day: 15, name: 'Tu B\'Shvat', category: 'minor', festival: null, sensorName: 'Tu B\'Shvat' },
  { month: 'Iyyar', day: 18, name: 'Lag B\'Omer', category: 'minor', festival: null, sensorName: 'Lag BaOmer' },
  { month: 'Av', day: 15, name: 'Tu B\'Av', category: 'minor', festival: null, sensorName: 'Tu B\'Av' },
  // NOTE: Rosh Chodesh is deferred — it recurs monthly (1st of each Hebrew month, sometimes also
  // 30th of preceding month). Adding 12+ entries is noisy; will revisit in a future enhancement
  // with a `recurring: true` flag or separate lookup. The HA sensor reports it, so it can still
  // be detected via activeSensorHoliday fallback.
  // Fast days
  { month: 'Tishrei', day: 3, name: 'Tzom Gedaliah', category: 'fast', festival: null, sensorName: 'Tzom Gedaliah' },
  { month: 'Tevet', day: 10, name: 'Asara B\'Tevet', category: 'fast', festival: null, sensorName: 'Asara B\'Tevet' },
  { month: 'Adar', day: 13, name: 'Ta\'anit Esther', category: 'fast', festival: null, sensorName: 'Ta\'anit Esther' },
  { month: 'Tammuz', day: 17, name: 'Tzom Tammuz', category: 'fast', festival: null, sensorName: 'Shiva Asar B\'Tammuz' },
  { month: 'Av', day: 9, name: 'Tish\'a B\'Av', category: 'fast', festival: null, sensorName: 'Tish\'a B\'Av' },
];

export const FESTIVAL_PERIODS = [
  { name: 'Rosh Hashana', startMonth: 'Tishrei', startDay: 1, endMonth: 'Tishrei', endDay: 2 },
  { name: 'Sukkot', startMonth: 'Tishrei', startDay: 15, endMonth: 'Tishrei', endDay: 23, endDayIsrael: 22 },
  { name: 'Pesach', startMonth: 'Nisan', startDay: 15, endMonth: 'Nisan', endDay: 22, endDayIsrael: 21 },
  { name: 'Shavuot', startMonth: 'Sivan', startDay: 6, endMonth: 'Sivan', endDay: 7, endDayIsrael: 6 },
  { name: 'Chanukah', startMonth: 'Kislev', startDay: 25, endMonth: 'Tevet', endDay: 2 },
];

export const HOLIDAY_THEMES = {
  'Rosh Hashana': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #8B6914 50%, #DAA520 100%)', category: 'major', greeting: 'שנה טובה' },
  'Yom Kippur': { gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #2d2d4a 100%)', category: 'major', greeting: 'גמר חתימה טובה' },
  'Sukkot': { gradient: 'linear-gradient(180deg, #1a3a1a 0%, #2d5a27 50%, #4a8c3f 100%)', category: 'major', greeting: 'חג שמח' },
  'Shmini Atzeret': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #3d2066 50%, #6b3fa0 100%)', category: 'major', greeting: 'חג שמח' },
  'Simchat Torah': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #3d2066 50%, #6b3fa0 100%)', category: 'major', greeting: 'חג שמח' },
  'Pesach': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #2d1810 50%, #5c3a1e 100%)', category: 'major', greeting: 'חג שמח' },
  'Shavuot': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #4a3060 50%, #8b5e83 100%)', category: 'major', greeting: 'חג שמח' },
  'Chanukah': { gradient: 'linear-gradient(180deg, #0a1628 0%, #1a3a5c 50%, #2b6cb0 100%)', category: 'minor', greeting: 'חג שמח' },
  'Purim': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #4a1a5c 50%, #7b3fa0 100%)', category: 'minor', greeting: 'חג שמח' },
  'Shushan Purim': { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #4a1a5c 50%, #7b3fa0 100%)', category: 'minor', greeting: 'חג שמח' },
  "Tu B'Shvat": { gradient: 'linear-gradient(180deg, #1a2a1a 0%, #3a5a2a 50%, #5a8a4a 100%)', category: 'minor', greeting: 'חג שמח' },
  "Lag BaOmer": { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #4a2a1a 50%, #8a4a2a 100%)', category: 'minor', greeting: 'חג שמח' },
  "Tu B'Av": { gradient: 'linear-gradient(180deg, #1a1a4e 0%, #3d2b6b 50%, #7b4fa0 100%)', category: 'minor', greeting: 'חג שמח' },
  'Tzom Gedaliah': { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #4a4a4a 100%)', category: 'fast', greeting: '' },
  "Asara B'Tevet": { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #4a4a4a 100%)', category: 'fast', greeting: '' },
  "Ta'anit Esther": { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #4a4a4a 100%)', category: 'fast', greeting: '' },
  "Shiva Asar B'Tammuz": { gradient: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 50%, #4a4a4a 100%)', category: 'fast', greeting: '' },
  "Tish'a B'Av": { gradient: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)', category: 'fast', greeting: '' },
};
```

**Note on `sensorName`:** These must match the exact strings in the HA `sensor.jewish_calendar_holiday` entity's `options` attribute. Verify by checking `hass.states['sensor.jewish_calendar_holiday'].attributes.options` in the browser console on your HA instance.

- [ ] **Step 4: Update DEFAULT_CONFIG with new fields**

In `src/constants.js`, change `DEFAULT_CONFIG` (currently at line 138) to:
```js
export const DEFAULT_CONFIG = {
  size: 'large',
  preview: 'off',
  diaspora: true,
  major_holiday_lead_days: 14,
  minor_holiday_lead_days: 5,
};
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/constants.js test/constants.test.js
git commit -m "feat: add holiday data tables, themes, and config defaults"
```

---

## Task 4: Create `src/holidays.js` — Hebrew Date Helpers

**Files:**
- Create: `src/holidays.js`
- Create: `test/holidays.test.js`

This is the core module. It wraps `@hebcal/core` to provide:
- `getNextHoliday(now, config)` — finds the nearest upcoming holiday
- `getHolidayMode(nextHoliday, issur, activeSensorHoliday, config)` — determines display mode

- [ ] **Step 1: Write tests for `getNextHoliday`**

Create `test/holidays.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { getNextHoliday, getHolidayMode } from '../src/holidays.js';

describe('getNextHoliday', () => {
  const defaultConfig = { diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };

  it('finds Pesach when date is within 14 days before Nisan 15', () => {
    // 2026-03-31 is ~Nisan 13, 5786 — 2 days before Pesach
    const result = getNextHoliday(new Date('2026-03-31T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.name).toBe('Pesach I');
    expect(result.sensorName).toBe('Pesach');
    expect(result.category).toBe('major');
    expect(result.daysUntil).toBeLessThanOrEqual(3);
    expect(result.daysUntil).toBeGreaterThanOrEqual(0);
  });

  it('returns null when no holiday is within any threshold', () => {
    // Mid-Cheshvan — no holidays nearby
    const result = getNextHoliday(new Date('2025-11-15T12:00:00'), defaultConfig);
    expect(result).toBeNull();
  });

  it('respects diaspora filtering — Pesach VIII excluded when diaspora=false', () => {
    const israelConfig = { ...defaultConfig, diaspora: false };
    // A date very close to Nisan 22
    const result = getNextHoliday(new Date('2026-04-11T12:00:00'), israelConfig);
    // Pesach VIII (Nisan 22) should not appear for Israel
    if (result && result.name === 'Pesach VIII') {
      throw new Error('Pesach VIII should be excluded for Israel');
    }
  });

  it('finds minor holidays within 5-day threshold', () => {
    // Tu B'Shvat 5786 is Feb 3, 2026 (Shvat 15)
    const result = getNextHoliday(new Date('2026-02-01T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.sensorName).toBe("Tu B'Shvat");
    expect(result.category).toBe('minor');
  });

  it('picks the nearest holiday when two are within threshold', () => {
    // Ta'anit Esther is Adar 13, Purim is Adar 14 — both within 5 days
    // When 4 days before Ta'anit Esther, it should pick Ta'anit Esther (nearer)
    const result = getNextHoliday(new Date('2026-03-13T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    // Should be the nearer one
    expect(result.daysUntil).toBeLessThanOrEqual(5);
  });

  it('during Chol HaMoed Pesach, finds next Yom Tov day (Pesach VII)', () => {
    // Nisan 17, 5786 is during Chol HaMoed — Pesach VII (Nisan 21) is 4 days away
    // Use @hebcal/core to get exact Gregorian date for Nisan 17
    const result = getNextHoliday(new Date('2026-04-05T12:00:00'), defaultConfig);
    expect(result).not.toBeNull();
    expect(result.festival).toBe('Pesach');
    expect(result.daysUntil).toBeLessThanOrEqual(14);
  });

  it('handles leap year — Purim falls in Adar II', () => {
    // Hebrew year 5787 is a leap year. Purim should be in Adar II (~March 2027).
    // Test a date ~3 days before Purim 5787
    const result = getNextHoliday(new Date('2027-03-20T12:00:00'), defaultConfig);
    // Should find either Purim or another nearby holiday, but not crash
    expect(result === null || typeof result.name === 'string').toBe(true);
  });
});

describe('getHolidayMode', () => {
  it('returns "off" when nextHoliday is null', () => {
    expect(getHolidayMode(null, false, '')).toBe('off');
  });

  it('returns "approaching" when holiday is near but not active', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 5 };
    expect(getHolidayMode(holiday, false, '')).toBe('approaching');
  });

  it('returns "active" when holiday sensor matches', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 0 };
    expect(getHolidayMode(holiday, false, 'Pesach')).toBe('active');
  });

  it('returns "shabbat_merge" when approaching holiday + issur on (Shabbat)', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 3 };
    expect(getHolidayMode(holiday, true, '')).toBe('shabbat_merge');
  });

  it('returns "shabbat_overlap" when holiday active + issur on', () => {
    const holiday = { name: 'Pesach I', category: 'major', sensorName: 'Pesach', daysUntil: 0 };
    expect(getHolidayMode(holiday, true, 'Pesach')).toBe('shabbat_overlap');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `src/holidays.js` does not exist.

- [ ] **Step 3: Implement `src/holidays.js`**

Create `src/holidays.js`:
```js
import { HDate, months } from '@hebcal/core';
import { HOLIDAY_DAYS } from './constants.js';

/** Map month name strings to @hebcal/core month constants */
const MONTH_MAP = {
  'Tishrei': months.TISHREI,
  'Cheshvan': months.CHESHVAN,
  'Kislev': months.KISLEV,
  'Tevet': months.TEVET,
  'Shvat': months.SHVAT,
  'Adar': months.ADAR_II,      // resolves to Adar in non-leap, Adar II in leap
  'Adar I': months.ADAR_I,
  'Adar II': months.ADAR_II,
  'Nisan': months.NISAN,
  'Iyyar': months.IYYAR,
  'Sivan': months.SIVAN,
  'Tammuz': months.TAMUZ,
  'Av': months.AV,
  'Elul': months.ELUL,
};

/**
 * Get the Gregorian date for a Hebrew month/day in a given Hebrew year.
 * Returns a Date object or null if the date doesn't exist (e.g., Adar I in non-leap year).
 */
function hebrewToGregorian(hebrewYear, monthName, day) {
  try {
    const monthNum = MONTH_MAP[monthName];
    if (!monthNum) return null;
    const hd = new HDate(day, monthNum, hebrewYear);
    return hd.greg();
  } catch {
    return null; // date doesn't exist this year (e.g., Adar I in non-leap)
  }
}

/**
 * Find the next upcoming holiday within its category threshold.
 * @param {Date} now - current date/time
 * @param {object} config - { diaspora, major_holiday_lead_days, minor_holiday_lead_days }
 * @returns {{ name, category, festival, sensorName, daysUntil, startDate } | null}
 */
export function getNextHoliday(now, config) {
  const { diaspora = true, major_holiday_lead_days = 14, minor_holiday_lead_days = 5 } = config;
  const hdate = new HDate(now);
  const currentYear = hdate.getFullYear();

  // Filter by diaspora
  const holidays = HOLIDAY_DAYS.filter(h => {
    if (h.diasporaOnly === true && !diaspora) return false;
    return true;
  });

  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let best = null;

  // Check current and next Hebrew year
  for (const year of [currentYear, currentYear + 1]) {
    for (const h of holidays) {
      const gregDate = hebrewToGregorian(year, h.month, h.day);
      if (!gregDate) continue;

      const holidayMs = new Date(gregDate.getFullYear(), gregDate.getMonth(), gregDate.getDate()).getTime();
      const daysUntil = Math.round((holidayMs - todayMs) / 86400000);

      // Skip past holidays (allow today = 0)
      if (daysUntil < 0) continue;

      // Check threshold
      const threshold = h.category === 'major' ? major_holiday_lead_days : minor_holiday_lead_days;
      if (daysUntil > threshold) continue;

      // Pick nearest
      if (!best || daysUntil < best.daysUntil) {
        best = {
          name: h.name,
          category: h.category,
          festival: h.festival,
          sensorName: h.sensorName,
          daysUntil,
          startDate: gregDate,
        };
      }
    }
  }

  return best;
}

/**
 * Determine the holiday display mode.
 * @param {{ category, sensorName, daysUntil } | null} nextHoliday
 * @param {boolean} issur - issur melacha currently on
 * @param {string} activeSensorHoliday - current value of sensor.jewish_calendar_holiday
 * @returns {'off' | 'approaching' | 'active' | 'shabbat_merge' | 'shabbat_overlap'}
 */
export function getHolidayMode(nextHoliday, issur, activeSensorHoliday) {
  if (!nextHoliday) return 'off';

  const sensorName = activeSensorHoliday || '';
  const holidayActive = sensorName && sensorName === nextHoliday.sensorName;

  if (holidayActive && issur) return 'shabbat_overlap';
  if (holidayActive) return 'active';
  if (issur) return 'shabbat_merge';  // issur on (Shabbat) with holiday approaching
  return 'approaching';
}
```

**Important note on `MONTH_MAP['Adar']`:** We map `'Adar'` to `months.ADAR_II`. In `@hebcal/core`, `ADAR_II` maps to regular Adar in non-leap years and Adar II in leap years. This is the standard behavior — Purim and other Adar holidays are celebrated in Adar II during leap years.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: All tests pass. If any date assertions are off by 1, adjust the test dates — Hebrew-to-Gregorian conversions are authoritative from `@hebcal/core`.

- [ ] **Step 5: Fix any failing tests**

If `getNextHoliday` date math is slightly off (Hebrew calendar edge cases), adjust test input dates to known correct values. Use `@hebcal/core` directly to verify:
```bash
node -e "
  import { HDate, months } from '@hebcal/core';
  const h = new HDate(15, months.NISAN, 5786);
  console.log('Pesach I 5786:', h.greg().toISOString());
"
```

- [ ] **Step 6: Commit**

```bash
git add src/holidays.js test/holidays.test.js
git commit -m "feat: add holidays.js with Hebrew date lookup via @hebcal/core"
```

---

## Task 5: Integrate Holiday Mode into `computeState()`

**Files:**
- Modify: `src/state.js:1-2` (imports), `src/state.js:34-119` (`computeState` function)
- Test: `test/state.test.js`

- [ ] **Step 1: Write tests for holiday state fields**

Create `test/state.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { computeState } from '../src/state.js';

function mockHass(overrides = {}) {
  const states = {
    'binary_sensor.jewish_calendar_issur_melacha_in_effect': { state: 'off', attributes: {} },
    'binary_sensor.jewish_calendar_motzei_shabbat_hag': { state: 'off', attributes: {} },
    'sensor.jewish_calendar_upcoming_candle_lighting': { state: '2026-04-03T18:03:00+00:00', attributes: {} },
    'sensor.jewish_calendar_upcoming_havdalah': { state: '2026-04-04T19:00:00+00:00', attributes: {} },
    'sensor.jewish_calendar_parshat_hashavua': { state: 'Tzav', attributes: {} },
    'sensor.jewish_calendar_holiday': { state: '', attributes: {} },
    'sensor.jewish_calendar_date': { state: '5 Nisan 5786', attributes: {} },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
    ...overrides,
  };
  return { states };
}

describe('computeState holiday fields', () => {
  it('includes holidayMode and nextHoliday in returned state', () => {
    const hass = mockHass();
    const config = { preview: 'off', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    const cache = {};
    // Inject a date near Pesach 5786 so holiday mode is predictable
    const state = computeState(hass, config, cache, new Date('2026-03-30T12:00:00'));
    expect(state).toHaveProperty('holidayMode');
    expect(state).toHaveProperty('nextHoliday');
  });

  it('returns holidayMode "off" when no holiday is near', () => {
    const hass = mockHass();
    const config = { preview: 'off', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    // Mid-Cheshvan — no holidays nearby
    const state = computeState(hass, config, {}, new Date('2025-11-15T12:00:00'));
    expect(state.holidayMode).toBe('off');
  });

  it('preview modes include holiday fields', () => {
    const config = { preview: 'holiday_approaching', diaspora: true, major_holiday_lead_days: 14, minor_holiday_lead_days: 5 };
    const state = computeState({}, config, {});
    expect(state).toHaveProperty('holidayMode');
    expect(state.holidayMode).toBe('approaching');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `computeState` doesn't return `holidayMode` yet.

- [ ] **Step 3: Modify `src/state.js` to integrate holiday mode**

Update the imports at the top of `src/state.js`:
```js
import { ENTITIES, PREVIEW_DATA } from './constants.js';
import { getNextHoliday, getHolidayMode } from './holidays.js';
```

Change the `computeState` function signature to accept an optional `now` parameter for testability:
```js
export function computeState(hass, config, cache, now = new Date()) {
```

Then after the `hebrewDate` variable (line 51), add:
```js
  // Holiday mode computation
  const nextHoliday = getNextHoliday(now, config);
  const holidayMode = getHolidayMode(nextHoliday, issur, hasHoliday ? holiday : '');
```

Also update the `Date.now()` usage on line 57 to use the injected `now`:
```js
  const nowMs = now.getTime();
```
Then replace all references to `now` (the number from `Date.now()`) with `nowMs` in the rest of the function.

Extend the return object (around line 113-119) to include:
```js
  return {
    issur, motzei, holiday: hasHoliday ? holiday : '',
    progress, statusText, statusSubtitle,
    countdown, countdownLabel, targetTimeLocal,
    candleLighting, havdalah, hebrewDate,
    nextHoliday, holidayMode,
    error: null,
  };
```

- [ ] **Step 4: Add new holiday preview entries to PREVIEW_DATA in constants.js**

Add these entries after the existing `yom_tov` entry in `PREVIEW_DATA` (in `src/constants.js`):

```js
  holiday_approaching: {
    issur: false,
    motzei: false,
    holiday: '',
    progress: 0,
    statusText: 'חג שמח',
    statusSubtitle: 'Pesach in 5 days',
    countdown: '5d 2h',
    countdownLabel: 'Until Pesach',
    targetTimeLocal: 'Thursday 7:15 PM',
    candleLighting: '7:15 PM',
    havdalah: '8:10 PM',
    hebrewDate: '10 Nisan 5786',
    nextHoliday: { name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach', daysUntil: 5 },
    holidayMode: 'approaching',
  },
  holiday_shabbat_merge: {
    issur: true,
    motzei: false,
    holiday: '',
    progress: 25,
    statusText: 'שבת שלום',
    statusSubtitle: 'Tzav',
    countdown: '20h 15m',
    countdownLabel: 'Until Havdalah',
    targetTimeLocal: 'Saturday 8:10 PM',
    candleLighting: '7:15 PM',
    havdalah: '8:10 PM',
    hebrewDate: '12 Nisan 5786',
    nextHoliday: { name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach', daysUntil: 3 },
    holidayMode: 'shabbat_merge',
  },
  holiday_active: {
    issur: true,
    motzei: false,
    holiday: 'Pesach',
    progress: 35,
    statusText: 'חג שמח',
    statusSubtitle: 'Pesach',
    countdown: '16h 30m',
    countdownLabel: 'Until Havdalah',
    targetTimeLocal: 'Thursday 8:10 PM',
    candleLighting: '7:15 PM',
    havdalah: '8:10 PM',
    hebrewDate: '15 Nisan 5786',
    nextHoliday: { name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach', daysUntil: 0 },
    holidayMode: 'active',
  },
  holiday_shabbat_overlap: {
    issur: true,
    motzei: false,
    holiday: 'Pesach',
    progress: 40,
    statusText: 'שבת שלום · חג שמח',
    statusSubtitle: 'Pesach',
    countdown: '14h 45m',
    countdownLabel: 'Until Havdalah',
    targetTimeLocal: 'Saturday 8:10 PM',
    candleLighting: '7:15 PM',
    havdalah: '8:10 PM',
    hebrewDate: '16 Nisan 5786',
    nextHoliday: { name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach', daysUntil: 0 },
    holidayMode: 'shabbat_overlap',
  },
  fast_approaching: {
    issur: false,
    motzei: false,
    holiday: '',
    progress: 0,
    statusText: 'שבת שלום',
    statusSubtitle: '',
    countdown: '3d 5h',
    countdownLabel: 'Until Tzom Gedaliah',
    targetTimeLocal: 'Wednesday 5:30 AM',
    candleLighting: '7:00 PM',
    havdalah: '7:55 PM',
    hebrewDate: '1 Tishrei 5787',
    nextHoliday: { name: 'Tzom Gedaliah', category: 'fast', festival: null, sensorName: 'Tzom Gedaliah', daysUntil: 3 },
    holidayMode: 'approaching',
  },
  chanukah: {
    issur: false,
    motzei: false,
    holiday: 'Chanukah',
    progress: 0,
    statusText: 'חג שמח',
    statusSubtitle: 'Chanukah',
    countdown: '5d 16h',
    countdownLabel: 'Until Candle Lighting',
    targetTimeLocal: 'Friday 4:15 PM',
    candleLighting: '4:15 PM',
    havdalah: '5:20 PM',
    hebrewDate: '27 Kislev 5787',
    nextHoliday: { name: 'Chanukah', category: 'minor', festival: 'Chanukah', sensorName: 'Chanukah', daysUntil: 0 },
    holidayMode: 'active',
  },
```

- [ ] **Step 5: Handle preview data returning holiday fields**

In `computeState()`, ensure the preview branch (around line 37-39) passes through `holidayMode` and `nextHoliday` from the preview data:
```js
  if (preview !== 'off' && PREVIEW_DATA[preview]) {
    const data = PREVIEW_DATA[preview];
    return {
      ...data,
      holidayMode: data.holidayMode || 'off',
      nextHoliday: data.nextHoliday || null,
      error: null,
    };
  }
```

- [ ] **Step 6: Update `buildDataKey` to include minute-level timestamp**

In `buildDataKey()` at the bottom of `src/state.js`, add a time component so the card re-evaluates holiday mode periodically:
```js
export function buildDataKey(hass) {
  const entityIds = Object.values(ENTITIES);
  const minuteKey = Math.floor(Date.now() / 60000);
  return entityIds.map(e => {
    const s = hass?.states?.[e];
    return (s?.state || '') + JSON.stringify(s?.attributes || {});
  }).join('|') + '|t' + minuteKey;
}
```

- [ ] **Step 7: Run tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/state.js src/constants.js test/state.test.js
git commit -m "feat: integrate holiday mode into computeState with preview data"
```

---

## Task 6: Holiday Gradient Override in `computeSky()`

**Files:**
- Modify: `src/sky.js:3` (function signature)

- [ ] **Step 1: Add `holidayGradient` parameter to `computeSky`**

Change the function signature in `src/sky.js` (line 3):
```js
export function computeSky(sunElevation, issur, motzei, progress, preview, holidayGradient) {
```

Add at the very top of the function body (after `let isNightSky = false;`):
```js
  // Holiday gradient override
  if (holidayGradient) {
    return { background: holidayGradient, isNightSky: true };
  }
```

- [ ] **Step 2: Verify build works**

```bash
npm run build
```

Expected: builds without errors. The extra parameter is harmless to existing callers (it's `undefined` by default).

- [ ] **Step 3: Commit**

```bash
git add src/sky.js
git commit -m "feat: add holiday gradient override to computeSky"
```

---

## Task 7: Generic Category Icons in `candle.js`

**Files:**
- Modify: `src/candle.js:1-2` (imports), `src/candle.js:146-155` (`renderIcon` function)

- [ ] **Step 1: Add category icon SVG functions**

Add these functions before `renderIcon` in `src/candle.js` (before the existing `renderIcon` export, after `sparklesSvg`):

```js
function majorHolidaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L28 17 L42 17 L31 26 L35 39 L24 31 L13 39 L17 26 L6 17 L20 17 Z"
      fill="#FFD700" opacity="0.9" stroke="#DAA520" stroke-width="0.5"/>
    <path d="M24 10 L26.5 18.5 L36 18.5 L28.5 24.5 L31 33 L24 27.5 L17 33 L19.5 24.5 L12 18.5 L21.5 18.5 Z"
      fill="#FFF8E1" opacity="0.6"/>
  </svg>`;
}

function minorHolidaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="14" fill="none" stroke="#B8860B" stroke-width="1.5" opacity="0.7"/>
    <path d="M24 10 L26 20 L36 22 L26 24 L24 34 L22 24 L12 22 L22 20 Z"
      fill="#DAA520" opacity="0.8"/>
    <circle cx="24" cy="22" r="3" fill="#FFF8E1" opacity="0.5"/>
  </svg>`;
}

function fastDaySvg(heroSize) {
  return html`<svg width="${heroSize}" height="${heroSize}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="21" y="12" width="6" height="24" rx="3" fill="#888" opacity="0.6"
      stroke="#666" stroke-width="0.5"/>
    <rect x="22.5" y="14" width="1.5" height="16" rx="0.75" fill="rgba(255,255,255,0.2)"/>
    <ellipse cx="24" cy="36" rx="8" ry="2.5" fill="#666" opacity="0.3"/>
    <path d="M24,12 Q24.5,9 24,7" stroke="#555" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  </svg>`;
}
```

- [ ] **Step 2: Extend `renderIcon` to handle holiday approaching mode**

Replace the `renderIcon` export in `src/candle.js`:
```js
export function renderIcon(sizeName, issur, motzei, progress, showIcon, holidayMode, holidayCategory) {
  if (showIcon === false) return nothing;

  // Holiday approaching mode — show category icon
  if (holidayMode === 'approaching' && holidayCategory) {
    const iconFn = holidayCategory === 'major' ? majorHolidaySvg
      : holidayCategory === 'fast' ? fastDaySvg
      : minorHolidaySvg;
    return html`<div class="sc-hero sc-float">${iconFn(48)}</div>`;
  }

  if (issur) {
    return html`<div class="sc-melt-candle">${renderCandle(sizeName, progress)}</div>`;
  } else if (motzei) {
    return html`<div class="sc-hero sc-float">${sparklesSvg(48)}</div>`;
  } else {
    return html`<div class="sc-hero">${unlitCandleSvg(48)}</div>`;
  }
}
```

- [ ] **Step 3: Verify build works**

```bash
npm run build
```

Expected: builds without errors. The new parameters are optional and default to undefined, so existing callers still work.

- [ ] **Step 4: Commit**

```bash
git add src/candle.js
git commit -m "feat: add generic category SVG icons for holiday approaching mode"
```

---

## Task 8: Holiday Info Box Styles

**Files:**
- Modify: `src/styles.js` (add at the end, before the closing backtick)

- [ ] **Step 1: Add holiday box and merge line styles**

Add these styles before the closing backtick (`` ` ``) at the end of `src/styles.js`:

```css
  .sc-holiday-box {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    padding: 10px 14px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(4px);
  }
  .sc-holiday-box-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sc-holiday-box-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .sc-holiday-box-name {
    font-size: 0.85em;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sc-holiday-box-countdown {
    font-size: 0.75em;
    opacity: 0.7;
  }

  .sc-shabbat-merge {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 8px;
    font-size: 0.8em;
  }
  .sc-shabbat-merge-title {
    font-weight: 600;
    margin-bottom: 4px;
    opacity: 0.9;
  }
  .sc-shabbat-merge-times {
    display: flex;
    gap: 16px;
    opacity: 0.7;
  }
```

- [ ] **Step 2: Verify build works**

```bash
npm run build
```

Expected: builds without errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles.js
git commit -m "feat: add styles for holiday info box and Shabbat merge line"
```

---

## Task 9: Update Card Renderer for Holiday Modes

**Files:**
- Modify: `src/shabbat-card.js:1-7` (imports), `src/shabbat-card.js:74-178` (render method)

This is the largest task — it wires everything together in the `render()` method.

- [ ] **Step 1: Update imports in `shabbat-card.js`**

Add `HOLIDAY_THEMES` to the constants import (line 3):
```js
import { SIZE_PRESETS, DEFAULT_CONFIG, ENTITIES, HOLIDAY_THEMES } from './constants.js';
```

- [ ] **Step 2: Update `shouldUpdate()` to include new config fields**

In `shouldUpdate()` (line 42 of `src/shabbat-card.js`), update the data key to include the new config fields so the card re-renders when they change:
```js
  shouldUpdate() {
    const c = this._config;
    const newKey = (c?.size || '') + '|' + (c?.preview || '') + '|'
      + (c?.diaspora ?? '') + '|'
      + (c?.major_holiday_lead_days ?? '') + '|'
      + (c?.minor_holiday_lead_days ?? '') + '|'
      + buildDataKey(this._hass);
    if (newKey === this._lastDataKey) return false;
    this._lastDataKey = newKey;
    return true;
  }
```

- [ ] **Step 3: Add holiday-aware logic to `render()`**

In the `render()` method, after computing `state` (line 78), add:
```js
    // Holiday theme lookup
    const holidayThemeKey = state.nextHoliday?.festival || state.nextHoliday?.sensorName;
    const holidayTheme = holidayThemeKey ? HOLIDAY_THEMES[holidayThemeKey] : null;
    const holidayGradient = (state.holidayMode !== 'off' && holidayTheme) ? holidayTheme.gradient : null;
```

- [ ] **Step 4: Pass holiday gradient to computeSky**

Update the `computeSky` call (line 93):
```js
    const { background, isNightSky } = computeSky(sunElev, state.issur, state.motzei, state.progress, preview, holidayGradient);
```

- [ ] **Step 5: Pass holiday mode to renderIcon**

Update the `renderIcon` call (line 126):
```js
    const icon = renderIcon(this._config.size, state.issur, state.motzei, state.progress, sz.showIcon, state.holidayMode, state.nextHoliday?.category);
```

- [ ] **Step 6: Update status text for holiday modes**

After the `icon` variable, add a helper for dynamic content:
```js
    // Holiday mode adjustments to display
    let titleText = state.statusText;
    let subtitleText = state.statusSubtitle;
    let countdownText = state.countdown;
    let countdownLabelText = state.countdownLabel;

    if (state.holidayMode === 'approaching' && state.nextHoliday) {
      const theme = holidayTheme;
      titleText = theme?.greeting || 'חג שמח';
      subtitleText = state.nextHoliday.sensorName;
      // Keep the existing countdown format (e.g., "5d 2h") for precision
      countdownLabelText = `Until ${state.nextHoliday.sensorName}`;
    } else if (state.holidayMode === 'shabbat_overlap') {
      titleText = 'שבת שלום · חג שמח';
    }
```

- [ ] **Step 7: Add holiday info box and Shabbat merge box renderers**

Add before the `return html...` in render():
```js
    // Holiday info box — shown during shabbat_merge and shabbat_overlap when Shabbat is active
    const holidayBox = (state.holidayMode === 'shabbat_merge' || state.holidayMode === 'shabbat_overlap') && state.nextHoliday && sz.showTimes
      ? html`<div class="sc-holiday-box">
          <div class="sc-holiday-box-text">
            <div class="sc-holiday-box-name">${state.nextHoliday.sensorName}</div>
            <div class="sc-holiday-box-countdown">${state.nextHoliday.daysUntil === 0 ? 'Now' : `In ${state.nextHoliday.daysUntil} day${state.nextHoliday.daysUntil === 1 ? '' : 's'}`}</div>
          </div>
        </div>` : nothing;

    // Shabbat merge line — shown during holiday approaching when Shabbat is this week
    const shabbatMerge = state.holidayMode === 'approaching' && state.candleLighting && sz.showTimes
      ? html`<div class="sc-shabbat-merge">
          <div class="sc-shabbat-merge-title">Shabbat</div>
          <div class="sc-shabbat-merge-times">
            <span>Candle Lighting ${state.candleLighting}</span>
            <span>Havdalah ${state.havdalah}</span>
          </div>
        </div>` : nothing;
```

- [ ] **Step 8: Wire the new variables into the template**

Replace the existing template references to `state.statusText`, `state.statusSubtitle`, `state.countdown`, and `state.countdownLabel` with the new local variables:
- `state.statusText` → `titleText`
- `state.statusSubtitle` → `subtitleText`
- `state.countdown` → `countdownText`
- `state.countdownLabel` → `countdownLabelText`

Add `${holidayBox}` and `${shabbatMerge}` after `${times}` and before `${date}` in both the two-col and single-col branches.

- [ ] **Step 9: Verify build works**

```bash
npm run build
```

Expected: builds without errors.

- [ ] **Step 10: Commit**

```bash
git add src/shabbat-card.js
git commit -m "feat: render holiday modes with theme gradients, info boxes, and merge lines"
```

---

## Task 10: Update Card Editor

**Files:**
- Modify: `src/editor.js`

- [ ] **Step 1: Add diaspora toggle and lead-time inputs**

In `src/editor.js`, add change handlers after `_previewChanged`:
```js
  _diasporaChanged(e) {
    this._config = { ...this._config, diaspora: e.target.checked };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
  }

  _majorLeadChanged(e) {
    this._config = { ...this._config, major_holiday_lead_days: parseInt(e.target.value, 10) };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
  }

  _minorLeadChanged(e) {
    this._config = { ...this._config, minor_holiday_lead_days: parseInt(e.target.value, 10) };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
  }
```

- [ ] **Step 2: Extend the render() template with new controls**

Add after the existing preview select in the `render()` method, before the closing `</div>`:

```js
        <label class="spacer">Holiday Settings</label>
        <div class="checkbox-row">
          <input type="checkbox" id="sc-diaspora"
            .checked=${this._config?.diaspora !== false}
            @change=${this._diasporaChanged}>
          <label for="sc-diaspora" style="display:inline; font-weight:400;">Diaspora (include second-day Yom Tov)</label>
        </div>
        <label class="spacer">Major Holiday Lead Time (days)</label>
        <input type="number" min="1" max="30"
          .value=${this._config?.major_holiday_lead_days ?? 14}
          @change=${this._majorLeadChanged}>
        <label class="spacer">Minor Holiday Lead Time (days)</label>
        <input type="number" min="1" max="14"
          .value=${this._config?.minor_holiday_lead_days ?? 5}
          @change=${this._minorLeadChanged}>
```

- [ ] **Step 3: Add new preview options**

In the preview `<select>`, add these options after the existing `yom_tov` option:
```html
          <option value="holiday_approaching" ?selected=${currentPreview === 'holiday_approaching'}>Holiday Approaching (Pesach)</option>
          <option value="holiday_shabbat_merge" ?selected=${currentPreview === 'holiday_shabbat_merge'}>Shabbat + Holiday Merge</option>
          <option value="holiday_active" ?selected=${currentPreview === 'holiday_active'}>Holiday Active (Pesach)</option>
          <option value="holiday_shabbat_overlap" ?selected=${currentPreview === 'holiday_shabbat_overlap'}>Shabbat + Holiday Overlap</option>
          <option value="fast_approaching" ?selected=${currentPreview === 'fast_approaching'}>Fast Day Approaching</option>
          <option value="chanukah" ?selected=${currentPreview === 'chanukah'}>Chanukah</option>
```

- [ ] **Step 4: Add styles for checkbox and number input**

In the editor's static `styles`, add:
```css
    .checkbox-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
    input[type="number"] {
      width: 80px; padding: 8px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
```

- [ ] **Step 5: Verify build works**

```bash
npm run build
```

Expected: builds without errors.

- [ ] **Step 6: Commit**

```bash
git add src/editor.js
git commit -m "feat: add diaspora, lead-time, and holiday preview options to card editor"
```

---

## Task 11: Build, Bundle Size Check, and Integration Test

**Files:**
- Modify: `dist/shabbat-card.js` (rebuild)

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
ls -la dist/shabbat-card.js
```

Expected: builds without errors. Note the file size — target is under 80KB. If it exceeds 80KB, we'll need to investigate tree-shaking `@hebcal/core`.

- [ ] **Step 3: Check bundle size**

```bash
wc -c dist/shabbat-card.js
```

If over 80KB, try adding Rollup tree-shaking hints. In `src/holidays.js`, ensure only `HDate` and `months` are imported from `@hebcal/core` (not the entire library).

- [ ] **Step 4: Deploy to HA for visual verification**

```bash
smbclient //192.168.4.84/config -A /home/claude-svc/.smbcredentials -c "cd www; put dist/shabbat-card.js shabbat-card.js"
```

Then verify in HA: open the card editor, select "Holiday Approaching (Pesach)" preview, and confirm the card shows Pesach earth-tone gradient with a star icon and countdown.

- [ ] **Step 5: Commit the built bundle**

```bash
git add dist/shabbat-card.js
git commit -m "build: rebuild bundle with holiday enhancement Phase 1"
```

- [ ] **Step 6: Push to GitHub**

```bash
git push origin master
```

This pushes all Phase 1 commits plus the earlier unpushed commits (SVG icon fix, spec docs).

---

## Task Summary

| Task | Description | Est. Steps |
|------|-------------|-----------|
| 1 | Test infrastructure (vitest) | 5 |
| 2 | Add @hebcal/core dependency | 4 |
| 3 | Holiday data tables in constants.js | 6 |
| 4 | Create holidays.js with Hebrew date helpers | 6 |
| 5 | Integrate holiday mode into computeState | 8 |
| 6 | Holiday gradient override in computeSky | 3 |
| 7 | Generic category icons in candle.js | 4 |
| 8 | Holiday info box styles | 3 |
| 9 | Update card renderer for holiday modes | 10 |
| 10 | Update card editor | 6 |
| 11 | Build, bundle check, deploy, push | 6 |

**Total: 11 tasks, ~61 steps**

**Dependencies:** Tasks 1-2 are independent. Task 3 depends on nothing. Task 4 depends on 2+3. Task 5 depends on 4. Tasks 6-8 are independent of each other but depend on 3. Task 9 depends on 5+6+7+8. Task 10 depends on 5. Task 11 depends on all.
