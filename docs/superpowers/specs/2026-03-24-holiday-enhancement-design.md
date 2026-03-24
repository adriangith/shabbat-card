# Holiday Enhancement Design Spec

**Goal:** Enhance the Shabbat Card to track upcoming and current Jewish holidays alongside Shabbat, with mode-switching display, per-holiday theming, and multi-timer candle visualization.

**Existing card:** HACS-ready Lit-based custom element (`shabbat-card`) with sun-driven sky, melting candle SVG, progress ring, and Shabbat countdown. Source in `src/`, Rollup build to `dist/shabbat-card.js`.

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

### Built-in Hebrew Date Lookup Table

The card embeds a static table mapping Hebrew calendar dates to holidays. The Hebrew date is already available from `sensor.jewish_calendar_date` (attributes: `hebrew_month_name`, `hebrew_day`).

**Why this works:** Jewish holidays fall on fixed Hebrew dates every year. The table never needs updating.

**Israel vs. Diaspora:** Some holidays have extra days in diaspora (Pesach VIII, Shavuot II, Sukkot II, Shmini Atzeret vs Simchat Torah). The Jewish Calendar integration's configuration determines this. The card detects diaspora mode by checking whether diaspora-only entities (e.g., Pesach VIII dates) are present or via the integration's configuration attributes.

**Table structure:**
```js
// Each entry: { month, day, name, category, endDay? }
// month is Hebrew month name, day is Hebrew day number
// endDay for multi-day festivals (e.g., Pesach 15-22 Nisan in diaspora)
const HOLIDAY_TABLE = [
  { month: 'Tishrei', day: 1, name: 'Rosh Hashana I', category: 'major' },
  { month: 'Tishrei', day: 2, name: 'Rosh Hashana II', category: 'major' },
  { month: 'Tishrei', day: 10, name: 'Yom Kippur', category: 'major' },
  // ... etc
];
```

**Finding the next holiday:** On each update, the card computes the distance in days from the current Hebrew date to each holiday in the table, and selects the nearest upcoming one. Hebrew month ordering is needed (Tishrei → Cheshvan → ... → Elul).

---

## 3. Display Mode: Mode Switching

### Normal State (no holiday nearby)
The card displays exactly as it does today: Shabbat countdown, candle/icon, parsha, times, date.

### Holiday Approaching (within threshold)
The card switches its primary display to the upcoming holiday:
- Holiday name as title
- Holiday-specific SVG icon
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

## 6. Multi-Timer Candle Cluster

### When multiple timers are active simultaneously

During periods with overlapping time spans (e.g., Shabbat during Pesach), the card shows an **overlapping candle cluster** instead of a single candle.

**Up to three candles:**
1. **Festival overall** (e.g., "Pesach" — the entire 7/8-day period) — tallest, narrowest, furthest back
2. **Current Yom Tov day** (e.g., "Yom Tov I") — medium height and width
3. **Shabbat** — shortest, widest, front and center

**Visual design (inspired by pillar candle photo):**
- **Perspective:** Front candle is wider and lower, back candles are narrower and taller. Triangular grouping — not a straight line.
- **3D shading:** Each candle has cylindrical gradient (left shadow, center highlight, right falloff), ribbed vertical texture, elliptical top surface, wax pool at base, and cast shadow.
- **Depth cueing:** Back candles have reduced brightness and saturation. Front candle is brightest and most detailed (drips, ember glow).
- **Height = time remaining:** Each candle's height is proportional to the percentage of its timer remaining. As time passes, candles melt down independently.
- **Shared environment:** Combined warm glow from all flames, shared surface shadow beneath the group.

**Labels below candles:**
Three columns aligned to the candles above, each showing:
- Timer name (PESACH / YOM TOV / SHABBAT)
- Countdown (5d 2h / 1d 8h / 17h 20m)
- Opacity increases left-to-right (most immediate timer is most prominent)

**When only one timer (regular Shabbat):** Single candle, same as current card behavior.

**When two timers (Shabbat + single-day holiday):** Two candles — back (holiday) and front (Shabbat).

---

## 7. Per-Holiday Visual Identity

Each holiday gets a unique SVG icon and sky gradient color theme.

### Major Yom Tov

