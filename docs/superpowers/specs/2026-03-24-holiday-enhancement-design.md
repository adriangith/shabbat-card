# Holiday Enhancement Design Spec

**Goal:** Enhance the Shabbat Card to track upcoming and current Jewish holidays alongside Shabbat, with mode-switching display, per-holiday theming, and multi-timer candle visualization.

**Existing card:** HACS-ready Lit-based custom element (`shabbat-card`) with sun-driven sky, melting candle SVG, progress ring, and Shabbat countdown. Source in `src/`, Rollup build to `dist/shabbat-card.js`.

**Implementation phases:**
- **Phase 1:** Holiday data model, mode switching, approaching/active states, per-holiday gradients with a generic icon (colored star/symbol) per category
- **Phase 2:** Custom per-holiday SVG icons
- **Phase 3:** Multi-candle cluster visualization

---

## 1. Holiday Scope

The card tracks three categories of holidays from the Jewish Calendar integration's 38 known occasions:

| Category | Holidays | Behavior |
|----------|----------|----------|
| **Major Yom Tov** | Pesach, Pesach II, Pesach VII, Pesach VIII, Shavuot, Shavuot II, Sukkot, Sukkot II, Shmini Atzeret, Simchat Torah, Rosh Hashana I, Rosh Hashana II, Yom Kippur | Full mode switch with issur melacha candle behavior |
| **Minor / Rabbinic** | Chanukah, Purim, Shushan Purim, Tu B'Shvat, Lag B'Omer, Tu B'Av, Rosh Chodesh | Mode switch for countdown/theming, no candle/progress behavior |
| **Fast days** | Tzom Gedaliah, Asara B'Tevet, Ta'anit Esther, Tish'a B'Av, Tzom Tammuz | Mode switch with somber theming, no candle behavior |

**Excluded:** Chol HaMoed (Pesach, Sukkot), Hoshana Raba, Erev days, Israeli national days.

---

## 2. Holiday Data Source

### Built-in Hebrew Date Lookup Table with `@hebcal/core`

The card bundles the `@hebcal/core` library (~40KB minified, tree-shakeable) for Hebrew date arithmetic. This library provides:
- Accurate Hebrew-to-Gregorian date conversion
- Month length computation (handles variable-length Cheshvan/Kislev and leap year Adar I/II)
- Day-of-year distance calculations
- Holiday lookups with diaspora awareness

**Why a library:** Hebrew date arithmetic involves variable month lengths (Cheshvan: 29 or 30, Kislev: 29 or 30), leap years that insert Adar I (30 days), and year-type classification (deficient/regular/complete). Implementing this from scratch is error-prone. `@hebcal/core` is the standard, well-tested library for this.

**Israel vs. Diaspora:** Explicit `diaspora` boolean config option in the card editor, defaulting to `true`. This controls which holiday days are included (e.g., Pesach VIII, Shavuot II, Sukkot II exist only in diaspora).

### Two-Layer Data Model

The holiday table separates individual holy days from festival periods:

```js
// Individual holy days — each is a mode-switch trigger
const HOLIDAY_DAYS = [
  { month: 'Tishrei', day: 1, name: 'Rosh Hashana I', category: 'major', festival: 'Rosh Hashana', sensorName: 'Rosh Hashana I' },
  { month: 'Tishrei', day: 2, name: 'Rosh Hashana II', category: 'major', festival: 'Rosh Hashana', sensorName: 'Rosh Hashana II', diasporaOnly: false },
  { month: 'Tishrei', day: 10, name: 'Yom Kippur', category: 'major', festival: null, sensorName: 'Yom Kippur' },
  { month: 'Nisan', day: 15, name: 'Pesach I', category: 'major', festival: 'Pesach', sensorName: 'Pesach' },
  { month: 'Nisan', day: 16, name: 'Pesach II', category: 'major', festival: 'Pesach', sensorName: 'Pesach II', diasporaOnly: true },
  // ... etc for all holidays
];

// Festival periods — for the "festival overall" candle timer
const FESTIVAL_PERIODS = [
  { name: 'Rosh Hashana', startMonth: 'Tishrei', startDay: 1, endMonth: 'Tishrei', endDay: 2 },
  { name: 'Pesach', startMonth: 'Nisan', startDay: 15, endMonth: 'Nisan', endDay: 22, endDayIsrael: 21 },
  { name: 'Sukkot', startMonth: 'Tishrei', startDay: 15, endMonth: 'Tishrei', endDay: 23, endDayIsrael: 22 },
  { name: 'Chanukah', startMonth: 'Kislev', startDay: 25, endMonth: 'Tevet', endDay: 2 },
  // ... etc
];
```

