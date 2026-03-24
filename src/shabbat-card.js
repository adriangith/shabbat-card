import { LitElement, html, nothing } from 'lit';
import { styles } from './styles.js';
import { SIZE_PRESETS, DEFAULT_CONFIG, ENTITIES } from './constants.js';
import { computeState, buildDataKey } from './state.js';
import { computeSky, renderStars } from './sky.js';
import { renderIcon } from './candle.js';
import './editor.js';

class ShabbatCard extends LitElement {
  static styles = styles;

  static properties = {
    _hass: { state: true },
    _config: { state: true },
  };

  _cache = { candleLightingTs: null, havdalahTs: null };
  _lastDataKey = null;

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  set hass(hass) {
    this._hass = hass;
  }

  static getConfigElement() {
    return document.createElement('shabbat-card-editor');
  }

  static getStubConfig() {
    return { size: 'large' };
  }

  getCardSize() {
    const sz = SIZE_PRESETS[this._config?.size] || SIZE_PRESETS.large;
    return sz.cardSize;
  }

  shouldUpdate() {
    const newKey = (this._config?.size || '') + '|' + (this._config?.preview || '') + '|' + buildDataKey(this._hass);
    if (newKey === this._lastDataKey) return false;
    this._lastDataKey = newKey;
    return true;
  }

  _renderRing(sz, progress) {
    const ringR = (sz.ringSize - sz.ringStroke * 2) / 2;
    const circ = 2 * Math.PI * ringR;
    const offset = circ * (1 - progress / 100);
    return html`
      <div class="sc-ring-wrap">
        <div class="sc-ring">
          <svg viewBox="0 0 ${sz.ringSize} ${sz.ringSize}">
            <defs>
              <linearGradient id="scGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#F5C563"/>
                <stop offset="100%" style="stop-color:#E8A838"/>
              </linearGradient>
            </defs>
            <circle class="sc-ring-bg" cx="${sz.ringSize/2}" cy="${sz.ringSize/2}" r="${ringR}"/>
            <circle class="sc-ring-fg" cx="${sz.ringSize/2}" cy="${sz.ringSize/2}" r="${ringR}"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="sc-ring-text">
            <div class="sc-ring-pct">${Math.round(progress)}%</div>
            <div class="sc-ring-lbl">complete</div>
          </div>
        </div>
      </div>`;
  }

  render() {
    if (!this._hass || !this._config) return nothing;

    const sz = SIZE_PRESETS[this._config.size] || SIZE_PRESETS.large;
    const state = computeState(this._hass, this._config, this._cache);

    if (state.error) {
      return html`
        <ha-card>
          <div class="sc-error">
            <div class="sc-error-title">Shabbat Card</div>
            <div>${state.error}</div>
          </div>
        </ha-card>`;
    }

    const preview = this._config.preview || 'off';
    const sunState = this._hass.states?.[ENTITIES.sun];
    const sunElev = sunState?.attributes?.elevation;
    const { background, isNightSky } = computeSky(sunElev, state.issur, state.motzei, state.progress, preview);

    const textColor = (state.issur && isNightSky) || state.motzei ? '#F5F0E8' : '#FFFFFF';
    const showStars = sz.showStars && ((state.issur && isNightSky) || state.motzei);
    const manyStars = state.motzei || (state.issur && sunElev !== undefined && parseFloat(sunElev) < -12);

    const holidayBit = state.holiday ? ` \u00B7 ${state.holiday}` : '';

    const cssVars = `
      --sc-padding: ${sz.padding};
      --sc-min-height: ${sz.minHeight};
      --sc-direction: ${sz.horizontal ? 'row' : 'column'};
      --sc-gap: ${sz.horizontal ? '12px' : '0'};
      --sc-text-color: ${textColor};
      --sc-bg: ${background};
      --sc-title-size: ${sz.titleSize};
      --sc-subtitle-size: ${sz.subtitleSize};
      --sc-countdown-size: ${sz.countdownSize};
      --sc-cd-label-size: ${sz.cdLabelSize};
      --sc-hero-size: ${sz.heroSize};
      --sc-hero-margin: ${sz.heroMargin};
      --sc-ring-size: ${sz.ringSize}px;
      --sc-ring-stroke: ${sz.ringStroke};
      --sc-ring-pct-size: ${sz.ringPctSize};
      --sc-ring-lbl-size: ${sz.ringLblSize};
      --sc-ring-margin: ${sz.ringMargin};
      --sc-times-gap: ${sz.timesGap};
      --sc-times-margin: ${sz.timesMargin};
      --sc-times-size: ${sz.timesSize};
      --sc-date-size: ${sz.dateSize};
      --sc-two-col-gap: ${sz.twoColGap || '14px'};
    `;

    const icon = renderIcon(this._config.size, state.issur, state.motzei, state.progress, sz.showIcon);
    const ring = state.issur && sz.showRing ? this._renderRing(sz, state.progress) : nothing;

    const times = sz.showTimes ? html`
      <div class="sc-times">
        <div>
          <div class="sc-time-label">Candle Lighting</div>
          <div class="sc-time-val">${state.candleLighting}</div>
        </div>
        <div>
          <div class="sc-time-label">Havdalah</div>
          <div class="sc-time-val">${state.havdalah}</div>
        </div>
      </div>` : nothing;

    const date = sz.showDate ? html`<div class="sc-date">${state.hebrewDate}${holidayBit}</div>` : nothing;

    const useTwoCol = sz.twoCol && (state.issur || state.motzei);

    return html`
      <ha-card style="overflow:hidden; border-radius:16px;">
        <div class="sc-widget" style="${cssVars}">
          <div class="sc-bg"></div>
          ${renderStars(showStars, manyStars)}
          ${useTwoCol ? html`
          <div class="sc-content sc-two-col">
            <div class="sc-col-left">
              ${icon}
              ${ring}
            </div>
            <div class="sc-col-right">
              <div class="sc-title">${state.statusText}</div>
              ${sz.showSubtitle !== false ? html`<div class="sc-subtitle">${state.statusSubtitle}</div>` : nothing}
              <div class="sc-countdown">${state.countdown}</div>
              ${sz.showCdLabel !== false ? html`<div class="sc-cd-label">${state.countdownLabel} \u00B7 ${state.targetTimeLocal}</div>` : nothing}
              ${times}
              ${date}
            </div>
          </div>` : html`
          <div class="sc-content${sz.horizontal ? ' sc-horizontal' : ''}">
            ${icon}
            <div class="sc-title">${state.statusText}</div>
            ${sz.showSubtitle !== false ? html`<div class="sc-subtitle">${state.statusSubtitle}</div>` : nothing}
            ${ring}
            <div class="sc-countdown">${state.countdown}</div>
            ${sz.showCdLabel !== false ? html`<div class="sc-cd-label">${state.countdownLabel} \u00B7 ${state.targetTimeLocal}</div>` : nothing}
            ${times}
            ${date}
          </div>`}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('shabbat-card', ShabbatCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'shabbat-card',
  name: 'Shabbat Card',
  description: 'Animated Shabbat/Yom Tov status card with sun-driven sky, melting candle, and progress tracking',
});