| Holiday | Icon | Sky gradient |
|---------|------|-------------|
| Pesach | Seder plate (circular with food items) | Dark navy → warm earth brown (#1a1a4e → #2d1810 → #5c3a1e) |
| Rosh Hashana | Honey jar / shofar | Dark navy → gold (#1a1a4e → #8B6914 → #DAA520) |
| Yom Kippur | Open book / Torah scroll | Deep solemn navy (#0a0a1a → #1a1a2e → #2d2d4a) |
| Sukkot | Lulav & etrog / greenery | Dark → forest green (#1a3a1a → #2d5a27 → #4a8c3f) |
| Shmini Atzeret / Simchat Torah | Torah scroll with joy | Blue → festive purple (#1a1a4e → #3d2066 → #6b3fa0) |
| Shavuot | Wheat / Torah / mountain | Night blue → dawn pink (#1a1a4e → #4a3060 → #8b5e83) |

### Minor / Rabbinic

| Holiday | Icon | Sky gradient |
|---------|------|-------------|
| Chanukah | Menorah (9 branches) | Dark navy → blue glow (#0a1628 → #1a3a5c → #2b6cb0) |
| Purim | Megillah scroll / mask | Purple festive (#1a1a4e → #4a1a5c → #7b3fa0) |
| Tu B'Shvat | Tree / blossoms | Dark → spring green (#1a2a1a → #3a5a2a → #5a8a4a) |
| Lag B'Omer | Bonfire | Dark → warm orange (#1a1a1a → #4a2a1a → #8a4a2a) |
| Others (Tu B'Av, Rosh Chodesh) | Generic star | Default purple (#1a1a4e → #3d2b6b → #7b4fa0) |

### Fast Days

| Fast day | Icon | Sky gradient |
|----------|------|-------------|
| Tish'a B'Av | Flames / broken wall | Dark muted (#0a0a0a → #1a1a1a → #2d2d2d) |
| Other fast days | Single candle (memorial style) | Muted grey (#1a1a1a → #2d2d2d → #4a4a4a) |

All icons are custom SVGs — no emojis. Icons should be designed to work at multiple sizes (the card has size presets from tiny to large).

---

## 8. Card Editor Updates

New configuration options in `src/editor.js`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `major_holiday_lead_days` | number (1-30) | 14 | Days before major Yom Tov to switch to holiday mode |
| `minor_holiday_lead_days` | number (1-14) | 5 | Days before minor holidays / fast days to switch |

These appear as dropdown or number input fields in the existing card editor, below the current size and preview options.

### Preview Mode Extension

Add new preview options for holiday states:
- `holiday_approaching` — Pesach in 5 days, weekday
- `holiday_shabbat_merge` — Friday with Pesach in 2 days, Shabbat tonight
- `holiday_active` — During Pesach Yom Tov
- `holiday_shabbat_overlap` — Shabbat during Pesach (multi-candle)
- `fast_approaching` — Fast day in 3 days
- `chanukah` — During Chanukah

---

## 9. Module Changes

### `src/constants.js`
- Add `HOLIDAY_TABLE` — static array of Hebrew date → holiday mappings
- Add `HOLIDAY_THEMES` — map of holiday name → `{ icon, gradient, greeting, category }`
- Add `HEBREW_MONTHS` — ordered array for date arithmetic
- Add default config values for new editor options
- Add new `PREVIEW_DATA` entries for holiday states

### `src/state.js`
- Add `computeNextHoliday(hebrewDate, holidayTable, diaspora)` — finds the next upcoming holiday and days until it
- Extend `computeState()` to include:
  - `nextHoliday` — `{ name, category, daysUntil, hebrewDate }` or null
  - `holidayMode` — `'off' | 'approaching' | 'active' | 'shabbat_merge' | 'shabbat_overlap'`
  - `activeTimers` — array of `{ name, label, remaining, total, progress }` for the candle cluster
- Add Hebrew date arithmetic helpers (distance between two Hebrew dates accounting for month lengths and year wrapping)

### `src/sky.js`
- Extend `computeSky()` to accept an optional holiday theme gradient, which overrides the sun-based gradient when in holiday mode

### `src/candle.js`
- Add `renderCandleCluster(timers, sizeName)` — renders 2-3 overlapping candles with perspective
- Each candle in the cluster uses the existing `renderCandle` geometry but with varied width/height parameters
- Add per-holiday SVG icon renderers (one function per icon, or a lookup map)
- Extend `renderIcon()` to select holiday icon when in holiday mode (approaching state)

### `src/styles.js`
- Add styles for holiday info box (`.sc-holiday-box`)
- Add styles for candle cluster layout (`.sc-candle-cluster`)
- Add styles for merged Shabbat info line (`.sc-shabbat-merge`)

### `src/shabbat-card.js`
- Update `render()` to handle the new `holidayMode` states
- Apply holiday theme gradient to background
- Render candle cluster when `activeTimers.length > 1`
- Show holiday info box during `shabbat_merge` and `shabbat_overlap` modes
- Display combined greeting "שבת שלום · חג שמח" during overlap

### `src/editor.js`
- Add number inputs for `major_holiday_lead_days` and `minor_holiday_lead_days`
- Add new preview options for holiday states

---

## 10. State Machine

```
                    ┌─────────────────────┐
                    │     NORMAL          │
                    │ (Shabbat-only card) │
                    └─────────┬───────────┘
                              │ holiday within threshold
                              ▼
                    ┌─────────────────────┐
                    │  HOLIDAY_APPROACHING │
                    │ Holiday mode primary │
                    │ Shabbat times merge  │
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    issur on (Shabbat)  issur on (YomTov)   holiday sensor
              │               │           active (minor/fast)
              ▼               ▼               ▼
    ┌─────────────────┐ ┌────────────┐ ┌────────────────┐
    │ SHABBAT_ACTIVE  │ │ YOM_TOV    │ │ HOLIDAY_ACTIVE │
    │ + holiday box   │ │ ACTIVE     │ │ (minor/fast)   │
    │ lit candle      │ │ lit candle │ │ no candle      │
    │ holiday theme   │ │ holiday    │ │ holiday theme  │
    └────────┬────────┘ │ theme      │ └────────────────┘
             │          └─────┬──────┘
             │                │
             │  both active   │
             ▼                ▼
    ┌─────────────────────────────┐
    │    SHABBAT_OVERLAP          │
    │ "שבת שלום · חג שמח"         │
    │ Holiday theme, lit candle   │
    │ Multi-candle cluster        │
    │ (up to 3 timers)           │
    └─────────────────────────────┘
```

---

## 11. Edge Cases

- **Multiple holidays near each other** (e.g., Purim close to Pesach): nearest holiday wins. When one ends and the next is within threshold, it switches.
- **Holiday sensor reports a name not in our table** (future integration changes): fall back to generic holiday theme.
- **Hebrew date sensor unavailable**: fall back to current behavior (no holiday awareness), show Shabbat only.
- **Leap years**: Hebrew leap years add Adar II. The month ordering table must account for this. The `hebrew_month_name` attribute from the sensor disambiguates.
- **Single-day vs multi-day festivals**: The candle cluster shows a "festival overall" candle only when the festival spans multiple days. For single-day holidays (Shavuot in Israel, fast days), only two candles max (holiday + Shabbat if applicable).
