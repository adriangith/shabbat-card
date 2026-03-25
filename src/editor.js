import { LitElement, html, css } from 'lit';

class ShabbatCardEditor extends LitElement {
  static properties = {
    _config: { state: true },
  };

  static styles = css`
    div { padding: 16px; }
    label { display: block; font-weight: 500; margin-bottom: 8px; }
    select {
      width: 100%; padding: 8px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .spacer { margin-top: 16px; }
    p { margin-top: 8px; font-size: 12px; opacity: 0.5; }
    .checkbox-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
    input[type="number"] {
      width: 80px; padding: 8px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }
  `;

  setConfig(config) {
    this._config = { ...config };
  }

  _sizeChanged(e) {
    this._config = { ...this._config, size: e.target.value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
  }

  _previewChanged(e) {
    this._config = { ...this._config, preview: e.target.value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
  }

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

  render() {
    const current = this._config?.size || 'large';
    const currentPreview = this._config?.preview || 'off';
    return html`
      <div>
        <label>Card Size</label>
        <select @change=${this._sizeChanged}>
          <option value="tiny" ?selected=${current === 'tiny'}>Tiny \u2014 single-line badge</option>
          <option value="compact" ?selected=${current === 'compact'}>Compact \u2014 icon + title + countdown</option>
          <option value="small" ?selected=${current === 'small'}>Small \u2014 title + countdown only</option>
          <option value="medium" ?selected=${current === 'medium'}>Medium \u2014 adds times, ring & date</option>
          <option value="large" ?selected=${current === 'large'}>Large \u2014 full size with all details</option>
        </select>
        <label class="spacer">Preview Mode</label>
        <select @change=${this._previewChanged}>
          <option value="off" ?selected=${currentPreview === 'off'}>Off \u2014 live data</option>
          <option value="pre_shabbat" ?selected=${currentPreview === 'pre_shabbat'}>\uD83D\uDD6F\uFE0F Pre-Shabbat \u2014 candles lit (18 min window)</option>
          <option value="shabbat_early" ?selected=${currentPreview === 'shabbat_early'}>\uD83D\uDD6F\uFE0F Shabbat \u2014 early (sunset)</option>
          <option value="shabbat_mid" ?selected=${currentPreview === 'shabbat_mid'}>\uD83D\uDD6F\uFE0F Shabbat \u2014 middle (night)</option>
          <option value="shabbat_late" ?selected=${currentPreview === 'shabbat_late'}>\uD83D\uDD6F\uFE0F Shabbat \u2014 late (dawn)</option>
          <option value="motzei" ?selected=${currentPreview === 'motzei'}>\u2728 Motzei Shabbat</option>
          <option value="yom_tov" ?selected=${currentPreview === 'yom_tov'}>\uD83C\uDF1F Yom Tov (Pesach)</option>
          <option value="holiday_approaching" ?selected=${currentPreview === 'holiday_approaching'}>Holiday Approaching (Pesach)</option>
          <option value="holiday_shabbat_merge" ?selected=${currentPreview === 'holiday_shabbat_merge'}>Shabbat + Holiday Merge</option>
          <option value="holiday_active" ?selected=${currentPreview === 'holiday_active'}>Holiday Active (Pesach)</option>
          <option value="holiday_shabbat_overlap" ?selected=${currentPreview === 'holiday_shabbat_overlap'}>Shabbat + Holiday Overlap</option>
          <option value="fast_approaching" ?selected=${currentPreview === 'fast_approaching'}>Fast Day Approaching</option>
          <option value="chanukah" ?selected=${currentPreview === 'chanukah'}>Chanukah</option>
        </select>
        <p>Preview renders mock data. Set back to "Off" for live sensors.</p>
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
      </div>
    `;
  }
}

customElements.define('shabbat-card-editor', ShabbatCardEditor);
