# Pre-Shabbat Phase (18-minute window) — Design Spec

## Summary

Add a distinct intermediate card state for the ~18 minutes between candle lighting and Shabbat start (sunset/issur). Currently the card shows "countdown to candle lighting" even after that moment has passed. This phase makes the window visible with a transitional look: candle lit, dusk sky, and a "Shabbat begins in Xm" countdown.

## State Logic (`src/state.js`)

A new boolean `preShabbat` is derived in `computeState()`:

```
preShabbat = issur === false  &&  now >= candleLightingTs  &&  candleLightingTs is valid
```

A derived timestamp is computed and stored in `cache`:

```
shabbatStartTs = candleLightingTs + 18 * 60 * 1000
```

Cache lifecycle: `shabbatStartTs` is cleared when `issur` turns on (same as `candleLightingTs`/`havdalahTs`).

**Graceful fallback:** If `shabbatStartTs - now` goes negative before `issur` flips (clock drift, community variation where window is shorter), `preShabbat` is set to `false` and the card falls through to the regular pre-Shabbat countdown state.

## Display Values During `preShabbat`

| Field | Value |
|---|---|
| `statusText` | שבת שלום |
| `statusSubtitle` | parsha name (same as regular pre-Shabbat) |
| `countdown` | `formatCountdown(shabbatStartTs - now)` |
| `countdownLabel` | `Until Shabbat` |
| `targetTimeLocal` | formatted `shabbatStartTs` |
| Progress ring | Not shown |
| Sky / candle | Driven by real `sun.sun` elevation — no change needed |

## Preview Mode

New key `pre_shabbat` added to `PREVIEW_DATA` in `constants.js`:

```js
pre_shabbat: {
  issur: false,
  motzei: false,
  preShabbat: true,
  holiday: '',
  progress: 0,
  statusText: 'שבת שלום',
  statusSubtitle: 'Vayakhel-Pekudei',
  countdown: '14m',
  countdownLabel: 'Until Shabbat',
  targetTimeLocal: 'Friday 7:42 PM',
  candleLighting: '7:24 PM',
  havdalah: '8:20 PM',
  hebrewDate: '19 Adar 5786',
}
```

`pre_shabbat` is also added to the preview dropdown in `editor.js`.

## Files Changed

| File | Change |
|---|---|
| `src/state.js` | `preShabbat` flag, `shabbatStartTs` cache entry, new countdown branch |
| `src/constants.js` | `PREVIEW_DATA.pre_shabbat` fixture |
| `src/shabbat-card.js` | Include `preShabbat` in `buildDataKey` fingerprint so phase transition triggers re-render |
| `src/editor.js` | Add `pre_shabbat` option to preview mode dropdown |

`sky.js`, `candle.js`, `styles.js` — no changes needed.

## Out of Scope

- Making the 18-minute constant configurable (standard convention; zero-config is a card goal)
- Adding a progress ring for the 18-minute window
- Any Yom Tov-specific variant of this phase
