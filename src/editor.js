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
        </select>
        <p>Preview renders mock data. Set back to "Off" for live sensors.</p>
      </div>
    `;
  }
}

customElements.define('shabbat-card-editor', ShabbatCardEditor);
