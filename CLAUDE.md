# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run build     # bundle src/ → dist/shabbat-card.js (one-shot)
npm run dev       # watch mode, rebuilds on changes
npm run lint      # eslint src/
```

There are no tests. Verify changes using the `preview` config option in a live Home Assistant dashboard (see Preview Modes below).

Releases are triggered by pushing a `v*` tag; CI builds and attaches `dist/shabbat-card.js` to a GitHub release automatically.

## Architecture

This is a single-file Home Assistant Lovelace custom card built with [Lit](https://lit.dev/) and bundled by Rollup into `dist/shabbat-card.js` (the only file HACS/HA needs).

**Source modules (`src/`):**

| File | Responsibility |
|------|---------------|
| `shabbat-card.js` | Root `LitElement` — wires everything together, renders layout variants |
| `state.js` | `computeState()` reads HA entity states → normalized card data; `buildDataKey()` drives `shouldUpdate()` |
| `constants.js` | `ENTITIES` (hardcoded HA entity IDs), `SIZE_PRESETS`, `CANDLE_SIZES`, `DEFAULT_CONFIG`, `PREVIEW_DATA` |
| `sky.js` | `computeSky()` maps sun elevation + Shabbat state → CSS gradient; `renderStars()` generates twinkling star elements |
| `candle.js` | `renderIcon()` generates the animated SVG melting candle; wax height / drip geometry is driven by `progress` |
| `editor.js` | `shabbat-card-editor` custom element — visual config panel shown in the dashboard UI |
| `styles.js` | Single `css` tagged template with all component styles |

**Data flow:**
1. HA calls `set hass(hass)` and `setConfig(config)` on the card element.
2. `shouldUpdate()` computes a fingerprint of all relevant entity states via `buildDataKey()` — skips re-render if nothing changed.
3. `render()` calls `computeState()` to derive display values, then `computeSky()` for the background gradient, and injects CSS custom properties (`--sc-*`) from the active `SIZE_PRESET`.

**Layout system:**  
`SIZE_PRESETS` in `constants.js` drives every dimension. The five sizes (`tiny`, `compact`, `small`, `medium`, `large`) control padding, font sizes, which UI elements are visible (`showRing`, `showTimes`, etc.), and whether a two-column layout is used.

**Entity IDs** are hardcoded in `ENTITIES` (constants.js) and match the standard [Jewish Calendar integration](https://www.home-assistant.io/integrations/jewish_calendar/) entity naming. If HA renames these, update `ENTITIES`.

## Preview Modes

Set `preview: shabbat_early|shabbat_mid|shabbat_late|motzei|yom_tov` in the card config to render with static fixture data from `PREVIEW_DATA` (constants.js) instead of live HA sensors. Useful during development without a real Jewish Calendar integration.