Each `HOLIDAY_DAYS` entry has a `sensorName` field mapping to the exact string the `sensor.jewish_calendar_holiday` entity reports (from its `options` attribute). This avoids name-matching ambiguity.

The `diasporaOnly` flag filters entries based on the card's `diaspora` config.

**Finding the next holiday:** Use `@hebcal/core` to convert the current Gregorian date to a Hebrew date, compute the Hebrew date of each holiday in the current and next Hebrew year, and find the nearest upcoming one by Gregorian day distance. This avoids manual Hebrew month arithmetic entirely.

---

## 3. Display Mode: Mode Switching

### Normal State (no holiday nearby)
The card displays exactly as it does today: Shabbat countdown, candle/icon, parsha, times, date.

### Holiday Approaching (within threshold)
The card switches its primary display to the upcoming holiday:
- Holiday name as title
- Holiday-specific SVG icon (Phase 1: generic category icon; Phase 2: per-holiday icon)
- Holiday-specific color theme (sky gradient)
- Countdown to the holiday start
- Shabbat times shown as a secondary info line: "Shabbat: Fri 6:03 PM — Sat 6:59 PM" (when Shabbat is within the week)

### Holiday Active (sensor reports current holiday)
When the `sensor.jewish_calendar_holiday` reports the holiday and `issur_melacha` is on:
- Full holiday theming (icon, colors)
- Lit candle with melting progress (same as current Shabbat behavior)
- Progress ring tracking the Yom Tov period
- Appropriate greeting (חג שמח for Yom Tov)

For minor holidays and fast days (no issur melacha): holiday theming without candle/progress behavior.

---

## 4. Switch Timing

### Tiered Defaults
| Category | Default threshold |
|----------|------------------|
| Major Yom Tov | 14 days before |
| Minor / Rabbinic | 5 days before |
| Fast days | 5 days before |

### User Configurable
Two new settings in the card editor:
- **Major holiday lead time** (default: 14 days)
- **Minor holiday lead time** (default: 5 days, applies to both minor and fast days)

When a holiday is within its threshold, the card switches to holiday mode. When two holidays overlap thresholds, the nearest one wins.

---

## 5. Priority: Shabbat vs Holiday

### Holiday mode stays primary, Shabbat merges in

When the card is in holiday mode and Shabbat approaches:
- The holiday visual identity (theme, icon, countdown) **stays as the primary display**
- Shabbat times appear in a merged info box below the holiday content:
  ```
  ┌─────────────────────────────┐
  │  Shabbat tonight            │
  │  Candle Lighting 6:03 PM    │
  │  Havdalah 6:59 PM           │
  └─────────────────────────────┘
  ```

### During active Shabbat with a nearby holiday
When issur melacha is on for Shabbat:
- Card shows the **lit candle** (melting, with progress)
- Shabbat countdown and progress ring active
- Holiday gets a **rich info box** with its SVG icon, name, and countdown
- Holiday theme colors stay (not the regular Shabbat blue sky)

### Shabbat during a holiday (overlap)
When both Shabbat and a holiday are simultaneously active (e.g., Shabbat Chol HaMoed Pesach, or Yom Tov that falls on Shabbat):
- **Both greetings**: "שבת שלום · חג שמח"
- **Holiday theme** stays (Pesach earth tones, etc.)
- **Lit candle** with progress tracking to next Havdalah
- The Havdalah countdown tracks the next transition out of issur melacha (whatever the integration reports)

---

## 6. Multi-Timer Candle Cluster (Phase 3)

### When multiple timers are active simultaneously

During periods with overlapping time spans (e.g., Shabbat during Pesach), the card shows an **overlapping candle cluster** instead of a single candle.

**Up to three candles:**
1. **Festival overall** (e.g., "Pesach" — the entire 7/8-day period) — tallest, narrowest, furthest back
2. **Current Yom Tov day** (e.g., "Yom Tov I") — medium height and width
3. **Shabbat** — shortest, widest, front and center

The "festival overall" candle only appears for multi-day festivals. Single-day holidays (Shavuot in Israel, fast days) show at most two candles.

