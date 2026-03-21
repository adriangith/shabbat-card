# Shabbat Card

Animated Shabbat/Yom Tov status card for Home Assistant with sun-driven sky gradients, a melting candle, progress tracking, and countdown timer.

<!-- TODO: add screenshot -->

## Prerequisites

- Home Assistant with the [Jewish Calendar](https://www.home-assistant.io/integrations/jewish_calendar/) integration installed

## Installation

### HACS (Custom Repository)

1. Open HACS in your Home Assistant
2. Click the three dots menu → **Custom repositories**
3. Add this repository URL with category **Lovelace**
4. Search for "Shabbat Card" and install
5. Clear your browser cache

### Manual

1. Download `shabbat-card.js` from the [latest release](../../releases/latest)
2. Copy to your `www/` directory
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/shabbat-card.js`
   - Type: JavaScript Module

## Configuration

### Minimal

```yaml
type: custom:shabbat-card
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | string | `large` | Card size preset |
| `preview` | string | `off` | Preview mode for testing |

### Size Presets

| Size | Description |
|------|-------------|
| `tiny` | Single-line badge, no icon |
| `compact` | Two-column with icon + countdown |
| `small` | Two-column with progress ring |
| `medium` | Full layout with times and date |
| `large` | Full size with all details |

### Preview Modes

| Mode | Description |
|------|-------------|
| `off` | Live data from sensors |
| `shabbat_early` | Shabbat just started (sunset) |
| `shabbat_mid` | Middle of Shabbat (night) |
| `shabbat_late` | Late Shabbat (near havdalah) |
| `motzei` | Motzei Shabbat |
| `yom_tov` | Yom Tov (Pesach) |

## Features

- Sun-driven sky gradients that match the real sky
- Animated SVG melting candle with wax drips
- Progress ring showing Shabbat/Yom Tov completion
- Countdown to candle lighting or havdalah
- Twinkling stars at night
- Hebrew status text (שבת שלום, חג שמח, שבוע טוב)
- Multi-day Yom Tov support
- Zero-config — auto-discovers Jewish Calendar entities
- Visual config editor in the dashboard UI

## License

MIT
