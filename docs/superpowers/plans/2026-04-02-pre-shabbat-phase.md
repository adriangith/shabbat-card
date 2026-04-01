# Pre-Shabbat Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a distinct card phase for the ~18 minutes between candle lighting and Shabbat start (sunset/issur), showing a "Shabbat begins in Xm" countdown with the candle lit and the dusk sky.

**Architecture:** A new `preShabbat` boolean is derived in `computeState()` when `issur=false` and `now >= candleLightingTs`. A derived `shabbatStartTs = candleLightingTs + 18 * 60 * 1000` drives the countdown. `shouldUpdate()` includes a minute-level time bucket when inside the window so the countdown ticks without waiting for an entity state change.

**Tech Stack:** Lit 3, Rollup 4, vanilla JS ES modules. No test framework — verify by building and using the `preview: pre_shabbat` config option in a live HA dashboard.

---

### Task 1: Add `pre_shabbat` preview fixture to `constants.js`

**Files:**
- Modify: `src/constants.js`

- [ ] **Step 1: Add `pre_shabbat` entry to `PREVIEW_DATA`**

In `src/constants.js`, add the following entry to `PREVIEW_DATA` immediately before `shabbat_early` (chronological order):

```js
  pre_shabbat: {
    issur: false,
    motzei: false,
    preShabbat: true,
    holiday: '',
    progress: 0,
    statusText: '\u05E9\u05D1\u05EA \u05E9\u05DC\u05D5\u05DD',
    statusSubtitle: 'Vayakhel-Pekudei',
    countdown: '14m',
    countdownLabel: 'Until Shabbat',
    targetTimeLocal: 'Friday 7:42 PM',
    candleLighting: '7:24 PM',
    havdalah: '8:20 PM',
    hebrewDate: '19 Adar 5786',
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/constants.js
git commit -m "feat: add pre_shabbat preview fixture"
```

---

### Task 2: Detect `preShabbat` phase in `state.js` and compute its countdown

**Files:**
- Modify: `src/state.js`

- [ ] **Step 1: Derive `preShabbat` and `shabbatStartTs` after the existing timestamp computation**

In `computeState()`, the existing code computes `candleLightingTs`, `havdalahTs`, and `now`. Directly after those three lines (before the `statusText` block), add:

```js
  const preShabbat = !issur && !motzei && !isNaN(candleLightingTs) && now >= candleLightingTs;
  const shabbatStartTs = preShabbat ? candleLightingTs + 18 * 60 * 1000 : null;
```

The exact lines to insert after are:
```js
  const candleLightingTs = new Date(candleLightingIso).getTime();
  const havdalahTs = new Date(havdalahIso).getTime();
  const now = Date.now();
```

- [ ] **Step 2: Add `preShabbat` countdown branch**

Find the existing countdown block:

```js
  let countdown, countdownLabel, targetTimeLocal;
  if (issur && cache.havdalahTs) {
```

Replace it with:

```js
  let countdown, countdownLabel, targetTimeLocal;
  if (preShabbat && shabbatStartTs) {
    const remaining = shabbatStartTs - now;
    countdown = remaining > 0 ? formatCountdown(remaining) : '';
    countdownLabel = 'Until Shabbat';
    targetTimeLocal = formatTargetTime(new Date(shabbatStartTs).toISOString());
  } else if (issur && cache.havdalahTs) {
```

- [ ] **Step 3: Include `preShabbat` in the return value**

Find the return statement and add `preShabbat` to it:

```js
  return {
    issur, motzei, preShabbat, holiday: hasHoliday ? holiday : '',
    progress, statusText, statusSubtitle,
    countdown, countdownLabel, targetTimeLocal,
    candleLighting, havdalah, hebrewDate,
    error: null,
  };
```

- [ ] **Step 4: Commit**

```bash
git add src/state.js
git commit -m "feat: detect preShabbat phase and compute 18-min countdown"
```

---

### Task 3: Make `shouldUpdate` tick during the preShabbat window

**Files:**
- Modify: `src/shabbat-card.js`

Without this change the countdown won't update unless an HA entity happens to change state. Adding a minute-level time bucket to the data key causes a re-render each minute during the 18-minute window.

- [ ] **Step 1: Update `shouldUpdate()` to include a time bucket**

Find the existing `shouldUpdate()` method:

```js
  shouldUpdate() {
    const newKey = (this._config?.size || '') + '|' + (this._config?.preview || '') + '|' + buildDataKey(this._hass);
    if (newKey === this._lastDataKey) return false;
    this._lastDataKey = newKey;
    return true;
  }
```

Replace it with:

```js
  shouldUpdate() {
    const candleLightingIso = this._hass?.states?.[ENTITIES.candleLighting]?.state;
    const candleLightingTs = candleLightingIso ? new Date(candleLightingIso).getTime() : NaN;
    const now = Date.now();
    const inPreShabbatWindow = !isNaN(candleLightingTs) && now >= candleLightingTs && now < candleLightingTs + 20 * 60 * 1000;
    const timeBucket = inPreShabbatWindow ? Math.floor(now / 60000) : '';
    const newKey = (this._config?.size || '') + '|' + (this._config?.preview || '') + '|' + buildDataKey(this._hass) + '|' + timeBucket;
    if (newKey === this._lastDataKey) return false;
    this._lastDataKey = newKey;
    return true;
  }
```

Note: the 20-minute window (vs 18) gives a small buffer so the final tick still fires before `issur` flips.

- [ ] **Step 2: Commit**

```bash
git add src/shabbat-card.js
git commit -m "feat: tick shouldUpdate every minute during preShabbat window"
```

---

### Task 4: Add `pre_shabbat` option to the preview dropdown in `editor.js`

**Files:**
- Modify: `src/editor.js`

- [ ] **Step 1: Add the option immediately after the "Off — live data" option**

Find:
```js
          <option value="off" ?selected=${currentPreview === 'off'}>Off \u2014 live data</option>
```

Replace with:
```js
          <option value="off" ?selected=${currentPreview === 'off'}>Off \u2014 live data</option>
          <option value="pre_shabbat" ?selected=${currentPreview === 'pre_shabbat'}>\uD83D\uDD6F Pre-Shabbat \u2014 candles lit (18 min window)</option>
```

- [ ] **Step 2: Commit**

```bash
git add src/editor.js
git commit -m "feat: add pre_shabbat option to preview dropdown"
```

---

### Task 5: Build and verify

**Files:** none modified

- [ ] **Step 1: Install dependencies if needed and build**

```bash
npm ci && npm run build
```

Expected: exits 0, `dist/shabbat-card.js` updated with new timestamp.

- [ ] **Step 2: Confirm the bundle contains the new preview key**

```bash
grep -c 'pre_shabbat' dist/shabbat-card.js
```

Expected: `1` or more (minified, so key may appear once).

- [ ] **Step 3: Verify in Home Assistant**

Copy `dist/shabbat-card.js` to your HA `www/` directory, hard-refresh the browser, open a dashboard with the card, and set `preview: pre_shabbat` in the card config. Confirm:
- Status text shows שבת שלום
- Countdown label shows "Until Shabbat"
- Countdown value shows ~14m (matches fixture)
- No progress ring visible
- Sky looks like dusk (driven by real `sun.sun` elevation in live mode)
- "Pre-Shabbat — candles lit (18 min window)" appears in the editor dropdown

- [ ] **Step 4: Commit build artifact**

```bash
git add dist/shabbat-card.js
git commit -m "build: regenerate bundle with pre-Shabbat phase"
```