**Timer data sources:**
- **Shabbat timer:** Existing `candleLighting` → `havdalah` timestamps from integration sensors
- **Current Yom Tov day timer:** Same sensors — `issur_melacha` on → next `havdalah`
- **Festival overall timer:** Computed from `FESTIVAL_PERIODS` table. Start = sunset on `startDay - 1` (use integration's candle lighting time as sunset reference for the current location). End = nightfall on `endDay` (use integration's havdalah time as nightfall reference). `@hebcal/core` converts Hebrew dates to Gregorian to compute total duration and elapsed time.

**Visual design (inspired by pillar candle photo):**
- **Perspective:** Front candle is wider and lower, back candles are narrower and taller. Triangular grouping — not a straight line.
- **3D shading:** Each candle has cylindrical gradient (left shadow, center highlight, right falloff), ribbed vertical texture, elliptical top surface, wax pool at base, and cast shadow.
- **Depth cueing:** Back candles have reduced brightness and saturation. Front candle is brightest and most detailed (drips, ember glow).
- **Height = time remaining:** Each candle's height is proportional to the percentage of its timer remaining. As time passes, candles melt down independently.
- **Shared environment:** Combined warm glow from all flames, shared surface shadow beneath the group.
- **Gradient ID namespacing:** Each candle instance uses suffixed gradient IDs (e.g., `scWaxGrad-0`, `scWaxGrad-1`, `scWaxGrad-2`) to avoid SVG ID conflicts when multiple candles render in the same document.

**Labels below candles:**
Three columns aligned to the candles above, each showing:
- Timer name (PESACH / YOM TOV / SHABBAT)
- Countdown (5d 2h / 1d 8h / 17h 20m)
- Opacity increases left-to-right (most immediate timer is most prominent)

**When only one timer (regular Shabbat):** Single candle, same as current card behavior.

**When two timers (Shabbat + single-day holiday):** Two candles — back (holiday) and front (Shabbat).

**Phase 3 note:** Until Phase 3, the card shows a single candle during overlap states and tracks the most immediate timer (Shabbat havdalah). The multi-candle cluster is a visual enhancement that builds on working holiday mode logic.

---

## 7. Per-Holiday Visual Identity

Each holiday gets a sky gradient color theme and an SVG icon.

**Phase 1:** Generic category icons — a colored star/symbol for major, minor, and fast categories. Per-holiday gradients are implemented immediately.

**Phase 2:** Custom per-holiday SVG icons at 48x48 viewBox, designed to render clearly at sizes from 22px (tiny preset) to 80px (large preset). Monochrome with opacity variations to work over any gradient background.

### Major Yom Tov

| Holiday | Icon (Phase 2) | Sky gradient |
|---------|------|-------------|
| Pesach | Seder plate (circular with food items) | Dark navy → warm earth brown (#1a1a4e → #2d1810 → #5c3a1e) |
| Rosh Hashana | Honey jar / shofar | Dark navy → gold (#1a1a4e → #8B6914 → #DAA520) |
| Yom Kippur | Open book / Torah scroll | Deep solemn navy (#0a0a1a → #1a1a2e → #2d2d4a) |
| Sukkot | Lulav & etrog / greenery | Dark → forest green (#1a3a1a → #2d5a27 → #4a8c3f) |
| Shmini Atzeret / Simchat Torah | Torah scroll with joy | Blue → festive purple (#1a1a4e → #3d2066 → #6b3fa0) |
| Shavuot | Wheat / Torah / mountain | Night blue → dawn pink (#1a1a4e → #4a3060 → #8b5e83) |

### Minor / Rabbinic

| Holiday | Icon (Phase 2) | Sky gradient |
|---------|------|-------------|
| Chanukah | Menorah (9 branches) | Dark navy → blue glow (#0a1628 → #1a3a5c → #2b6cb0) |
| Purim | Megillah scroll / mask | Purple festive (#1a1a4e → #4a1a5c → #7b3fa0) |
| Tu B'Shvat | Tree / blossoms | Dark → spring green (#1a2a1a → #3a5a2a → #5a8a4a) |
| Lag B'Omer | Bonfire | Dark → warm orange (#1a1a1a → #4a2a1a → #8a4a2a) |
| Others (Tu B'Av, Rosh Chodesh) | Generic star | Default purple (#1a1a4e → #3d2b6b → #7b4fa0) |

### Fast Days

| Fast day | Icon (Phase 2) | Sky gradient |
|----------|------|-------------|
| Tish'a B'Av | Flames / broken wall | Dark muted (#0a0a0a → #1a1a1a → #2d2d2d) |
| Other fast days | Single candle (memorial style) | Muted grey (#1a1a1a → #2d2d2d → #4a4a4a) |

All icons are custom SVGs — no emojis.

---

## 8. Card Editor Updates

New configuration options in `src/editor.js`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `diaspora` | boolean | true | Whether to include diaspora-only holiday days |
| `major_holiday_lead_days` | number (1-30) | 14 | Days before major Yom Tov to switch to holiday mode |
| `minor_holiday_lead_days` | number (1-14) | 5 | Days before minor holidays / fast days to switch |

These appear as dropdown or number input fields in the existing card editor, below the current size and preview options.

### Preview Mode Extension

Add new preview options for holiday states:
- `holiday_approaching` — Pesach in 5 days, weekday
- `holiday_shabbat_merge` — Friday with Pesach in 2 days, Shabbat tonight
- `holiday_active` — During Pesach Yom Tov
- `holiday_shabbat_overlap` — Shabbat during Pesach (multi-candle, Phase 3)
- `fast_approaching` — Fast day in 3 days
- `chanukah` — During Chanukah

Each preview entry must include concrete mock values for all new state fields (`nextHoliday`, `holidayMode`, `activeTimers`).

---

## 9. Module Changes

### `src/constants.js`
- Add `HOLIDAY_DAYS` — static array of individual holy days with `sensorName`, `festival`, `category`, `diasporaOnly` fields
- Add `FESTIVAL_PERIODS` — static array of multi-day festival spans with start/end Hebrew dates
- Add `HOLIDAY_THEMES` — map of holiday/festival name → `{ icon, gradient, greeting, category }`
- Add default config values for `diaspora`, `major_holiday_lead_days`, `minor_holiday_lead_days`
- Add new `PREVIEW_DATA` entries for holiday states with concrete mock values

### `src/holidays.js` (new module)
- Wraps `@hebcal/core` for Hebrew date operations
- `getNextHoliday(now, holidayDays, diaspora, config)` → `{ name, category, festival, daysUntil, startDate }` or null
- `getFestivalProgress(now, festivalPeriod, diaspora)` → `{ total, elapsed, remaining, progress }` or null
- `getActiveTimers(hass, state, holidayDays, festivalPeriods, diaspora)` → array of timer objects
- All `@hebcal/core` usage is isolated to this module for easy testing and potential future replacement

### `src/state.js`
- Import from `holidays.js`
- Extend `computeState()` to include:
  - `nextHoliday` — `{ name, category, festival, daysUntil, startDate }` or null
  - `holidayMode` — `'off' | 'approaching' | 'active' | 'shabbat_merge' | 'shabbat_overlap'`
    - `'active'` covers both Yom Tov (with candle) and minor/fast (without candle). The `category` field on `nextHoliday` determines candle behavior.
  - `activeTimers` — array of `{ name, label, remaining, total, progress }` for the candle cluster (Phase 3; until then, single-element array)
- Add time-based recomputation: include a truncated timestamp (to the minute) in the data key so the card re-renders when the holiday mode should change at midnight or when countdowns tick

### `src/sky.js`
- Extend `computeSky()` to accept an optional holiday theme gradient, which overrides the sun-based gradient when in holiday mode

### `src/candle.js`
- Phase 1: Extend `renderIcon()` to select a generic category icon when in holiday approaching mode
- Phase 2: Add per-holiday SVG icon renderers in a lookup map
- Phase 3: Add `renderCandleCluster(timers, sizeName)` — renders 2-3 overlapping candles with perspective. Each candle uses parameterized width/height/brightness and namespaced gradient IDs.

### `src/styles.js`
- Add styles for holiday info box (`.sc-holiday-box`) — sized per preset using CSS custom properties, similar to existing `.sc-times`
- Add styles for merged Shabbat info line (`.sc-shabbat-merge`)
- Phase 3: Add styles for candle cluster layout (`.sc-candle-cluster`)
- Holiday info box respects existing `showTimes` visibility flags at smaller size presets

### `src/shabbat-card.js`
- Update `render()` to handle the new `holidayMode` states
- Apply holiday theme gradient to background
- Phase 3: Render candle cluster when `activeTimers.length > 1`
- Show holiday info box during `shabbat_merge` and `shabbat_overlap` modes
- Display combined greeting "שבת שלום · חג שמח" during overlap

### `src/editor.js`
- Add toggle for `diaspora` (checkbox, default true)
- Add number inputs for `major_holiday_lead_days` and `minor_holiday_lead_days`
- Add new preview options for holiday states

### Build changes
- Add `@hebcal/core` to `package.json` dependencies
- Rollup already bundles `node_modules` via `@rollup/plugin-node-resolve`, so no config changes needed
- Verify bundle size stays reasonable (target: under 80KB minified for the full bundle including `@hebcal/core`)

---

## 10. State Machine

```
                    ┌─────────────────────────┐
                    │        NORMAL            │
                    │   (Shabbat-only card)    │
                    └──────────┬──────────────┘
                               │ holiday within threshold
                               ▼
                    ┌─────────────────────────┐
                    │   HOLIDAY_APPROACHING    │◄──────────────────┐
                    │  Holiday mode primary    │                   │
                    │  Shabbat times merge     │                   │
                    └──────────┬──────────────┘                   │
                               │                                  │
               ┌───────────────┼──────────────┐                  │
               │               │              │                  │
     issur on        issur on         holiday sensor             │
     (Shabbat)       (Yom Tov)       active (minor/fast)         │
               │               │              │                  │
               ▼               ▼              ▼                  │
     ┌────────────────┐ ┌────────────┐ ┌────────────────┐       │
     │ ACTIVE         │ │ ACTIVE     │ │ ACTIVE         │       │
     │ (Shabbat near  │ │ (Yom Tov)  │ │ (minor/fast)   │       │
     │  holiday,      │ │ lit candle │ │ no candle      │       │
     │  lit candle,   │ │ holiday    │ │ holiday theme  │       │
     │  holiday box)  │ │ theme      │ │                │       │
     └───────┬────────┘ └─────┬──────┘ └───────┬────────┘       │
             │                │                │                │
             │  both active   │    issur off / │  holiday ends  │
             ▼                ▼    sensor clear │                │
     ┌────────────────────────────┐            │                │
     │    SHABBAT_OVERLAP         │            │                │
     │ "שבת שלום · חג שמח"        │            │                │
     │ Holiday theme, lit candle  │            │                │
     │ Multi-candle (Phase 3)     │            │                │
     └────────────┬───────────────┘            │                │
                  │                            │                │
                  │ issur off / sensor clear    │                │
                  └────────────────────────────┴────────────────┘
                    → NORMAL (if no holiday within threshold)
                    → APPROACHING (if next holiday within threshold)
```

**Exit transitions:** All active states return to either NORMAL or APPROACHING when issur melacha turns off and the holiday sensor clears. The card re-evaluates the next holiday in the table on every state change.

**Chol HaMoed behavior:** Chol HaMoed days are excluded from the holiday table, so the card sees them as non-holiday days. However, if the next Yom Tov day (e.g., Pesach VII) is within the 14-day threshold (which it always is during Chol HaMoed), the card enters APPROACHING for that upcoming Yom Tov day. This means during Chol HaMoed, the card shows the Pesach theme with a countdown to the next Yom Tov day — which is the desired behavior.

---

## 11. Edge Cases

- **Multiple holidays near each other** (e.g., Purim close to Pesach): nearest holiday wins. When one ends and the next is within threshold, it switches.
- **Holiday sensor reports a name not in our table** (future integration changes): fall back to generic holiday theme (default purple gradient, star icon).
- **Hebrew date sensor unavailable**: fall back to current behavior (no holiday awareness), show Shabbat only.
- **Leap years**: `@hebcal/core` handles Adar I/II automatically. The `HOLIDAY_DAYS` table lists Adar holidays under `'Adar'` which the library resolves to Adar II in leap years (standard practice).
- **Single-day vs multi-day festivals**: The candle cluster (Phase 3) shows a "festival overall" candle only when the festival spans multiple days per `FESTIVAL_PERIODS`. For single-day holidays (Shavuot in Israel, fast days), only two candles max (holiday + Shabbat if applicable).
- **Midnight transitions**: The data key includes a minute-truncated timestamp, so the card re-evaluates holiday mode at least every minute. This ensures mode changes at midnight (when a new Hebrew date starts at sunset — tracked by the integration's sensor updates) are detected promptly.
- **`@hebcal/core` bundle size**: Monitor that the tree-shaken bundle stays under 80KB total. If it exceeds this, consider extracting only the date arithmetic functions needed.
- **Performance on low-powered devices**: Phase 3 multi-candle cluster uses multiple SVG gradients and filters. For `tiny` and `compact` size presets, consider a simplified 2D rendering without blur filters.
